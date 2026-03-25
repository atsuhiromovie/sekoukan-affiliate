'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PREFS, JOB_TYPES } from '../lib/constants';

export default function PrefJobSelector() {
  const [prefId, setPrefId] = useState('');
  const [jobTypeId, setJobTypeId] = useState('');
  const router = useRouter();

  const canSubmit = prefId !== '' && jobTypeId !== '';

  const handleClick = () => {
    if (!canSubmit) return;
    router.push(`/${prefId}/${jobTypeId}/`);
  };

  return (
    <div
      className="rounded-xl p-6 mb-10 border"
      style={{ backgroundColor: '#f8f9fb', borderColor: '#e2e6ef' }}
    >
      {/* ラベル */}
      <p
        className="text-xs font-semibold tracking-widest mb-4 uppercase"
        style={{
          fontFamily: 'Oswald, sans-serif',
          color: '#1a2744',
          letterSpacing: '0.15em',
        }}
      >
        STEP 1 ― 地域と工種を選ぶ
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* 都道府県セレクト */}
        <select
          value={prefId}
          onChange={(e) => setPrefId(e.target.value)}
          className="flex-1 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 transition-all"
          style={{
            border: '2px solid #1a2744',
          }}
        >
          <option value="">都道府県を選択</option>
          {PREFS.map((pref) => (
            <option key={pref.id} value={pref.id}>
              {pref.name}
            </option>
          ))}
        </select>

        {/* 工種セレクト */}
        <select
          value={jobTypeId}
          onChange={(e) => setJobTypeId(e.target.value)}
          className="flex-1 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 transition-all"
          style={{
            border: '2px solid #1a2744',
          }}
        >
          <option value="">工種を選択</option>
          {JOB_TYPES.map((job) => (
            <option key={job.id} value={job.id}>
              {job.fullName}
            </option>
          ))}
        </select>

        {/* 送信ボタン */}
        <button
          onClick={handleClick}
          disabled={!canSubmit}
          className="rounded-lg text-sm font-semibold px-6 py-2.5 transition-all whitespace-nowrap"
          style={
            canSubmit
              ? {
                  backgroundColor: '#1a2744',
                  color: '#ffffff',
                  cursor: 'pointer',
                }
              : {
                  backgroundColor: '#d1d5db',
                  color: '#9ca3af',
                  cursor: 'not-allowed',
                }
          }
        >
          求人・エージェントを見る{' '}
          <span style={canSubmit ? { color: '#f59e0b' } : {}}>→</span>
        </button>
      </div>
    </div>
  );
}
