#!/usr/bin/env tsx
/**
 * 記事を Google Sheets の articles シートへ投入するスクリプト
 *
 * 認証: サービスアカウント鍵（既定: ./service-account.json）
 * 対象シート列順: A=id B=slug C=title D=description E=category F=jobType G=pref H=body I=heroImage J=publishedAt K=status
 *
 * 使い方:
 *   # ドライラン（何を書くか表示するだけ・書き込まない）
 *   npx tsx scripts/push-articles-to-sheets.ts --dir deliverables/202606-hyouban
 *
 *   # 本実行（実際にスプレッドシートへ書き込む）
 *   npx tsx scripts/push-articles-to-sheets.ts --dir deliverables/202606-hyouban --commit
 *
 * オプション:
 *   --dir <path>        meta.tsv と本文.md があるフォルダ（必須）
 *   --commit            実書き込み（指定しなければドライラン）
 *   --key <path>        サービスアカウント鍵JSON（既定: ./service-account.json）
 *   --sheet-id <id>     スプレッドシートID（既定: .env.local / 環境変数 GOOGLE_SPREADSHEET_ID）
 *
 * meta.tsv の規約:
 *   - id 列が「（要採番）」      → 新規記事。article-NNN を自動採番して末尾に追加。本文は {slug}.md
 *   - id 列にそれ以外（リライト） → 既存 slug 行を探し body と description のみ更新。本文は {slug}_rewrite.md
 *   - 「（変更なし）」「（既存のまま）」というセルは既存値を温存する
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const SHEET_NAME = 'articles';
const RANGE_ALL = `${SHEET_NAME}!A1:K1000`;

// ---------- 引数パース ----------
function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const DIR = getArg('--dir');
const COMMIT = process.argv.includes('--commit');
const KEY_PATH = getArg('--key') || path.resolve('service-account.json');

if (!DIR) {
  console.error('エラー: --dir <フォルダ> は必須です。例: --dir deliverables/202606-hyouban');
  process.exit(1);
}

// ---------- .env.local から spreadsheetId を取得 ----------
function readEnvLocal(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) return undefined;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] === key) return m[2].replace(/^["']|["']$/g, '');
  }
  return undefined;
}
const SPREADSHEET_ID = getArg('--sheet-id') || readEnvLocal('GOOGLE_SPREADSHEET_ID');

if (!SPREADSHEET_ID) {
  console.error('エラー: スプレッドシートIDが見つかりません。--sheet-id で渡すか .env.local に GOOGLE_SPREADSHEET_ID を設定してください。');
  process.exit(1);
}
if (!fs.existsSync(KEY_PATH)) {
  console.error(`エラー: サービスアカウント鍵が見つかりません: ${KEY_PATH}`);
  console.error('Google Cloud で作成した鍵JSONを service-account.json として置いてください。');
  process.exit(1);
}

// ---------- meta.tsv パース ----------
interface MetaRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  jobType: string;
  pref: string;
  heroImage: string;
  publishedAt: string;
  status: string;
}
const META_HEADERS = ['id', 'slug', 'title', 'description', 'category', 'jobType', 'pref', 'heroImage', 'publishedAt', 'status'];

function parseMeta(dir: string): MetaRow[] {
  const tsv = fs.readFileSync(path.join(dir, 'meta.tsv'), 'utf8').trim();
  const lines = tsv.split('\n');
  const header = lines[0].split('\t');
  if (header.join(',') !== META_HEADERS.join(',')) {
    throw new Error(`meta.tsv のヘッダーが想定と異なります。\n期待: ${META_HEADERS.join('|')}\n実際: ${header.join('|')}`);
  }
  return lines.slice(1).map((line) => {
    const c = line.split('\t');
    return {
      id: c[0], slug: c[1], title: c[2], description: c[3], category: c[4],
      jobType: c[5], pref: c[6], heroImage: c[7], publishedAt: c[8], status: c[9],
    };
  });
}

const isNew = (id: string) => id.includes('要採番');
const isPlaceholder = (v: string) => v.includes('変更なし') || v.includes('既存のまま') || isNew(v);

// 本文.md を読む（先頭の # 見出しも含めて body 全体）
function readBody(dir: string, slug: string, rewrite: boolean): string {
  const file = path.join(dir, rewrite ? `${slug}_rewrite.md` : `${slug}.md`);
  if (!fs.existsSync(file)) throw new Error(`本文ファイルが見つかりません: ${file}`);
  return fs.readFileSync(file, 'utf8').trim();
}

// article-NNN の最大値から次のIDを採番
function nextId(existing: string[][]): (offset: number) => string {
  let max = 0;
  for (const row of existing) {
    const m = (row[0] || '').match(/^article-(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return (offset: number) => `article-${String(max + 1 + offset).padStart(3, '0')}`;
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // 既存データ取得
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: RANGE_ALL });
  const grid = res.data.values || [];
  const dataRows = grid.slice(1); // ヘッダー除く
  const gen = nextId(dataRows);

  const meta = parseMeta(DIR!);
  const toAppend: string[][] = [];
  const toUpdate: { rowNumber: number; col: string; value: string; label: string }[] = [];

  let newCount = 0;
  console.log(`\n=== ${COMMIT ? '本実行' : 'ドライラン（書き込みません）'} : ${meta.length}件 ===\n`);

  for (const m of meta) {
    const body = readBody(DIR!, m.slug, !isNew(m.id));

    if (isNew(m.id)) {
      // 新規 → 11列を組み立てて末尾に追加
      const id = gen(newCount++);
      const row = [
        id, m.slug, m.title, m.description, m.category,
        isPlaceholder(m.jobType) ? '' : m.jobType,
        isPlaceholder(m.pref) ? '' : m.pref,
        body,
        isPlaceholder(m.heroImage) ? '' : m.heroImage,
        m.publishedAt, m.status,
      ];
      toAppend.push(row);
      console.log(`[新規] ${id}  ${m.slug}`);
      console.log(`        title: ${m.title}`);
      console.log(`        body : ${body.length}字 (${m.slug}.md)`);
      console.log(`        列   : F(jobType)="${row[5]}" G(pref)="${row[6]}" J(publishedAt)="${m.publishedAt}" K(status)="${m.status}"\n`);
    } else {
      // リライト → 既存 slug 行を探して body(H) と description(D) を更新
      const idx = dataRows.findIndex((r) => r[1] === m.slug);
      if (idx < 0) throw new Error(`リライト対象の slug がシートに見つかりません: ${m.slug}`);
      const rowNumber = idx + 2; // ヘッダー1行 + 0始まり補正
      toUpdate.push({ rowNumber, col: 'H', value: body, label: `body(${body.length}字)` });
      if (!isPlaceholder(m.description)) {
        toUpdate.push({ rowNumber, col: 'D', value: m.description, label: 'description' });
      }
      if (!isPlaceholder(m.title)) {
        toUpdate.push({ rowNumber, col: 'C', value: m.title, label: 'title' });
      }
      console.log(`[リライト] 行${rowNumber}  ${m.slug}（id/slug/publishedAtは温存）`);
      console.log(
        `        更新: ${m.slug}_rewrite.md → H列 body(${body.length}字)` +
          `${isPlaceholder(m.description) ? '' : ' + D列 description'}` +
          `${isPlaceholder(m.title) ? '' : ' + C列 title'}\n`
      );
    }
  }

  if (!COMMIT) {
    console.log('--- ドライラン終了。問題なければ末尾に --commit を付けて再実行してください。 ---\n');
    return;
  }

  // 実書き込み
  if (toAppend.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:K`,
      valueInputOption: 'RAW',
      requestBody: { values: toAppend },
    });
    console.log(`✓ 新規 ${toAppend.length}件を追加しました`);
  }
  for (const u of toUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${u.col}${u.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[u.value]] },
    });
    console.log(`✓ 行${u.rowNumber} ${u.col}列 更新: ${u.label}`);
  }
  console.log('\n完了。Netlifyのビルドをトリガーして反映してください。\n');
}

main().catch((e) => {
  console.error('失敗:', e.message || e);
  process.exit(1);
});
