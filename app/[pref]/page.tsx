import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PREFS, JOB_TYPES, getPrefById } from '../../lib/constants';

// ===== SSG: 47都道府県分のパスを生成 =====
export async function generateStaticParams() {
  return PREFS.map((pref) => ({ pref: pref.id }));
}

// ===== メタデータ動的生成 =====
export async function generateMetadata({
  params,
}: {
  params: { pref: string };
}): Promise<Metadata> {
  const pref = getPrefById(params.pref);
  if (!pref) return {};

  const title = `${pref.name}の施工管理転職おすすめエージェント比較【${new Date().getFullYear()}年最新】`;
  const description = `${pref.name}で施工管理の転職を成功させるためのエージェント比較。建築・土木・電気工事・管工事・造園の工種別求人情報と平均年収を掲載。`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.pref}/`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

// ===== 求人需要バッジ =====
function DemandBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  if (level === 'high') {
    return (
      <span
        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full text-white"
        style={{ backgroundColor: '#dc2626' }}
      >
        求人多数
      </span>
    );
  }
  if (level === 'medium') {
    return (
      <span
        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
      >
        標準
      </span>
    );
  }
  return (
    <span
      className="inline-block text-xs font-bold px-2.5 py-1 rounded-full text-white"
      style={{ backgroundColor: '#6b7280' }}
    >
      少なめ
    </span>
  );
}

// ===== 都道府県TOPページ =====
export default function PrefTopPage({ params }: { params: { pref: string } }) {
  const pref = getPrefById(params.pref);
  if (!pref) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <span>{pref.name}の施工管理転職</span>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {pref.name}の施工管理転職おすすめエージェント
      </h1>

      {/* ③ trendKeywordsバッジ（H1直下・リード文の前） */}
      {pref.trendKeywords && pref.trendKeywords.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold mb-2" style={{ color: '#1a2744' }}>
            注目キーワード
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pref.trendKeywords.map((kw, i) => (
              <span
                key={i}
                className="shrink-0 text-xs px-3 py-1 rounded-full border font-medium"
                style={{
                  backgroundColor: '#f0f4f8',
                  borderColor: '#1a2744',
                  color: '#1a2744',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-gray-600 mb-8 leading-relaxed">
        {pref.name}で施工管理の転職を検討中の方へ。建築・土木・電気工事・管工事・造園の5工種別に、
        {pref.name}の求人に強い転職エージェントと平均年収データをまとめました。
        工種を選んで詳細情報をご確認ください。
      </p>

      {/* 地域特性バッジ */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h2 className="font-bold text-blue-800 mb-3">
          📍 {pref.name}の施工管理市場の特徴
        </h2>
        <ul className="space-y-1.5">
          {pref.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-500 shrink-0">▶</span>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="bg-white rounded-lg px-4 py-2 border border-blue-100">
            <span className="text-gray-500">施工管理平均年収</span>
            <span className="font-bold text-blue-700 ml-2">約{pref.avgSalary}万円</span>
          </div>
          <div className="bg-white rounded-lg px-4 py-2 border border-blue-100">
            <span className="text-gray-500">主要都市</span>
            <span className="font-bold text-gray-700 ml-2">{pref.majorCity}</span>
          </div>
          {/* ① 求人需要バッジ */}
          <div className="bg-white rounded-lg px-4 py-2 border border-blue-100 flex items-center gap-2">
            <span className="text-gray-500">求人需要</span>
            <DemandBadge level={pref.demandLevel} />
          </div>
        </div>
      </div>

      {/* 工種別ページ一覧 */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        工種を選んで転職情報を確認
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {JOB_TYPES.map((job) => {
          const salary = pref.avgSalary + job.avgSalary;
          return (
            <Link
              key={job.id}
              href={`/${pref.id}/${job.id}/`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {pref.nameShort}の{job.fullName}
                </h3>
                <span className="text-blue-600 text-sm font-bold">→</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{job.description}</p>
              {/* ② 工種カードの年収表示強化 */}
              <p className="text-xs mb-2" style={{ color: '#6b7280' }}>
                目安年収：約{salary}万円〜
              </p>
              <div className="text-sm font-semibold" style={{ color: '#1a2744' }}>
                {pref.nameShort}の{job.name}求人を見る →
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {job.license}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
