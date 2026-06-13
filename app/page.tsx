import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { TrendingUp, Sparkles } from 'lucide-react';
import { JOB_TYPES, ARTICLE_CATEGORIES, PREFS } from '../lib/constants';
import PrefJobSelector from '../components/PrefJobSelector';
import AffiliateCta from '../components/AffiliateCta';
import RegionAccordion from '../components/RegionAccordion';
import StampMark from '../components/StampMark';
import BlueprintHero from '../components/BlueprintHero';
import SiteBlackboard from '../components/SiteBlackboard';
import { getRevision } from '../lib/revision';
import { fetchAffiliatesFromSheets, fetchArticles } from '../lib/sheets';

export const metadata: Metadata = {
  title: '施工管理転職ナビ | 47都道府県×5工種別おすすめエージェント比較',
  description:
    '47都道府県×5工種の求人に対応。建築・土木・電気工事・管工事・造園の施工管理技士向けおすすめエージェントを比較。転職のコツ・平均年収データも掲載。',
  alternates: { canonical: 'https://sekoukan-navi.com/' },
};

// 施工図面: 英字・数字ディスプレイ用フォント（和文には適用しない）
const BEBAS = "var(--font-bebas), 'Oswald', sans-serif";

/** 図面シート番号方式のセクション見出し */
function SectionHead({
  no,
  en,
  ja,
  note,
}: {
  no: string;
  en: string;
  ja: string;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <span
        className="font-blueprint"
        style={{
          fontSize: '10px',
          fontWeight: 600,
          backgroundColor: 'var(--amber)',
          color: 'var(--bg0)',
          padding: '3px 7px',
          letterSpacing: '0.06em',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {no}
      </span>
      <span
        style={{
          fontFamily: BEBAS,
          fontSize: '18px',
          letterSpacing: '0.14em',
          color: 'var(--amber)',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {en}
      </span>
      <span
        className="hidden sm:inline"
        style={{ fontSize: '11px', color: 'var(--txt3)', flexShrink: 0 }}
      >
        {ja}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--line-soft)' }} />
      {note && (
        <span
          className="font-blueprint"
          style={{ fontSize: '10px', color: 'var(--txt3)', letterSpacing: '0.08em', flexShrink: 0 }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [allItems, allArticles] = await Promise.all([
    fetchAffiliatesFromSheets(),
    fetchArticles(),
  ]);
  const recommended = allItems.filter((item) => item.isRecommended).slice(0, 3);

  // 記事数・台帳番号はビルド時の published 件数から動的算出（手動更新を発生させない）
  const publishedCount = allArticles.length;
  const ledger = [...allArticles]
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, 5);

  // 改訂情報（黒板・フッターで共有）
  const rev = getRevision();

  // 年収シミュレーター代表値: 東京×建築×1級×10年 を実データ（constants）から算出
  // ※ ダミー値のハードコードは禁止。SalarySimulator と同じ係数を使用
  const tokyo = PREFS.find((p) => p.id === 'tokyo');
  const arch = JOB_TYPES.find((j) => j.id === 'architecture');
  const simBaseMan = (tokyo?.avgSalary ?? 560) + (arch?.avgSalary ?? 30);
  const simSalaryMan = Math.round(simBaseMan * 1.15 * 1.05); // 1級(×1.15) × 経験10年(×1.05)
  const simSalaryYen = (simSalaryMan * 10000).toLocaleString('ja-JP');

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
        @media (prefers-reduced-motion: reduce) {
          .anim-1, .anim-2, .anim-3, .anim-4 { animation: none; }
        }
        /* RECOMMENDED: 1位をわずかに大きく（1.2fr : 1fr : 1fr）*/
        .rec-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 768px) {
          .rec-grid { grid-template-columns: 1.2fr 1fr 1fr; align-items: stretch; }
        }
        /* ABOUT: 本文 1.15fr : 黒板 1fr（モバイルは縦積み・本文先）*/
        .about-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 768px) {
          .about-grid { grid-template-columns: 1.15fr 1fr; align-items: start; }
        }
        .tool-panel { transition: border-color .2s, transform .2s; }
        .tool-panel:hover { transform: translateY(-3px); border-color: rgba(245,158,11,0.5); }
        .rec-card { transition: border-color .2s; }
        .ledger-row:hover .ledger-title { color: #f0f4f8; }
      `}</style>

      <div style={{ backgroundColor: 'var(--bg0)' }}>

        {/* ===== A-01 HERO ===== */}
        <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg1)' }}>
          <div
            className="absolute top-0 right-0 h-full"
            style={{ width: '3px', backgroundColor: 'var(--amber)' }}
          />
          <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <div className="grid md:grid-cols-[1fr_auto] md:gap-10 items-center">
              {/* 左: コピー + 検索 */}
              <div>
                <p
                  className="anim-1 mb-4"
                  style={{ fontFamily: BEBAS, color: 'var(--amber)', letterSpacing: '0.2em', fontSize: '15px' }}
                >
                  FIND YOUR NEXT CAREER
                </p>
                <h1
                  className="anim-2 text-3xl sm:text-4xl font-bold leading-tight mb-4"
                  style={{ color: '#ffffff' }}
                >
                  47都道府県 × 5工種
                  <br />
                  <span style={{ color: 'var(--amber)' }}>地域密着</span>の転職情報
                </h1>
                <p
                  className="anim-3 text-sm sm:text-base leading-relaxed mb-8 max-w-xl"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  施工管理技士（建築・土木・電気工事・管工事・造園）の転職を成功させる専門情報サイトです。
                  <br className="hidden sm:block" />
                  お住まいの都道府県と工種を選んで、最適な転職エージェントを見つけてください。
                </p>

                {/* SPEC ― 検索条件を記入（PrefJobSelector は機能変更なし）*/}
                <div
                  className="anim-4"
                  style={{ border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden' }}
                >
                  <div
                    className="font-blueprint flex items-center gap-2 px-4 py-2"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      color: 'var(--bg0)',
                      backgroundColor: 'var(--amber)',
                    }}
                  >
                    SPEC ― 検索条件を記入
                  </div>
                  <div className="p-4" style={{ backgroundColor: 'rgba(10,20,34,0.35)' }}>
                    <PrefJobSelector />
                  </div>
                </div>
              </div>

              {/* 右: 寸法線付き図面（デスクトップのみ・LCP保護）*/}
              <div className="hidden md:block" style={{ width: '250px' }}>
                <BlueprintHero className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 数字ストリップ ===== */}
        <div
          style={{
            backgroundColor: 'var(--bg0)',
            borderTop: '1px solid var(--line-soft)',
            borderBottom: '1px solid var(--line-soft)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4">
            {[
              { num: '47', label: '都道府県' },
              { num: '5', label: '工種' },
              { num: '235', label: '求人ページ' },
              { num: String(publishedCount), label: '転職コラム' },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center px-2 py-1"
                style={{ borderRight: i < 3 ? '1px solid var(--line-soft)' : 'none' }}
              >
                <div style={{ fontFamily: BEBAS, fontSize: '42px', color: 'var(--amber)', lineHeight: 1 }}>
                  {s.num}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--txt2)', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== A-02 RECOMMENDED（S級・トラ縞）===== */}
        {recommended.length > 0 && (
          <>
            <div className="tiger-stripe" />
            <section style={{ backgroundColor: 'var(--bg2)' }}>
              <div className="max-w-5xl mx-auto px-4 py-12">
                <SectionHead
                  no="A-02"
                  en="RECOMMENDED"
                  ja="編集部が調査したおすすめ転職サービス"
                  note={`${recommended.length} AGENTS`}
                />
                <div className="rec-grid">
                  {recommended.map((item, i) => {
                    const isFirst = i === 0;
                    const rankStr = `0${i + 1}`;
                    return (
                      <AffiliateCta
                        key={item.id}
                        href={item.url}
                        agentName={item.name}
                        isRecommended={item.isRecommended}
                        source="top_recommended"
                        className="rec-card relative flex flex-col rounded-xl p-5"
                        style={{
                          backgroundColor: 'var(--bg1)',
                          border: isFirst
                            ? '1px solid var(--amber)'
                            : '1px solid var(--line)',
                          textDecoration: 'none',
                        }}
                      >
                        {/* ランク番号 + 調査済スタンプ */}
                        <div className="flex items-start justify-between mb-1">
                          <span
                            style={{
                              fontFamily: BEBAS,
                              fontSize: isFirst ? '34px' : '26px',
                              lineHeight: 1,
                              color: isFirst ? 'var(--amber)' : 'var(--txt3)',
                            }}
                          >
                            {rankStr}
                          </span>
                          {isFirst && (
                            <span className="-mt-1 -mr-1">
                              <StampMark />
                            </span>
                          )}
                        </div>

                        {item.badge && !/^\d+$/.test(item.badge) && (
                          <span
                            className="inline-block self-start text-xs font-bold px-2 py-0.5 rounded mb-2"
                            style={{ backgroundColor: 'var(--amber)', color: 'var(--bg0)' }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <div className="font-bold text-sm leading-snug mb-2" style={{ color: 'var(--txt)' }}>
                          {item.name}
                        </div>
                        {item.tagline && (
                          <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--txt2)' }}>
                            {item.tagline}
                          </div>
                        )}
                        {item.features.length > 0 && (
                          <ul className="text-xs space-y-1 mb-4 flex-1" style={{ color: 'var(--txt2)' }}>
                            {item.features.map((f, fi) => (
                              <li key={fi} className="flex gap-1.5">
                                <span style={{ color: 'var(--amber)', flexShrink: 0 }}>✓</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* CTA: 1位はベタ塗り / 2-3位はゴースト */}
                        <div
                          className="mt-auto text-center text-sm font-bold py-2.5 rounded-md"
                          style={
                            isFirst
                              ? { backgroundColor: 'var(--amber)', color: 'var(--bg0)' }
                              : {
                                  backgroundColor: 'rgba(245,158,11,0.12)',
                                  color: 'var(--amber)',
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
            </section>
          </>
        )}

        {/* ===== A-03 TOOLS（計測機器パネル）===== */}
        <section style={{ backgroundColor: 'var(--bg1)' }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <SectionHead
              no="A-03"
              en="TOOLS"
              ja="施工管理に特化した計測ツール"
              note="2 INSTRUMENTS"
            />
            <div className="grid md:grid-cols-2 gap-4">
              {/* INSTRUMENT 01: 年収シミュレーター */}
              <Link
                href="/simulator"
                className="tool-panel flex flex-col rounded-xl p-6"
                style={{ backgroundColor: 'var(--bg0)', border: '1px solid var(--line)', textDecoration: 'none' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} color="#f59e0b" strokeWidth={2} />
                  <span className="font-blueprint" style={{ fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.08em' }}>
                    INSTRUMENT 01
                  </span>
                  <span className="text-xs" style={{ color: 'var(--txt3)' }}>― 年収シミュレーター</span>
                </div>
                <div style={{ fontFamily: BEBAS, fontSize: '38px', color: '#ffffff', lineHeight: 1 }}>
                  ¥{simSalaryYen}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                  {['東京', '建築', '1級', '10年'].map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ border: '1px solid var(--line)', color: 'var(--txt2)' }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <span className="mt-auto text-sm font-semibold" style={{ color: 'var(--amber)' }}>
                  シミュレーターを使う →
                </span>
              </Link>

              {/* INSTRUMENT 02: 肩書き翻訳ツール */}
              <Link
                href="/tools/title-translator"
                className="tool-panel relative flex flex-col rounded-xl p-6"
                style={{ backgroundColor: 'var(--bg0)', border: '1px solid var(--line)', textDecoration: 'none' }}
              >
                <span
                  className="absolute top-4 right-4 font-bold rounded leading-none"
                  style={{ backgroundColor: 'var(--amber)', color: 'var(--bg0)', fontSize: '0.6rem', padding: '2px 5px' }}
                >
                  AI
                </span>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} color="#f59e0b" strokeWidth={2} />
                  <span className="font-blueprint" style={{ fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.08em' }}>
                    INSTRUMENT 02
                  </span>
                  <span className="text-xs" style={{ color: 'var(--txt3)' }}>― 肩書き翻訳ツール</span>
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm rounded-md px-3 py-2 mb-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--line-soft)', color: 'var(--txt2)' }}
                  >
                    現場代理人（8年）
                  </div>
                  <div className="text-center leading-none mb-2" style={{ color: 'var(--amber)', fontSize: '18px' }}>↓</div>
                  <div
                    className="text-sm rounded-md px-3 py-2"
                    style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--txt)' }}
                  >
                    施工管理責任者 / 工程・原価・安全統括
                  </div>
                </div>
                <span className="mt-4 text-sm font-semibold" style={{ color: 'var(--amber)' }}>
                  AIに肩書き案を出してもらう →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== A-04 ABOUT（工事黒板）===== */}
        <section style={{ backgroundColor: 'var(--bg0)' }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <SectionHead no="A-04" en="ABOUT" ja="運営者について" />
            <div className="about-grid">
              {/* 本文（です・ます調・確定コピー）*/}
              <div>
                <p className="font-bold mb-4" style={{ fontSize: '19px', color: 'var(--txt)' }}>
                  転職で、<span style={{ color: 'var(--amber)' }}>失敗</span>しています。
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--txt2)' }}>
                  複数のエージェントを使い倒し、遠回りの末にたどり着いたのは、失敗と成功の両方の経験でした。だからこそ、何が遠回りで、どこが近道だったのかを知っています。
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--txt2)' }}>
                  その経験をすべてこのサイトに置いていきます。転職を考えるあなたが、
                  <span style={{ color: 'var(--txt)', fontWeight: 500 }}>最短ルートで最適な転職</span>
                  にたどり着くために。
                </p>

                {/* 著者表示 */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: 'var(--surface)',
                      border: '2px solid var(--amber)',
                      color: 'var(--amber)',
                    }}
                  >
                    F/F
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--txt)' }}>
                      よんさん
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--txt2)' }}>
                      スタジオ Four/Frame 代表（41歳）/ Webマーケター・動画クリエイター
                    </div>
                  </div>
                </div>
                <Link
                  href="/about/"
                  className="inline-block mt-4 text-xs"
                  style={{
                    color: 'var(--amber)',
                    borderBottom: '1px solid rgba(245,158,11,0.4)',
                    paddingBottom: '1px',
                    textDecoration: 'none',
                  }}
                >
                  著者プロフィール・運営者情報を読む →
                </Link>
              </div>

              {/* 工事黒板 */}
              <SiteBlackboard updatedLabel={rev.label} />
            </div>
          </div>
        </section>

        {/* ===== A-05 COLUMN（図面台帳）===== */}
        <section style={{ backgroundColor: 'var(--bg1)' }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <SectionHead
              no="A-05"
              en="COLUMN"
              ja="転職コラム"
              note={`${publishedCount} ARTICLES`}
            />
            {ledger.length > 0 ? (
              <div style={{ border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
                {ledger.map((article, i) => {
                  const num = publishedCount - i;
                  const isLatest = i === 0;
                  return (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}/`}
                      className="ledger-row flex items-baseline gap-3 px-4 py-3"
                      style={{
                        borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
                        backgroundColor: isLatest ? 'var(--bg2)' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      <span
                        className="font-blueprint"
                        style={{
                          fontSize: '11px',
                          flexShrink: 0,
                          color: isLatest ? 'var(--amber)' : 'var(--txt3)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        C-{num}
                      </span>
                      <span
                        className="ledger-title text-sm truncate"
                        style={{ color: 'var(--txt)', maxWidth: '60%' }}
                      >
                        {article.title}
                      </span>
                      <span
                        className="flex-1 self-center"
                        style={{ borderBottom: '1px dotted var(--line)' }}
                      />
                      <span
                        className="font-blueprint hidden sm:inline"
                        style={{ fontSize: '10px', flexShrink: 0, color: 'var(--txt3)' }}
                      >
                        {ARTICLE_CATEGORIES[article.category] ?? article.category}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--txt3)' }}>
                コラムは現在準備中です。
              </p>
            )}
            <div className="text-center mt-5">
              <Link
                href="/articles"
                className="text-sm"
                style={{
                  color: 'var(--amber)',
                  borderBottom: '1px solid rgba(245,158,11,0.3)',
                  paddingBottom: '1px',
                  textDecoration: 'none',
                }}
              >
                コラム一覧を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== A-06 REGION ===== */}
        <section id="region" style={{ backgroundColor: 'var(--bg0)' }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <SectionHead no="A-06" en="REGION" ja="地域から探す" note="47 PREF." />
            <RegionAccordion />
          </div>
        </section>

        {/* ===== A-07 JOB TYPE ===== */}
        <section style={{ backgroundColor: 'var(--bg0)' }}>
          <div className="max-w-5xl mx-auto px-4 pb-12">
            <SectionHead no="A-07" en="JOB TYPE" ja="工種から探す" note="5 TYPES" />
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
                    {job.fullName}の求人を見る <span style={{ color: '#f59e0b' }}>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 全都道府県リンクハブ ===== */}
        <section style={{ backgroundColor: 'var(--bg0)' }}>
          <div className="max-w-5xl mx-auto px-4 pb-16">
            <h2
              className="text-xl font-bold mb-6 pl-4"
              style={{ color: 'var(--txt)', borderLeft: '4px solid var(--amber)' }}
            >
              全国の施工管理転職情報
            </h2>
            {(['北海道・東北', '関東', '中部', '近畿', '中国・四国', '九州・沖縄'] as const).map((regionLabel) => {
              const prefs = PREFS.filter((p) => p.region === regionLabel);
              if (prefs.length === 0) return null;
              return (
                <div key={regionLabel} className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--txt2)' }}>
                    {regionLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {prefs.map((pref) => (
                      <Link
                        key={pref.id}
                        href={`/${pref.id}/architecture/`}
                        className="text-sm px-3 py-1 rounded-full transition-colors"
                        style={{
                          color: 'var(--txt2)',
                          backgroundColor: 'rgba(139,164,188,0.08)',
                          border: '1px solid var(--line-soft)',
                        }}
                      >
                        {pref.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
