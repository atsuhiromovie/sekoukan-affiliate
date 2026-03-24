import { FAQItem } from '../lib/types';

interface Props {
  prefName: string;
  jobTypeName: string;
  avgSalary: number;
  faqs: FAQItem[];
  pageUrl: string;
}

/**
 * 構造化データ（JSON-LD）コンポーネント
 * 確信度 78% — schema.org の FAQPage・JobPosting スキーマは仕様変更の可能性あり
 * Google Search Console での定期確認を推奨
 */
export default function StructuredData({
  prefName,
  jobTypeName,
  avgSalary,
  faqs,
  pageUrl,
}: Props) {
  // ===== FAQPage 構造化データ =====
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // ===== BreadcrumbList 構造化データ =====
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: process.env.SITE_URL || 'https://sekoukan-agent.netlify.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${prefName}の施工管理転職`,
        item: pageUrl,
      },
    ],
  };

  // ===== WebPage 構造化データ =====
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${prefName}の${jobTypeName}転職おすすめエージェント比較`,
    description: `${prefName}で${jobTypeName}の転職を成功させるための転職エージェント比較。平均年収${avgSalary}万円台の求人情報も掲載。`,
    url: pageUrl,
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'ja',
    publisher: {
      '@type': 'Organization',
      name: '施工管理転職ナビ',
      url: process.env.SITE_URL || 'https://sekoukan-agent.netlify.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
