import { describe, it, expect } from 'vitest';
import { buildRelatedArticles, renderRelatedArticlesBlock, linkHubKeywords, addInternalLinks } from './internal-links';
import { Article } from './types';

function art(slug: string, category: string, jobType = '', title = slug): Article {
  return {
    id: slug,
    slug,
    title,
    description: '',
    category,
    jobType,
    pref: '',
    body: '',
    heroImage: '',
    publishedAt: '2026-06-01',
    status: 'published',
  };
}

describe('buildRelatedArticles', () => {
  it('同カテゴリの記事を、自分自身を除いて上限数まで返す', () => {
    const all = [
      art('current', '評判'),
      art('hyouban-a', '評判'),
      art('hyouban-b', '評判'),
      art('hyouban-c', '評判'),
      art('hyouban-d', '評判'),
      art('hyouban-e', '評判'),
      art('nenshu-x', '年収'),
    ];
    const related = buildRelatedArticles('current', all, 4);
    const slugs = related.map((a) => a.slug);

    expect(slugs).toHaveLength(4);
    expect(slugs).not.toContain('current'); // 自分自身は除外
    expect(slugs).not.toContain('nenshu-x'); // 別カテゴリは含めない
    expect(slugs.every((s) => s.startsWith('hyouban-'))).toBe(true);
  });

  it('同カテゴリが上限に満たない時は同一工種の記事で補完する', () => {
    const all = [
      art('current', '評判', 'architecture'),
      art('hyouban-a', '評判', 'civil'),
      art('nenshu-arch', '年収', 'architecture'), // 同工種（別カテゴリ）
      art('dokugaku-arch', '独学', 'architecture'), // 同工種（別カテゴリ）
      art('nenshu-civil', '年収', 'civil'), // 別カテゴリ・別工種→対象外
    ];
    const slugs = buildRelatedArticles('current', all, 4).map((a) => a.slug);

    // 同カテゴリ(hyouban-a)を先頭に、残りを同工種で補完
    expect(slugs[0]).toBe('hyouban-a');
    expect(slugs).toContain('nenshu-arch');
    expect(slugs).toContain('dokugaku-arch');
    expect(slugs).not.toContain('nenshu-civil'); // 別カテゴリ・別工種は含めない
    expect(slugs).not.toContain('current');
  });
});

describe('renderRelatedArticlesBlock', () => {
  it('関連記事の見出しとMarkdownリンクのリストを返す', () => {
    const all = [
      art('current', '評判', '', '現在の記事'),
      art('hyouban-a', '評判', '', 'マイナビ評判'),
      art('hyouban-b', '評判', '', 'doda評判'),
    ];
    const block = renderRelatedArticlesBlock('current', all, 4);

    expect(block).toContain('関連記事');
    expect(block).toContain('[マイナビ評判](/articles/hyouban-a/)');
    expect(block).toContain('[doda評判](/articles/hyouban-b/)');
    expect(block).not.toContain('/articles/current/'); // 自分へのリンクは無い
  });

  it('関連記事が無ければ空文字を返す（見出しだけ残さない）', () => {
    const all = [art('current', '評判'), art('other', '年収', 'civil')];
    expect(renderRelatedArticlesBlock('current', all, 4)).toBe('');
  });
});

describe('linkHubKeywords（カニバリ解消：ハブ記事へ集約）', () => {
  it('「マイナビエージェント」の最初の1回をmynavi記事へリンクする', () => {
    const body = 'マイナビエージェントは施工管理に強い。マイナビエージェントの評判も良い。';
    const out = linkHubKeywords(body, 'sekoukan-agent-osusume-2026');
    // 最初の1回だけリンク化
    expect(out).toContain('[マイナビエージェント](/articles/mynavi-agent-sekoukan/)は施工管理');
    // 2回目はリンク化しない（プレーンのまま）
    expect(out).toContain('。マイナビエージェントの評判');
    expect(out.match(/\/articles\/mynavi-agent-sekoukan\//g)).toHaveLength(1);
  });

  it('ハブ記事自身の中では自己リンクしない', () => {
    const body = 'マイナビエージェントの特徴を解説します。';
    const out = linkHubKeywords(body, 'mynavi-agent-sekoukan');
    expect(out).toBe(body); // 変化なし
  });
});

describe('linkHubKeywords: 重複キーワードの二重リンク防止', () => {
  it('長いKWをリンク後、その中の短いKWを再リンクしない', () => {
    const body = '施工管理マイナビエージェントは施工管理に強い。';
    const out = linkHubKeywords(body, 'sekoukan-agent-osusume-2026');
    // リンクは1つだけ、ネスト/破損しない
    expect(out.match(/\/articles\/mynavi-agent-sekoukan\//g)).toHaveLength(1);
    expect(out).not.toContain(']('.concat('/articles/mynavi-agent-sekoukan/)]')); // 破損検知
    expect(out).toContain('[施工管理マイナビエージェント](/articles/mynavi-agent-sekoukan/)');
  });
});

describe('addInternalLinks 統合', () => {
  it('本文末尾に関連記事ブロックを付与する', () => {
    const all = [
      art('current', '評判', '', '現在'),
      art('peer-a', '評判', '', 'ピアA'),
    ];
    const out = addInternalLinks('本文テキスト。', 'current', all);
    expect(out).toContain('## 関連記事');
    expect(out).toContain('[ピアA](/articles/peer-a/)');
  });

  it('本文中のハブKWをmynavi記事へ集約リンクする', () => {
    const all = [
      art('current', 'ノウハウ', '', '現在'),
      art('mynavi-agent-sekoukan', '評判', '', 'マイナビ評判'),
    ];
    const out = addInternalLinks('マイナビエージェントは強い。', 'current', all);
    expect(out).toContain('[マイナビエージェント](/articles/mynavi-agent-sekoukan/)');
  });

  it('既存リンクのアンカー内テキストはハブ集約で二重リンクしない', () => {
    const all = [art('current', 'ノウハウ', '', '現在')];
    const body = '[マイナビエージェント公式サイト](https://example.com/)を見る。';
    const out = addInternalLinks(body, 'current', all);
    // 既存リンクは壊さない（/articles/へのリンクを内側に作らない）
    expect(out).toContain('[マイナビエージェント公式サイト](https://example.com/)');
    expect(out).not.toContain('/articles/mynavi-agent-sekoukan/');
  });
});
