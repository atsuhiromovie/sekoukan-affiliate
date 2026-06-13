/**
 * 施工図面ヒーロー: 寸法線付きの建物立面ワイヤーフレーム。
 * - 躯体 4列×5層 + 切妻屋根
 * - 各フロアに工種ラベル（建築/土木/電気/管/造園）
 * - 寸法線3本（下辺:47都道府県 / 左辺:5工種 / 右辺:235ページ）
 * インラインSVG（画像リクエストなし・LCP保護のためデスクトップのみ表示は呼び出し側で制御）
 */

const BODY = '#8ba4bc'; // 躯体線色のベース（rgba で薄く使う）
const AMBER = '#f59e0b';
const TXT3 = '#51698a';
const TXT2 = '#8ba4bc';

// 躯体グリッド座標
const COLS = [55, 90, 125, 160, 195]; // 縦線（4スパン）
const ROWS = [70, 104, 138, 172, 206, 240]; // 横線（5層）
const FLOOR_LABELS = ['建築', '土木', '電気', '管', '造園'];

export default function BlueprintHero({ className = '' }: { className?: string }) {
  const bodyStroke = 'rgba(139,164,188,0.45)';
  return (
    <svg
      viewBox="0 0 250 290"
      className={className}
      role="img"
      aria-label="施工図面: 47都道府県・5工種・235ページの建物立面ワイヤーフレーム"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ===== 屋根（切妻）===== */}
      <polyline
        points="50,70 125,42 200,70"
        fill="none"
        stroke={bodyStroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* ===== 躯体グリッド ===== */}
      {COLS.map((x) => (
        <line key={`c${x}`} x1={x} y1={70} x2={x} y2={240} stroke={bodyStroke} strokeWidth="1" />
      ))}
      {ROWS.map((y) => (
        <line key={`r${y}`} x1={55} y1={y} x2={195} y2={y} stroke={bodyStroke} strokeWidth="1" />
      ))}

      {/* ===== 各フロアの工種ラベル ===== */}
      {FLOOR_LABELS.map((label, i) => (
        <text
          key={label}
          x={125}
          y={ROWS[i] + 21}
          textAnchor="middle"
          fontFamily="'Noto Sans JP', sans-serif"
          fontSize="8"
          fill={TXT3}
          letterSpacing="0.04em"
        >
          {label}
        </text>
      ))}

      {/* ===== 寸法線: 下辺「47 都道府県」===== */}
      <g>
        <line x1={55} y1={250} x2={55} y2={256} stroke={AMBER} strokeWidth="1" />
        <line x1={195} y1={250} x2={195} y2={256} stroke={AMBER} strokeWidth="1" />
        <line
          className="dim-line"
          style={{ ['--dim-len' as string]: '140' }}
          x1={55}
          y1={253}
          x2={195}
          y2={253}
          stroke={AMBER}
          strokeWidth="1"
        />
        <text
          x={125}
          y={269}
          textAnchor="middle"
          className="font-bebas"
          fontSize="14"
          fill={AMBER}
          letterSpacing="0.06em"
        >
          47 都道府県
        </text>
      </g>

      {/* ===== 寸法線: 左辺「5 工種」===== */}
      <g>
        <line x1={36} y1={70} x2={42} y2={70} stroke={AMBER} strokeWidth="1" />
        <line x1={36} y1={240} x2={42} y2={240} stroke={AMBER} strokeWidth="1" />
        <line
          className="dim-line"
          style={{ ['--dim-len' as string]: '170' }}
          x1={39}
          y1={70}
          x2={39}
          y2={240}
          stroke={AMBER}
          strokeWidth="1"
        />
        <text
          transform="rotate(-90 24 155)"
          x={24}
          y={155}
          textAnchor="middle"
          className="font-bebas"
          fontSize="14"
          fill={AMBER}
          letterSpacing="0.06em"
        >
          5 工種
        </text>
      </g>

      {/* ===== 寸法線: 右辺「235 ページ」===== */}
      <g>
        <line x1={208} y1={70} x2={214} y2={70} stroke={TXT2} strokeWidth="1" opacity="0.7" />
        <line x1={208} y1={240} x2={214} y2={240} stroke={TXT2} strokeWidth="1" opacity="0.7" />
        <line
          className="dim-line"
          style={{ ['--dim-len' as string]: '170' }}
          x1={211}
          y1={70}
          x2={211}
          y2={240}
          stroke={TXT2}
          strokeWidth="1"
          opacity="0.7"
        />
        <text
          transform="rotate(90 226 155)"
          x={226}
          y={155}
          textAnchor="middle"
          className="font-bebas"
          fontSize="14"
          fill={TXT2}
          letterSpacing="0.06em"
        >
          235 ページ
        </text>
      </g>
    </svg>
  );
}
