'use client';

import { useState } from 'react';
import Link from 'next/link';

const TARGETS = [
  '大手・準大手ゼネコン',
  '地方工務店・中小ゼネコン',
  '異業種への転職',
  '発注者側・コンサル系',
];

const QUALS = [
  '1級施工管理技士',
  '2級施工管理技士',
  '無資格（取得予定含む）',
];

type Pattern = {
  title: string;
  tag?: string;
  impression?: string;
  why?: string;
  example?: string;
};

type Usage = {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
};

// ===== スタイル定数 =====
const NAVY = '#1c2b3a';
const ACCENT = '#c0492f';
const PAPER = '#f6f4ef';
const MUTED = '#6d7682';
const LINE = '#dcd6cb';

export default function TitleTranslator() {
  const [target, setTarget] = useState<string | null>(null);
  const [qual, setQual] = useState<string | null>(null);
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[] | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState('');

  const isReady = target && qual && experience.trim().length >= 10;

  async function handleSubmit() {
    if (!isReady || loading) return;
    setLoading(true);
    setError('');
    setPatterns(null);
    setUsage(null);

    try {
      const res = await fetch('/.netlify/functions/translate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, qual, experience: experience.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました。');
        return;
      }

      if (!data.patterns?.length) {
        setError('うまく生成できませんでした。経験の入力をもう少し具体的にしてみてください。');
        return;
      }

      setPatterns(data.patterns);
      if (data._usage) setUsage(data._usage);
    } catch {
      setError('うまく生成できませんでした。少し時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: '"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif' }}>

      {/* 入力フォーム */}
      <div
        className="rounded-sm border"
        style={{ backgroundColor: '#fff', borderColor: LINE, boxShadow: '0 10px 30px rgba(28,43,58,.10)', padding: '26px 24px' }}
      >
        {/* ① 応募先タイプ */}
        <div className="mb-7">
          <label className="block font-bold text-sm mb-1" style={{ color: NAVY }}>
            ① どこに応募しますか
          </label>
          <p className="text-xs mb-3" style={{ color: MUTED }}>
            応募先のタイプによって、避けるべき書き方が変わります。
          </p>
          <div className="flex flex-wrap gap-2.5">
            {TARGETS.map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className="text-sm px-4 py-2.5 border rounded-sm transition-all"
                style={{
                  borderColor: target === t ? NAVY : LINE,
                  backgroundColor: target === t ? NAVY : '#fbfaf7',
                  color: target === t ? '#fff' : NAVY,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ② 保有資格 */}
        <div className="mb-7">
          <label className="block font-bold text-sm mb-3" style={{ color: NAVY }}>
            ② 保有資格
          </label>
          <div className="flex flex-wrap gap-2.5">
            {QUALS.map((q) => (
              <button
                key={q}
                onClick={() => setQual(q)}
                className="text-sm px-4 py-2.5 border rounded-sm transition-all"
                style={{
                  borderColor: qual === q ? NAVY : LINE,
                  backgroundColor: qual === q ? NAVY : '#fbfaf7',
                  color: qual === q ? '#fff' : NAVY,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* ③ 経験 */}
        <div className="mb-6">
          <label className="block font-bold text-sm mb-1" style={{ color: NAVY }}>
            ③ あなたの経験
          </label>
          <p className="text-xs mb-3" style={{ color: MUTED }}>
            担当した工種・現場の規模・工事金額・職人の人数・経験年数など、数字があるほど良い翻訳ができます。
          </p>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            maxLength={1000}
            placeholder={`例：\n・建築（RCマンション）の現場を担当して8年\n・最大で工事金額12億円の現場\n・職人を20名ほどまとめる\n・施工体制台帳、工程管理の経験あり`}
            className="w-full rounded-sm text-sm leading-relaxed border resize-y"
            style={{
              minHeight: '120px',
              padding: '13px 14px',
              borderColor: LINE,
              backgroundColor: '#fbfaf7',
              color: NAVY,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div className="text-right text-xs mt-1" style={{ color: MUTED }}>
            {experience.length} / 1000
          </div>
          <div
            className="text-xs mt-2 rounded-sm"
            style={{ color: MUTED, backgroundColor: '#f7ece8', padding: '8px 12px' }}
          >
            ※ 会社名・案件名・個人名など特定につながる情報は入力しないでください。入力内容は肩書き表現の提案にのみ使用されます。
          </div>
        </div>

        {error && (
          <div className="text-sm mb-4 rounded-sm border px-3.5 py-3" style={{ color: ACCENT, backgroundColor: '#fbf3f0', borderColor: '#e8d9d3' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isReady || loading}
          className="w-full font-bold text-sm rounded-sm transition-opacity"
          style={{
            backgroundColor: ACCENT,
            color: '#fff',
            padding: '15px',
            opacity: (!isReady || loading) ? 0.45 : 1,
            cursor: (!isReady || loading) ? 'not-allowed' : 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="inline-block border-2 rounded-full animate-spin"
                style={{
                  width: '15px',
                  height: '15px',
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                }}
              />
              あなたの経験を翻訳しています…
            </span>
          ) : (
            '翻訳する'
          )}
        </button>
      </div>

      {/* 結果 */}
      {patterns && patterns.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-bold mb-4" style={{ color: ACCENT, letterSpacing: '0.18em' }}>
            翻訳結果 ｜ 職務経歴書の肩書き案
          </p>

          <div className="space-y-4">
            {patterns.map((p, i) => (
              <div
                key={i}
                className="rounded-sm border-l-4 border"
                style={{
                  backgroundColor: '#fff',
                  borderColor: LINE,
                  borderLeftColor: NAVY,
                  padding: '20px 22px',
                  animation: `fadeUp 0.45s ${i * 0.1}s ease both`,
                }}
              >
                <p className="font-semibold text-lg mb-1" style={{ color: NAVY }}>
                  {p.title}
                </p>
                {p.tag && (
                  <span
                    className="inline-block text-xs border rounded-sm mb-3"
                    style={{ color: ACCENT, borderColor: '#e8d9d3', backgroundColor: '#fbf3f0', padding: '2px 9px' }}
                  >
                    {p.tag}
                  </span>
                )}
                {p.impression && (
                  <div className="mb-3">
                    <span className="block text-xs font-bold mb-1" style={{ color: MUTED, letterSpacing: '0.06em' }}>
                      連想される人物像
                    </span>
                    <p className="text-sm" style={{ color: NAVY }}>{p.impression}</p>
                  </div>
                )}
                {p.why && (
                  <div className="mb-3">
                    <span className="block text-xs font-bold mb-1" style={{ color: MUTED, letterSpacing: '0.06em' }}>
                      なぜ刺さるか
                    </span>
                    <p className="text-sm" style={{ color: NAVY }}>{p.why}</p>
                  </div>
                )}
                {p.example && (
                  <div>
                    <span className="block text-xs font-bold mb-1" style={{ color: MUTED, letterSpacing: '0.06em' }}>
                      職務経歴書での一文（例）
                    </span>
                    <p
                      className="text-sm rounded-sm"
                      style={{
                        color: NAVY,
                        backgroundColor: PAPER,
                        padding: '12px 15px',
                        fontFamily: '"Hiragino Mincho ProN","Yu Mincho",serif',
                        lineHeight: '1.8',
                      }}
                    >
                      {p.example}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 rounded-sm" style={{ backgroundColor: NAVY, padding: '22px 24px' }}>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#eef1f4' }}>
              この書き方で実際に書類選考を通過できるか、添削してもらいたい方は施工管理に強い転職エージェントの主要なサービスで確認できます。
            </p>
            <Link
              href="/"
              className="inline-block font-bold text-sm rounded-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT, color: '#fff', padding: '11px 22px', textDecoration: 'none' }}
            >
              施工管理に強いエージェントを比較する →
            </Link>
          </div>

          {/* デバッグ用 usage 表示（開発確認用、本番では非表示） */}
          {usage && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs p-3 rounded" style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
              <strong>usage:</strong> {JSON.stringify(usage)}
            </div>
          )}
        </div>
      )}

      {/* 免責文 */}
      <p
        className="text-xs mt-8 pt-4 leading-relaxed border-t"
        style={{ color: MUTED, borderColor: LINE }}
      >
        本ツールが提示する表現は、入力内容に基づくAIによる提案であり、採用・選考の結果を保証するものではありません。記載する内容は必ずご自身の事実に基づいてください。提案はあくまで「同じ事実をどう表現するか」の案であり、経歴の誇張・虚偽記載を推奨するものではありません。
      </p>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
