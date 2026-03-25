'use client';

import { useState } from 'react';
import { PREFS, JOB_TYPES } from '../lib/constants';

// GA4 gtag型宣言
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, string | number>
    ) => void;
  }
}

interface Props {
  defaultPrefId?: string;
  defaultJobTypeId?: string;
  avgSalary?: number;
}

export default function SalaryCalculator({
  defaultPrefId,
  defaultJobTypeId,
  avgSalary,
}: Props) {
  const [prefId, setPrefId] = useState(defaultPrefId ?? 'tokyo');
  const [jobTypeId, setJobTypeId] = useState(defaultJobTypeId ?? 'architecture');
  const [currentSalary, setCurrentSalary] = useState('');
  const [result, setResult] = useState<{
    low: number;
    high: number;
    steps: string[];
  } | null>(null);

  function getTargetSalary(): number {
    if (avgSalary) return avgSalary;
    const pref = PREFS.find((p) => p.id === prefId);
    const jobType = JOB_TYPES.find((j) => j.id === jobTypeId);
    return (pref?.avgSalary ?? 450) + (jobType?.avgSalary ?? 0);
  }

  function handleDiagnose() {
    const current = parseInt(currentSalary, 10);
    if (isNaN(current) || current <= 0) return;

    const target = getTargetSalary();
    const baseUp = Math.max(0, target - current);
    const low = Math.round(baseUp * 0.8 / 10) * 10;
    const high = Math.round((baseUp + Math.round(target * 0.15)) / 10) * 10;

    const pref = PREFS.find((p) => p.id === prefId);
    const jobType = JOB_TYPES.find((j) => j.id === jobTypeId);

    const steps = [
      `${jobType?.license ?? '施工管理技士'}の取得・更新で資格手当を確保`,
      `${pref?.name ?? ''}の求人に強い転職エージェントへ複数登録して求人を比較`,
      '職務経歴書に現場規模・管理人数を数字で明記して書類選考を突破',
    ];

    setResult({ low, high, steps });

    // GA4イベント送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'salary_simulation', {
        pref_id: prefId,
        job_type_id: jobTypeId,
        current_salary: current,
      });
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">年収アップ診断ツール</h2>
      <p className="text-sm text-gray-500 mb-5">
        現在の年収を入力すると、転職による年収アップの目安をシミュレーションします。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* 都道府県セレクト */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            都道府県
          </label>
          <select
            value={prefId}
            onChange={(e) => {
              setPrefId(e.target.value);
              setResult(null);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PREFS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* 工種セレクト */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            工種
          </label>
          <select
            value={jobTypeId}
            onChange={(e) => {
              setJobTypeId(e.target.value);
              setResult(null);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {JOB_TYPES.map((j) => (
              <option key={j.id} value={j.id}>
                {j.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* 現在年収入力 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            現在の年収（万円）
          </label>
          <input
            type="number"
            min="100"
            max="2000"
            value={currentSalary}
            onChange={(e) => {
              setCurrentSalary(e.target.value);
              setResult(null);
            }}
            placeholder="例：380"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleDiagnose}
        disabled={!currentSalary || parseInt(currentSalary, 10) <= 0}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-colors text-sm"
      >
        年収アップを診断する
      </button>

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-blue-700 font-medium mb-1">診断結果</p>
          <p className="text-2xl font-bold text-blue-900 mb-4">
            年収アップ見込み：
            <span className="text-amber-600">
              +{result.low}〜{result.high}万円
            </span>
          </p>
          <p className="text-sm font-bold text-gray-700 mb-2">推奨ステップ</p>
          <ol className="space-y-2">
            {result.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
