/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSG静的出力（Netlifyで最高パフォーマンス）
  output: 'export',

  // 末尾スラッシュ（Netlify推奨）
  trailingSlash: true,

  // 画像最適化（SSGでは無効化、手動最適化を使用）
  images: {
    unoptimized: true,
  },

  // ビルド最適化
  experimental: {
    optimizeCss: true,
  },

  // 環境変数をビルド時に注入
  env: {
    SITE_URL: process.env.SITE_URL || 'https://sekoukan-navi.com',
    BUILD_DATE: new Date().toISOString().split('T')[0],
  },
};

module.exports = nextConfig;
