export default function StampMark() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" role="img" aria-label="編集部調査済み">
      <circle cx="25" cy="25" r="22" fill="none" stroke="#f59e0b" strokeWidth="1.3" opacity="0.9" />
      <circle cx="25" cy="25" r="17.5" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
      <text x="25" y="22" textAnchor="middle" fontFamily="'Noto Sans JP'" fontWeight="700" fontSize="8" fill="#f59e0b">編集部</text>
      <text x="25" y="32" textAnchor="middle" fontFamily="'Noto Sans JP'" fontWeight="700" fontSize="8" fill="#f59e0b">調査済</text>
    </svg>
  );
}
