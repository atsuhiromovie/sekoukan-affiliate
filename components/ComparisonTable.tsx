import { AffiliateItem } from '../lib/types';

interface Props {
  affiliates: AffiliateItem[];
  prefName: string;
  jobTypeName: string;
}

export default function ComparisonTable({ affiliates, prefName, jobTypeName }: Props) {
  return (
    <section className="my-10" id="comparison">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 border-l-4 border-blue-600 pl-4">
        {prefName}の{jobTypeName}転職おすすめエージェント比較
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        ※ 掲載情報は編集部調査時点（{new Date().getFullYear()}年）のものです。最新情報は各社公式サイトでご確認ください。
      </p>

      {/* モバイル：カード型 / デスクトップ：テーブル型 */}
      <div className="space-y-6 lg:hidden">
        {affiliates.map((item, i) => (
          <MobileCard key={item.id} item={item} rank={i + 1} prefName={prefName} jobTypeName={jobTypeName} />
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3 text-left w-12">順位</th>
              <th className="p-3 text-left">サービス名</th>
              <th className="p-3 text-left">特徴・強み</th>
              <th className="p-3 text-center">対応地域</th>
              <th className="p-3 text-center">年収アップ実績</th>
              <th className="p-3 text-center w-40">公式サイト</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((item, i) => (
              <tr
                key={item.id}
                className={`border-b ${
                  item.isRecommended
                    ? 'bg-amber-50 border-amber-200'
                    : i % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-50'
                }`}
              >
                <td className="p-3 text-center font-bold text-lg">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </td>
                <td className="p-3">
                  <div className="font-bold text-base text-gray-900">{item.name}</div>
                  {item.badge && !/^\d+$/.test(item.badge) && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded">
                      {item.badge}
                    </span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">{item.tagline}</div>
                </td>
                <td className="p-3">
                  <ul className="space-y-1">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1 text-gray-700">
                        <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 text-center text-gray-700">
                  {item.regions.includes('all') ? '全国対応' : `${prefName}対応`}
                </td>
                <td className="p-3 text-center font-bold text-blue-700">
                  実績多数
                </td>
                <td className="p-3 text-center">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={`block w-full py-2.5 px-3 rounded font-bold text-sm text-center transition-colors ${
                      item.isRecommended
                        ? 'bg-amber-400 hover:bg-amber-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    公式サイトで
                    <br />
                    求人を見る →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        ※本ページはアフィリエイト広告を含みます。掲載企業より紹介料をいただく場合があります。
      </p>
    </section>
  );
}

// ===== モバイル用カードコンポーネント =====
function MobileCard({
  item,
  rank,
  prefName,
}: {
  item: AffiliateItem;
  rank: number;
  prefName: string;
  jobTypeName: string;
}) {
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}位`;

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        item.isRecommended ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-2xl mr-2">{rankEmoji}</span>
          <span className="font-bold text-lg text-gray-900">{item.name}</span>
          {item.badge && !/^\d+$/.test(item.badge) && (
            <span className="ml-2 inline-block px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded">
              {item.badge}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{item.tagline}</p>
      <ul className="space-y-1.5 mb-4">
        {item.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-500 shrink-0 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-500 mb-3">
        対応地域: {item.regions.includes('all') ? '全国' : `${prefName}対応`}
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`block w-full py-3 rounded-lg font-bold text-center text-white transition-colors ${
          item.isRecommended
            ? 'bg-amber-400 hover:bg-amber-500'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        公式サイトで求人を見る →
      </a>
    </div>
  );
}
