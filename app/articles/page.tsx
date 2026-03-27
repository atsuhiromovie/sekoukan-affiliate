import { Metadata } from 'next';
import Link from 'next/link';
import { fetchArticles } from '../../lib/sheets';

export const metadata: Metadata = {
  title: '転職コラム | 施工管理転職ナビ',
  description:
    '施工管理技士の転職に役立つコラム・ノウハウ記事を掲載。年収アップのコツ・エージェント活用術・資格取得情報など。',
  alternates: { canonical: '/articles/' },
};

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* ページヘッダー */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold tracking-widest mb-2"
          style={{ fontFamily: 'Oswald, sans-serif', color: '#f59e0b', letterSpacing: '0.2em' }}
        >
          ARTICLES
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold pb-3 border-b-2"
          style={{ color: '#1a2744', borderColor: '#f59e0b' }}
        >
          転職コラム
        </h1>
        <p className="text-sm text-gray-500 mt-3">
          施工管理技士の転職を成功させるためのノウハウ・情報を発信しています。
        </p>
      </div>

      {/* 記事一覧 */}
      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-lg font-medium">記事を準備中です</p>
          <p className="text-sm mt-2">近日公開予定です。しばらくお待ちください。</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}/`}
              className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* サムネイル */}
              {article.heroImage ? (
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div
                  className="h-44 flex items-center justify-center text-4xl"
                  style={{ backgroundColor: '#1a2744' }}
                >
                  🏗️
                </div>
              )}

              {/* テキスト */}
              <div className="p-5">
                {article.category && (
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2"
                    style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
                  >
                    {article.category}
                  </span>
                )}
                <h2
                  className="font-bold text-base leading-snug mb-2 group-hover:underline"
                  style={{ color: '#1a2744' }}
                >
                  {article.title}
                </h2>
                {article.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{article.description}</p>
                )}
                {article.publishedAt && (
                  <p className="text-xs text-gray-400 mt-3">{article.publishedAt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* フッターCTA */}
      <div
        className="mt-14 rounded-xl p-6 text-center"
        style={{ backgroundColor: '#1a2744' }}
      >
        <p className="text-white font-bold mb-1">施工管理の転職は専門エージェントへ</p>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          都道府県・工種ごとのおすすめエージェントを比較
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
        >
          エージェントを比較する →
        </Link>
      </div>
    </div>
  );
}
