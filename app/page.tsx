import Link from 'next/link';
import { Metadata } from 'next';
import { PREFS, JOB_TYPES } from '../lib/constants';

export const metadata: Metadata = {
  title: '施工管理転職ナビ | 47都道府県×5工種別おすすめエージェント比較',
  description:
    '施工管理技士の転職を成功させる専門情報サイト。建築・土木・電気工事・管工事・造園の工種別に、都道府県別の求人・平均年収・おすすめエージェントを比較掲載。',
};

const REGIONS = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州', '沖縄'];

export default function HomePage() {
  const prefsByRegion = REGIONS.map((region) => ({
    region,
    prefs: PREFS.filter((p) => p.region === region),
  })).filter((r) => r.prefs.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        施工管理転職ナビ
      </h1>
      <p className="text-gray-600 leading-relaxed mb-10">
        施工管理技士（建築・土木・電気工事・管工事・造園）の転職を成功させるための専門情報サイトです。
        お住まいの都道府県と工種を選んで、最適な転職エージェントを見つけてください。
      </p>

      {/* 地域別都道府県一覧 */}
      {prefsByRegion.map(({ region, prefs }) => (
        <section key={region} className="mb-8">
          <h2 className="text-lg font-bold text-blue-800 bg-blue-50 px-4 py-2 rounded-lg mb-3">
            {region}地方
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {prefs.map((pref) => (
              <Link
                key={pref.id}
                href={`/${pref.id}/`}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition-all text-sm"
              >
                <div className="font-medium text-gray-900">{pref.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">約{pref.avgSalary}万円〜</div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* 工種別リンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">工種から探す</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {JOB_TYPES.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">{job.fullName}</h3>
              <p className="text-xs text-gray-500 mb-3">{job.license}</p>
              <p className="text-xs text-gray-600 mb-4 line-clamp-2">{job.description}</p>
              <Link
                href={`/tokyo/${job.id}/`}
                className="text-sm text-blue-600 hover:underline"
              >
                東京の{job.name}求人を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
