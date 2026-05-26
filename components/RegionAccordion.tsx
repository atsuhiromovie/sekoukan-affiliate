'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PREFS } from '../lib/constants';

const AREA_GROUPS = [
  {
    label: '北海道・東北',
    en: 'HOKKAIDO / TOHOKU',
    prefIds: ['hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'],
  },
  {
    label: '関東',
    en: 'KANTO',
    prefIds: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'],
  },
  {
    label: '中部',
    en: 'CHUBU',
    prefIds: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'shizuoka', 'aichi', 'mie'],
  },
  {
    label: '近畿',
    en: 'KINKI',
    prefIds: ['shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'],
  },
  {
    label: '中国',
    en: 'CHUGOKU',
    prefIds: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi'],
  },
  {
    label: '四国',
    en: 'SHIKOKU',
    prefIds: ['tokushima', 'kagawa', 'ehime', 'kochi'],
  },
  {
    label: '九州・沖縄',
    en: 'KYUSHU / OKINAWA',
    prefIds: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'],
  },
];

export default function RegionAccordion() {
  const [openArea, setOpenArea] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {AREA_GROUPS.map((area) => {
        const prefs = PREFS.filter((p) => area.prefIds.includes(p.id));
        const isOpen = openArea === area.label;
        return (
          <div
            key={area.label}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#111d35' }}
          >
            <button
              onClick={() => setOpenArea(isOpen ? null : area.label)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '13px',
                    color: '#f59e0b',
                    letterSpacing: '0.1em',
                  }}
                >
                  {area.en}
                </span>
                <span className="text-sm font-semibold" style={{ color: '#e8edf2' }}>
                  {area.label}
                </span>
                <span className="text-xs hidden sm:inline" style={{ color: '#7a96aa' }}>
                  {prefs.length}都道府県
                </span>
              </div>
              <span
                className="text-lg leading-none transition-transform duration-200"
                style={{ color: '#f59e0b', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▾
              </span>
            </button>
            {isOpen && (
              <div
                className="px-5 pb-5 pt-2 border-t bg-slate-800"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="grid grid-cols-3 gap-2">
                  {prefs.map((pref) => (
                    <Link
                      key={pref.id}
                      href={`/${pref.id}/`}
                      className="rounded-lg p-3 border border-gray-200 bg-white cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {pref.name}
                      </div>
                      <div className="text-xs mt-0.5 text-gray-400">
                        約{pref.avgSalary}万円〜
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
