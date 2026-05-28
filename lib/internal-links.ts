import { PREFS } from './constants';
import { Article } from './types';

/**
 * （※内部リンク：#X記事へ）プレースホルダーを実際のMarkdownリンクに変換する
 * 記事番号をゼロ埋め3桁にして article-XXX の id で検索する
 */
function resolvePlaceholderLinks(body: string, allArticles: Article[]): string {
  // パターン1: （※内部リンク：#X記事へ）→ article-XXX IDで検索
  let result = body.replace(/（※内部リンク：#(\d+)記事へ）/g, (_match, num) => {
    const paddedNum = String(parseInt(num, 10)).padStart(3, '0');
    const target = allArticles.find((a) => a.id === `article-${paddedNum}`);
    if (target) return `[${target.title}](/articles/${target.slug}/)`;
    return '';
  });

  // パターン2: （※内部リンク：#27 タイトル文字列）→ IDまたはタイトルで検索
  result = result.replace(/（※内部リンク：#(\d+)\s+([^）]+)）/g, (_match, num, titleHint) => {
    const paddedNum = String(parseInt(num, 10)).padStart(3, '0');
    // まずIDで検索
    let target = allArticles.find((a) => a.id === `article-${paddedNum}`);
    // なければタイトルの部分一致で検索
    if (!target) {
      target = allArticles.find((a) => a.title && a.title.includes(titleHint.split('｜')[0].trim()));
    }
    if (target) return `[${target.title}](/articles/${target.slug}/)`;
    // 記事が未公開・未存在の場合はリンクなしのテキストだけ残す
    return titleHint.trim();
  });

  // （※アフィリエイトリンク設置箇所）→ 削除（CTAはページレイアウト側で描画）
  result = result.replace(/（※アフィリエイトリンク設置箇所）/g, '');

  return result;
}

/**
 * 記事本文のMarkdownに内部リンクを自動挿入する
 * - （※内部リンク：#X記事へ）プレースホルダーを実リンクに変換
 * - 各キーワードは最初の1回のみリンク化
 * - 既存リンク内のテキストは保護
 * - テーブル行（|で始まる行）は変更しない
 * - コードブロック（```で囲まれた部分）は変更しない
 */
export function addInternalLinks(
  body: string,
  currentSlug: string,
  allArticles: Article[]
): string {
  // 0. プレースホルダーリンクを実際のMarkdownリンクに変換
  // 1. コードブロックをプレースホルダーで保護
  const codeBlocks: string[] = [];
  let result = resolvePlaceholderLinks(body, allArticles).replace(/```[\s\S]*?```/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_${idx}__`;
  });

  // 2. 既存のMarkdownリンクをプレースホルダーで保護
  const existingLinks: string[] = [];
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, (match) => {
    const idx = existingLinks.length;
    existingLinks.push(match);
    return `__LINK_${idx}__`;
  });

  // 3. 行単位で処理（テーブル行とヘッダー行はスキップ）
  const usedKeywords = new Set<string>();

  const lines = result.split('\n');
  const processedLines = lines.map((line) => {
    // テーブル行はスキップ
    if (line.trimStart().startsWith('|')) return line;
    // 通常行は処理する
    return processLine(line, usedKeywords, currentSlug, allArticles);
  });
  result = processedLines.join('\n');

  // 4. プレースホルダーを元に戻す
  result = result.replace(/__LINK_(\d+)__/g, (_, idx) => existingLinks[parseInt(idx)]);
  result = result.replace(/__CODE_(\d+)__/g, (_, idx) => codeBlocks[parseInt(idx)]);

  return result;
}

function processLine(
  line: string,
  usedKeywords: Set<string>,
  currentSlug: string,
  allArticles: Article[]
): string {
  let result = line;

  // 都道府県名をリンク化（長い名前から優先的にマッチ）
  const prefsSorted = [...PREFS].sort((a, b) => b.name.length - a.name.length);

  for (const pref of prefsSorted) {
    if (usedKeywords.has(`pref:${pref.id}`)) continue;

    // 都道府県名（フル）でマッチ
    const regex = new RegExp(escapeRegex(pref.name), 'g');
    let replaced = false;
    result = result.replace(regex, (match) => {
      if (!replaced && !usedKeywords.has(`pref:${pref.id}`)) {
        replaced = true;
        usedKeywords.add(`pref:${pref.id}`);
        return `[${match}](/${pref.id}/)`;
      }
      return match;
    });
  }

  // 他の記事タイトルをリンク化（長いタイトルから優先）
  const otherArticles = allArticles
    .filter((a) => a.slug !== currentSlug && a.title && a.title.length > 8)
    .sort((a, b) => b.title.length - a.title.length);

  for (const article of otherArticles) {
    if (usedKeywords.has(`article:${article.slug}`)) continue;
    const regex = new RegExp(escapeRegex(article.title), 'g');
    let replaced = false;
    result = result.replace(regex, (match) => {
      if (!replaced && !usedKeywords.has(`article:${article.slug}`)) {
        replaced = true;
        usedKeywords.add(`article:${article.slug}`);
        return `[${match}](/articles/${article.slug}/)`;
      }
      return match;
    });
  }

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
