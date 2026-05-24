# 地域ページ独自コンテンツ強化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `lib/constants.ts` の `getLocalAdvice` を都道府県データ駆動型に書き換え、新関数 `getSuccessPoints` を追加することで、235地域ページすべてに固有のテキストを自動生成する。

**Architecture:** `lib/types.ts` に `SuccessPoint` 型を追加し、`lib/constants.ts` の固定テンプレート群（`ADVICE_TEMPLATES`, `getAdvicePattern`）を削除して `demandLevel`・`trendKeywords`・工種データを組み合わせるデータ駆動関数2本に置き換える。`app/[pref]/[job_type]/page.tsx` はハードコードされた成功ポイント配列を `getSuccessPoints()` 呼び出しに差し替えるだけで済む。

**Tech Stack:** TypeScript, Next.js 14 (SSG), tsx（smoke check用）

---

## File Map

| 操作 | ファイル | 変更内容 |
|------|---------|---------|
| Modify | `lib/types.ts` | `SuccessPoint` インターフェースを追加 |
| Modify | `lib/constants.ts` | `ADVICE_TEMPLATES`・`getAdvicePattern` を削除し `getLocalAdvice` を再実装。`getSuccessPoints` を追加 |
| Modify | `app/[pref]/[job_type]/page.tsx` | 成功ポイントのハードコード配列を `getSuccessPoints()` に差し替え。`getSuccessPoints` を import 追加 |

---

## Task 1: `SuccessPoint` 型を `lib/types.ts` に追加

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: `SuccessPoint` インターフェースをファイル末尾に追記**

`lib/types.ts` の末尾（`PageData` の後）に以下を追加：

```typescript
export interface SuccessPoint {
  title: string;
  body: string;
}
```

- [ ] **Step 2: 型チェックでエラーがないことを確認**

```bash
npx tsc --noEmit
```

期待結果: エラーなし（0 errors）

- [ ] **Step 3: コミット**

```bash
git add lib/types.ts
git commit -m "feat: add SuccessPoint interface to types"
```

---

## Task 2: `getLocalAdvice` をデータ駆動型に書き換え

**Files:**
- Modify: `lib/constants.ts:107-149`（`ADVICE_TEMPLATES`, `getAdvicePattern`, `getLocalAdvice` の範囲）

- [ ] **Step 1: `ADVICE_TEMPLATES`・`getAdvicePattern`・`getLocalAdvice` の3つを削除し、以下の新実装に置き換える**

`lib/constants.ts` の `// ===== アドバイステンプレート（5工種 × 3パターン）=====` から `export function getLocalAdvice` の終わりまでを丸ごと以下に置き換える：

```typescript
/** 都道府県×工種データから地域固有のアドバイス文を生成する */
export function getLocalAdvice(jobTypeId: string, prefId: string): string {
  const pref = getPrefById(prefId);
  const jobType = getJobTypeById(jobTypeId);
  if (!pref || !jobType) return '';

  const demandPhrase: Record<string, string> = {
    high:   `${pref.name}は施工管理の求人需要が特に旺盛で、好条件の案件が多数出ています。`,
    medium: `${pref.name}は安定した施工管理需要があり、転職タイミングを選べば好条件の求人に巡り会えます。`,
    low:    `${pref.name}は求人数こそ多くないものの、地域密着型エージェントを活用することで非公開求人にアクセスできます。`,
  };

  const trendPhrase = `特に「${pref.trendKeywords[0]}」「${pref.trendKeywords[1]}」関連の案件が活発で、${jobType.fullName}経験者への需要は高まっています。`;

  const jobAdvice: Record<string, string> = {
    architecture: `大手ゼネコン・デベロッパー系の案件を狙うなら1級建築施工管理技士の取得が年収交渉の決め手になります。複数のエージェントを比較して求人の幅を広げましょう。`,
    civil:        `公共工事メインなら官公庁案件に強いエージェントが有利です。1級土木施工管理技士＋舗装・橋梁などの専門経験で年収アップが狙えます。`,
    electrical:   `電気系は慢性的な人材不足で売り手市場が続いており、1級電気工事施工管理技士があれば年収600万円超えも現実的です。再生可能エネルギー分野の経験は特に高評価です。`,
    pipe:         `省エネ・ZEB対応設備の施工経験は引き合いが強く、CAD・BIM操作スキルがあると書類選考の通過率が大幅に上がります。`,
    landscaping:  `都市緑化・グリーンインフラ需要の拡大で求人は増加中です。公共造園工事の実績と1級造園施工管理技士の組み合わせが転職時の最大の武器になります。`,
  };

  return `${demandPhrase[pref.demandLevel]}${trendPhrase}${jobAdvice[jobTypeId] ?? ''}`;
}
```

- [ ] **Step 2: smoke check — 需要度・工種が異なる3組み合わせで出力を確認**

```bash
npx tsx -e "
import { getLocalAdvice } from './lib/constants.js';
console.log('--- tokyo/architecture (high) ---');
console.log(getLocalAdvice('architecture', 'tokyo'));
console.log('--- osaka/electrical (high) ---');
console.log(getLocalAdvice('electrical', 'osaka'));
console.log('--- kochi/landscaping (low) ---');
console.log(getLocalAdvice('landscaping', 'kochi'));
"
```

期待結果: 3件とも異なるテキストが出力され、各県の `trendKeywords` が文中に含まれる。エラーなし。

- [ ] **Step 3: 型チェック**

```bash
npx tsc --noEmit
```

期待結果: エラーなし

- [ ] **Step 4: コミット**

```bash
git add lib/constants.ts
git commit -m "feat: rewrite getLocalAdvice with data-driven text generation"
```

---

## Task 3: `getSuccessPoints` を `lib/constants.ts` に追加

**Files:**
- Modify: `lib/constants.ts`（`getLocalAdvice` の直後に追記）
- Modify: `lib/constants.ts` の import 行（`SuccessPoint` を types から import）

- [ ] **Step 1: `lib/constants.ts` 先頭の import に `SuccessPoint` を追加**

```typescript
import { PrefData, JobTypeData, SuccessPoint } from './types';
```

- [ ] **Step 2: `getLocalAdvice` の直後に `getSuccessPoints` を追加**

```typescript
/** 都道府県×工種データから転職成功ポイント3項目を生成する */
export function getSuccessPoints(jobTypeId: string, prefId: string): SuccessPoint[] {
  const pref = getPrefById(prefId);
  const jobType = getJobTypeById(jobTypeId);
  if (!pref || !jobType) return [];

  const point1ByDemand: Record<string, SuccessPoint> = {
    high: {
      title: '施工管理特化エージェントに今すぐ複数登録する',
      body: `${pref.name}は求人需要が旺盛で、好条件の求人は早期に埋まります。今すぐ施工管理特化型エージェントに2〜3社同時登録して、非公開求人を押さえることが転職成功の第一歩です。`,
    },
    medium: {
      title: '地域特化型と全国型の両方のエージェントに登録する',
      body: `${pref.name}の転職では、地域密着型エージェント（地場ゼネコン求人に強い）と全国型エージェント（大手・中堅案件に強い）を併用することで、選択肢を最大化できます。`,
    },
    low: {
      title: '全国展開型エージェントも併用して求人の選択肢を広げる',
      body: `${pref.name}は求人数が限られるため、地域特化型だけでなく全国展開型エージェントも並行して使い、隣接エリアの求人まで視野に入れることが重要です。`,
    },
  };

  const point2ByJobType: Record<string, SuccessPoint> = {
    architecture: {
      title: `${jobType.license}の取得・アピールを最優先にする`,
      body: `1級建築施工管理技士は大手ゼネコンへの転職で必須条件になることが多く、取得だけで年収交渉の余地が大幅に広がります。未取得なら取得計画を、取得済みなら担当した工事規模・種別を具体的にアピールしましょう。`,
    },
    civil: {
      title: `${jobType.license}＋専門分野経験を組み合わせてアピールする`,
      body: `1級土木施工管理技士に加えて、舗装・橋梁・トンネルなど専門性の高い施工経験があると希少人材として評価されます。施工計画書の作成経験も重要なアピールポイントです。`,
    },
    electrical: {
      title: `${jobType.license}を武器に売り手市場で強気に交渉する`,
      body: `電気工事施工管理は全工種で最も人材不足が深刻です。1級電気工事施工管理技士があれば年収600万円超えも現実的で、複数社から内定を取って条件を比較する強気の戦略が有効です。`,
    },
    pipe: {
      title: `${jobType.license}＋BIM・省エネ設備経験で差別化する`,
      body: `管工事施工管理は省エネ・ZEB対応の需要増で注目度が上昇中です。CAD・BIM操作スキルと省エネ設備の施工経験を組み合わせることで、年収交渉のレバレッジが大きく高まります。`,
    },
    landscaping: {
      title: `${jobType.license}と公共造園工事の実績を前面に出す`,
      body: `造園施工管理は都市緑化・グリーンインフラ需要の高まりで求人が拡大中です。1級造園施工管理技士の資格と公園・緑地などの公共造園工事の実績は転職時の最大の差別化ポイントになります。`,
    },
  };

  const point3ByDemand: Record<string, SuccessPoint> = {
    high: {
      title: '複数社に同時並行で応募して条件を比較する',
      body: `求人が豊富な${pref.name}では、1社ずつ応募するより複数社に並行して応募することで内定が競合し、年収や条件の交渉余地が生まれます。エージェント経由で一括管理すると効率的です。`,
    },
    medium: {
      title: '職務経歴書に数字・規模・人数を具体的に記載して差をつける',
      body: `「どんな規模の現場を・何人のチームで・どのような課題を解決しながら管理したか」を数字で表現することで、書類選考の通過率が大幅に上がります。エージェントに添削を依頼するのも有効です。`,
    },
    low: {
      title: '希望エリアを隣県まで広げ求人数を最大化する',
      body: `求人数が限られる${pref.name}では、隣接する都道府県や通勤圏内の求人まで視野を広げることで選択肢が一気に増えます。転勤許容度を上げることが収入アップへの近道になるケースも多いです。`,
    },
  };

  return [
    point1ByDemand[pref.demandLevel],
    point2ByJobType[jobTypeId] ?? {
      title: `${jobType.license}の取得を目指す`,
      body: `資格があることで求人の幅が大幅に広がり、年収交渉でも有利になります。特に1級は管理職候補として高待遇での転職が狙えます。`,
    },
    point3ByDemand[pref.demandLevel],
  ];
}
```

- [ ] **Step 3: smoke check — 需要度・工種の異なる2組み合わせで3項目が返ることを確認**

```bash
npx tsx -e "
import { getSuccessPoints } from './lib/constants.js';
const pts1 = getSuccessPoints('civil', 'tokyo');
const pts2 = getSuccessPoints('pipe', 'akita');
console.log('tokyo/civil point1 title:', pts1[0].title);
console.log('tokyo/civil point3 title:', pts1[2].title);
console.log('akita/pipe point1 title:', pts2[0].title);
console.log('akita/pipe point3 title:', pts2[2].title);
console.log('count (expect 3):', pts1.length, pts2.length);
"
```

期待結果:
- `tokyo/civil`（high）と `akita/pipe`（low）でポイント1・3のタイトルが異なること
- 両方とも count が 3 であること

- [ ] **Step 4: 型チェック**

```bash
npx tsc --noEmit
```

期待結果: エラーなし

- [ ] **Step 5: コミット**

```bash
git add lib/constants.ts
git commit -m "feat: add getSuccessPoints for data-driven success point generation"
```

---

## Task 4: `page.tsx` の成功ポイントセクションを `getSuccessPoints()` に差し替え

**Files:**
- Modify: `app/[pref]/[job_type]/page.tsx:4`（import 行）
- Modify: `app/[pref]/[job_type]/page.tsx:222-248`（成功ポイントセクション）

- [ ] **Step 1: import に `getSuccessPoints` を追加**

`app/[pref]/[job_type]/page.tsx` の以下の行を：

```typescript
import { PREFS, JOB_TYPES, getPrefById, getJobTypeById, getLocalAdvice } from '../../../lib/constants';
```

以下に変更：

```typescript
import { PREFS, JOB_TYPES, getPrefById, getJobTypeById, getLocalAdvice, getSuccessPoints } from '../../../lib/constants';
```

- [ ] **Step 2: 成功ポイントセクションのハードコード配列を `getSuccessPoints()` に差し替え**

`app/[pref]/[job_type]/page.tsx` の以下の部分を：

```tsx
        {/* 転職成功ポイント */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            {pref.name}で{jobType.fullName}に転職するためのポイント
          </h2>
          <ol className="space-y-4">
            {[
              {
                title: '施工管理特化型エージェントを複数登録する',
                body: `一般転職サービスではなく、建設・施工管理に特化したエージェントを選ぶことで、${pref.name}の${jobType.fullName}求人に強いアドバイザーに担当してもらえます。複数登録することで選択肢が広がります。`,
              },
              {
                title: `${jobType.license}の取得を目指す`,
                body: `資格があることで求人の幅が大幅に広がり、年収交渉でも有利になります。特に1級は管理職候補として高待遇での転職が狙えます。`,
              },
              {
                title: '職務経歴書で「現場規模・人数管理」を具体的に記載',
                body: `施工管理の転職では「どんな規模の現場を・何人のチームで・どのように管理したか」が重視されます。数字を使った具体的な記載が内定率を高めます。`,
              },
            ].map((item, i) => (
```

以下に変更：

```tsx
        {/* 転職成功ポイント */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            {pref.name}で{jobType.fullName}に転職するためのポイント
          </h2>
          <ol className="space-y-4">
            {getSuccessPoints(jobType.id, pref.id).map((item, i) => (
```

- [ ] **Step 3: 型チェック**

```bash
npx tsc --noEmit
```

期待結果: エラーなし

- [ ] **Step 4: コミット**

```bash
git add app/\[pref\]/\[job_type\]/page.tsx
git commit -m "feat: replace hardcoded success points with getSuccessPoints()"
```

---

## Task 5: ビルド検証

**Files:** なし（読み取り専用）

- [ ] **Step 1: フルビルドを実行**

```bash
npm run build
```

期待結果: `✓ Generating static pages (235/235)` が表示されビルド成功。エラーなし。

- [ ] **Step 2: 東京・建築ページと高知・造園ページの出力HTMLを diff 確認**

```bash
grep -A3 "転職成功ポイント\|施工管理特化エージェント\|都市緑化" out/tokyo/architecture/index.html | head -20
grep -A3 "転職成功ポイント\|全国展開型エージェント\|造園施工管理技士" out/kochi/landscaping/index.html | head -20
```

期待結果:
- `out/tokyo/architecture/index.html` に「施工管理特化エージェントに今すぐ複数登録する」が含まれる
- `out/kochi/landscaping/index.html` に「全国展開型エージェントも併用して」が含まれる

- [ ] **Step 3: git push**

```bash
git push origin main
```
