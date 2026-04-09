'use client';

interface Props {
  href: string;
  isRecommended?: boolean;
  agentName?: string;
  source?: string; // 'top_recommended' | 'article_cta' など
  isExternal?: boolean; // false の場合は target="_blank" / rel="sponsored" を付けない
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function AffiliateCta({
  href,
  isRecommended = false,
  agentName = '',
  source = '',
  isExternal = true,
  className,
  style,
  children,
}: Props) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        agent_name: agentName,
        source,
        link_url: href,
        is_recommended: isRecommended,
      });
    }
  };

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer sponsored' : undefined}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
