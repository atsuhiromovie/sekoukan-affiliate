import { PREFS } from './constants';
import { Article } from './types';

/**
 * 本文中アフィリエイトブロックの差し込み位置を示すトークン。
 * 記事本文の（※アフィリエイトリンク設置箇所）を、記事ページ側でComparisonTableに
 * 置換するためのセンチネル。記事ページがこのトークンで本文を分割して描画する。
 */
export const AFFILIATE_BLOCK_TOKEN = '__AFFILIATE_BLOCK__';

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

  // パターン3: （内部リンク：タイトル文字列）→ タイトル部分一致で検索（※なし・番号なし）
  result = result.replace(/（内部リンク：([^）]+)）/g, (_match, titleHint) => {
    const hint = titleHint.trim();
    const target = allArticles.find(
      (a) => a.title && (a.title === hint || a.title.includes(hint) || hint.includes(a.title))
    );
    if (target) return `[${target.title}](/articles/${target.slug}/)`;
    return hint;
  });

  // パターン4: （ツールリンク：tool-slug）→ ツールページへのリンク
  const TOOL_MAP: Record<string, { title: string; href: string }> = {
    'title-translator': {
      title: '職務経歴書の「肩書き」翻訳ツール',
      href: '/tools/title-translator/',
    },
  };
  result = result.replace(/（ツールリンク：([^）]+)）/g, (_match, slug) => {
    const tool = TOOL_MAP[slug.trim()];
    if (tool) return `[${tool.title}](${tool.href})`;
    return '';
  });

  // （※アフィリエイトリンク設置箇所）→ センチネルトークンに置換
  // （記事ページ側でこのトークンを ComparisonTable に差し替えて本文内に描画する）
  result = result.replace(/（※アフィリエイトリンク設置箇所）/g, AFFILIATE_BLOCK_TOKEN);

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

  // 5. 特定記事へのツール誘導テキストを末尾に追加
  const TOOL_INJECTIONS: Record<string, string> = {
    'genba-kantoku-sekoukan-gishi-chigai':
      '\n\n職務経歴書に「現場監督」と書くか「施工管理」と書くかは、応募先によって最適な表現が変わります。あなたの経験と応募先タイプを入力するだけで肩書き案を2〜3パターン提案する[職務経歴書の「肩書き」翻訳ツール](/tools/title-translator/)もぜひ活用してみてください。',
    'sekoukan-40dai-agent-erabi':
      '\n\n40代の転職では、職務経歴書の肩書きひとつで採用担当の印象が変わります。「大手ゼネコン向け」「異業種向け」など応募先別に最適な書き方を確認できる[職務経歴書の「肩書き」翻訳ツール](/tools/title-translator/)も、書類作成の前にお試しください。',
    'sekoukan-30dai-agent-osusume':
      '\n\nエージェントへの登録前に職務経歴書の方向性を整理しておくと、初回面談がスムーズになります。応募先タイプ別に肩書きの表現案を提案する[職務経歴書の「肩書き」翻訳ツール](/tools/title-translator/)で、書き方のパターンを確認してみてください。',
    'sekoukan-gishi-dokugaku-tsushin-dochira':
      '\n\n資格取得後は、職務経歴書への活かし方も重要です。「1級施工管理技士」の資格を応募先に最も刺さる肩書きに変換するには、[職務経歴書の「肩書き」翻訳ツール](/tools/title-translator/)が参考になります。',
  };
  if (TOOL_INJECTIONS[currentSlug]) {
    result += TOOL_INJECTIONS[currentSlug];
  }

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
