#!/usr/bin/env tsx
/**
 * 指定ページ（複数可）ごとの流入クエリを取得する。
 * CTR改善リライトでタイトル/ディスクリプションを実クエリに合わせるための一時調査スクリプト。
 *
 * 使い方:
 *   npx tsx scripts/gsc-page-queries.ts --days 90 /articles/foo/ /articles/bar/
 */
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const KEY_PATH = getArg('--key') || path.resolve('service-account.json');
const DAYS = parseInt(getArg('--days') || '90', 10);
const pages = process.argv.slice(2).filter((a) => a.startsWith('/'));

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
const END = new Date();
END.setUTCDate(END.getUTCDate() - 3);
const START = new Date(END);
START.setUTCDate(START.getUTCDate() - (DAYS - 1));

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const wm = google.webmasters({ version: 'v3', auth });
  const { data } = await wm.sites.list();
  const entries = data.siteEntry || [];
  const site =
    (entries.find((e) => (e.siteUrl || '').includes('sekoukan-navi.com'))?.siteUrl) ||
    entries[0]?.siteUrl;
  if (!site) throw new Error('プロパティが見つかりません');

  console.log(`対象: ${site}  期間: ${ymd(START)}〜${ymd(END)}（${DAYS}日）\n`);

  for (const p of pages) {
    const full = `https://sekoukan-navi.com${p}`;
    const r = await wm.searchanalytics.query({
      siteUrl: site,
      requestBody: {
        startDate: ymd(START),
        endDate: ymd(END),
        dimensions: ['query'],
        dimensionFilterGroups: [
          { filters: [{ dimension: 'page', operator: 'equals', expression: full }] },
        ],
        rowLimit: 25,
      },
    });
    const rows = r.data.rows || [];
    console.log(`━━━ ${p} （${rows.length}クエリ）━━━`);
    if (rows.length === 0) console.log('（クエリデータなし）');
    for (const row of rows) {
      const kw = row.keys?.[0] || '';
      console.log(
        `${kw}\t表示${row.impressions}\tクリック${row.clicks}\tCTR${((row.ctr || 0) * 100).toFixed(1)}%\t順位${(row.position || 0).toFixed(1)}`
      );
    }
    console.log('');
  }
}
main().catch((e) => {
  console.error('エラー:', e.message);
  process.exit(1);
});
