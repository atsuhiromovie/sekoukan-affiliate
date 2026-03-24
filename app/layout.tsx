import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://sekoukan-agent.netlify.app'),
  title: {
    default: '施工管理転職ナビ | 都道府県×工種別おすすめエージェント比較',
    template: '%s | 施工管理転職ナビ',
  },
  description:
    '施工管理技士の転職を成功させる専門情報サイト。47都道府県×5工種別に最適な転職エージェントを比較紹介。現キャリ・RSGなど高年収案件に強いエージェントを厳選掲載。',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: '施工管理転職ナビ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Google Fonts — display=swap でLCPに影響させない */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        {/* グローバルヘッダー */}
        <header className="bg-blue-800 text-white py-3 px-4 shadow-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-tight">
              🏗️ 施工管理転職ナビ
            </a>
            <span className="text-blue-200 text-xs hidden sm:block">
              施工管理技士のための転職情報サイト
            </span>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* グローバルフッター */}
        <footer className="bg-gray-800 text-gray-400 py-8 mt-16">
          <div className="max-w-5xl mx-auto px-4 text-sm">
            <p className="mb-2">
              ※ 本サイトにはアフィリエイト広告が含まれています。
            </p>
            <p className="mb-4">
              掲載情報は編集部調査時点のものです。最新情報は各社公式サイトでご確認ください。
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} 施工管理転職ナビ
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
