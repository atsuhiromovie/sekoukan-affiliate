#!/usr/bin/env tsx
/**
 * GA4 の実データ（セッション・ユーザー・エンゲージメント・チャネル・LP・CV）を取得して表示するスクリプト
 *
 * 認証: GSCと同じサービスアカウント鍵（既定: ./service-account.json）
 *       スコープ: https://www.googleapis.com/auth/analytics.readonly
 *
 * 事前準備（どちらも一度きり・ブラウザ操作）:
 *   1. GCPプロジェクト sekoukan-affiliate で「Google Analytics Data API」を有効化
 *      https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=sekoukan-affiliate
 *   2. GA4管理画面 → プロパティ → プロパティのアクセス管理 → ユーザーを追加 で
 *      article-uploader@sekoukan-affiliate.iam.gserviceaccount.com を「閲覧者」で追加
 *
 * 使い方:
 *   # 直近28日サマリ（プロパティIDは --property か 環境変数 GA4_PROPERTY_ID）
 *   GA4_PROPERTY_ID=123456789 npx tsx scripts/ga4-report.ts
 *   npx tsx scripts/ga4-report.ts --property 123456789 --days 90
 *
 * オプション:
 *   --property <id>  GA4プロパティID（数字のみ。例: 123456789）。未指定時は環境変数 GA4_PROPERTY_ID
 *   --days <n>       集計期間（既定: 28）
 *   --limit <n>      上位LP/参照元の表示件数（既定: 20）
 *   --key <path>     サービスアカウント鍵JSON（既定: ./service-account.json）
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
const PROPERTY_ID = (getArg('--property') || process.env.GA4_PROPERTY_ID || '').replace(/^properties\//, '');
const DAYS = parseInt(getArg('--days') || '28', 10);
const LIMIT = parseInt(getArg('--limit') || '20', 10);

if (!fs.existsSync(KEY_PATH)) {
  console.error(`エラー: サービスアカウント鍵が見つかりません: ${KEY_PATH}`);
  process.exit(1);
}
if (!PROPERTY_ID) {
  console.error('エラー: GA4プロパティIDが未指定です。--property 123456789 または 環境変数 GA4_PROPERTY_ID を設定してください。');
  console.error('  確認方法: GA4管理画面 → プロパティ設定 → 「プロパティID」（数字9桁前後）');
  process.exit(1);
}

// ---------- 日付（GA4は YYYY-MM-DD / プロパティのタイムゾーン基準） ----------
function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
const END = new Date();
END.setUTCDate(END.getUTCDate() - 1); // 当日は確定前なので前日まで
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
function num(v: string | null | undefined): number {
  return Number(v || 0);
}
function hint(msg: string): void {
  if (/has not been used in project|is disabled|SERVICE_DISABLED/.test(msg)) {
    console.error('\n⚠ Google Analytics Data API がGCPプロジェクトで有効化されていません。');
    console.error('  → https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=sekoukan-affiliate');
  } else if (/permission|PERMISSION_DENIED|forbidden|403/i.test(msg)) {
    console.error('\n⚠ サービスアカウントがGA4プロパティに登録されていません。');
    console.error('  → GA4管理画面 → プロパティのアクセス管理 → ユーザー追加で次を「閲覧者」追加:');
    console.error('     article-uploader@sekoukan-affiliate.iam.gserviceaccount.com');
  } else if (/property|invalid|INVALID_ARGUMENT/i.test(msg)) {
    console.error('\n⚠ プロパティIDが正しいか確認してください（数字のみ・GA4の「プロパティID」）。');
  }
}

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const ga = google.analyticsdata({ version: 'v1beta', auth });
  const property = `properties/${PROPERTY_ID}`;
  const dateRanges = [{ startDate: START_DATE, endDate: END_DATE }];

  const run = (body: any) =>
    ga.properties.runReport({ property, requestBody: { dateRanges, ...body } }).then((r) => r.data);

  console.log(`\n対象: ${property}`);
  console.log(`期間: ${START_DATE} 〜 ${END_DATE}（${DAYS}日間）\n`);

  // ---- 全体サマリ ----
  const summary = await run({
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'engagementRate' },
      { name: 'averageSessionDuration' },
    ],
  });
  const s = summary.rows?.[0]?.metricValues || [];
  if (!summary.rows?.length) {
    console.log('この期間のデータがありません（計測開始前か、期間が早すぎます）。');
    return;
  }
  console.log('━━━ 全体サマリ ━━━');
  console.log(
    `セッション: ${num(s[0]?.value)}   ユーザー: ${num(s[1]?.value)}   PV: ${num(s[2]?.value)}   ` +
      `エンゲージ率: ${pct(num(s[3]?.value))}   平均セッション時間: ${num(s[4]?.value).toFixed(0)}秒`
  );

  // ---- チャネル別流入（GSCと突合する google/organic を含む） ----
  const channels = await run({
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'engagementRate' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  });
  console.log('\n━━━ チャネル別流入 ━━━');
  console.log(`${pad('チャネル', 26)}${pad('セッション', 12)}${pad('ユーザー', 10)}エンゲージ率`);
  for (const r of channels.rows || []) {
    const ch = r.dimensionValues?.[0]?.value || '(other)';
    const m = r.metricValues || [];
    console.log(`${pad(ch, 26)}${pad(String(num(m[0]?.value)), 12)}${pad(String(num(m[1]?.value)), 10)}${pct(num(m[2]?.value))}`);
  }

  // ---- 参照元/メディア（GSCのクリックと突き合わせる google / organic はここ） ----
  const sources = await run({
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: LIMIT,
  });
  console.log(`\n━━━ 参照元/メディア TOP${LIMIT} ━━━`);
  console.log(`${pad('source / medium', 36)}${pad('セッション', 12)}ユーザー`);
  for (const r of sources.rows || []) {
    const sm = r.dimensionValues?.[0]?.value || '(not set)';
    const m = r.metricValues || [];
    console.log(`${pad(sm.slice(0, 34), 36)}${pad(String(num(m[0]?.value)), 12)}${num(m[1]?.value)}`);
  }

  // ---- ランディングページ別（流入の入り口〜エンゲージ） ----
  const landings = await run({
    dimensions: [{ name: 'landingPagePlusQueryString' }],
    metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: LIMIT,
  });
  console.log(`\n━━━ ランディングページ TOP${LIMIT}（セッション順） ━━━`);
  console.log(`${pad('LP', 50)}${pad('セッション', 12)}${pad('エンゲージ率', 14)}平均秒`);
  for (const r of landings.rows || []) {
    const lp = (r.dimensionValues?.[0]?.value || '').slice(0, 44);
    const m = r.metricValues || [];
    console.log(`${pad(lp, 50)}${pad(String(num(m[0]?.value)), 12)}${pad(pct(num(m[1]?.value)), 14)}${num(m[2]?.value).toFixed(0)}`);
  }

  // ---- イベント別（発生回数順）／キーイベント（コンバージョン）別 ----
  const events = await run({
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'keyEvents' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 30,
  });
  const allEvents = events.rows || [];
  const keyRows = allEvents.filter((r) => num(r.metricValues?.[1]?.value) > 0);
  console.log('\n━━━ 計測中のイベント一覧（発生回数順） ━━━');
  console.log(`${pad('イベント名', 30)}${pad('発生回数', 10)}キーイベント`);
  for (const r of allEvents) {
    const name = r.dimensionValues?.[0]?.value || '';
    const m = r.metricValues || [];
    const isKey = num(m[1]?.value) > 0 ? '✓' : '';
    console.log(`${pad(name, 30)}${pad(String(num(m[0]?.value)), 10)}${isKey}`);
  }
  console.log('\n━━━ キーイベント（コンバージョン）別 ━━━');
  if (keyRows.length === 0) {
    console.log('キーイベントが計測されていません（GA4でキーイベント未設定の可能性大）。');
    console.log('→ GA4管理画面 → 管理 → イベント → 対象イベントの「キーイベントとしてマーク」をON にすると、ここにCV件数が出ます。');
  } else {
    console.log(`${pad('イベント名', 30)}${pad('CV件数', 10)}${pad('発生回数', 10)}CVR(対セッション)`);
    for (const r of keyRows) {
      const name = r.dimensionValues?.[0]?.value || '';
      const m = r.metricValues || [];
      const cv = num(m[1]?.value);
      const sess = num(s[0]?.value);
      console.log(`${pad(name, 30)}${pad(String(cv), 10)}${pad(String(num(m[0]?.value)), 10)}${sess ? pct(cv / sess) : '-'}`);
    }
  }

  console.log('\n※ google / organic のセッション数をGSCのクリック数と突き合わせると、検索流入の計測差を切り分けられます。');
}

main().catch((e: any) => {
  console.error('\nエラー:', e.message);
  hint(e.message || '');
  process.exit(1);
});
