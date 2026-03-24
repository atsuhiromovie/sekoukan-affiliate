# 施工管理特化型アフィリエイト量産システム
## セットアップガイド（エンジニア向け）

---

## 📁 ディレクトリ構成

```
sekoukan-affiliate/
├── app/
│   ├── layout.tsx              # グローバルレイアウト・ヘッダー・フッター
│   ├── page.tsx                # トップページ（都道府県×工種一覧）
│   ├── globals.css             # グローバルCSS（Tailwind）
│   ├── [pref]/
│   │   ├── page.tsx            # 都道府県TOPページ（47ページ）
│   │   └── [job_type]/
│   │       └── page.tsx        # 都道府県×工種ページ（235ページ）★収益の核心
├── components/
│   ├── ComparisonTable.tsx     # 比較表コンポーネント（アフィリエイトリンク）
│   ├── FAQSection.tsx          # FAQ（アコーディオン）
│   └── StructuredData.tsx      # JSON-LD構造化データ
├── lib/
│   ├── types.ts                # TypeScript型定義
│   ├── constants.ts            # 47都道府県・5工種マスターデータ
│   └── sheets.ts               # Google Sheets API連携
├── scripts/
│   └── trigger-netlify.gs      # Google Apps Script（自動ビルドトリガー）
├── .env.example                # 環境変数テンプレート
├── netlify.toml                # Netlify設定
├── next.config.js              # Next.js設定（SSG output: 'export'）
├── next-sitemap.config.js      # サイトマップ自動生成設定
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

---

## 🚀 初回セットアップ手順

### 1. リポジトリ準備

```bash
cd sekoukan-affiliate
npm install
```

### 2. 環境変数設定

```bash
cp .env.example .env.local
# .env.local を編集して各値を入力
```

### 3. ローカル確認（フォールバックデータで動作）

```bash
npm run dev
# → http://localhost:3000 でプレビュー
```

### 4. ビルドテスト

```bash
npm run build
# → /out ディレクトリに283ページ（235+47+1）が生成される
```

---

## 📊 Googleスプレッドシート設定

スプレッドシートは以下の **3シート構成** で作成してください。

### シート①: `affiliate_items`（アフィリエイト案件）

| 列 | カラム名 | 例 |
|----|---------|-----|
| A | id | genkyi |
| B | name | 現キャリ |
| C | tagline | 建設・施工管理に特化した転職エージェント |
| D | features | 建設業界専門｜年収100万UP実績｜Web面談可（`|`区切り） |
| E | regions | all（または `shiga|osaka|kyoto` など） |
| F | jobTypes | all（または `architecture|civil` など） |
| G | url | https://px.a8.net/... ← **ASPのリンクをここに** |
| H | badge | おすすめNo.1（任意） |
| I | minSalaryUp | 100（任意・万円） |
| J | isRecommended | TRUE（比較表の強調表示用） |

### シート②: `pref_salary`（都道府県×工種別年収上書き）

| 列 | カラム名 | 例 |
|----|---------|-----|
| A | pref_id | shiga |
| B | job_type_id | architecture |
| C | avg_salary | 490 |

※ このシートに記載がない組み合わせはマスターデータの値が使われます。

### シート③: `faqs`（FAQ上書き）

| 列 | カラム名 | 例 |
|----|---------|-----|
| A | pref_id | osaka |
| B | job_type_id | electrical |
| C | question | 大阪で電気工事施工管理の年収を上げるには？ |
| D | answer | 大阪では... |

※ 記載がない組み合わせは自動生成FAQが使われます。

---

## ☁️ Netlify デプロイ設定

### 1. GitHubリポジトリを作成してpush

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/yourname/sekoukan-affiliate.git
git push -u origin main
```

### 2. Netlifyで新サイト作成

1. https://app.netlify.com → **Add new site → Import an existing project**
2. GitHubリポジトリを選択
3. ビルド設定は `netlify.toml` が自動読み込み（変更不要）
4. **Environment variables** に以下を設定：
   - `GOOGLE_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_API_KEY`
   - `SITE_URL`（例: `https://sekoukan-agent.netlify.app`）

### 3. Build Hook の作成（スプレッドシート連携用）

1. Netlifyダッシュボード → **Site configuration → Build hooks**
2. **Add build hook** → 名前: `Google Sheets Trigger` → ブランチ: `main`
3. 生成されたURLをコピー（例: `https://api.netlify.com/build_hooks/xxxx`）

### 4. Google Apps Script の設定

1. スプレッドシートのメニュー → **拡張機能 → Apps Script**
2. `scripts/trigger-netlify.gs` の内容を貼り付け
3. `NETLIFY_BUILD_HOOK_URL` に手順3のURLを入力
4. **トリガーを設定** → `onSheetEdit` 関数 → イベント: **スプレッドシートの編集時**
5. Googleアカウントの権限承認を完了

これで **スプレッドシートを保存するたびに自動でNetlifyがビルド・デプロイ** されます。

---

## 📈 SEO・サイトマップ

ビルド時に `next-sitemap` が自動実行され、`/out/sitemap.xml` と `/out/robots.txt` が生成されます。

### Google Search Console への登録

1. https://search.google.com/search-console
2. サイトURLを追加
3. `sitemap.xml` を登録（例: `https://sekoukan-agent.netlify.app/sitemap.xml`）

---

## 🏗️ 生成ページ数の確認

```bash
npm run build 2>&1 | grep "pages"
# 期待値: 283 static pages (1 top + 47 pref + 235 pref×job_type)
```

---

## ⚡ パフォーマンス最適化チェックリスト

- [x] `output: 'export'` → 完全静的HTML（サーバーサイド処理なし）
- [x] Tailwind CSS の未使用スタイル自動パージ
- [x] Google Fonts は `display=swap` で非同期読み込み
- [x] Netlify CDN キャッシュ設定（`netlify.toml`）
- [ ] 画像追加時は `<img loading="lazy" decoding="async">` を付与すること
- [ ] Google PageSpeed Insights でLCP 1.2s以内を確認

---

## 🔧 よくある操作（非エンジニア向け）

### アフィリエイトリンクの変更
→ スプレッドシートの `affiliate_items` シートの **G列（url）** を書き換えて保存

### 年収データの修正
→ `pref_salary` シートに `都道府県ID | 工種ID | 年収（万円）` を追加して保存

### FAQのカスタマイズ
→ `faqs` シートに追加（ない組み合わせは自動生成FAQが使われる）

### 新しい案件の追加
→ `affiliate_items` に新しい行を追加して保存

**保存後、約2〜4分でNetlifyが自動ビルド・デプロイされます。**

---

## ⚠️ 注意事項・確信度の低い点

| 項目 | 確信度 | 備考 |
|------|--------|------|
| Google Sheets APIのキークォータ | 80% | 無料枠: 読み取り300回/分。235ページビルドでも通常は問題ない |
| LCP 1.2s達成 | 80% | 画像を追加する場合はWebP形式+lazyload必須 |
| JSON-LDスキーマの最新準拠 | 78% | Google公式ドキュメントで定期確認推奨 |
| Netlify無料プランのビルド分数 | 75% | 月300分の無料枠。毎日自動ビルドすると約20ページ/月。**有料プランへの移行を検討** |
