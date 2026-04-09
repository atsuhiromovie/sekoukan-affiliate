'use client';

interface Props {
  href: string;
  isRecommended?: boolean;
  agentName?: string;
  prefName?: string;
  jobTypeName?: string;
  className?: string;
  children: React.ReactNode;
}

export default function TrackingCtaLink({
  href,
  isRecommended = false,
  agentName = '',
  prefName = '',
  jobTypeName = '',
  className,
  children,
}: Props) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        agent_name: agentName,
        pref: prefName,
        job_type: jobTypeName,
        link_url: href,
        is_recommended: isRecommended,
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
