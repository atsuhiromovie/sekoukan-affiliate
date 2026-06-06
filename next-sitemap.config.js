/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sekoukan-navi.com',
  outDir: 'out',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    if (path === '/') {
      return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() };
    }
    // 都道府県TOP（next-sitemapは末尾スラッシュなしでpathを渡すため両対応）
    if (/^\/[a-z-]+\/?$/.test(path) && !path.startsWith('/articles')) {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // 記事一覧
    if (path === '/articles' || path === '/articles/') {
      return { loc: path, changefreq: 'daily', priority: 0.9, lastmod: new Date().toISOString() };
    }
    // 記事ページ
    if (path.startsWith('/articles/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // 都道府県×工種ページ
    return { loc: path, changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() };
  },
};
