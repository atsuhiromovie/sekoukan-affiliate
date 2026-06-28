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
              私自身、20代〜30代にかけて複数回の転職を経験しました。その過程で大手から業界特化型まで
              10社以上の転職エージェントを実際に利用し、対応の丁寧さ・求人の質・提案力に大きな「差」が
              あることを身をもって知りました。書類作成からエージェント面談・企業面接・条件交渉・退職手続きまで、
              転職の全プロセスを当事者として経験しています。
            </p>
            <p>
              現在はWebマーケター・動画クリエイターとしてスタジオ Four/Frame を運営しています。
              制作の仕事ではゼネコンや専門工事会社など<strong style={{ color: '#cfe0ea' }}>建設業界のクライアントを数多く担当</strong>しており、
              採用サイトや会社案内・現場動画の制作を通じて、人手不足・採用難・施工管理職の離職や転職事情といった
              「現場のリアル」を当事者の方から直接うかがう機会が続いてきました。
            </p>
            <p>
              「これだけ需要があるのに、施工管理の転職に本当に役立つ情報がネット上に驚くほど少ない」——
              建設業界の方と接する中で感じたこの課題と、自分自身がエージェント選びで苦労した経験が重なり、
              本サイトを立ち上げました。施工管理技士の方が<strong style={{ color: '#cfe0ea' }}>質の高いエージェントへ最短でたどり着ける</strong>よう、
              データと実体験の両面から情報を編集しています。
            </p>
            <p className="text-xs" style={{ color: '#7a96aa' }}>
              ※私自身は施工管理技士の有資格者ではありません。だからこそ、各社の公式データ・公開求人・
              利用者の口コミといった検証可能な一次情報を重視し、推測や誇張に頼らない編集を徹底しています。
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
                { label: '業界との接点', value: '制作業務でゼネコン・建設企業を多数担当' },
                { label: '転職経験',   value: '複数回（建設・施工管理求人への応募経験含む）' },
                { label: '利用経験',   value: '10社以上の転職エージェントを実際に利用・比較' },
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
              body: '転職エージェント（人材紹介）は、求職者側の費用が完全無料であること。採用した企業側が費用を負担するため、求職者に金銭的負担は発生しません。',
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

        <div
          className="mt-3 rounded-xl p-4 text-xs leading-relaxed"
          style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}
        >
          <strong>【転職エージェント以外のサービスについて】</strong>
          本サイトでは、上記の転職エージェントとは別に、転職前に資格取得を目指す方向けの「資格取得・独学サポート」サービスも紹介しています。
          これらは転職エージェント（無料）とは異なり、<strong>受講料などの費用が利用者負担となる有料サービス</strong>です。
          ご利用前に各サービスの料金・内容を必ずご確認ください。
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
              a: '転職エージェント（人材紹介）はすべて求職者側の費用が完全無料です。転職支援サービスの費用は採用した企業側が負担します。なお、本サイトで別枠として紹介している「資格取得・独学サポート」は、受講料などが利用者負担となる有料サービスです。エージェントとは料金体系が異なりますので、ご利用前に各サービスの料金をご確認ください。',
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
