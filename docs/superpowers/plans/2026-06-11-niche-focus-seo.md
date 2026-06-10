# 芽の出たニッチ集中 SEO 強化 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GSC で表示が付き始めた「造園×東京」と「競合サービス指名×評判KW」に集中投資し、最初の上位表示とアフィリエイト成約の足場を作る。

**Architecture:** ① `lib/constants.ts` / `lib/sheets.ts` の東京固有早期リターン内の造園コンテンツを区レベルに深化（他234ページに影響なし）。② 都道府県×工種ページに「関連コラム」セクションを追加し記事↔地域ページの内部リンクを作る。③ S級評判記事2本新規+1本リライトを執筆し、Google Sheets 入稿用に納品（コードと分離）。

**Tech Stack:** Next.js 14 (App Router, `output: 'export'` SSG) / Google Sheets API（記事データソース）/ Netlify

**Spec:** `docs/superpowers/specs/2026-06-10-niche-focus-seo-design.md`

---

## 前提知識（実装者向け）

- 本リポジトリに**テストフレームワークは存在しない**。検証は `npm run build`（283ページ生成）と `out/` 内の生成 HTML の grep で行う。
- 記事本文は Google Sheets の `articles` シート（カラム: id | slug | title | description | category | jobType | pref | body | heroImage | publishedAt | status）にあり、**リポジトリには入っていない**。記事の納品物は `deliverables/202606-hyouban/` に Markdown + メタ情報として置き、ユーザーが Sheets に貼り付ける。
- 記事の執筆ルールは `施工管理サイト/施工管理プロジェクトMD/article-production-spec.md`（だ・である調、「私」を主語にしない等）と `author-persona.md`（著者経験は「根拠」として使う）に従う。**着手前に両方を必ず全文読むこと。**
- 記事本文内の内部リンクはプレースホルダー記法 `（内部リンク：記事タイトルの一部）` を使う（`lib/internal-links.ts` のパターン3がタイトル部分一致で実リンクに変換する。ID 不要で最も安全）。
- カテゴリは `lib/constants.ts` の `ARTICLE_CATEGORIES` で定義: `career` / `salary` / `qualification` / `work` / `region`。評判記事は `career`。
- ビルドには `.env.local`（Sheets API キー）が必要。既に設定済みのはず。なければ `USE_LOCAL_FALLBACK` でフォールバック動作になり記事関連の検証が一部できない — その場合はユーザーに確認。

---

### Task 1: 造園×東京コンテンツの区レベル深化

**Files:**
- Modify: `lib/constants.ts:119`（`getLocalAdvice` 内 `tokyoAdvice.landscaping`）
- Modify: `lib/constants.ts:171-175`（`getSuccessPoints` 内 `tokyoPoints.landscaping`）
- Modify: `lib/sheets.ts` `generateTokyoFAQs()` 内 `jobSpecific.landscaping`（約317行付近）

GSC で「新宿 造園施工管理 求人」「江東区 造園施工管理 求人」が拾われているため、区・実在案件レベルの記述に差し替える。**東京×造園の早期リターン内のみ変更し、他の工種・他県のコードに触らないこと。**

- [ ] **Step 1: `tokyoAdvice.landscaping` の文字列を差し替え**

`lib/constants.ts` の `getLocalAdvice` 内、`landscaping:` の値を以下に置換:

```typescript
      landscaping: '東京都の「東京グリーンビズ」推進と大型再開発の緑地整備義務化で、都市造園の求人は23区を中心に拡大しています。新宿エリアでは神宮外苑地区の再開発関連や新宿中央公園のPark-PFI運営、江東区では豊洲・有明など臨海部の公園整備や海の森公園関連の植栽工事、区部全域では街路樹の維持管理・都立公園の指定管理案件が並行して動いており、求人は「新植・外構造園」と「維持管理」の両輪で発生しています。1級造園施工管理技士に屋上緑化・植栽基盤設計の経験を組み合わせると年収500万円台が現実的で、維持管理会社から再開発元請の施工管理へキャリアアップする転職も東京では実現しやすい環境です。',
```

- [ ] **Step 2: `tokyoPoints.landscaping` の3項目を差し替え**

`lib/constants.ts` の `getSuccessPoints` 内、`landscaping:` の配列を以下に置換:

```typescript
      landscaping: [
        { title: '「新植」と「維持管理」どちらの実績も数字で整理する', body: '東京の造園求人は神宮外苑・臨海部など再開発の新植工事と、街路樹・都立公園の維持管理の2系統で発生しています。植栽面積・本数・工事金額・管理面積を数字で職務経歴書に記載すると、どちらの系統でも書類通過率が大きく上がります。' },
        { title: '応募先を「再開発元請系」か「公共維持管理系」かで絞り込む', body: '同じ造園施工管理でも、大手ゼネコン協力会社として再開発の植栽工事を担う会社と、区・都発注の街路樹維持管理や指定管理を担う会社では働き方も年収レンジも異なります。エージェントに希望の系統を最初に伝えることで、ミスマッチのない求人紹介を受けられます。' },
        { title: '屋上緑化・植栽基盤設計・樹木医で年収500万円台を狙う', body: '緑地整備義務化で屋上・壁面緑化の施工需要が急増しており、一般造園と異なる専門技術として高く評価されます。1級造園施工管理技士に屋上緑化や植栽基盤設計の経験、樹木医資格を組み合わせると、東京では年収500万円台を超える求人を現実的に狙えます。' },
      ],
```

- [ ] **Step 3: `generateTokyoFAQs` の `jobSpecific.landscaping` を差し替え**

`lib/sheets.ts` の `generateTokyoFAQs` 内、`landscaping:` の配列を以下に置換:

```typescript
    landscaping: [
      { question: '東京で造園施工管理の求人が多いエリアはどこですか？', answer: '新宿エリア（神宮外苑地区の再開発関連・新宿中央公園のPark-PFI運営）、江東区（豊洲・有明など臨海部の公園整備、海の森公園関連の植栽工事）が代表的です。また23区全域で街路樹の維持管理・都立公園の指定管理案件が継続的に発生しており、求人は再開発系の新植工事と公共系の維持管理の両方で動いています。施工管理特化型エージェントの非公開求人で区レベルの勤務地希望を伝えるのが効率的です。' },
      { question: '東京の造園施工管理で年収500万円以上を目指せますか？', answer: '可能です。1級造園施工管理技士を保有し、都市緑化・屋上緑化または大型再開発の植栽工事の施工管理実績がある場合、東京では年収500万円台の求人を十分狙えます。植栽基盤設計の経験や樹木医資格があればさらに希少価値が高まります。維持管理系の経験のみの場合も、管理面積・本数を数字で示せれば再開発元請系への転職は十分可能です。' },
    ],
```

- [ ] **Step 4: ビルドして生成 HTML を確認**

```bash
cd /Users/yotsutsujiatsuhiro/claudecode/sekoukan-affiliate
npm run build
```

Expected: エラーなく完了し `out/` に283ページ生成。

```bash
grep -o '新宿中央公園' out/tokyo/landscaping/index.html | head -1
grep -o '海の森公園' out/tokyo/landscaping/index.html | head -1
grep -c '新宿中央公園' out/osaka/landscaping/index.html || echo "OK: 他県に波及なし"
```

Expected: tokyo/landscaping に新テキストが含まれ、osaka/landscaping には含まれない（`grep -c` が 0 で exit 1 → `OK: 他県に波及なし` が出る）。

- [ ] **Step 5: Commit**

```bash
git add lib/constants.ts lib/sheets.ts
git commit -m "feat: 東京×造園コンテンツを区レベル情報に深化（GSCクエリ対応）"
```

---

### Task 2: 都道府県×工種ページに「関連コラム」セクション追加

**Files:**
- Modify: `app/[pref]/[job_type]/page.tsx`（import 部・データ取得部・288行付近のセクション描画部）

記事データ（`articles` シート）には `pref` / `jobType` カラムがあるため、ページの都道府県に一致する記事を最大3件リンク表示する。これにより記事↔地域ページの内部リンクが自動で張られる（東京なら `sekoukan-tenshoku-tokyo-agent` 等が出る）。

- [ ] **Step 1: import に `fetchArticles` を追加**

`app/[pref]/[job_type]/page.tsx` の lib/sheets import（5〜13行）に `fetchArticles` を追加:

```typescript
import {
  fetchAffiliatesFromSheets,
  fetchSalaryOverrides,
  fetchFAQs,
  fetchEditorNotes,
  fetchRankingOverrides,
  fetchArticles,
  generateDefaultFAQs,
  DEFAULT_AFFILIATES,
} from '../../../lib/sheets';
```

- [ ] **Step 2: ビルド時データ取得に記事を追加**

76〜82行の `Promise.all` を以下に変更:

```typescript
  const [allAffiliates, salaryOverrides, faqMap, editorNoteMap, rankingOverrides, allArticles] = await Promise.all([
    fetchAffiliatesFromSheets(),
    fetchSalaryOverrides(),
    fetchFAQs(),
    fetchEditorNotes(),
    fetchRankingOverrides(),
    fetchArticles(),
  ]);
```

直後（フィルタリング処理の前）に関連記事の抽出を追加:

```typescript
  // この都道府県に関連する記事（工種指定がある記事は一致するものだけ）
  const relatedArticles = allArticles
    .filter((a) => a.pref === pref.id && (!a.jobType || a.jobType === jobType.id))
    .slice(0, 3);
```

- [ ] **Step 3: セクションを描画**

`<FAQSection ... />`（288行付近）と `{/* ===== 関連ページ内部リンク ===== */}` の間に挿入:

```tsx
        {/* ===== 関連コラム ===== */}
        {relatedArticles.length > 0 && (
          <section className="my-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {pref.nameShort}の転職に役立つコラム
            </h2>
            <ul className="space-y-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}/`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <span className="text-gray-400">›</span>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
```

- [ ] **Step 4: ビルドして確認**

```bash
npm run build
grep -o '転職に役立つコラム' out/tokyo/landscaping/index.html | head -1
grep -o '/articles/sekoukan-tenshoku-tokyo-agent/' out/tokyo/architecture/index.html | head -1
```

Expected: ビルド成功。東京ページに「転職に役立つコラム」セクションと記事リンクが出る。
（注: `pref` カラムが空の記事しかない県ではセクションが出ないのが正常動作。Sheets の記事データに依存するため、東京で出ていればOK）

- [ ] **Step 5: Commit**

```bash
git add "app/[pref]/[job_type]/page.tsx"
git commit -m "feat: 都道府県×工種ページに関連コラムセクションを追加（記事との内部リンク）"
```

---

### Task 3: 新規記事①「施工管理求人ナビ 評判・口コミ」執筆

**Files:**
- Create: `deliverables/202606-hyouban/sekoukan-kyujin-navi-hyouban.md`（記事本文）
- Create: `deliverables/202606-hyouban/meta.tsv`（3記事分のメタ情報。このタスクで1行目を書く）

GSC 根拠: 「施工管理求人ナビ 評判」10表示・54.9位、「施工管理求人ナビ 口コミ」5表示・48.8位。記事が存在しないのに拾われている = 記事を作れば確実に順位が付く最有望KW。

- [ ] **Step 1: 執筆ルールを読む**

`施工管理サイト/施工管理プロジェクトMD/article-production-spec.md` と `author-persona.md` を全文読む。要点: だ・である調 / 「私」を主語にしない / 著者経験は根拠として使う / 短文連打しない / きれいにまとめすぎない。

- [ ] **Step 2: WebSearch で実データを調査**

以下を WebSearch で調べてメモする（**事実確認が取れないことは書かない**）:
- 「施工管理求人ナビ」の運営会社・サービス概要・求人数の規模感・対応エリア
- 特徴（施工管理特化か、派遣型か正社員紹介型か — ここが読者の最大の関心点）
- 公開されている利用者の評判・口コミの傾向（良い点・悪い点の両方）
- 競合上位記事（「施工管理求人ナビ 評判」で検索）の構成と情報量

- [ ] **Step 3: 記事本文を執筆**

メタ情報:
| 項目 | 値 |
|------|-----|
| slug | `sekoukan-kyujin-navi-hyouban` |
| title | `施工管理求人ナビの評判・口コミ｜登録前に知るべき特徴と注意点` |
| description | 施工管理求人ナビの評判・口コミを調査。サービスの仕組み・求人の傾向・向いている人/向いていない人を、転職エージェント5社を使い比べた編集部が解説する。（130字以内に調整） |
| category | `career` |
| jobType | （空） |
| pref | （空） |
| heroImage | （空 — フォールバック表示。画像は後日ユーザーが追加） |
| status | `published` |

構成（ナレッジの収益テンプレ準拠・3,500〜5,000字目安）:
1. リード: 結論先出し（どんな人に向くサービスか）
2. 施工管理求人ナビの基本情報（運営会社・仕組み・求人の傾向 — 表形式）
3. 良い評判・口コミ
4. 悪い評判・口コミ（**正直に。隠さない**）
5. 評判からわかる向いている人・向いていない人
6. 他サービスとの比較（`（内部リンク：建設転職ナビの評判）` `（内部リンク：施工管理の転職エージェントおすすめ）` プレースホルダーで既存記事へリンク）
7. 登録から利用開始までの流れ
8. まとめ + 比較記事への誘導

執筆時の必須ルール:
- 体験談の創作は**禁止**。スタンスは「編集部が調査した」。著者の転職経験（エージェント5社使い比べ）は「複数エージェントを使い比べた経験から言えるのは〜」の形で根拠として使ってよい
- 施工管理求人ナビ自体はアフィリエイト案件ではない可能性が高い → 記事の出口は自社の比較記事・推奨エージェントへの内部リンク（ナレッジの「指名KWで集客→自社推奨へ送客」パターン）
- CTA相当の内部リンク誘導を冒頭・中盤・末尾の3箇所に置く
- 「実際に使った感想」のような体験談見出しは**作らない**（中身を創作できないため）。ユーザーが将来実体験を追記しやすいよう、README.md に「体験談を追記する場合はセクション3（良い評判）の直前に挿入」と推奨位置を明記する（Task 6 で対応）

- [ ] **Step 4: 品質セルフチェック**

ナレッジのチェックリストで確認:
- [ ] ネガティブな点も正直に書いているか
- [ ] 向いていない人を明確に書いているか
- [ ] 競合上位記事より情報量が多いか（Step 2 の調査と比較）
- [ ] 施工管理職に特化した記述があるか
- [ ] だ・である調で統一されているか／「私は」が出てこないか
- [ ] 「いかがでしたか」「〜することが重要です」連打などAI常套句がないか
- [ ] 事実確認が取れない数字・固有名詞を書いていないか

- [ ] **Step 5: meta.tsv に1行追記して Commit**

`deliverables/202606-hyouban/meta.tsv` をヘッダー付きで作成し1行目を書く（id はユーザーが Sheets の最終行を見て採番するため `（要採番）` と記載。タブ区切り）:

```
id	slug	title	description	category	jobType	pref	heroImage	publishedAt	status
（要採番）	sekoukan-kyujin-navi-hyouban	施工管理求人ナビの評判・口コミ｜登録前に知るべき特徴と注意点	（記事のdescriptionをここに）	career			（空）	2026-06-11	published
```

```bash
git add deliverables/202606-hyouban/
git commit -m "feat: 新規記事「施工管理求人ナビ 評判」納品（S級指名KW）"
```

---

### Task 4: 新規記事②「マイナビエージェント×施工管理」執筆

**Files:**
- Create: `deliverables/202606-hyouban/mynavi-agent-sekoukan.md`
- Modify: `deliverables/202606-hyouban/meta.tsv`（2行目を追記）

GSC 根拠: 「施工管理マイナビエ-ジェント」15表示・26.9位。既に27位なので記事を作れば10位台が狙える。

- [ ] **Step 1: WebSearch で実データを調査**

- マイナビエージェントの施工管理・建設業界求人の取り扱い状況（建築・土木専門チームの有無）
- 施工管理職がマイナビエージェントを使う場合の強み・弱み（大手総合型 vs 施工管理特化型の構造差）
- 公開されている評判・口コミの傾向
- 競合上位記事（「マイナビエージェント 施工管理」で検索）の構成

- [ ] **Step 2: 記事本文を執筆**

メタ情報:
| 項目 | 値 |
|------|-----|
| slug | `mynavi-agent-sekoukan` |
| title | `マイナビエージェントは施工管理の転職に使える？求人の実態と特化型との違い` |
| description | マイナビエージェントで施工管理の転職はできるのか。求人の傾向・総合型エージェントの強みと限界・施工管理特化型との使い分けを編集部が解説する。（130字以内に調整） |
| category | `career` |
| jobType / pref / heroImage | （空） |
| status | `published` |

構成（3,500〜5,000字目安）:
1. リード: 結論先出し（使えるが、特化型との併用が前提 — 調査結果に基づき調整）
2. マイナビエージェントの基本情報と施工管理求人の実態
3. 施工管理転職で使うメリット（大手総合型の強み）
4. デメリット・限界（**特化型と比べた弱みを正直に**。著者の「大手は良くも悪くもテンプレ対応」という経験を根拠として使える）
5. 向いている人・向いていない人
6. 施工管理特化型エージェントとの併用戦略（`（内部リンク：施工管理の転職エージェントおすすめ）` `（内部リンク：リクルートエージェント）` で既存記事へ）
7. まとめ + 比較記事への誘導

執筆ルール・品質チェックは Task 3 の Step 4 と同一。

- [ ] **Step 3: meta.tsv に2行目を追記して Commit**

```bash
git add deliverables/202606-hyouban/
git commit -m "feat: 新規記事「マイナビエージェント 施工管理」納品（指名KW 27位対策）"
```

---

### Task 5: リライト「建設転職ナビ 評判」増強

**Files:**
- Create: `deliverables/202606-hyouban/kensetsu-tenshoku-navi-hyouban_rewrite.md`（差し替え用の新本文）
- Modify: `deliverables/202606-hyouban/meta.tsv`（3行目: リライトである旨を明記）

GSC 根拠: 「建設転職ナビ 評判」6表示・38.3位、「建設転職ナビ」4表示・26.5位。記事は既に存在する（slug: `kensetsu-tenshoku-navi-hyouban`）が順位が弱い → 情報量を競合超えに増強する。

- [ ] **Step 1: 現行記事を取得して分析**

```bash
curl -s "https://sekoukan-navi.com/articles/kensetsu-tenshoku-navi-hyouban/" > /tmp/current-article.html
```

HTML から本文を読み、現行の構成・文字数・不足要素を整理する。

- [ ] **Step 2: WebSearch で競合と最新データを調査**

- 「建設転職ナビ 評判」検索上位3記事の構成・情報量・文字数
- 建設転職ナビの最新情報（運営会社ヒューマンタッチ・求人数・サービス変更の有無）
- 現行記事に欠けている要素を特定（例: 求人数の実数、登録〜内定の流れ、職種別の求人傾向、FAQ）

- [ ] **Step 3: 新本文を執筆**

方針:
- **slug・title の大幅変更はしない**（既に26〜38位で評価され始めているため。title の微調整は可）
- 現行記事の良い部分（独自の視点・著者経験ベースの記述）は残し、不足要素を追加して競合上位を情報量で上回る
- 更新日表記を「更新日：2026年6月」に変更
- 既存の内部リンクプレースホルダーがあれば維持し、新記事への `（内部リンク：施工管理求人ナビの評判）` `（内部リンク：マイナビエージェント）` を追加（評判記事クラスタの相互リンク完成）
- 比較記事 `kensetsu-navi-vs-recruit-hikaku` / `kensetsu-navi-vs-doda-hikaku` へのリンクを確認・追加

品質チェックは Task 3 の Step 4 と同一。

- [ ] **Step 4: meta.tsv 3行目を追記して Commit**

3行目は新規ではなくリライトなので以下の形式:

```
（既存IDのまま）	kensetsu-tenshoku-navi-hyouban	（titleを変える場合のみ記載・変えないなら「変更なし」）	（同左）	career			（変更なし）	（既存のまま）	published
```

```bash
git add deliverables/202606-hyouban/
git commit -m "feat: リライト「建設転職ナビ 評判」納品（38位→上位対策の増強版）"
```

---

### Task 6: 入稿手順書の作成と最終検証

**Files:**
- Create: `deliverables/202606-hyouban/README.md`（ユーザー向け入稿手順）

- [ ] **Step 1: 入稿手順書を書く**

`deliverables/202606-hyouban/README.md` に以下の内容を含める:

```markdown
# 評判記事3本 入稿手順（2026-06）

## 入稿するもの
| ファイル | 種別 | slug |
|---------|------|------|
| sekoukan-kyujin-navi-hyouban.md | 新規 | sekoukan-kyujin-navi-hyouban |
| mynavi-agent-sekoukan.md | 新規 | mynavi-agent-sekoukan |
| kensetsu-tenshoku-navi-hyouban_rewrite.md | リライト（body差し替え） | kensetsu-tenshoku-navi-hyouban |

## 手順（新規記事）
1. Google Sheets の articles シートを開き、最終行の id を確認（例: article-077 なら次は article-078）
2. 新しい行に meta.tsv の内容を列ごとに入力（id は採番した値に置き換え）
3. body セルは: セルをダブルクリックして編集モードにしてから、.md ファイルの全文を貼り付ける
   （編集モードにせず貼ると改行で行が分かれてしまうので注意）
4. status が published になっていることを確認

## 手順（リライト）
1. articles シートで slug = kensetsu-tenshoku-navi-hyouban の行を探す
2. body セルをダブルクリック → 全選択して削除 → _rewrite.md の全文を貼り付け
3. id・slug・publishedAt は変更しない

## 反映
- 貼り付け後、Netlify のビルドをトリガー（GAS の自動トリガー or Netlify 管理画面から手動 Deploy）
- 反映後 https://sekoukan-navi.com/articles/ に新記事2本が出ていることを確認
- Search Console で新記事2本の URL 検査 →「インデックス登録をリクエスト」を実行

## 体験談の追記（任意・推奨）
新規記事2本は「編集部調査」スタンスで書かれています。実際にサービスを利用した体験があれば、
「良い評判・口コミ」セクションの直前に体験談セクションを追記すると E-E-A-T が大きく強化されます。

## 効果測定（4〜6週間後）
- 「施工管理求人ナビ 評判」「マイナビエージェント 施工管理」の順位
- 「建設転職ナビ 評判」38位 → 改善
- 「東京 造園施工管理 求人」31位 → 20位以内
- /tokyo/landscaping/ の表示回数
```

- [ ] **Step 2: 最終ビルド検証**

```bash
npm run build
ls out/ | head -5
grep -o '新宿中央公園' out/tokyo/landscaping/index.html | head -1
grep -o '転職に役立つコラム' out/tokyo/landscaping/index.html | head -1
```

Expected: ビルド成功・Task 1/2 の変更が生成 HTML に反映されている。

- [ ] **Step 3: Commit**

```bash
git add deliverables/202606-hyouban/README.md
git commit -m "docs: 評判記事3本の入稿手順書を追加"
```

- [ ] **Step 4: ユーザーへの報告**

以下をユーザーに伝える:
1. コード変更（東京×造園深化・関連コラムセクション）はコミット済み → git push とNetlifyデプロイの実行可否を確認
2. 記事3本は `deliverables/202606-hyouban/` に納品済み → README.md の手順で Sheets に貼り付けてもらう
3. 貼り付け後のビルドで記事が公開され、関連コラムセクションにも自動で記事リンクが増える

---

## 実装順序とまとめ

| Task | 内容 | 種別 |
|------|------|------|
| 1 | 東京×造園コンテンツ深化 | コード |
| 2 | 関連コラムセクション | コード |
| 3 | 新規記事「施工管理求人ナビ 評判」 | コンテンツ |
| 4 | 新規記事「マイナビエージェント 施工管理」 | コンテンツ |
| 5 | リライト「建設転職ナビ 評判」 | コンテンツ |
| 6 | 入稿手順書・最終検証 | ドキュメント |

Task 1-2 と Task 3-5 は独立しているため並行可能。Task 6 は全タスク完了後。
