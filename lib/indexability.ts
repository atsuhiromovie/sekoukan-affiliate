import policy from './index-policy.json';

const HIGH_DEMAND_PREFS = new Set<string>(policy.highDemandPrefs);
const CLICK_WHITELIST = new Set<string>(policy.clickWhitelist);

/**
 * 県×工種ページを検索インデックス対象にするか判定する。
 *
 * keep（index維持）の条件:
 *   (a) 需要が旺盛な県（demandLevel='high'）… 主要市場として勝負する
 *   (b) クリック実績がある非高需要ページ … 実ユーザー信号があるため救済
 * それ以外は薄いテンプレート量産ページのため noindex,follow にして
 * サイト全体の品質シグナルを濃縮する。
 *
 * 判定データは lib/index-policy.json（単一ソース）。
 */
export function isPrefJobIndexable(prefId: string, jobId: string): boolean {
  if (HIGH_DEMAND_PREFS.has(prefId)) return true;
  if (CLICK_WHITELIST.has(`${prefId}/${jobId}`)) return true;
  return false;
}
