/**
 * 図面タイトルブロック用の「更新日・改訂番号」をビルド日から動的算出する。
 * 工事黒板（SiteBlackboard）とフッタータイトルブロックで同じ値を共有するため一元化。
 * 手動更新を発生させない（CLAUDE.md 注意事項7）: ビルド時の日付から自動計算する。
 */

// 改訂番号の起点（2026年1月 = Rev.1）。月が変わるごとに +1 される。
const REV_BASE_YEAR = 2026;
const REV_BASE_MONTH = 1;

export interface RevisionInfo {
  /** 更新表示: "2026.06" */
  updated: string;
  /** 改訂番号: 6 */
  rev: number;
  /** "2026.06　Rev.6" の結合表記 */
  label: string;
}

export function getRevision(now: Date = new Date()): RevisionInfo {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const mm = String(month).padStart(2, '0');
  const updated = `${year}.${mm}`;
  const rev = (year - REV_BASE_YEAR) * 12 + (month - REV_BASE_MONTH) + 1;
  return { updated, rev, label: `${updated}　Rev.${rev}` };
}
