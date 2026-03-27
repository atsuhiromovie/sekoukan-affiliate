import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { fetchArticles } from '../../../lib/sheets';

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
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
      {article.heroImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-56 sm:h-72 object-cover"
          />
        </div>
      )}

      {/* 本文（Markdownレンダリング） */}
      <article className="prose prose-sm sm:prose max-w-none prose-headings:text-[#1a2744] prose-a:text-[#f59e0b] prose-strong:text-[#1a2744]">
        <ReactMarkdown>{article.body.replace(/\n{1}(?!\n)/g, '\n\n')}</ReactMarkdown>
      </article>

      {/* CTA */}
      <div
        className="mt-12 rounded-xl p-6 text-center"
        style={{ backgroundColor: '#1a2744' }}
      >
        <p className="text-white font-bold mb-1">
          {article.pref ? `${article.pref}の転職エージェントを比較する` : '転職エージェントを今すぐ比較する'}
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
                  <div className="h-28 overflow-hidden bg-gray-100">
                    <img
                      src={rel.heroImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div
                    className="h-28 flex items-center justify-center text-3xl"
                    style={{ backgroundColor: '#1a2744' }}
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
