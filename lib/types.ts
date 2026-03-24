// ===== マスターデータ型定義 =====

export interface PrefData {
  id: string;           // 例: "shiga"
  name: string;         // 例: "滋賀県"
  nameShort: string;    // 例: "滋賀"
  region: string;       // 例: "近畿"
  avgSalary: number;    // 年収（万円）
  demandLevel: 'high' | 'medium' | 'low';
  majorCity: string;    // 例: "大津市"
  features: string[];   // 地域特性テキスト
}

export interface JobTypeData {
  id: string;           // 例: "architecture"
  name: string;         // 例: "建築"
  fullName: string;     // 例: "建築施工管理"
  license: string;      // 例: "1級建築施工管理技士"
  avgSalary: number;    // 工種別年収調整（万円）
  description: string;  // 工種説明文
}

export interface AffiliateItem {
  id: string;
  name: string;
  tagline: string;      // キャッチコピー
  features: string[];   // 特徴（3〜5項目）
  regions: string[];    // 対応地域（"all" or 都道府県IDリスト）
  jobTypes: string[];   // 対応工種（"all" or 工種IDリスト）
  url: string;          // アフィリエイトURL
  badge?: string;       // バッジテキスト（例: "おすすめNo.1"）
  minSalaryUp?: number; // 年収アップ実績（万円）
  isRecommended?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PageData {
  pref: PrefData;
  jobType: JobTypeData;
  affiliates: AffiliateItem[];
  faqs: FAQItem[];
  avgSalary: number;    // その都道府県×工種の合算年収
  lastUpdated: string;
}
