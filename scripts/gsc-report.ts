#!/usr/bin/env tsx
/**
 * Search Console の実データ（表示回数・クリック・CTR・平均掲載順位）を取得して表示するスクリプト
 *
 * 認証: サービスアカウント鍵（既定: ./service-account.json）
 *       スコープ: https://www.googleapis.com/auth/webmasters.readonly
 *
 * 事前準備（どちらも一度きり・ブラウザ操作）:
 *   1. GCPプロジェクト sekoukan-affiliate で「Search Console API」を有効化
 *      https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=sekoukan-affiliate
 *   2. Search Console の対象プロパティ → 設定 → ユーザーと権限 → ユーザーを追加で
 *      article-uploader@sekoukan-affiliate.iam.gserviceaccount.com を「制限付き（閲覧）」で追加
 *
 * 使い方:
 *   # 直近28日サマリ＋上位クエリ/ページ（プロパティ自動検出）
 *   npx tsx scripts/gsc-report.ts
 *
 *   # 期間・件数・プロパティを指定
 *   npx tsx scripts/gsc-report.ts --days 90 --limit 30 --site sc-domain:sekoukan-navi.com
 *
 * オプション:
 *   --site <url>    対象プロパティ（既定: sites.list から sekoukan-navi.com を自動検出）
 *                   例: sc-domain:sekoukan-navi.com / https://sekoukan-navi.com/
 *   --days <n>      集計期間（既定: 28）。GSCは当日含む直近2〜3日が未確定なので3日前を終端にする
 *   --limit <n>     上位クエリ/ページの表示件数（既定: 20）
 *   --key <path>    サービスアカウント鍵JSON（既定: ./service-account.json）
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// ---------- 引数パース ----------
function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const KEY_PATH = getArg('--key') || path.resolve('service-account.json');
const SITE_ARG = getArg('--site');
const DAYS = parseInt(getArg('--days') || '28', 10);
const LIMIT = parseInt(getArg('--limit') || '20', 10);

if (!fs.existsSync(KEY_PATH)) {
  console.error(`エラー: サービスアカウント鍵が見つかりません: ${KEY_PATH}`);
  process.exit(1);
}

// ---------- 日付ユーティリティ（GSCはYYYY-MM-DD・UTC基準） ----------
function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
const END = new Date();
END.setUTCDate(END.getUTCDate() - 3); // 直近3日は未確定なので除外
const START = new Date(END);
START.setUTCDate(START.getUTCDate() - (DAYS - 1));
const START_DATE = ymd(START);
const END_DATE = ymd(END);

// ---------- 表示ヘルパ ----------
function pct(n: number): string {
  return (n * 100).toFixed(2) + '%';
}
function pad(s: string, w: number): string {
  const len = [...s].reduce((a, c) => a + (c.charCodeAt(0) > 0xff ? 2 : 1), 0);
  return s + ' '.repeat(Math.max(0, w - len));
}
function hint(msg: string): void {
  if (/has not been used in project|is disabled/.test(msg)) {
    console.error('\n⚠ Search Console API がGCPプロジェクトで有効化されていません。');
    console.error('  → https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=sekoukan-affiliate');
  } else if (/does not have sufficient permission|User does not have|forbidden|403/i.test(msg)) {
    console.error('\n⚠ サービスアカウントがGSCプロパティに登録されていません。');
    console.error('  → Search Console → 設定 → ユーザーと権限 で次を「閲覧」追加:');
    console.error('     article-uploader@sekoukan-affiliate.iam.gserviceaccount.com');
  }
}

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const wm = google.webmasters({ version: 'v3', auth });

  // ---- 対象プロパティの決定 ----
  let site = SITE_ARG;
  if (!site) {
    const { data } = await wm.sites.list();
    const entries = data.siteEntry || [];
    const match = entries.find((e) => (e.siteUrl || '').includes('sekoukan-navi.com'));
    site = match?.siteUrl || entries[0]?.siteUrl || undefined;
    if (!site) {
      console.error('エラー: このサービスアカウントで参照できるプロパティがありません。');
      console.error('登録済み:', entries.map((e) => e.siteUrl).join(', ') || '(なし)');
      process.exit(1);
    }
    console.log('登録プロパティ:', entries.map((e) => `${e.siteUrl}[${e.permissionLevel}]`).join(', '));
  }

  console.log(`\n対象: ${site}`);
  console.log(`期間: ${START_DATE} 〜 ${END_DATE}（${DAYS}日間）\n`);

  const q = (dimensions: string[], rowLimit: number) =>
    wm.searchanalytics
      .query({ siteUrl: site!, requestBody: { startDate: START_DATE, endDate: END_DATE, dimensions, rowLimit } })
      .then((r) => r.data.rows || []);

  // ---- 全体サマリ ----
  const total = await q([], 1);
  if (total.length === 0) {
    console.log('この期間のデータがまだありません（インデックス/評価が乗る前か、期間が早すぎます）。');
    return;
  }
  const t = total[0];
  console.log('━━━ 全体サマリ ━━━');
  console.log(`クリック: ${t.clicks}   表示回数: ${t.impressions}   CTR: ${pct(t.ctr || 0)}   平均掲載順位: ${(t.position || 0).toFixed(1)}`);

  // ---- 上位クエリ ----
  const queries = await q(['query'], LIMIT);
  console.log(`\n━━━ 上位クエリ TOP${LIMIT}（表示回数順） ━━━`);
  console.log(`${pad('クエリ', 40)}${pad('表示', 8)}${pad('クリック', 8)}${pad('CTR', 8)}順位`);
  for (const r of queries) {
    const kw = (r.keys?.[0] || '').slice(0, 28);
    console.log(`${pad(kw, 40)}${pad(String(r.impressions), 8)}${pad(String(r.clicks), 8)}${pad(pct(r.ctr || 0), 8)}${(r.position || 0).toFixed(1)}`);
  }

  // ---- 上位ページ ----
  const pages = await q(['page'], LIMIT);
  console.log(`\n━━━ 上位ページ TOP${LIMIT}（表示回数順） ━━━`);
  console.log(`${pad('パス', 50)}${pad('表示', 8)}${pad('クリック', 8)}${pad('CTR', 8)}順位`);
  for (const r of pages) {
    const p = (r.keys?.[0] || '').replace(/^https?:\/\/[^/]+/, '').slice(0, 40);
    console.log(`${pad(p, 50)}${pad(String(r.impressions), 8)}${pad(String(r.clicks), 8)}${pad(pct(r.ctr || 0), 8)}${(r.position || 0).toFixed(1)}`);
  }

  // ---- ページ種別の集計（記事 vs 県×工種 vs 県TOP） ----
  const allPages = await q(['page'], 1000);
  const bucket = { 記事: { i: 0, c: 0 }, 県工種: { i: 0, c: 0 }, 県TOP: { i: 0, c: 0 }, その他: { i: 0, c: 0 } };
  for (const r of allPages) {
    const path = (r.keys?.[0] || '').replace(/^https?:\/\/[^/]+/, '');
    const seg = path.replace(/\/$/, '').split('/').filter(Boolean);
    let k: keyof typeof bucket = 'その他';
    if (path.startsWith('/articles/')) k = '記事';
    else if (seg.length === 2) k = '県工種';
    else if (seg.length === 1) k = '県TOP';
    bucket[k].i += r.impressions || 0;
    bucket[k].c += r.clicks || 0;
  }
  console.log('\n━━━ ページ種別の貢献度 ━━━');
  console.log(`${pad('種別', 10)}${pad('表示回数', 12)}クリック`);
  for (const [k, v] of Object.entries(bucket)) {
    console.log(`${pad(k, 10)}${pad(String(v.i), 12)}${v.c}`);
  }
  console.log('\n※「インデックス登録状況（クロール済み-未登録 等）」はAPIで取れないため、');
  console.log('   GSC画面 → ページ（インデックス作成）レポートを併せて確認してください。');
}

main().catch((e: any) => {
  console.error('\nエラー:', e.message);
  hint(e.message || '');
  process.exit(1);
});
