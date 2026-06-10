/**
 * Google Sheets API v4 連携モジュール
 * ビルド時（SSG）にスプレッドシートからデータを取得する
 *
 * 確信度: 85% — googleapis v140の型定義は安定しているが、
 * シート構造の変更時はカラムマッピングの更新が必要
 */

import { AffiliateItem, Article, FAQItem } from './types';

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
 * カラム順: id | name | tagline | features(|区切り) | regions(|区切り) | jobTypes(|区切り) | url | badge | minSalaryUp | isRecommended | targetTags(|区切り) | reason | rank | category
 */
export async function fetchAffiliatesFromSheets(): Promise<AffiliateItem[]> {
  if (USE_LOCAL_FALLBACK) {
    console.log('[Sheets] 環境変数未設定 → フォールバックデータを使用');
    return DEFAULT_AFFILIATES;
  }

  try {
    const range = encodeURIComponent('affiliate_items!A2:N100');
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
        rank: row[12] ? Number(row[12]) : undefined,
        category: (row[13] === 'study' ? 'study' : 'agent') as 'agent' | 'study',
      }));
  } catch (err) {
    console.error('[Sheets] 取得エラー → フォールバックを使用:', err);
    return DEFAULT_AFFILIATES;
  }
}

/**
 * 都道府県×工種ごとのランキング上書きデータを取得
 * シート名: "affiliate_ranking_override"
 * カラム順: pref_id | job_type_id | affiliate_id | rank
 * 戻り値: Map<"pref_job_type", Map<affiliateId, rank>>
 */
export async function fetchRankingOverrides(): Promise<Map<string, Map<string, number>>> {
  const map = new Map<string, Map<string, number>>();

  if (USE_LOCAL_FALLBACK) return map;

  try {
    const range = encodeURIComponent('affiliate_ranking_override!A2:D500');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: false } });
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

    const json = await res.json();
    const rows: string[][] = json.values || [];

    rows.forEach((row) => {
      if (row[0] && row[1] && row[2] && row[3]) {
        const key = `${row[0]}_${row[1]}`;
        if (!map.has(key)) map.set(key, new Map());
        map.get(key)!.set(row[2], Number(row[3]));
      }
    });
  } catch (err) {
    console.error('[Sheets] ランキング上書きデータ取得エラー:', err);
  }

  return map;
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
 * 編集部メモをスプレッドシートから取得
 * シート名: "pref_salary"
 * カラム順: pref_id | job_type_id | avg_salary | editor_note
 */
export async function fetchEditorNotes(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  if (USE_LOCAL_FALLBACK) return map;

  try {
    const range = encodeURIComponent('pref_salary!A2:D500');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: false } });
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

    const json = await res.json();
    const rows: string[][] = json.values || [];

    rows.forEach((row) => {
      if (row[0] && row[1] && row[3]) {
        map.set(`${row[0]}_${row[1]}`, row[3]);
      }
    });
  } catch (err) {
    console.error('[Sheets] editor_note取得エラー:', err);
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
  avgSalary: number,
  prefId?: string,
  jobTypeId?: string
): FAQItem[] {
  if (prefId === 'tokyo') {
    return generateTokyoFAQs(jobTypeName, avgSalary, jobTypeId ?? '');
  }
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

function generateTokyoFAQs(jobTypeName: string, avgSalary: number, jobTypeId: string): FAQItem[] {
  const jobSpecific: Record<string, FAQItem[]> = {
    architecture: [
      { question: '東京の大手ゼネコンに転職するにはどうすればよいですか？', answer: '鹿島・清水・大成・大林・竹中など五大ゼネコンへの転職は、施工管理特化型エージェント経由の非公開求人が主な入口です。1級建築施工管理技士の資格と、工事費100億円以上・延床3万㎡以上の大型現場の管理実績があると書類選考を有利に進められます。まず複数のエージェントに同時登録して非公開求人を比較しましょう。' },
      { question: '東京の建築施工管理で年収700万円以上を狙えますか？', answer: '可能です。東京では1級建築施工管理技士を持ち、大規模現場の管理経験が10年以上あれば年収700万円以上の求人は珍しくありません。特に超高層・大型複合施設の元請け企業では700〜800万円台のポジションが複数あります。エージェントを通じた年収交渉では現職比100〜150万円アップの実績も多くあります。' },
    ],
    civil: [
      { question: '東京で土木施工管理の需要が高い工事はどれですか？', answer: '首都高速道路の大規模リニューアル工事（C1都心環状線・3号線・湾岸線など）、東京外環道の関連工事、東京メトロ有楽町線豊洲〜住吉延伸工事、東京都水道局・下水道局発注の老朽化更新工事が特に需要が高い案件です。地下工事・シールド工法の施工経験者はどの案件でも引く手あまたです。' },
      { question: '東京の土木施工管理で年収600万円以上を目指せますか？', answer: 'はい、可能です。東京では1級土木施工管理技士を保有し、地下工事・シールド工法・大規模公共工事の管理経験があれば年収600〜700万円台の求人を十分狙えます。国土交通省・東京都発注の大型案件を扱う企業では、資格・経験次第で700万円台も視野に入ります。' },
    ],
    electrical: [
      { question: '東京で電気工事施工管理の求人が増えているエリアはどこですか？', answer: 'データセンター建設が急増している江東区（東雲・有明）・品川区・多摩エリアが特に需要が高いエリアです。また、港区・新宿区・渋谷区の超高層ビルでは既存電気設備の大規模改修工事が活発で、BAS統合・省エネ改修の施工管理経験者の需要が高まっています。' },
      { question: 'データセンター建設の施工管理経験は転職に有利ですか？', answer: '非常に有利です。東京ではAI需要の急拡大でデータセンターの建設が急増しており、高圧受変電設備・非常用発電設備・UPS設備の施工管理経験者は深刻に不足しています。この経験があると複数社から同時にアプローチを受けるケースが多く、1級電気工事施工管理技士と組み合わせれば年収700万円超えの交渉が現実的です。' },
    ],
    pipe: [
      { question: '東京でZEB対応工事の施工管理経験はどのくらい評価されますか？', answer: 'ZEB（ネット・ゼロ・エネルギー・ビル）対応の空調・熱源工事の施工経験は東京の案件で特に高く評価されます。麻布台ヒルズ・東京ミッドタウンなど大型複合施設でのZEB改修施工実績があれば、書類選考の段階で大手設備会社から強い関心を持たれます。BEI計算や省エネ計画書の作成経験も一緒にアピールしましょう。' },
      { question: 'BIM操作スキルは東京の管工事転職に必要ですか？', answer: '東京の大型案件ではBIM（Revit MEP・CADew）を活用した施工計画が当たり前になっており、操作スキルがある場合は書類選考での通過率が大きく変わります。現時点でスキルがない場合も、「習得中・学習計画あり」と記載することで積極的な姿勢として評価されます。1級管工事施工管理技士との組み合わせで年収600〜700万円台を狙いましょう。' },
    ],
    landscaping: [
      { question: '東京で造園施工管理の求人が多いエリアはどこですか？', answer: '新宿エリア（神宮外苑地区の再開発関連・新宿中央公園のPark-PFI運営）、江東区（豊洲・有明など臨海部の公園整備、海の森公園関連の植栽工事）が代表的です。また23区全域で街路樹の維持管理・都立公園の指定管理案件が継続的に発生しており、求人は再開発系の新植工事と公共系の維持管理の両方で動いています。施工管理特化型エージェントの非公開求人で区レベルの勤務地希望を伝えるのが効率的です。' },
      { question: '東京の造園施工管理で年収500万円以上を目指せますか？', answer: '可能です。1級造園施工管理技士を保有し、都市緑化・屋上緑化または大型再開発の植栽工事の施工管理実績がある場合、東京では年収500万円台の求人を十分狙えます。植栽基盤設計の経験や樹木医資格があればさらに希少価値が高まります。維持管理系の経験のみの場合も、管理面積・本数を数字で示せれば再開発元請系への転職は十分可能です。' },
    ],
  };

  const specificFAQs = jobSpecific[jobTypeId] ?? jobSpecific['architecture'];
  return [
    specificFAQs[0],
    {
      question: `東京の${jobTypeName}の平均年収はいくらですか？`,
      answer: `東京の${jobTypeName}の平均年収は約${avgSalary}万円ですが、1級施工管理技士の資格保有者や経験10年以上の方は${avgSalary + 80}万円〜${avgSalary + 150}万円の求人も多数あります。五大ゼネコン・大手デベロッパー系の案件では700万円台以上も珍しくなく、全国で最も年収水準が高いエリアです。`,
    },
    specificFAQs[1],
    {
      question: `40代・50代でも東京で${jobTypeName}に転職できますか？`,
      answer: `はい、東京の${jobTypeName}は40代・50代の転職実績が豊富です。大規模現場のプロジェクトマネージャー・現場所長候補として積極的に採用されており、20年以上の施工経験と1級資格の組み合わせは東京では特に高く評価されます。複数のエージェントに登録して選択肢を広げましょう。`,
    },
    {
      question: `東京で${jobTypeName}のエージェントを選ぶポイントは？`,
      answer: `東京での${jobTypeName}エージェント選びのポイントは①大手ゼネコン・大手デベロッパー系の非公開求人を多数保有していること②業界出身のキャリアアドバイザーが在籍していること③年収交渉の実績が豊富なこと の3点です。2〜3社に同時登録して非公開求人を比較するのが最も効果的です。`,
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
