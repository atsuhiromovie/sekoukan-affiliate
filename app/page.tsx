import Link from 'next/link';
import { Metadata } from 'next';
import { PREFS, JOB_TYPES } from '../lib/constants';
import PrefJobSelector from '../components/PrefJobSelector';
import { fetchAffiliatesFromSheets, fetchArticles } from '../lib/sheets';

export const metadata: Metadata = {
  title: '施工管理転職ナビ | 47都道府県×5工種別おすすめエージェント比較',
  description:
    '施工管理技士の転職を成功させる専門情報サイト。建築・土木・電気工事・管工事・造園の工種別に、都道府県別の求人・平均年収・おすすめエージェントを比較掲載。',
};

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

const SITE_FEATURES = [
  {
    icon: '🗾',
    title: '地域別の求人情報',
    desc: '47都道府県×5工種、235ページ。お住まいの地域と工種で絞り込める専門ナビ。',
  },
  {
    icon: '📊',
    title: '年収シミュレーター',
    desc: '現在の工種と年収を入力すると、転職で上昇する可能性のある年収額を自動計算。',
  },
  {
    icon: '📝',
    title: '転職ノウハウ記事',
    desc: '複数回の転職経験をもとに編集した、施工管理技士向けの実践的な転職コラム。',
  },
];


function SectionHead({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: '20px',
          letterSpacing: '0.12em',
          color: '#f59e0b',
        }}
      >
        {en}
      </span>
      <span className="text-xs tracking-widest" style={{ color: '#7a96aa' }}>
        {ja}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}

export default async function HomePage() {
  const [allItems, allArticles] = await Promise.all([
    fetchAffiliatesFromSheets(),
    fetchArticles(),
  ]);
  const recommended = allItems.filter((item) => item.isRecommended).slice(0, 3);
  const featuredArticles = allArticles
    .filter((a) => a.status === 'published')
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, 3);

  const prefsByRegion = REGIONS.map((region) => ({
    region,
    prefs: PREFS.filter((p) => p.region === region),
  })).filter((r) => r.prefs.length > 0);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.6s 0.00s ease both; }
        .anim-2 { animation: fadeUp 0.6s 0.10s ease both; }
        .anim-3 { animation: fadeUp 0.6s 0.20s ease both; }
        .anim-4 { animation: fadeUp 0.6s 0.30s ease both; }
      `}</style>

      <div>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(245,158,11,0.05) 1px,transparent 1px),' +
                'linear-gradient(90deg,rgba(245,158,11,0.05) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute top-0 right-0 h-full"
            style={{ width: '3px', backgroundColor: '#f59e0b' }}
          />
          <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <p
              className="anim-1 text-xs font-semibold mb-4"
              style={{ fontFamily: 'Oswald, sans-serif', color: '#f59e0b', letterSpacing: '0.2em' }}
            >
              FIND YOUR NEXT CAREER
            </p>
            <h1
              className="anim-2 text-3xl sm:text-4xl font-bold leading-tight mb-4"
              style={{ color: '#ffffff' }}
            >
              47都道府県 × 5工種
              <br />
              <span style={{ color: '#f59e0b' }}>地域密着</span>の転職情報
            </h1>
            <p
              className="anim-3 text-sm sm:text-base leading-relaxed mb-10 max-w-xl"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              施工管理技士（建築・土木・電気工事・管工事・造園）の転職を成功させる専門情報サイトです。
              <br className="hidden sm:block" />
              お住まいの都道府県と工種を選んで、最適な転職エージェントを見つけてください。
            </p>
            <div className="anim-4">
              <PrefJobSelector />
            </div>
          </div>
        </section>

        {/* ===== 数字ストリップ ===== */}
        <div
          style={{
            backgroundColor: '#111d35',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-4">
            {[
              { num: '47',  label: '都道府県対応' },
              { num: '5',   label: '工種対応' },
              { num: '235', label: '求人ページ' },
              { num: '7+',  label: '掲載エージェント' },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center px-2"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
              >
                <div
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '28px',
                    color: '#f59e0b',
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div className="text-xs mt-1" style={{ color: '#7a96aa', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4">

          {/* ===== サイトの特徴 ===== */}
          <section className="py-10">
            <SectionHead en="FEATURES" ja="このサイトでできること" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SITE_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl p-5 border"
                  style={{ backgroundColor: '#111d35', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <div className="font-bold text-sm mb-2" style={{ color: '#e8edf2' }}>
                    {f.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: '#7a96aa' }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== おすすめ転職サービス ===== */}
          {recommended.length > 0 && (
            <section className="pb-10">
              <SectionHead en="RECOMMENDED" ja="おすすめ転職サービス" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recommended.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex flex-col rounded-xl p-5 border transition-colors hover:border-amber-400"
                    style={{
                      backgroundColor: '#111d35',
                      borderColor: 'rgba(255,255,255,0.1)',
                      textDecoration: 'none',
                    }}
                  >
                    {item.badge && (
                      <span
                        className="inline-block self-start text-xs font-bold px-2 py-0.5 rounded mb-3"
                        style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <div className="font-bold text-sm leading-snug mb-2" style={{ color: '#e8edf2' }}>
                      {item.name}
                    </div>
                    {item.tagline && (
                      <div className="text-xs leading-relaxed mb-3" style={{ color: '#7a96aa' }}>
                        {item.tagline}
                      </div>
                    )}
                    {item.features.length > 0 && (
                      <ul className="text-xs space-y-1 mb-4 flex-1" style={{ color: '#7a96aa' }}>
                        {item.features.map((f, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span style={{ color: '#f59e0b', flexShrink: 0 }}>✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div
                      className="mt-auto text-center text-sm font-bold py-2 rounded-md"
                      style={{
                        backgroundColor: 'rgba(245,158,11,0.12)',
                        color: '#f59e0b',
                        border: '1px solid rgba(245,158,11,0.3)',
                      }}
                    >
                      無料で相談する →
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ===== ABOUT ===== */}
          <section className="pb-10">
            <SectionHead en="ABOUT" ja="このサイトについて" />
            <div
              className="rounded-r-xl p-6"
              style={{
                backgroundColor: '#111d35',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeftWidth: '3px',
                borderLeftColor: '#f59e0b',
              }}
            >
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#7a96aa' }}>
                複数回の転職で
                <span style={{ color: '#e8edf2', fontWeight: 500 }}>
                  多くのエージェントを使い比べた経験
                </span>
                をもとに、
                <br />
                データと実体験から施工管理技士の転職を編集している専門ナビです。
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: '#1a3a5c',
                    border: '2px solid #f59e0b',
                    color: '#f59e0b',
                  }}
                >
                  F/F
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#e8edf2' }}>
                    よんさん
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#7a96aa' }}>
                    スタジオ Four/Frame 代表（41歳）/ Webマーケター・動画クリエイター
                  </div>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-block mt-4 text-xs"
                style={{
                  color: '#f59e0b',
                  borderBottom: '1px solid rgba(245,158,11,0.4)',
                  paddingBottom: '1px',
                  textDecoration: 'none',
                }}
              >
                著者プロフィール・運営者情報を読む →
              </Link>
            </div>
          </section>

          {/* ===== 転職コラム ===== */}
          <section className="pb-10">
            <SectionHead en="COLUMN" ja="転職コラム" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}/`}
                  className="block rounded-xl overflow-hidden border transition-colors hover:border-amber-400"
                  style={{
                    backgroundColor: '#111d35',
                    borderColor: 'rgba(255,255,255,0.08)',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    className="flex items-center justify-center text-xs"
                    style={{
                      height: '80px',
                      backgroundColor: '#1a3a5c',
                      color: '#3a6080',
                      letterSpacing: '0.1em',
                    }}
                  >
                    ARTICLE
                  </div>
                  <div className="p-4">
                    <div
                      className="text-xs mb-2"
                      style={{ color: '#f59e0b', letterSpacing: '0.05em' }}
                    >
                      {article.category}
                    </div>
                    <div className="text-sm leading-snug" style={{ color: '#c8d8e4' }}>
                      {article.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link
                href="/articles"
                className="text-sm"
                style={{
                  color: '#f59e0b',
                  borderBottom: '1px solid rgba(245,158,11,0.3)',
                  paddingBottom: '1px',
                  textDecoration: 'none',
                }}
              >
                コラム一覧を見る →
              </Link>
            </div>
          </section>

          {/* ===== 地域別都道府県一覧 ===== */}
          <section className="pb-4">
            <SectionHead en="REGION" ja="地域から探す" />
            {prefsByRegion.map(({ region, prefs }) => {
              const regionEn = REGION_EN[region] ?? region.toUpperCase();
              return (
                <div key={region} className="mb-8">
                  <h2
                    className="text-xs font-semibold mb-3 pb-1 inline-block border-b-2"
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
                        className="bg-white border rounded-lg p-3 hover:shadow-md transition-all text-sm"
                        style={{ borderColor: '#e2e6ef' }}
                      >
                        <div className="font-medium" style={{ color: '#1a2744' }}>
                          {pref.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                          約{pref.avgSalary}万円〜
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ===== 工種別リンク ===== */}
          <section className="pb-12">
            <SectionHead en="JOB TYPE" ja="工種から探す" />
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
    </>
  );
}
