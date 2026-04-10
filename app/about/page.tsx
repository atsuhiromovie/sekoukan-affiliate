import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '著者プロフィール・運営者情報 | 施工管理転職ナビ',
  description:
    '施工管理転職ナビの著者・運営者情報です。複数回の転職経験をもとにデータと実体験から情報を編集しています。エージェント選定基準・編集方針も公開。',
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
              20代〜30代にかけて複数回の転職活動を経験。建設・施工管理業界を含む求人に実際に応募し、
              大手・特化型を問わず10社以上の転職エージェントを自ら利用・比較してきました。
            </p>
            <p>
              エージェントの「質の差」を身をもって感じたことが、このサイトを立ち上げたきっかけです。
              転職活動の全プロセス（書類作成・エージェント面談・企業面接・条件交渉・退職手続き）を
              当事者として経験しており、現場感覚を大切にした情報発信を心がけています。
            </p>
            <p>
              現在はWebマーケター・動画クリエイターとしてスタジオ Four/Frame を運営。
              Web制作・映像制作に加え、キャリア系コンテンツの企画・編集を手がけています。
            </p>
          </div>
        </div>

        {/* 経歴テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: '名前',       value: 'よんさん' },
                { label: '年齢',       value: '41歳' },
                { label: '職業',       value: 'Webマーケター・動画クリエイター' },
                { label: '転職経験',   value: '複数回（施工管理業界含む）' },
                { label: '利用経験',   value: '10社以上の転職エージェントを実際に利用・比較' },
                { label: '副業',       value: '動画制作・Webコンテンツ制作' },
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

      {/* ===== エージェント選定基準 ===== */}
      <section className="mb-12">
        <SectionHead en="CRITERIA" ja="エージェント選定基準" />

        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          本サイトでは、以下の基準を満たすエージェントのみを掲載対象としています。
          アフィリエイト報酬の有無が掲載可否に影響することはありません。
        </p>

        <ol className="space-y-4">
          {[
            {
              title: '施工管理・建設業界への専門性',
              body: '施工管理技士（建築・土木・電気・管工事・造園）の求人を多数保有し、業界特化のキャリアアドバイザーが在籍していること。',
            },
            {
              title: '求人の質・量',
              body: '公開求人数が十分にあり、非公開求人の保有実績があること。年収500万円超の案件が含まれること。',
            },
            {
              title: '対応地域の広さ',
              body: '全国対応、または特定地域で強い実績を持つこと。地方の施工管理求人にも対応できること。',
            },
            {
              title: '利用者からの評判',
              body: '転職口コミサイト（転職会議・Googleレビュー等）での評価が平均水準以上であること。強引な営業行為の報告がないこと。',
            },
            {
              title: '費用',
              body: '転職者側への費用が完全無料であること（求職者向け有料サービスは掲載対象外）。',
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ backgroundColor: '#1a2744' }}
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-sm text-gray-900 mb-1">{item.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div
          className="mt-5 rounded-xl p-4 text-xs leading-relaxed"
          style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
        >
          <strong>【広告表示について】</strong>
          本サイトはアフィリエイトプログラムに参加しており、掲載リンクを経由してサービスへ申し込みが発生した場合、
          当サイトに報酬が発生することがあります。ただし、掲載順位・評価内容は報酬額に左右されておらず、
          上記の選定基準に基づいて独自に決定しています。
        </div>
      </section>

      {/* ===== 編集方針 ===== */}
      <section className="mb-12">
        <SectionHead en="EDITORIAL" ja="編集方針" />

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div className="flex gap-3">
            <span className="shrink-0 text-amber-500 font-bold mt-0.5">▶</span>
            <p><strong>一次情報の重視：</strong>各エージェントの公式サイト・求人データベースを直接調査し、二次情報に依存しない掲載内容を目指しています。</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 text-amber-500 font-bold mt-0.5">▶</span>
            <p><strong>定期的な情報更新：</strong>掲載情報は定期的に見直しを行い、サービス内容の変更や新サービスの登場に対応しています。</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 text-amber-500 font-bold mt-0.5">▶</span>
            <p><strong>地域・工種の網羅：</strong>47都道府県×5工種の235パターンに対応し、特定の地域・工種に偏らない情報提供を行っています。</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 text-amber-500 font-bold mt-0.5">▶</span>
            <p><strong>誤り・変更のご指摘：</strong>掲載内容に誤りや変更があった場合は、<Link href="/contact/" className="text-blue-600 underline hover:opacity-80">お問い合わせ</Link>よりご連絡ください。速やかに確認・修正いたします。</p>
          </div>
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

      {/* ===== よくある質問 ===== */}
      <section className="mb-12">
        <SectionHead en="FAQ" ja="よくある質問" />

        <div className="space-y-4">
          {[
            {
              q: '掲載エージェントはどのように選んでいますか？',
              a: '上記の「エージェント選定基準」に基づき、施工管理業界への専門性・求人の質・対応地域・利用者評判・無料利用可否を総合的に評価して掲載を決定しています。アフィリエイト報酬の高低は選定に影響しません。',
            },
            {
              q: '掲載順位はどう決まりますか？',
              a: '施工管理転職への専門性・保有求人数・年収アップ実績・使いやすさ等を独自の基準で評価しています。上位掲載がアフィリエイト報酬によって決まることはありません。',
            },
            {
              q: '情報はいつ更新されていますか？',
              a: '各エージェントの情報は定期的に確認・更新しています。ページ内に「編集部調査時点」と記載している情報については、各社公式サイトで最新情報をご確認ください。',
            },
            {
              q: 'このサイトを使って転職エージェントに登録すると費用はかかりますか？',
              a: '掲載しているエージェントはすべて求職者側への費用が完全無料です。転職支援サービスの費用は採用した企業側が負担します。',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-semibold text-sm text-gray-900 mb-2">
                <span className="text-amber-500 mr-2">Q.</span>{item.q}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed pl-5">{item.a}</p>
            </div>
          ))}
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
