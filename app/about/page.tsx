import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '著者プロフィール・運営者情報 | 施工管理転職ナビ',
  description:
    '施工管理転職ナビの著者・運営者情報です。複数回の転職経験をもとにデータと実体験から情報を編集しています。',
};

function SectionHead({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: '18px',
          letterSpacing: '0.12em',
          color: '#f59e0b',
        }}
      >
        {en}
      </span>
      <span className="text-xs tracking-widest" style={{ color: '#9ca3af' }}>
        {ja}
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* パンくず */}
      <nav className="text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <span>著者プロフィール・運営者情報</span>
      </nav>

      {/* ページタイトル */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold tracking-widest mb-2"
          style={{ fontFamily: 'Oswald, sans-serif', color: '#f59e0b', letterSpacing: '0.2em' }}
        >
          ABOUT
        </p>
        <h1
          className="text-2xl font-bold pb-3 border-b-2"
          style={{ color: '#1a2744', borderColor: '#f59e0b' }}
        >
          著者プロフィール・運営者情報
        </h1>
      </div>

      {/* ===== 著者プロフィール ===== */}
      <section className="mb-12">
        <SectionHead en="PROFILE" ja="著者プロフィール" />

        {/* アバター＋名前 */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: '#111d35',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeftWidth: '3px',
            borderLeftColor: '#f59e0b',
          }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm"
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#1a3a5c',
                border: '2px solid #f59e0b',
                color: '#f59e0b',
              }}
            >
              F/F
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: '#e8edf2' }}>
                よんさん
              </div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: '#7a96aa' }}>
                スタジオ Four/Frame 代表（41歳）<br />
                Webマーケター・動画クリエイター
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#9cb3c0' }}>
            <p>
              複数回の転職活動を通じて多くの転職エージェントを実際に使い比べた経験をもとに、
              データと実体験から施工管理技士向けの転職情報を編集しています。
            </p>
            <p>
              転職活動の全プロセス（書類作成・エージェント面談・企業面接・条件交渉・退職手続き）を
              当事者として経験しており、現場感覚を大切にした情報発信を心がけています。
            </p>
            <p>
              現在は副業として動画制作・Webコンテンツ制作にも従事。
              スタジオ Four/Frame としてWeb制作・映像制作を手がけています。
            </p>
          </div>
        </div>

        {/* 経歴テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: '名前',   value: 'よんさん' },
                { label: '年齢',   value: '41歳' },
                { label: '職業',   value: 'Webマーケター・動画クリエイター' },
                { label: '転職経験', value: '複数回（施工管理業界含む）' },
                { label: '副業',   value: '動画制作・Webコンテンツ制作' },
              ].map((row, i) => (
                <tr
                  key={row.label}
                  style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}
                >
                  <td
                    className="py-3 px-4 font-semibold w-32 text-xs"
                    style={{ color: '#1a2744', borderBottom: '1px solid #e2e8f0' }}
                  >
                    {row.label}
                  </td>
                  <td
                    className="py-3 px-4 text-xs"
                    style={{ color: '#4b5563', borderBottom: '1px solid #e2e8f0' }}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== サイト情報 ===== */}
      <section className="mb-12">
        <SectionHead en="SITE INFO" ja="サイト情報" />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: 'サイト名', value: '施工管理転職ナビ' },
                { label: '運営',    value: 'スタジオ Four/Frame' },
                { label: '設立',    value: '2026年' },
                { label: '目的',    value: '施工管理技士の転職を支援する専門情報サイト' },
                { label: 'URL',     value: 'https://sekoukan-navi.com' },
              ].map((row, i) => (
                <tr
                  key={row.label}
                  style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}
                >
                  <td
                    className="py-3 px-4 font-semibold w-32 text-xs"
                    style={{ color: '#1a2744', borderBottom: '1px solid #e2e8f0' }}
                  >
                    {row.label}
                  </td>
                  <td
                    className="py-3 px-4 text-xs"
                    style={{ color: '#4b5563', borderBottom: '1px solid #e2e8f0' }}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 免責事項 ===== */}
      <section className="mb-12">
        <SectionHead en="DISCLAIMER" ja="免責事項" />

        <div
          className="rounded-xl p-5 text-sm leading-relaxed space-y-3"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#6b7280',
          }}
        >
          <p>
            本サイトに掲載している情報は、編集部調査時点のものです。
            最新情報は各社公式サイトでご確認ください。
          </p>
          <p>
            本サイトはアフィリエイトプログラムに参加しており、
            掲載リンクを経由してサービスに申し込まれた場合、
            当サイトに報酬が発生することがあります。
            ただし、掲載内容はそれにより左右されるものではありません。
          </p>
          <p>
            転職に関する最終的なご判断は、ご自身の責任において行ってください。
            本サイトの情報を参考にした結果について、当サイトは一切の責任を負いかねます。
          </p>
        </div>
      </section>

      {/* ===== リンク ===== */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/privacy/"
          className="underline hover:opacity-70 transition-opacity"
          style={{ color: '#1a2744' }}
        >
          プライバシーポリシー
        </Link>
        <Link
          href="/contact/"
          className="underline hover:opacity-70 transition-opacity"
          style={{ color: '#1a2744' }}
        >
          お問い合わせ
        </Link>
        <Link
          href="/"
          className="underline hover:opacity-70 transition-opacity"
          style={{ color: '#1a2744' }}
        >
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
