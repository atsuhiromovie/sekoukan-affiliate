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
        <meta name="google-site-verification" content="BtYm2wMpMxrnMWJ7aiZWK7GZYSIaPNKgBGFUdmUGrkQ" />
        <meta name="google-site-verification" content="S3gMdx_YVuSq1yrM_vcbxsMvu" />
        <meta name="google-site-verification" content="BtYm2wMpMxrnMWJ7aiZWK7GZYSlaPNKgBGFUdmUGrkQ" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        {/* グローバルヘッダー */}
        <header style={{ backgroundColor: '#1a2744' }} className="text-white py-3 px-4 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">
                施工管理
                <span style={{ color: '#f59e0b' }}>転職</span>
                ナビ
              </span>
            </a>
            <div className="flex items-center gap-5">
              <a
                href="/articles/"
                className="text-sm font-medium transition-colors hover:opacity-80 hidden sm:block"
                style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.03em' }}
              >
                転職コラム
              </a>
              <span
                className="text-xs hidden md:block tracking-widest"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.12em' }}
              >
                CONSTRUCTION CAREER NAV
              </span>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* グローバルフッター */}
        <footer style={{ backgroundColor: '#1a2744' }} className="py-8 mt-16">
          <div className="max-w-5xl mx-auto px-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <p className="mb-2">
              ※ 本サイトにはアフィリエイト広告が含まれています。
            </p>
            <p className="mb-4">
              掲載情報は編集部調査時点のものです。最新情報は各社公式サイトでご確認ください。
            </p>
            <nav className="flex gap-4 mb-4 text-xs">
              <a
                href="/privacy/"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                プライバシーポリシー
              </a>
              <a
                href="/company/"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                運営者情報
              </a>
              <a
                href="/contact/"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                お問い合わせ
              </a>
            </nav>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © {new Date().getFullYear()} 施工管理転職ナビ
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
