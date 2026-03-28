/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sekoukan-navi.com'

  // サイトマップファイルの出力先（SSGのoutputディレクトリ）
  outDir: 'out',

  generateRobotsTxt: true,

  // 全URL自動生成（235ページ + 47都道府県TOP + トップ）
  changefreq: 'weekly',

  // 都道府県×工種ページの優先度を高く設定
  priority: 0.8,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://sekoukan-navi.com'
    ],
  },

  // 特定パスの優先度をカスタマイズ
  transform: async (config, path) => {
    // トップページは最高優先度
    if (path === '/') {
      return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() };
    }
    // 都道府県TOPは高優先度
    const prefOnly = /^\/[a-z]+\/$/.test(path);
    if (prefOnly) {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // 都道府県×工種ページ
    return { loc: path, changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() };
  },
};
