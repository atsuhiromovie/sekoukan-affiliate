/**
 * Google Sheets API v4 連携モジュール
 * ビルド時（SSG）にスプレッドシートからデータを取得する
 *
 * 確信度: 85% — googleapis v140の型定義は安定しているが、
 * シート構造の変更時はカラムマッピングの更新が必要
 */

import { AffiliateItem, Article, FAQItem, PrefData } from './types';
import { PREFS, JOB_TYPES, getPrefById, getJobTypeById } from './constants';

// ===== 環境変数チェック =====
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Fallback: Google Sheets が使えない場合はローカルJSONを使用
const USE_LOCAL_FALLBACK = !SPREADSHEET_ID || !API_KEY;

// ===== デフォルトアフィリエイトデータ（スプレッドシート未設定時のフォールバック） =====
// 本番運用では全てスプレッドシートから読み込む
export const DEFAULT_AFFILIATES: AffiliateItem[] = [
  {
    id: 'genkyi',
    name: '現キャリ',
    tagline: '建設・施工管理に特化した転職エージェント',
    features: [
      '建設業界専門のキャリアアドバイザーが担当',
      '年収100万円UPの実績多数',
      'Web面談可・全国対応',
      '非公開求人が全体の80%以上',
    ],
    regions: ['all'],
    jobTypes: ['all'],
    url: 'https://px.a8.net/svt/ejp?a8mat=XXXXX', // ← ASPから取得したURLに差し替え
    badge: 'おすすめNo.1',
    minSalaryUp: 100,
    isRecommended: true,
    targetTags: ['年収アップ重視', '初めての転職', '施工管理特化'],
    reason: '施工管理専門のアドバイザーが対応。非公開求人が80%以上と求人の質が高く、年収100万円UP実績も豊富なため総合的に最もおすすめ。',
  },
  {
    id: 'rsg',
    name: 'RSG Construction',
    tagline: '施工管理技士の転職に強い専門エージェント',
    features: [
      '40代・50代の転職実績が豊富',
      '1級施工管理技士の求人多数',
      '大手ゼネコン・サブコンへの転職実績あり',
      '平均年収アップ率68%',
    ],
    regions: ['all'],
    jobTypes: ['architecture', 'civil', 'electrical', 'pipe'],
    url: 'https://px.a8.net/svt/ejp?a8mat=YYYYY',
    badge: '40代歓迎',
    minSalaryUp: 80,
    isRecommended: false,
    targetTags: ['40代・50代歓迎', '1級資格保有者', 'ゼネコン志望'],
    reason: '40〜50代のミドル層に強く、大手ゼネコン・サブコンへの転職実績が豊富。資格保有者が高年収案件を狙うならここ。',
  },
  {
    id: 'sekoukan-navi',
    name: '施工管理求人ナビ',
    tagline: '地域密着型の施工管理転職サポート',
    features: [
      '地域別の求人に強い',
      '未経験・第二新卒の転職サポート充実',
      '転職後のアフターフォローあり',
      '求人数10,000件以上',
    ],
    regions: ['all'],
    jobTypes: ['all'],
    url: 'https://px.a8.net/svt/ejp?a8mat=ZZZZZ',
    isRecommended: false,
    targetTags: ['未経験・第二新卒', '地方勤務希望', '求人数重視'],
    reason: '求人数10,000件以上で選択肢が多く、未経験歓迎求人も充実。地方の求人を幅広く探したい方や、まず求人量を確認したい方に向いている。',
  },
];

// ===== Google Sheets からデータ取得 =====

/**
 * アフィリエイト案件をスプレッドシートから取得
 * シート名: "affiliate_items"
 * カラム順: id | name | tagline | features(|区切り) | regions(|区切り) | jobTypes(|区切り) | url | badge | minSalaryUp | isRecommended | targetTags(|区切り) | reason
 */
export async function fetchAffiliatesFromSheets(): Promise<AffiliateItem[]> {
  if (USE_LOCAL_FALLBACK) {
    console.log('[Sheets] 環境変数未設定 → フォールバックデータを使用');
    return DEFAULT_AFFILIATES;
  }

  try {
    const range = encodeURIComponent('affiliate_items!A2:L100');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: false } }); // SSGなのでrevalidate不要
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

    const json = await res.json();
    const rows: string[][] = json.values || [];

    return rows
      .filter((row) => row[0] && row[6]) // id と url が必須
      .map((row) => ({
        id: row[0],
        name: row[1] || '',
        tagline: row[2] || '',
        features: (row[3] || '').split('|').filter(Boolean),
        regions: (row[4] || 'all').split('|').filter(Boolean),
        jobTypes: (row[5] || 'all').split('|').filter(Boolean),
        url: row[6],
        badge: row[7] || undefined,
        minSalaryUp: row[8] ? Number(row[8]) : undefined,
        isRecommended: row[9] === 'TRUE' || row[9] === '1',
        targetTags: row[10] ? row[10].split('|').filter(Boolean) : undefined,
        reason: row[11] || undefined,
      }));
  } catch (err) {
    console.error('[Sheets] 取得エラー → フォールバックを使用:', err);
    return DEFAULT_AFFILIATES;
  }
}

/**
 * 都道府県別の年収データをスプレッドシートから取得
 * シート名: "pref_salary"
 * カラム順: pref_id | job_type_id | avg_salary
 */
export async function fetchSalaryOverrides(): Promise<Map<string, number>> {
  const map = new Map<string, number>();

  if (USE_LOCAL_FALLBACK) return map;

  try {
    const range = encodeURIComponent('pref_salary!A2:C500');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: false } });
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

    const json = await res.json();
    const rows: string[][] = json.values || [];

    rows.forEach((row) => {
      if (row[0] && row[1] && row[2]) {
        map.set(`${row[0]}_${row[1]}`, Number(row[2]));
      }
    });
  } catch (err) {
    console.error('[Sheets] 年収データ取得エラー:', err);
  }

  return map;
}

/**
 * FAQ データをスプレッドシートから取得
 * シート名: "faqs"
 * カラム順: pref_id | job_type_id | question | answer
 */
export async function fetchFAQs(): Promise<Map<string, FAQItem[]>> {
  const map = new Map<string, FAQItem[]>();

  if (USE_LOCAL_FALLBACK) return map;

  try {
    const range = encodeURIComponent('faqs!A2:D500');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: false } });
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

    const json = await res.json();
    const rows: string[][] = json.values || [];

    rows.forEach((row) => {
      if (row[0] && row[1] && row[2] && row[3]) {
        const key = `${row[0]}_${row[1]}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ question: row[2], answer: row[3] });
      }
    });
  } catch (err) {
    console.error('[Sheets] FAQ取得エラー:', err);
  }

  return map;
}

// ===== デフォルトFAQ生成（スプレッドシートデータがない場合） =====
export function generateDefaultFAQs(
  prefName: string,
  jobTypeName: string,
  avgSalary: number
): FAQItem[] {
  return [
    {
      question: `${prefName}で${jobTypeName}の転職を成功させるには？`,
      answer: `${prefName}の${jobTypeName}転職を成功させるには、まず施工管理特化型の転職エージェントを活用することが重要です。地域の求人事情に詳しいエージェントを選ぶことで、公開されていない好条件の求人にアクセスできます。また、1級施工管理技士の資格取得も年収アップに直結します。`,
    },
    {
      question: `${prefName}の${jobTypeName}の平均年収はいくらですか？`,
      answer: `${prefName}の${jobTypeName}の平均年収は約${avgSalary}万円です（経験・資格・会社規模により変動）。1級施工管理技士の資格を持つ方や、10年以上の経験がある方は${avgSalary + 80}万円〜${avgSalary + 150}万円の求人も多数あります。転職エージェントを通じた年収交渉で大幅アップが期待できます。`,
    },
    {
      question: `${prefName}で${jobTypeName}の求人が多いエリアはどこですか？`,
      answer: `${prefName}では主要都市周辺に求人が集中しています。大手ゼネコンから地場の優良企業まで、幅広い選択肢があります。転職エージェントを活用すると、希望エリア・通勤条件を考慮した求人を紹介してもらえます。`,
    },
    {
      question: `40代・50代でも${prefName}で${jobTypeName}に転職できますか？`,
      answer: `はい、${prefName}の${jobTypeName}は40代・50代の転職実績が豊富です。施工管理は経験が直接評価されるため、年齢よりも「現場経験年数」「保有資格」「マネジメント経験」が重視されます。特に1級施工管理技士の資格保有者は、40代・50代でも好条件での転職が可能です。`,
    },
    {
      question: `${prefName}で${jobTypeName}の転職エージェントを選ぶポイントは？`,
      answer: `${prefName}での${jobTypeName}転職エージェント選びのポイントは①建設・施工管理に特化していること②${prefName}の地域求人に強いこと③非公開求人の保有数が多いこと④転職後の年収アップ実績があること、の4点です。複数のエージェントに登録して比較することをおすすめします。`,
    },
  ];
}

/**
 * 記事一覧をスプレッドシートから取得
 * シート名: "articles"
 * カラム順: id | slug | title | description | category | jobType | pref | body | heroImage | publishedAt | status
 */
export async function fetchArticles(): Promise<Article[]> {
  if (USE_LOCAL_FALLBACK) {
    return [];
  }

  try {
    const range = encodeURIComponent('articles!A2:K500');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: false } });
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

    const json = await res.json();
    const rows: string[][] = json.values || [];

    return rows
      .filter((row) => row[0] && row[1] && row[2]) // id, slug, title が必須
      .map((row) => ({
        id: row[0] || '',
        slug: row[1] || '',
        title: row[2] || '',
        description: row[3] || '',
        category: row[4] || '',
        jobType: row[5] || '',
        pref: row[6] || '',
        body: row[7] || '',
        heroImage: row[8] || '',
        publishedAt: row[9] || '',
        status: row[10] || '',
      }))
      .filter((article) => article.status === 'published');
  } catch (err) {
    console.error('[Sheets] articles取得エラー:', err);
    return [];
  }
}
