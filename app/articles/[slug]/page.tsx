import { Fragment } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  fetchArticles,
  fetchAffiliatesFromSheets,
  fetchRankingOverrides,
  DEFAULT_AFFILIATES,
} from '../../../lib/sheets';
import { ARTICLE_CATEGORIES, JOB_TYPES, PREFS } from '../../../lib/constants';
import { SITE_URL } from '../../../lib/config';
import { addInternalLinks, AFFILIATE_BLOCK_TOKEN } from '../../../lib/internal-links';
import { AffiliateItem } from '../../../lib/types';
import ArticleImage from './ArticleImage';
import AffiliateCta from '../../../components/AffiliateCta';
import ComparisonTable from '../../../components/ComparisonTable';

// ===== カテゴリ別カラー（heroImage代替）※英語ID対応 =====
const CATEGORY_COLORS: Record<string, string> = {
  career:        '#1a2744',
  salary:        '#162238',
  qualification: '#1e3a5f',
  work:          '#234068',
  region:        '#1a3050',
};

// ===== Markdownコンポーネント定義 =====
const mdComponents: Components = {
  h2: ({ children }) => (
    <h2
      style={{
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginTop: '2rem',
        marginBottom: '1rem',
        color: '#1a2744',
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginTop: '1.5rem',
        marginBottom: '0.75rem',
        color: '#1a2744',
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ marginBottom: '1.25rem', lineHeight: '1.8', fontSize: '1rem' }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul
      style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.25rem' }}
    >
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: '0.5rem', lineHeight: '1.8' }}>{children}</li>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th
      style={{
        backgroundColor: '#1a2744',
        color: '#ffffff',
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #e2e8f0',
        verticalAlign: 'top',
      }}
    >
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => {
    // 偶数行に背景色
    const node = (props as { node?: { position?: { start?: { line?: number } } } }).node;
    const lineIndex = node?.position?.start?.line ?? 0;
    const isEven = lineIndex % 2 === 0;
    return (
      <tr style={isEven ? { backgroundColor: '#f8fafc' } : {}}>
        {children}
      </tr>
    );
  },
};

// ===== SSG: 全公開記事のslugを事前生成 =====
export async function generateStaticParams() {
  const articles = await fetchArticles();
  // APIキー未設定時も空配列のままだと output: 'export' でエラーになるためフォールバック
  if (articles.length === 0) return [{ slug: '_placeholder' }];
  return articles.map((a) => ({ slug: a.slug }));
}

// ===== メタデータ動的生成 =====
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const articles = await fetchArticles();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description || undefined,
    alternates: { canonical: `/articles/${article.slug}/` },
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      images: article.heroImage ? [{ url: article.heroImage }] : undefined,
    },
  };
}

// ===== 記事詳細ページ =====
export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [articles, allAffiliates, rankingOverrides] = await Promise.all([
    fetchArticles(),
    fetchAffiliatesFromSheets(),
    fetchRankingOverrides(),
  ]);
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  // 関連記事（同カテゴリ or 同工種、自分以外・最大3件）
  const related = articles
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.category === article.category || a.jobType === article.jobType)
    )
    .slice(0, 3);

  // ===== 本文内アフィリエイトブロック用の案件を算出 =====
  // 都道府県×工種ページ（[pref]/[job_type]）と同じフィルタ・ソートを記事の pref/jobType に適用する。
  // pref/jobType が未設定なら、その軸の制約は掛けない（全国・全工種の案件を表示）。
  const articlePref = article.pref ? PREFS.find((p) => p.id === article.pref) : undefined;
  const articleJob = article.jobType ? JOB_TYPES.find((j) => j.id === article.jobType) : undefined;

  const seenAffIds = new Set<string>();
  const filteredAff: AffiliateItem[] = allAffiliates.filter((item) => {
    const regionOk =
      item.regions.includes('all') || !articlePref || item.regions.includes(articlePref.id);
    const jobOk =
      item.jobTypes.includes('all') || !articleJob || item.jobTypes.includes(articleJob.id);
    if (!regionOk || !jobOk || seenAffIds.has(item.id)) return false;
    seenAffIds.add(item.id);
    return true;
  });
  const affOverrideMap =
    articlePref && articleJob
      ? rankingOverrides.get(`${articlePref.id}_${articleJob.id}`)
      : undefined;
  const sortedAff = [...filteredAff].sort((a, b) => {
    const ra = affOverrideMap?.get(a.id) ?? a.rank ?? 999;
    const rb = affOverrideMap?.get(b.id) ?? b.rank ?? 999;
    return ra - rb;
  });
  const blockAffiliates = sortedAff.length > 0 ? sortedAff : DEFAULT_AFFILIATES;
  const blockPrefName = articlePref?.name ?? '全国';
  const blockJobName = articleJob?.fullName ?? '施工管理';

  // ===== 本文Markdownを整形し、アフィリエイトブロックのトークンで分割 =====
  const processedBody = (() => {
    // 行単位でテーブルブロックを検出し、適切に改行補完する
    const lines = article.body.split('\n');

    // 本文先頭の最初のH1見出し（`# タイトル`）はページ側の<h1>{article.title}</h1>と
    // 重複するため除去する。先頭の空行はスキップし、最初の非空行が単一`#`見出しのときのみ
    // その1行だけを取り除く（本文中の`##`/`###`や2つ目以降の`#`には触れない）。
    const firstContentIdx = lines.findIndex((l) => l.trim() !== '');
    if (firstContentIdx !== -1 && /^#\s/.test(lines[firstContentIdx])) {
      lines.splice(firstContentIdx, 1);
    }

    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isTableLine = line.trimStart().startsWith('|');
      const prevIsTable = i > 0 && lines[i - 1].trimStart().startsWith('|');
      const nextIsTable = i < lines.length - 1 && lines[i + 1].trimStart().startsWith('|');

      if (isTableLine) {
        if (!prevIsTable && result.length > 0) {
          const last = result[result.length - 1];
          if (last !== '') result.push('');
        }
        result.push(line);
        if (!nextIsTable) {
          result.push('');
        }
      } else {
        if (line === '') {
          result.push('');
        } else {
          if (result.length > 0 && result[result.length - 1] !== '' && !prevIsTable) {
            result.push('');
          }
          result.push(line);
        }
      }
    }

    return addInternalLinks(result.join('\n'), article.slug, articles);
  })();

  // トークンで分割（複数あっても各区切りにブロックを差し込む）。トークンが無ければ従来通り単一本文。
  const bodyParts = processedBody.split(AFFILIATE_BLOCK_TOKEN);

  const fallbackColor =
    CATEGORY_COLORS[article.category ?? ''] ?? '#1a2744';

  const siteUrl = SITE_URL;
  const pageUrl = `${siteUrl}/articles/${article.slug}/`;

  // Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || undefined,
    datePublished: article.publishedAt || undefined,
    dateModified: article.publishedAt || undefined,
    image: article.heroImage ? `${siteUrl}${article.heroImage}` : undefined,
    url: pageUrl,
    inLanguage: 'ja',
    publisher: {
      '@type': 'Organization',
      name: '施工管理転職ナビ',
      url: siteUrl,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: '転職コラム', item: `${siteUrl}/articles/` },
      { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-10"
      style={{ fontSize: '1.0625rem' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* パンくず */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/articles/" className="hover:underline">転職コラム</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{article.title}</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-8">
        {article.category && (
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded mb-3"
            style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
          >
            {ARTICLE_CATEGORIES[article.category] ?? article.category}
          </span>
        )}
        <h1
          className="text-2xl sm:text-3xl font-bold leading-tight mb-3"
          style={{ color: '#1a2744' }}
        >
          {article.title}
        </h1>
        {article.description && (
          <p className="text-gray-500 text-sm leading-relaxed">{article.description}</p>
        )}
        {article.publishedAt && (
          <p className="text-xs text-gray-400 mt-3">公開日：{article.publishedAt}</p>
        )}
      </div>

      {/* ヒーロー画像 */}
      <div className="mb-8 rounded-xl overflow-hidden">
        {article.heroImage ? (
          <ArticleImage
            src={article.heroImage}
            alt={article.title}
            fallbackColor={fallbackColor}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{
              backgroundColor: fallbackColor,
              aspectRatio: '1200 / 630',
            }}
          >
            <span className="text-5xl">🏗️</span>
          </div>
        )}
      </div>

      {/* 本文（Markdownレンダリング）＋ アフィリエイトブロックを本文内に差し込み */}
      <article style={{ fontSize: '1.0625rem' }}>
        <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
          {bodyParts[0]}
        </ReactMarkdown>
        {bodyParts.slice(1).map((part, i) => (
          <Fragment key={i}>
            <ComparisonTable
              affiliates={blockAffiliates}
              prefName={blockPrefName}
              jobTypeName={blockJobName}
              jobTypeId={article.jobType || undefined}
            />
            {part.trim() !== '' && (
              <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
                {part}
              </ReactMarkdown>
            )}
          </Fragment>
        ))}
      </article>

      {/* CTA / アフィリエイトブロック */}
      {(() => {
        const jobTypeData = article.jobType
          ? JOB_TYPES.find((j) => j.id === article.jobType)
          : undefined;
        const prefData = article.pref
          ? PREFS.find((p) => p.id === article.pref)
          : undefined;

        // pref と jobType を両方持つ記事 → 換金ページ（/{pref}/{jobType}/）への内部リンクCTAを維持
        if (prefData && jobTypeData) {
          const ctaHeading = `${prefData.name}の${jobTypeData.fullName}求人を見る`;
          const ctaButtonLabel = `${prefData.nameShort}の求人を見る →`;
          const ctaHref = `/${article.pref}/${article.jobType}/`;
          const ctaAgentName = `${prefData.name}/${jobTypeData.fullName}`;
          return (
            <div
              className="mt-12 rounded-xl p-6 text-center"
              style={{ backgroundColor: '#1a2744' }}
            >
              <p className="text-white font-bold mb-1">{ctaHeading}</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                都道府県・工種別の求人・エージェント情報を無料で確認
              </p>
              <AffiliateCta
                href={ctaHref}
                agentName={ctaAgentName}
                source="article_cta"
                isExternal={false}
                className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
              >
                {ctaButtonLabel}
              </AffiliateCta>
            </div>
          );
        }

        // それ以外（pref・jobType のいずれかが欠ける記事すべて）→ 実アフィリエイト案件ブロックを記事末に描画。
        // app/page.tsx の RECOMMENDED と同じ要領で isRecommended を優先し上位3件（不足時は rank 順で補完）。
        // 各案件は外部アフィリンク（item.url / isExternal / source="article_affiliate"）で出し、
        // rel="sponsored"・target=_blank・gtagトラッキングを効かせる。これで自己ループ／行き止まりを解消する。
        const endBlockAffiliates = [...allAffiliates]
          .sort((a, b) => {
            if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
            return (a.rank ?? 999) - (b.rank ?? 999);
          })
          .slice(0, 3);

        return (
          <div className="mt-12">
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1a2744' }}>
              <p className="text-white font-bold text-center mb-1">
                施工管理の転職エージェントを今すぐ比較する
              </p>
              <p className="text-sm text-center mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                編集部おすすめの施工管理特化エージェント（登録・相談は無料）
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {endBlockAffiliates.map((item, i) => {
                  const isFirst = i === 0;
                  return (
                    <AffiliateCta
                      key={item.id}
                      href={item.url}
                      agentName={item.name}
                      isRecommended={item.isRecommended}
                      source="article_affiliate"
                      className="flex flex-col rounded-lg p-4"
                      style={{
                        backgroundColor: '#142036',
                        border: isFirst
                          ? '1px solid #f59e0b'
                          : '1px solid rgba(255,255,255,0.12)',
                        textDecoration: 'none',
                      }}
                    >
                      {item.badge && !/^\d+$/.test(item.badge) && (
                        <span
                          className="inline-block self-start text-xs font-bold px-2 py-0.5 rounded mb-2"
                          style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <div className="font-bold text-sm leading-snug mb-1" style={{ color: '#ffffff' }}>
                        {item.name}
                      </div>
                      {item.tagline && (
                        <div className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {item.tagline}
                        </div>
                      )}
                      {item.features.length > 0 && (
                        <ul className="text-xs space-y-1 mb-4 flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {item.features.slice(0, 3).map((f, fi) => (
                            <li key={fi} className="flex gap-1.5">
                              <span style={{ color: '#f59e0b', flexShrink: 0 }}>✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div
                        className="mt-auto text-center text-sm font-bold py-2.5 rounded-md"
                        style={
                          isFirst
                            ? { backgroundColor: '#f59e0b', color: '#1a2744' }
                            : {
                                backgroundColor: 'rgba(245,158,11,0.12)',
                                color: '#f59e0b',
                                border: '1px solid rgba(245,158,11,0.3)',
                              }
                        }
                      >
                        無料で相談する →
                      </div>
                    </AffiliateCta>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              本ページはアフィリエイト広告を含みます。掲載順位は報酬額に関わらず独自基準で決定しています。
            </p>
          </div>
        );
      })()}

      {/* 関連記事 */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2
            className="text-lg font-bold pb-2 border-b-2 mb-5"
            style={{ color: '#1a2744', borderColor: '#f59e0b' }}
          >
            関連コラム
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/articles/${rel.slug}/`}
                className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {rel.heroImage ? (
                  <div className="relative h-28 overflow-hidden bg-gray-100">
                    <Image
                      src={rel.heroImage}
                      alt={rel.title}
                      width={400}
                      height={210}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div
                    className="h-28 flex items-center justify-center text-3xl"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[rel.category ?? ''] ?? '#1a2744',
                    }}
                  >
                    🏗️
                  </div>
                )}
                <div className="p-3">
                  <p
                    className="text-xs font-semibold leading-snug group-hover:underline"
                    style={{ color: '#1a2744' }}
                  >
                    {rel.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 一覧へ戻る */}
      <div className="mt-10 text-center">
        <Link
          href="/articles/"
          className="text-sm hover:underline"
          style={{ color: '#1a2744' }}
        >
          ← 転職コラム一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
