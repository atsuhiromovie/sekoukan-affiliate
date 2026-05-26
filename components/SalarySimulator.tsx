'use client';

import { useState } from 'react';
import Link from 'next/link';

const JOB_TYPES = [
  { id: 'architecture', label: '建築施工管理' },
  { id: 'civil',        label: '土木施工管理' },
  { id: 'electrical',   label: '電気工事施工管理' },
  { id: 'pipe',         label: '管工事施工管理' },
  { id: 'landscaping',  label: '造園施工管理' },
];

const YEARS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function SalarySimulator() {
  const [jobType, setJobType]     = useState('architecture');
  const [salary, setSalary]       = useState('');
  const [years, setYears]         = useState('5');
  const [license, setLicense]     = useState('none');
  const [result, setResult]       = useState<{ low: number; high: number } | null>(null);
  const [error, setError]         = useState('');

  function calculate() {
    const base = parseInt(salary, 10);
    if (!base || base < 100 || base > 5000) {
      setError('現在の年収を100〜5000万円の範囲で入力してください。');
      setResult(null);
      return;
    }
    setError('');

    const licenseRate = license === '1kyu' ? 1.15 : license === '2kyu' ? 1.08 : 1.05;
    const yearsRate   = parseInt(years, 10) >= 10 ? 1.05 : 1.0;
    const low  = Math.round(base * licenseRate * yearsRate);
    const high = Math.round(low * 1.1);
    setResult({ low, high });
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* 入力フォーム */}
      <div
        className="rounded-2xl p-6 sm:p-8 space-y-5"
        style={{ backgroundColor: '#111d35', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* 工種 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#e8edf2' }}>
            現在の工種
          </label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm"
            style={{ backgroundColor: '#1a2744', color: '#e8edf2', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {JOB_TYPES.map((j) => (
              <option key={j.id} value={j.id}>{j.label}</option>
            ))}
          </select>
        </div>

        {/* 現在の年収 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#e8edf2' }}>
            現在の年収（万円）
          </label>
          <input
            type="number"
            min={100}
            max={5000}
            placeholder="例：450"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm"
            style={{ backgroundColor: '#1a2744', color: '#e8edf2', border: '1px solid rgba(255,255,255,0.15)' }}
          />
        </div>

        {/* 経験年数 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#e8edf2' }}>
            施工管理の経験年数
          </label>
          <select
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm"
            style={{ backgroundColor: '#1a2744', color: '#e8edf2', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}年{y >= 10 ? '（+5%ボーナス）' : ''}</option>
            ))}
          </select>
        </div>

        {/* 保有資格 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#e8edf2' }}>
            保有資格
          </label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm"
            style={{ backgroundColor: '#1a2744', color: '#e8edf2', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <option value="none">資格なし</option>
            <option value="2kyu">2級施工管理技士</option>
            <option value="1kyu">1級施工管理技士</option>
          </select>
        </div>

        {error && (
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        )}

        {/* 計算ボタン */}
        <button
          onClick={calculate}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#f59e0b', color: '#1a2744' }}
        >
          年収をシミュレーションする →
        </button>
      </div>

      {/* 結果 */}
      {result && (
        <div
          className="mt-6 rounded-2xl p-6 sm:p-8"
          style={{ backgroundColor: '#0f2a1a', border: '2px solid #16a34a' }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: '#86efac' }}>
            転職後の想定年収
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: '#ffffff' }}>
            {result.low}万円
            <span className="text-xl mx-2" style={{ color: '#86efac' }}>〜</span>
            {result.high}万円
          </p>
          <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
            ※ 資格・経験年数をもとにした目安です。実際の年収は企業・地域・交渉によって異なります。
          </p>

          {/* CTA */}
          <Link
            href="/articles/sekoukan-agent-osusume-2026"
            className="block mt-5 w-full py-3.5 rounded-xl font-bold text-sm text-center transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#f59e0b', color: '#1a2744', textDecoration: 'none' }}
          >
            おすすめエージェントを見る →
          </Link>
        </div>
      )}

      {/* 注釈 */}
      <p className="text-xs text-center mt-5" style={{ color: '#7a96aa' }}>
        ※ 本シミュレーターの結果は参考値です。年収保証ではありません。
      </p>
    </div>
  );
}
