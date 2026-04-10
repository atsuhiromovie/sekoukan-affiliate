'use client';

import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ backgroundColor: '#1a2744' }} className="text-white py-3 px-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* ロゴ */}
        <a href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">
            施工管理
            <span style={{ color: '#f59e0b' }}>転職</span>
            ナビ
          </span>
        </a>

        {/* デスクトップナビ */}
        <div className="hidden sm:flex items-center gap-5">
          <a
            href="/articles/"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.03em' }}
          >
            転職コラム
          </a>
          <span
            className="text-xs hidden md:block tracking-widest"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-oswald), Oswald, sans-serif', letterSpacing: '0.12em' }}
          >
            CONSTRUCTION CAREER NAV
          </span>
        </div>

        {/* モバイルハンバーガーボタン */}
        <button
          className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* モバイルメニュー */}
      <div
        className="sm:hidden overflow-hidden transition-all duration-200"
        style={{ maxHeight: menuOpen ? '200px' : '0px' }}
      >
        <nav className="pt-3 pb-2 border-t border-white border-opacity-20 mt-3 space-y-1">
          <a
            href="/articles/"
            className="block px-2 py-2.5 text-sm font-medium rounded hover:bg-white hover:bg-opacity-10 transition-colors"
            style={{ color: 'rgba(255,255,255,0.9)' }}
            onClick={() => setMenuOpen(false)}
          >
            転職コラム
          </a>
          <a
            href="/about"
            className="block px-2 py-2.5 text-sm font-medium rounded hover:bg-white hover:bg-opacity-10 transition-colors"
            style={{ color: 'rgba(255,255,255,0.9)' }}
            onClick={() => setMenuOpen(false)}
          >
            このサイトについて
          </a>
          <a
            href="/contact/"
            className="block px-2 py-2.5 text-sm font-medium rounded hover:bg-white hover:bg-opacity-10 transition-colors"
            style={{ color: 'rgba(255,255,255,0.9)' }}
            onClick={() => setMenuOpen(false)}
          >
            お問い合わせ
          </a>
        </nav>
      </div>
    </header>
  );
}
