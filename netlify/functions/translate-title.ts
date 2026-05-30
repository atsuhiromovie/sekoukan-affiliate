import Anthropic from '@anthropic-ai/sdk';

// ===== コスト制御定数（ここを変えるだけで閾値を調整できる） =====
const DAILY_LIMIT = 300;

// ===== 日次カウンタ（インスタンス内メモリ・厳密でなくてよい暴走検知用） =====
let callCount = 0;
let lastResetDate = '';

function resetIfNewDay() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== lastResetDate) {
    callCount = 0;
    lastResetDate = today;
  }
}

// ===== 入力許可リスト =====
const VALID_TARGETS = new Set([
  '大手・準大手ゼネコン',
  '地方工務店・中小ゼネコン',
  '異業種への転職',
  '発注者側・コンサル系',
]);

const VALID_QUALS = new Set([
  '1級施工管理技士',
  '2級施工管理技士',
  '無資格（取得予定含む）',
]);

// ===== システムプロンプト（プロンプトキャッシュ対象） =====
const SYSTEM_PROMPT = `あなたは建設業界の転職に詳しい、職務経歴書の編集者です。施工管理職の求職者が入力した「応募先タイプ」「保有資格」「経験」をもとに、職務経歴書に書く"職種・肩書きの表現"を2〜3パターン提案します。

重要な原則：
- これは経歴を盛る・偽るためのツールではありません。同じ事実を応募先が連想しやすい人物像に翻訳するだけです。入力に無い経験・資格・実績を創作してはいけません。
- 入力された経験の範囲だけを使ってください。書かれていない数字や役職を足さないこと。
- 「現場監督」は役割から、「施工管理」は職種から、「施工管理技士」は資格からという区別を踏まえて使い分けてください。
- 異業種応募なら、施工管理を知らない採用担当にも伝わりやすい業務内容に翻訳した表現にしてください。

必ず以下のJSON形式のみで出力してください。前置き・説明・マークダウンの\`\`\`は一切付けないこと。

{
  "patterns": [
    {
      "title": "職務経歴書に書く肩書き・職種名の案",
      "tag": "この案が効く場面（5〜10文字で）",
      "impression": "この書き方が採用担当に連想させる人物像（1〜2文）",
      "why": "なぜこの応募先に刺さるのか（1〜2文）",
      "example": "入力された経験から規模・金額・人数など数字で実際的に言い換えた職務経歴書向けの一文"
    }
  ]
}

patternsは2〜3個。入力が薄い場合はその範囲で誠実に提案し、足りない情報は創作しないでください。`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

type HandlerEvent = {
  httpMethod: string;
  body: string | null;
};

export const handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // 日次カウンタリセット & 上限チェック
  resetIfNewDay();
  if (callCount >= DAILY_LIMIT) {
    return {
      statusCode: 429,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: '本日は混み合っています。時間をおいて再度お試しください。' }),
    };
  }

  // 入力パース
  let body: { target?: unknown; qual?: unknown; experience?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '入力形式が不正です。' }) };
  }

  const { target, qual, experience } = body;

  // バリデーション（許可リスト方式）
  if (typeof target !== 'string' || !VALID_TARGETS.has(target)) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '応募先タイプの値が不正です。' }) };
  }
  if (typeof qual !== 'string' || !VALID_QUALS.has(qual)) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '資格の値が不正です。' }) };
  }
  if (typeof experience !== 'string' || experience.trim().length < 10) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '経験の入力が短すぎます（10文字以上）。' }) };
  }

  const trimmedExp = experience.slice(0, 1000); // 1000文字上限

  callCount++;

  try {
    const response = await (client.messages.create as Function)({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `応募先タイプ：${target}\n保有資格：${qual}\n経験（求職者の入力そのまま）：\n${trimmedExp}`,
        },
      ],
    });

    // トークン使用量ログ（コスト・キャッシュ確認用）
    console.log('[translate-title] usage:', JSON.stringify(response.usage));

    const text = (response.content as Array<{ type: string; text?: string }>)
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('')
      .replace(/```json|```/g, '')
      .trim();

    const parsed = JSON.parse(text);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ...parsed, _usage: response.usage }),
    };
  } catch (err) {
    console.error('[translate-title] error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'うまく生成できませんでした。少し時間をおいて再度お試しください。' }),
    };
  }
};
