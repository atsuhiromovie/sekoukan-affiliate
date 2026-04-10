'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PREFS, JOB_TYPES } from '../lib/constants';

const selectStyle = {
  border: '2px solid #1a2744',
  WebkitAppearance: 'none' as const,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231a2744' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 12px center' as const,
  paddingRight: '36px',
};

export default function PrefJobSelector() {
  const [prefId, setPrefId] = useState('');
  const [jobTypeId, setJobTypeId] = useState('');
  const router = useRouter();

  const canSubmit = prefId !== '' && jobTypeId !== '';

  const handleClick = useCallback(() => {
    if (!canSubmit) return;
    router.push(`/${prefId}/${jobTypeId}/`);
  }, [canSubmit, prefId, jobTypeId, router]);

  return (
    <div
      className="rounded-xl p-6 mb-10 border"
      style={{ backgroundColor: '#f8f9fb', borderColor: '#e2e6ef' }}
      role="search"
      aria-label="都道府県と工種から求人を検索"
    >
      {/* ラベル */}
      <p
        className="text-xs font-semibold tracking-widest mb-4 uppercase"
        style={{
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          color: '#1a2744',
          letterSpacing: '0.15em',
        }}
      >
        STEP 1 ― 地域と工種を選ぶ
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* 都道府県セレクト */}
        <div className="flex-1">
          <label htmlFor="pref-select" className="sr-only">都道府県を選択</label>
          <select
            id="pref-select"
            value={prefId}
            onChange={(e) => setPrefId(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            style={selectStyle}
          >
            <option value="">都道府県を選択</option>
            {PREFS.map((pref) => (
              <option key={pref.id} value={pref.id}>
                {pref.name}
              </option>
            ))}
          </select>
        </div>

        {/* 工種セレクト */}
        <div className="flex-1">
          <label htmlFor="job-select" className="sr-only">工種を選択</label>
          <select
            id="job-select"
            value={jobTypeId}
            onChange={(e) => setJobTypeId(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            style={selectStyle}
          >
            <option value="">工種を選択</option>
            {JOB_TYPES.map((job) => (
              <option key={job.id} value={job.id}>
                {job.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleClick}
          disabled={!canSubmit}
          aria-label={canSubmit ? `${prefId}の求人とエージェントを見る` : '都道府県と工種を選択してください'}
          className="rounded-lg text-sm font-semibold px-6 py-2.5 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          style={
            canSubmit
              ? { backgroundColor: '#1a2744', color: '#ffffff', cursor: 'pointer' }
              : { backgroundColor: '#d1d5db', color: '#9ca3af', cursor: 'not-allowed' }
          }
        >
          求人・エージェントを見る{' '}
          <span aria-hidden="true" style={canSubmit ? { color: '#f59e0b' } : {}}>→</span>
        </button>
      </div>
    </div>
  );
}
