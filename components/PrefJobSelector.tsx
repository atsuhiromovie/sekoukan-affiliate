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
    <div className="bg-gray-100 rounded-2xl p-6 mb-10">
      <p className="text-sm font-semibold text-gray-700 mb-4">都道府県と工種を選んで求人を探す</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={prefId}
          onChange={(e) => setPrefId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">都道府県を選択</option>
          {PREFS.map((pref) => (
            <option key={pref.id} value={pref.id}>
              {pref.name}
            </option>
          ))}
        </select>

        <select
          value={jobTypeId}
          onChange={(e) => setJobTypeId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">工種を選択</option>
          {JOB_TYPES.map((job) => (
            <option key={job.id} value={job.id}>
              {job.fullName}
            </option>
          ))}
        </select>

        <button
          onClick={handleClick}
          disabled={!canSubmit}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          求人・エージェントを見る →
        </button>
      </div>
    </div>
  );
}
