#!/usr/bin/env tsx
/**
 * 任意の単一URLのインデックス状態を URL Inspection API で照会する。
 * 使い方: npx tsx scripts/gsc-inspect-one.ts <URL> [<URL> ...]
 */
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const KEY_PATH = path.resolve('service-account.json');

async function main() {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error('URLを1つ以上指定してください');
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const sc = google.searchconsole({ version: 'v1', auth });
  const wm = google.webmasters({ version: 'v3', auth });

  const { data } = await wm.sites.list();
  const entries = data.siteEntry || [];
  const siteUrl =
    entries.find((e) => (e.siteUrl || '').includes('sekoukan-navi.com'))?.siteUrl ||
    entries[0]?.siteUrl;
  if (!siteUrl) throw new Error('プロパティが見つかりません');
  console.log(`プロパティ: ${siteUrl}\n`);

  for (const url of targets) {
    try {
      const r = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl },
      });
      const res = r.data.inspectionResult?.indexStatusResult || {};
      console.log(`URL: ${url}`);
      console.log(`  verdict       : ${res.verdict || '-'}`);
      console.log(`  coverageState : ${res.coverageState || '-'}`);
      console.log(`  lastCrawlTime : ${res.lastCrawlTime || '-'}`);
      console.log(`  pageFetchState: ${res.pageFetchState || '-'}`);
      console.log(`  robotsTxtState: ${res.robotsTxtState || '-'}\n`);
    } catch (e: any) {
      console.log(`URL: ${url}\n  ERROR: ${e.message}\n`);
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}

main().catch((e) => {
  console.error('エラー:', e.message);
  process.exit(1);
});
