# shokumukeireki-kakikata リライト実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 公開済み記事 `/articles/shokumukeireki-kakikata/` を、転職主軸のタイトル＋完全サンプル職務経歴書の追加でリライトし、順位・CTR・コンバージョンを改善する。

**Architecture:** 記事の本文・metaは `deliverables/202606-shokumukeireki/`（`meta.tsv`＋`{slug}_rewrite.md`）が単一ソース。`scripts/push-articles-to-sheets.ts` でGoogle Sheetsへ入稿し、Netlify再ビルドで本番反映。リライト時にタイトル（C列）が更新されない既存バグを先に直し、本文・metaを更新して入稿、ライブで検証する。

**Tech Stack:** TypeScript / tsx スクリプト、Google Sheets API（サービスアカウント）、Next.js静的書き出し（Netlify）、Markdown原稿。

**設計仕様:** `docs/superpowers/specs/2026-06-27-shokumukeireki-kakikata-rewrite-design.md`

**確定タイトル（案A'）:** `施工管理の職務経歴書の書き方とサンプル｜転職で通る現場経験の伝え方`
（冒頭に「施工管理の職務経歴書の書き方」を温存し、5本の既存inbound内部リンクをノー編集で維持。「転職」「サンプル」も内包。）

**テスト方針の注記:** このリポジトリにはスクリプト用のユニットテスト基盤が無い。スクリプト改修の検証は「ドライラン出力の目視確認」で行う（YAGNI：1スクリプトのためにテスト基盤は導入しない）。本文の検証はライブ取得（WebFetch）とGSC再測定で行う。

---

## File Structure

- `scripts/push-articles-to-sheets.ts` — 入稿スクリプト。リライト経路にC列（title）更新を追加（Task 1）。
- `deliverables/202606-shokumukeireki/meta.tsv` — タイトル・description（Task 2）。
- `deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md` — 本文。リード文・作業員段落・サンプル節・CTA（Task 3〜5）。
- 兄弟記事の編集は**不要**（案A'でinboundリンク温存）。

---

### Task 1: 入稿スクリプトにリライト時のタイトル更新を追加

**Files:**
- Modify: `scripts/push-articles-to-sheets.ts:166-171`

- [ ] **Step 1: リライト経路にC列(title)更新を追加**

`scripts/push-articles-to-sheets.ts` の162-171行のリライト分岐を、以下に置き換える。

置換前（166-171行）:
```typescript
      toUpdate.push({ rowNumber, col: 'H', value: body, label: `body(${body.length}字)` });
      if (!isPlaceholder(m.description)) {
        toUpdate.push({ rowNumber, col: 'D', value: m.description, label: 'description' });
      }
      console.log(`[リライト] 行${rowNumber}  ${m.slug}（id/slug/publishedAtは温存）`);
      console.log(`        更新: ${m.slug}_rewrite.md → H列 body(${body.length}字)${isPlaceholder(m.description) ? '' : ' + D列 description'}\n`);
```

置換後:
```typescript
      toUpdate.push({ rowNumber, col: 'H', value: body, label: `body(${body.length}字)` });
      if (!isPlaceholder(m.description)) {
        toUpdate.push({ rowNumber, col: 'D', value: m.description, label: 'description' });
      }
      if (!isPlaceholder(m.title)) {
        toUpdate.push({ rowNumber, col: 'C', value: m.title, label: 'title' });
      }
      console.log(`[リライト] 行${rowNumber}  ${m.slug}（id/slug/publishedAtは温存）`);
      console.log(
        `        更新: ${m.slug}_rewrite.md → H列 body(${body.length}字)` +
          `${isPlaceholder(m.description) ? '' : ' + D列 description'}` +
          `${isPlaceholder(m.title) ? '' : ' + C列 title'}\n`
      );
```

- [ ] **Step 2: 型チェックが通ることを確認**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: エラーなし（既存の `m.title`・`isPlaceholder`・`toUpdate` を使うだけなので新規型エラーは出ない）。

※このスクリプトの動作検証は Task 6 のドライランで行う（titleが `toUpdate` に乗ることを出力で確認）。

---

### Task 2: meta.tsv のタイトルとdescriptionを更新

**Files:**
- Modify: `deliverables/202606-shokumukeireki/meta.tsv`

- [ ] **Step 1: title（C列）とdescription（D列）を書き換える**

現状のデータ行（タブ区切り、列順 `id slug title description category jobType pref heroImage publishedAt status`）の **title** と **description** のセルのみ差し替える。`id`は`（既存のまま）`、`jobType/pref/heroImage`は`（変更なし）`/`（既存のまま）`を維持（リライト経路で温存される）。

- title セル → `施工管理の職務経歴書の書き方とサンプル｜転職で通る現場経験の伝え方`
- description セル → `施工管理の転職で通る職務経歴書の書き方を、完全サンプル付きで解説。現場経験を請負金額・統括人数・4管理の成果で数字に翻訳し、会社独自の肩書きや作業員・職人経験を採用側の言葉へ直す。悪い数字の扱いから第三者添削で仕上げるコツまで。`

- [ ] **Step 2: 列ずれが無いことを確認**

Run: `awk -F'\t' 'NR==2{print NF" 列 / title="$3}' deliverables/202606-shokumukeireki/meta.tsv`
Expected: `10 列 / title=施工管理の職務経歴書の書き方とサンプル｜転職で通る現場経験の伝え方`

---

### Task 3: 本文リード文に「転職」を織り込む

**Files:**
- Modify: `deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`（冒頭リード段落）

- [ ] **Step 1: 第1文を差し替える**

置換前（冒頭文の先頭部分）:
```
施工管理の職務経歴書で最も多い失敗は、現場経験を「担当した記録」として書いてしまうことだ。
```
置換後:
```
施工管理の転職で書類選考を通過できるかどうかは、職務経歴書の書き方でほぼ決まる。最も多い失敗は、現場経験を「担当した記録」として書いてしまうことだ。
```
（以降の「採用担当が読みたいのは…」はそのまま）

- [ ] **Step 2: 「転職」が冒頭に入ったことを確認**

Run: `head -5 deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md | grep -c "施工管理の転職で書類選考"`
Expected: `1`

---

### Task 4: 「数字に翻訳する」節末に作業員・職人クエリ対応の段落を追加

**Files:**
- Modify: `deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`（`## 現場経験を「数字」に翻訳する` セクションの末尾）

- [ ] **Step 1: セクション末尾（次のH2 `## 会社独自の「肩書き」…` の直前）に段落を挿入**

挿入する段落:
```
現場経験を「作業員」や「職人」として積んできた人も、書き方の原則は同じだ。建設作業員・とび・型枠大工といった立場での経験でも、「何人の班をまとめたか」「どの工程を任され、工期や品質にどこまで責任を持ったか」を数字と役割で書けば、施工管理に通じるマネジメント経験として翻訳できる。評価されるのは肩書きが「作業員」だったかどうかではなく、現場で実際に何を動かしたかだ。
```

- [ ] **Step 2: 該当語が本文に入ったことを確認**

Run: `grep -c "建設作業員" deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`
Expected: `1` 以上

---

### Task 5: 完全サンプル職務経歴書の節を新設（＋CTA・住み分けリンク）

**Files:**
- Modify: `deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`（`## 会社独自の「肩書き」を採用側の言葉に直す` の**直前**に新H2を挿入）

- [ ] **Step 1: 新セクションを挿入する**

挿入するMarkdown（コードフェンス内はサンプル本体。`internal-links.ts` がコードブロックを保護するため自動リンク対象外になる）:

````markdown
## そのまま使える施工管理の職務経歴書サンプル

ここまでの「数字への翻訳」を、実際の職務経歴書の形に落とし込むと次のようになる。建築系の施工管理を想定した記入例だ。自分の現場の数字に置き換えて、たたき台として使ってほしい。

```
■職務要約
ゼネコンにて建築施工管理として9年従事。RC造・S造の新築を中心に、最大で請負金額18億円・延床12,000㎡規模の現場を現場代理人として統括。職人最大40名・協力会社11社をまとめ、工程・原価・品質・安全の4管理を担当。VE提案による原価圧縮と、無事故無災害の継続を強みとする。

■職務経歴
株式会社○○建設（2017年4月〜現在）／建築施工管理・現場代理人

【現場A】2022年5月〜2024年3月
・オフィスビル新築工事（S造・地上10階・延床12,000㎡・請負18億円）
・現場代理人として職人最大40名／協力会社11社を統括
・VE提案により実行予算比で原価を4%圧縮
・天候不順による遅延を工程調整で吸収し、工期内に竣工
・労働災害ゼロを完工まで継続

【現場B】2020年1月〜2022年4月
・分譲マンション新築工事（RC造・地上14階・72戸・請負12億円）
・職長として躯体〜内装の工程・品質管理を担当
・是正指摘ゼロ、完了検査一発合格
・協力会社7社の取りまとめと月次原価会議の運営

■活かせる経験・スキル
・4管理（工程・原価・品質・安全）の一貫した実務経験
・VE提案・実行予算管理による原価低減
・施主・設計事務所・協力会社との折衝・調整
・施工図／工程表の作成（CAD・工程管理ソフト）

■保有資格
・1級建築施工管理技士（2021年取得）
・監理技術者資格者証
・第一種衛生管理者（2019年取得）
```

このサンプルの肝は、すべての現場が「請負金額・構造・規模・統括人数・成果の数字」で語られている点にある。逆に言えば、この枠を自分の現場の数字で埋めるだけで、職務経歴書は一気に伝わるものになる。自己PR欄の組み立て方は[施工管理の自己PRの書き方](/articles/sekoukan-jikopr-kakikata/)で、AIで下書きを効率化する方法は[AIで職務経歴書・自己PRを作る使い方](/articles/sekoukan-ai-shokumukeireki-jikopr/)で扱っているので、あわせて使ってほしい。

ひと通り書き上げたら、その完成度は自分では判断しづらい。どの数字を選び、どう並べれば応募先に最も刺さるかは、施工管理に特化した転職エージェントの無料添削で第三者の目を通すと、抜けや強調すべき実績が一気に見えてくる。
````

挿入位置の注意：このブロックは `## 会社独自の「肩書き」を採用側の言葉に直す` の行の直前に空行を挟んで入れる。

- [ ] **Step 2: サンプル節とリンクが入ったことを確認**

Run: `grep -c "そのまま使える施工管理の職務経歴書サンプル" deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`
Expected: `1`

Run: `grep -c "/articles/sekoukan-jikopr-kakikata/" deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`
Expected: `1`（自己PR記事への住み分けリンク）

- [ ] **Step 3: コードフェンスの対応が崩れていないことを確認**

Run: `grep -c '^```$' deliverables/202606-shokumukeireki/shokumukeireki-kakikata_rewrite.md`
Expected: 偶数（開き＝閉じが揃っている。サンプルで2つ増える）

---

### Task 6: ドライランで入稿内容を検証

**Files:**
- 変更なし（検証のみ）

- [ ] **Step 1: ドライラン実行**

Run: `npx tsx scripts/push-articles-to-sheets.ts --dir deliverables/202606-shokumukeireki`
Expected出力に以下を含む:
- `[リライト] 行… shokumukeireki-kakikata`
- `H列 body(…字)` …本文字数が旧版（約2,800字）より増えている
- `+ D列 description`
- `+ C列 title`（← Task 1の改修が効いている証拠。これが出なければ Task 1 を見直す）

- [ ] **Step 2: タイトル文字列が正しいことを確認**

Run: `npx tsx scripts/push-articles-to-sheets.ts --dir deliverables/202606-shokumukeireki 2>&1 | grep -i "title\|C列"`
Expected: 新タイトル `施工管理の職務経歴書の書き方とサンプル｜転職で通る現場経験の伝え方` が更新対象として表示される。

---

### Task 7: 原稿・スクリプトをリポジトリに保全（コミット）

**Files:**
- Commit: `scripts/push-articles-to-sheets.ts`, `deliverables/202606-shokumukeireki/*`, `docs/superpowers/specs/2026-06-27-*`, `docs/superpowers/plans/2026-06-27-*`

> ⚠️ 現在ブランチは `main`。**ユーザーの承認を得てから**実行する。デフォルトブランチ直コミットを避けるなら作業ブランチを切る。

- [ ] **Step 1: （必要なら）作業ブランチ作成**

Run: `git switch -c rewrite/shokumukeireki-kakikata`

- [ ] **Step 2: コミット**

```bash
git add scripts/push-articles-to-sheets.ts \
  deliverables/202606-shokumukeireki/ \
  docs/superpowers/specs/2026-06-27-shokumukeireki-kakikata-rewrite-design.md \
  docs/superpowers/plans/2026-06-27-shokumukeireki-kakikata-rewrite.md
git commit -m "$(cat <<'EOF'
rewrite(SEO): 施工管理 職務経歴書コラムを転職主軸＋サンプル追加でリライト

- タイトルに転職・サンプルを内包（既存inbound5本を温存するsubstring設計）
- 完全サンプル職務経歴書を新設、作業員/職人クエリ対応の段落を追加
- 入稿スクリプトのリライト経路にC列(title)更新を追加

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: 本番入稿・再ビルド・ライブ検証

**Files:**
- 変更なし（公開操作と検証）

> ⚠️ 本番Sheetsへの書き込みと公開。**ユーザーの承認を得てから**実行する（[[column-publishing-workflow]] 準拠：入稿は代行可）。

- [ ] **Step 1: 本実行（Sheetsへ書き込み）**

Run: `npx tsx scripts/push-articles-to-sheets.ts --dir deliverables/202606-shokumukeireki --commit`
Expected: `本実行` セクションで H列 body / D列 description / C列 title が更新された旨が表示される。

- [ ] **Step 2: Netlify再ビルドをトリガー**

`scripts/trigger-netlify.gs`（Apps Script）または既存のビルドフック手順で再ビルドを実行する。完了まで待つ。

- [ ] **Step 3: ライブ記事を検証**

WebFetchで `https://sekoukan-navi.com/articles/shokumukeireki-kakikata/` を取得し、以下を確認:
- `<title>`/H1 が新タイトル（…とサンプル｜転職で通る…）になっている
- 「そのまま使える施工管理の職務経歴書サンプル」セクションが存在する
- 本文に「建設作業員」「職人」が含まれる
- 自己PR記事・AI記事へのリンクが存在する

- [ ] **Step 4: inbound内部リンクが壊れていないことを確認**

WebFetchで兄弟記事 `https://sekoukan-navi.com/articles/sekoukan-jikopr-kakikata/` を取得し、本記事 `/articles/shokumukeireki-kakikata/` へのリンクが**リンクとして生きている**ことを確認（テキスト化していない＝substring温存が機能している証拠）。

- [ ] **Step 5: 効果測定を予約**

公開2〜4週間後（2026年7月下旬）に `npx tsx scripts/gsc-page-queries.ts --days 30 /articles/shokumukeireki-kakikata/` を再実行し、表示・順位・CTRの変化を評価する。メモ [[indexing-crawl-budget-diagnosis]] の測定サイクルに合わせる。

---

## Self-Review（spec照合）

- タイトル転職主軸（spec A）→ Task 2 ✅／C列更新の前提バグ修正 → Task 1 ✅
- meta description更新（spec B）→ Task 2 ✅
- リード文の転職整合（spec C）→ Task 3 ✅
- 完全サンプル新設（spec D）→ Task 5 ✅
- 作業員/職人クエリ対応（spec E）→ Task 4 ✅
- サンプル直後CTA（spec F）→ Task 5 Step 1 末尾 ✅
- 内部リンク／クロール（spec G）→ 案A'で既存5本を温存（Task 2のタイトル設計）＋Task 8 Step4で検証 ✅
- 住み分け（spec H）→ Task 5 の自己PR/AIリンク ✅
- スコープ外（雛形/工種別/NG例）→ 未着手のまま ✅

プレースホルダ・型不整合なし。`m.title`/`isPlaceholder`/`toUpdate` は既存定義を使用。
