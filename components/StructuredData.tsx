import { AffiliateItem, FAQItem } from '../lib/types';

interface Props {
  prefName: string;
  jobTypeName: string;
  avgSalary: number;
  faqs: FAQItem[];
  pageUrl: string;
  prefId: string;
  affiliates?: AffiliateItem[];
}

export default function StructuredData({
  prefName,
  jobTypeName,
  avgSalary,
  faqs,
  pageUrl,
  prefId,
  affiliates = [],
}: Props) {
  const siteUrl = process.env.SITE_URL || 'https://sekoukan-navi.com';

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

  // ===== BreadcrumbList 構造化データ（3階層） =====
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${prefName}の施工管理転職`,
        item: `${siteUrl}/${prefId}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${prefName}の${jobTypeName}転職おすすめエージェント比較`,
        item: pageUrl,
      },
    ],
  };

  // ===== ItemList 構造化データ（エージェント比較リスト） =====
  const agentAffiliates = affiliates.filter((a) => a.category !== 'study');
  const itemListSchema = agentAffiliates.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${prefName}の${jobTypeName}転職おすすめエージェント比較`,
    numberOfItems: agentAffiliates.length,
    itemListElement: agentAffiliates.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      description: item.tagline,
      url: item.url,
    })),
  } : null;

  // ===== WebPage 構造化データ =====
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${prefName}の${jobTypeName}転職おすすめエージェント比較`,
    description: `${prefName}で${jobTypeName}の転職を成功させるための転職エージェント比較。平均年収${avgSalary}万円台の求人情報も掲載。`,
    url: pageUrl,
    datePublished: '2025-01-01',
    dateModified: '2025-06-01',
    inLanguage: 'ja',
    author: {
      '@type': 'Person',
      name: 'よんさん',
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: '施工管理転職ナビ',
      url: siteUrl,
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
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
