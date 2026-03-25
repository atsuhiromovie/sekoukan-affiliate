import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '施工管理転職ナビのプライバシーポリシーページです。',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
        プライバシーポリシー
      </h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">運営者</h2>
        <p className="text-gray-600 leading-relaxed">
          本サイト「施工管理転職ナビ」は、施工管理転職ナビ編集部が運営しています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">広告について</h2>
        <p className="text-gray-600 leading-relaxed">
          本サイトは、各種アフィリエイトプログラムに参加しています。
          サイト内に掲載している広告やリンクを経由して商品・サービスのお申し込みが発生した場合、
          当編集部が報酬を受け取ることがあります。
          なお、広告掲載の有無はコンテンツの内容・評価に影響を与えておりません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">アクセス解析について</h2>
        <p className="text-gray-600 leading-relaxed">
          本サイトでは、Googleが提供するアクセス解析ツール「Google Analytics 4（GA4）」を使用しています。
          GA4はCookieを使用してトラフィックデータを収集します。このデータは匿名で収集されており、
          個人を特定するものではありません。
          この機能はCookieを無効にすることで収集を拒否することができます。
          詳細は
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Googleプライバシーポリシー
          </a>
          をご確認ください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Cookieについて</h2>
        <p className="text-gray-600 leading-relaxed">
          本サイトではCookieを使用しています。Cookieはブラウザに保存される小さなテキストファイルであり、
          サイトの利便性向上やアクセス解析のために利用されます。
          ブラウザの設定によりCookieを無効にすることが可能ですが、
          一部機能が利用できなくなる場合があります。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">免責事項</h2>
        <p className="text-gray-600 leading-relaxed">
          本サイトに掲載している情報は、編集部が調査した時点のものです。
          掲載内容の正確性・完全性については万全を期しておりますが、
          実際の情報は各社公式サイトにてご確認ください。
          本サイトの情報を利用したことによって生じたいかなる損害についても、
          当編集部は一切の責任を負いかねます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">お問い合わせ</h2>
        <p className="text-gray-600 leading-relaxed">
          お問い合わせ窓口は後日設置予定です。
        </p>
      </section>

      <p className="text-sm text-gray-400 mt-12">
        制定日：2026年3月
      </p>
    </div>
  );
}
