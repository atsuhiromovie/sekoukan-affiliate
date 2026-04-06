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
    // 都道府県TOPは高優先度
    if (/^\/[a-z]+\/$/.test(path)) {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // 記事ページは高優先度
    if (path.startsWith('/articles/') && path !== '/articles/') {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // 記事一覧
    if (path === '/articles/') {
      return { loc: path, changefreq: 'daily', priority: 0.9, lastmod: new Date().toISOString() };
    }
    // 都道府県×工種ページ
    return { loc: path, changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() };
  },
};
