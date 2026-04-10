import type { Metadata } from 'next';
import { Noto_Sans_JP, Oswald } from 'next/font/google';
import Header from '../components/Header';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
});

const siteUrl = process.env.SITE_URL || 'https://sekoukan-navi.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: '施工管理転職ナビ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${siteUrl}/images/og-default.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${oswald.variable}`}>
      <head>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: '施工管理転職ナビ',
              url: 'https://sekoukan-navi.com',
              logo: 'https://sekoukan-navi.com/images/og-default.jpg',
            }),
          }}
        />
        {/* GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SCGYMN91JK" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SCGYMN91JK');
            `,
          }}
        />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
        <Header />

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
