/**
 * 工事黒板: ABOUTセクションの運営者情報を「現場の黒板」スタイルで表示。
 * 更新日・改訂はビルド日から算出した値を props で受け取り、フッターと共有する。
 */

const ROWS: Array<[string, string]> = [
  ['サイト名', '施工管理転職ナビ'],
  ['運営者', 'よんさん（Four/Frame 代表）'],
  ['経歴', '建設業界の制作を担当／エージェント10社以上を比較'],
  ['運営目的', '失敗と成功の両方の経験から、最短ルートを示す'],
];

export default function SiteBlackboard({ updatedLabel }: { updatedLabel: string }) {
  const chalk = '#e8efe9';
  const chalkDim = 'rgba(232,239,233,0.62)';
  const gridLine = 'rgba(255,255,255,0.5)';

  return (
    <div
      style={{
        backgroundColor: '#1d4a3a',
        border: '5px solid #8a6d4a',
        borderRadius: '3px',
        padding: '22px 20px 16px',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.28)',
      }}
    >
      {/* キャッチ */}
      <p
        className="text-center font-bold leading-relaxed mb-5"
        style={{ color: chalk, fontSize: '15px', letterSpacing: '0.02em' }}
      >
        遠回りを知っているから、最短ルートが
        <span
          style={{
            color: '#f59e0b',
            borderBottom: '2px solid #f59e0b',
            paddingBottom: '1px',
          }}
        >
          描ける
        </span>
        。
      </p>

      {/* 黒板の表組 */}
      <div style={{ border: `1px solid ${gridLine}` }}>
        {ROWS.map(([k, v], i) => (
          <div
            key={k}
            className="grid"
            style={{
              gridTemplateColumns: 'auto 1fr',
              borderTop: i === 0 ? 'none' : `1px solid ${gridLine}`,
            }}
          >
            <div
              className="text-xs font-bold px-3 py-2"
              style={{
                color: chalkDim,
                borderRight: `1px solid ${gridLine}`,
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
              }}
            >
              {k}
            </div>
            <div className="text-xs px-3 py-2 leading-snug" style={{ color: chalk }}>
              {v}
            </div>
          </div>
        ))}
      </div>

      {/* 改訂 */}
      <p
        className="font-blueprint text-right mt-3"
        style={{ color: chalkDim, fontSize: '10px', letterSpacing: '0.05em' }}
      >
        更新：{updatedLabel}
      </p>
    </div>
  );
}
