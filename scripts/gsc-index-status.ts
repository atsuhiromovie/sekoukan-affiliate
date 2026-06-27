#!/usr/bin/env tsx
/**
 * 全記事URLのインデックス状態を URL Inspection API で機械判定し、
 * 未登録（インデックスされていない）記事URLを一覧出力する。
 * GSCで手動インデックス登録リクエストする対象を正確に出すための調査スクリプト。
 *
 * 使い方:
 *   npx tsx scripts/gsc-index-status.ts          # 記事のみ（既定）
 *   npx tsx scripts/gsc-index-status.ts --all     # サイトマップ全URL
 *
 * 認証: service-account.json（webmasters.readonly）。GSCにユーザー登録済みであること。
 * クォータ: URL Inspection は 600回/分・2000回/日。記事60本程度なら問題なし。
 */
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const KEY_PATH = path.resolve('service-account.json');
const SITEMAP_URL = 'https://sekoukan-navi.com/sitemap-0.xml';
const ALL = process.argv.includes('--all');

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return ALL ? locs : locs.filter((u) => u.includes('/articles/'));
}

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const sc = google.searchconsole({ version: 'v1', auth });
  const wm = google.webmasters({ version: 'v3', auth });

  // プロパティ自動検出
  const { data } = await wm.sites.list();
  const entries = data.siteEntry || [];
  const siteUrl =
    entries.find((e) => (e.siteUrl || '').includes('sekoukan-navi.com'))?.siteUrl ||
    entries[0]?.siteUrl;
  if (!siteUrl) throw new Error('プロパティが見つかりません');

  const urls = await fetchSitemapUrls();
  console.log(`プロパティ: ${siteUrl}`);
  console.log(`検査対象: ${urls.length}URL（${ALL ? '全URL' : '記事のみ'}）\n`);

  const notIndexed: { url: string; state: string }[] = [];
  const indexed: string[] = [];

  for (const url of urls) {
    try {
      const r = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl },
      });
      const verdict = r.data.inspectionResult?.indexStatusResult?.verdict || '';
      const coverage = r.data.inspectionResult?.indexStatusResult?.coverageState || '';
      // verdict=PASS かつ「インデックスに登録されています」系なら登録済み
      const isIndexed = verdict === 'PASS' && /submitted and indexed|indexed/i.test(coverage);
      if (isIndexed) {
        indexed.push(url);
      } else {
        notIndexed.push({ url, state: coverage || verdict || 'UNKNOWN' });
      }
      process.stdout.write(isIndexed ? '.' : 'x');
    } catch (e: any) {
      notIndexed.push({ url, state: `ERROR: ${e.message}` });
      process.stdout.write('!');
    }
    await new Promise((r) => setTimeout(r, 150)); // レート制御
  }

  console.log('\n');
  console.log(`━━━ 登録済み: ${indexed.length} / 未登録: ${notIndexed.length} ━━━\n`);
  console.log('■ 未登録URL（← これをGSCのURL検査で登録リクエスト）\n');
  notIndexed.forEach((n) => console.log(`${n.url}\t[${n.state}]`));
}

main().catch((e) => {
  console.error('\nエラー:', e.message);
  process.exit(1);
});
