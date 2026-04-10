import { AffiliateItem } from '../lib/types';
import TrackingCtaLink from './TrackingCtaLink';

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
}

const JOB_TYPE_IDS = ['architecture', 'civil', 'electrical', 'pipe', 'landscaping'] as const;
const JOB_TYPE_LABELS: Record<string, string> = {
  architecture: '建築',
  civil: '土木',
  electrical: '電気',
  pipe: '管工事',
  landscaping: '造園',
};

// 安心バッジ（CTAの直上に表示）
const TRUST_BADGES = ['完全無料', '3分で登録', '強引な勧誘なし'];

interface Props {
  affiliates: AffiliateItem[];
  prefName: string;
  jobTypeName: string;
  jobTypeId?: string;
}

export default function ComparisonTable({ affiliates, prefName, jobTypeName, jobTypeId = '' }: Props) {
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
          <MobileCard
            key={item.id}
            item={item}
            rank={i + 1}
            prefName={prefName}
            jobTypeName={jobTypeName}
            jobTypeId={jobTypeId}
          />
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3 text-left w-12">順位</th>
              <th className="p-3 text-left">サービス名</th>
              <th className="p-3 text-left">特徴・強み</th>
              <th className="p-3 text-center">工種対応</th>
              <th className="p-3 text-center">対応地域</th>
              <th className="p-3 text-center">年収UP実績</th>
              <th className="p-3 text-center w-44">公式サイト</th>
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
                  {getRankEmoji(i + 1)}
                </td>
                <td className="p-3">
                  <div className="font-bold text-base text-gray-900">{item.name}</div>
                  {item.badge && !/^\d+$/.test(item.badge) && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded">
                      {item.badge}
                    </span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">{item.tagline}</div>
                  {/* こんな人におすすめタグ */}
                  {item.targetTags && item.targetTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.targetTags.map((tag) => (
                        <span key={tag} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  {/* 編集部コメント */}
                  {item.reason && (
                    <div className="text-xs text-gray-600 bg-gray-50 border-l-2 border-amber-400 pl-2 py-1 mb-2 leading-relaxed italic">
                      {item.reason}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1 text-gray-700">
                        <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 text-center text-xs">
                  {JOB_TYPE_IDS.map((jt) => {
                    const covered = item.jobTypes.includes('all') || item.jobTypes.includes(jt);
                    return (
                      <div
                        key={jt}
                        className={`flex items-center gap-1 ${covered ? 'text-green-600' : 'text-gray-300'}`}
                      >
                        <span>{covered ? '✓' : '○'}</span>
                        <span>{JOB_TYPE_LABELS[jt]}</span>
                      </div>
                    );
                  })}
                </td>
                <td className="p-3 text-center text-gray-700">
                  {item.regions.includes('all') ? '全国対応' : `${prefName}対応`}
                </td>
                <td className="p-3 text-center">
                  {item.minSalaryUp ? (
                    <span className="font-bold text-green-700 text-base">
                      +{item.minSalaryUp}万円〜
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">実績あり</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {/* 安心バッジ */}
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {TRUST_BADGES.map((b) => (
                      <span key={b} className="text-xs bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">
                        {b}
                      </span>
                    ))}
                  </div>
                  <TrackingCtaLink
                    href={item.url}
                    isRecommended={item.isRecommended}
                    agentName={item.name}
                    prefName={prefName}
                    jobTypeName={jobTypeName}
                    className={`block w-full py-2.5 px-3 rounded font-bold text-sm text-center transition-colors ${
                      item.isRecommended
                        ? 'bg-amber-400 hover:bg-amber-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {item.isRecommended ? '無料登録して年収交渉を依頼 →' : '無料で登録する →'}
                  </TrackingCtaLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        ※本ページはアフィリエイト広告を含みます。掲載企業より紹介料をいただく場合があります。掲載順位は報酬額に関わらず独自基準で決定しています。
      </p>
    </section>
  );
}

// ===== モバイル用カードコンポーネント =====
function MobileCard({
  item,
  rank,
  prefName,
  jobTypeName,
  jobTypeId,
}: {
  item: AffiliateItem;
  rank: number;
  prefName: string;
  jobTypeName: string;
  jobTypeId: string;
}) {
  const rankEmoji = getRankEmoji(rank);

  return (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${
        item.isRecommended ? 'border-amber-300' : 'border-gray-200'
      }`}
    >
      {/* カードヘッダー */}
      <div className={`px-5 pt-5 pb-4 ${item.isRecommended ? 'bg-amber-50' : 'bg-white'}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rankEmoji}</span>
            <div>
              <span className="font-bold text-lg text-gray-900">{item.name}</span>
              {item.badge && !/^\d+$/.test(item.badge) && (
                <span className="ml-2 inline-block px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
          {/* 年収UP実績バッジ */}
          {item.minSalaryUp && (
            <div className="shrink-0 text-right">
              <div className="text-xs text-gray-500">年収UP実績</div>
              <div className="font-bold text-green-700 text-base">+{item.minSalaryUp}万円〜</div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{item.tagline}</p>
      </div>

      {/* こんな人におすすめ */}
      {item.targetTags && item.targetTags.length > 0 && (
        <div className="px-5 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1.5">こんな人におすすめ</p>
          <div className="flex flex-wrap gap-1.5">
            {item.targetTags.map((tag) => (
              <span key={tag} className="bg-white text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 編集部コメント */}
      {item.reason && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">編集部コメント</p>
          <p className="text-xs text-gray-700 leading-relaxed">{item.reason}</p>
        </div>
      )}

      {/* 特徴リスト */}
      <div className={`px-5 py-4 border-t ${item.isRecommended ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100'}`}>
        <ul className="space-y-1.5">
          {item.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 shrink-0 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-3 text-xs text-gray-500">
          対応地域: {item.regions.includes('all') ? '全国' : `${prefName}対応`}
        </div>
      </div>

      {/* CTA */}
      <div className={`px-5 py-4 border-t ${item.isRecommended ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'}`}>
        {/* 安心バッジ */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TRUST_BADGES.map((b) => (
            <span key={b} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">
              {b}
            </span>
          ))}
        </div>
        <TrackingCtaLink
          href={item.url}
          isRecommended={item.isRecommended}
          agentName={item.name}
          prefName={prefName}
          jobTypeName={jobTypeName}
          className={`block w-full py-3.5 rounded-lg font-bold text-center text-white transition-colors ${
            item.isRecommended
              ? 'bg-amber-400 hover:bg-amber-500'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {item.isRecommended ? '無料登録して年収交渉を依頼 →' : '無料で登録する →'}
        </TrackingCtaLink>
      </div>
    </div>
  );
}
