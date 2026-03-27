import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { fetchArticles } from '../../../lib/sheets';

// ===== カテゴリ別カラー（heroImage代替） =====
const CATEGORY_COLORS: Record<string, string> = {
  転職ノウハウ: '#1a2744',
  資格情報: '#1e3a5f',
  地域情報: '#234068',
  企業研究: '#1a3050',
  年収情報: '#162238',
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
    <table
      style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}
    >
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th
      style={{
        border: '1px solid #e2e8f0',
        padding: '0.5rem',
        textAlign: 'left',
        backgroundColor: '#f8fafc',
        fontWeight: 'bold',
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ border: '1px solid #e2e8f0', padding: '0.5rem', textAlign: 'left' }}>
      {children}
    </td>
  ),
};

// ===== SSG: 全公開記事のslugを事前生成 =====
export async function generateStaticParams() {
  const articles = await fetchArticles();
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
  const articles = await fetchArticles();
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

  const fallbackColor =
    CATEGORY_COLORS[article.category ?? ''] ?? '#1a2744';

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-10"
      style={{ fontSize: '1.0625rem' }}
    >
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
            {article.category}
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
          <div className="relative w-full" style={{ aspectRatio: '1200 / 630' }}>
            <Image
              src={article.heroImage}
              alt={article.title}
              width={1200}
              height={630}
              className="w-full h-full object-cover"
              priority
              onError={() => {/* フォールバックはCSSで対応 */}}
            />
          </div>
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

      {/* 本文（Markdownレンダリング） */}
      <article style={{ fontSize: '1.0625rem' }}>
        <ReactMarkdown components={mdComponents}>
          {article.body.replace(/\n{1}(?!\n)/g, '\n\n')}
        </ReactMarkdown>
      </article>

      {/* CTA */}
      <div
        className="mt-12 rounded-xl p-6 text-center"
        style={{ backgroundColor: '#1a2744' }}
      >
        <p className="text-white font-bold mb-1">
          {article.pref
            ? `${article.pref}の転職エージェントを比較する`
            : '転職エージェントを今すぐ比較する'}
        </p>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          都道府県・工種別の求人・エージェント情報を無料で確認
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
        >
          エージェントを比較する →
        </Link>
      </div>

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
