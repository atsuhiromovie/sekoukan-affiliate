const policy = require('./lib/index-policy.json');
const HIGH_DEMAND_PREFS = new Set(policy.highDemandPrefs);
const CLICK_WHITELIST = new Set(policy.clickWhitelist);
// lib/indexability.ts と同一の判定規則（データは index-policy.json の単一ソース）
function isPrefJobIndexable(prefId, jobId) {
  if (HIGH_DEMAND_PREFS.has(prefId)) return true;
  if (CLICK_WHITELIST.has(`${prefId}/${jobId}`)) return true;
  return false;
}

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
    // opengraph-image はOG画像配信ルート（HTMLページではない）。サイトマップから除外。
    if (path.includes('/opengraph-image')) {
      return null;
    }
    // icon.png / favicon.ico などのアセットルート（HTMLページではない）。サイトマップから除外。
    if (/\.(png|jpg|jpeg|svg|ico|webp|gif)\/?$/i.test(path)) {
      return null;
    }
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
    // 都道府県×工種ページ：noindex 対象はサイトマップから除外（矛盾シグナル回避）
    const m = path.replace(/\/$/, '').match(/^\/([a-z-]+)\/([a-z-]+)$/);
    if (m && !isPrefJobIndexable(m[1], m[2])) {
      return null;
    }
    return { loc: path, changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() };
  },
};
