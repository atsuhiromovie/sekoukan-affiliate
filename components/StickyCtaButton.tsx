'use client';
import { useEffect, useState } from 'react';

interface Props {
  href: string;
  label?: string;
  agentName?: string;
}

export default function StickyCtaButton({
  href,
  label = '今すぐ無料でエージェントに登録する →',
  agentName = '',
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'sticky_cta_click', {
        agent_name: agentName,
        link_url: href,
      });
    }
  };

  // DOM に常に存在させ opacity で制御 → CLS を防ぐ
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
        backdropFilter: 'blur(2px)',
        // iPhone X 以降のホームインジケーター対応
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '8px',
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="block w-full py-4 rounded-xl font-bold text-center text-white text-base shadow-lg active:scale-95 transition-transform"
        style={{ backgroundColor: '#f59e0b' }}
      >
        {label}
      </a>
    </div>
  );
}
