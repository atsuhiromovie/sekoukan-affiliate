import Link from 'next/link';
import { Metadata } from 'next';
import { PREFS, JOB_TYPES } from '../lib/constants';
import PrefJobSelector from '../components/PrefJobSelector';

export const metadata: Metadata = {
  title: '施工管理転職ナビ | 47都道府県×5工種別おすすめエージェント比較',
  description:
    '施工管理技士の転職を成功させる専門情報サイト。建築・土木・電気工事・管工事・造園の工種別に、都道府県別の求人・平均年収・おすすめエージェントを比較掲載。',
};

// 地域英語対応表
const REGION_EN: Record<string, string> = {
  北海道: 'HOKKAIDO',
  東北: 'TOHOKU',
  関東: 'KANTO',
  中部: 'CHUBU',
  近畿: 'KINKI',
  中国: 'CHUGOKU',
  四国: 'SHIKOKU',
  九州: 'KYUSHU',
  沖縄: 'OKINAWA',
};

const REGIONS = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州', '沖縄'];

export default function HomePage() {
  const prefsByRegion = REGIONS.map((region) => ({
    region,
    prefs: PREFS.filter((p) => p.region === region),
  })).filter((r) => r.prefs.length > 0);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#1a2744' }}
      >
        {/* 右端ゴールド縦ライン */}
        <div
          className="absolute top-0 right-0 h-full"
          style={{ width: '3px', backgroundColor: '#f59e0b' }}
        />

        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
          {/* 英字キャプション */}
          <p
            className="text-sm tracking-widest mb-4 font-semibold"
            style={{
              fontFamily: 'Oswald, sans-serif',
              color: '#f59e0b',
              letterSpacing: '0.2em',
            }}
          >
            FIND YOUR NEXT CAREER
          </p>

          {/* メインコピー */}
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
            style={{ color: '#ffffff' }}
          >
            47都道府県 × 5工種
            <br />
            <span style={{ color: '#f59e0b' }}>地域密着</span>の転職情報
          </h1>

          {/* サブコピー */}
          <p
            className="text-sm sm:text-base leading-relaxed mb-10 max-w-xl"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            施工管理技士（建築・土木・電気工事・管工事・造園）の転職を成功させる専門情報サイトです。
            <br className="hidden sm:block" />
            お住まいの都道府県と工種を選んで、最適な転職エージェントを見つけてください。
          </p>

          {/* セレクター */}
          <PrefJobSelector />
        </div>
      </section>

      {/* ===== 地域別都道府県一覧 ===== */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {prefsByRegion.map(({ region, prefs }) => {
          const regionEn = REGION_EN[region] ?? region.toUpperCase();
          return (
            <section key={region} className="mb-10">
              {/* 地域ラベル（英字併記・Oswald） */}
              <h2
                className="text-sm font-semibold mb-4 pb-1 inline-block border-b-2"
                style={{
                  fontFamily: 'Oswald, sans-serif',
                  color: '#1a2744',
                  borderColor: '#f59e0b',
                  letterSpacing: '0.1em',
                }}
              >
                {regionEn}
                <span className="mx-2" style={{ color: '#f59e0b' }}>—</span>
                {region}地方
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {prefs.map((pref) => (
                  <Link
                    key={pref.id}
                    href={`/${pref.id}/`}
                    className="bg-white border rounded-lg p-3 hover:shadow-md transition-all text-sm group"
                    style={{ borderColor: '#e2e6ef' }}
                  >
                    <div
                      className="font-medium group-hover:transition-colors"
                      style={{ color: '#1a2744' }}
                    >
                      {pref.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      約{pref.avgSalary}万円〜
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* ===== 工種別リンク ===== */}
        <section className="mt-4">
          <h2
            className="text-sm font-semibold mb-6 pb-1 inline-block border-b-2"
            style={{
              fontFamily: 'Oswald, sans-serif',
              color: '#1a2744',
              borderColor: '#f59e0b',
              letterSpacing: '0.1em',
            }}
          >
            JOB TYPE
            <span className="mx-2" style={{ color: '#f59e0b' }}>—</span>
            工種から探す
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {JOB_TYPES.map((job) => (
              <div
                key={job.id}
                className="bg-white border rounded-xl p-5 hover:shadow-md transition-all"
                style={{ borderColor: '#e2e6ef' }}
              >
                <h3 className="font-bold mb-2" style={{ color: '#1a2744' }}>
                  {job.fullName}
                </h3>
                <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>
                  {job.license}
                </p>
                <p className="text-xs mb-4 line-clamp-2" style={{ color: '#6b7280' }}>
                  {job.description}
                </p>
                <Link
                  href={`/tokyo/${job.id}/`}
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#1a2744' }}
                >
                  東京の{job.name}求人を見る{' '}
                  <span style={{ color: '#f59e0b' }}>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
