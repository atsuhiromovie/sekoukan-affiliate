# 評判記事3本 入稿手順（2026-06）

GSC（過去3か月）で表示が付き始めていた「指名×評判KW」を獲りに行く施策の納品物。
記事はGoogle Sheetsに貼り付けて公開する。コード変更分（東京×造園深化・関連コラムセクション）は別途コミット済みでpush→Netlifyデプロイするだけ。

## 入稿するもの

| ファイル | 種別 | slug | 狙うKW（GSC現状） |
|---------|------|------|------|
| sekoukan-kyujin-navi-hyouban.md | 新規 | sekoukan-kyujin-navi-hyouban | 施工管理求人ナビ 評判（55位・記事なしで表示中） |
| mynavi-agent-sekoukan.md | 新規 | mynavi-agent-sekoukan | 施工管理マイナビエージェント（27位） |
| kensetsu-tenshoku-navi-hyouban_rewrite.md | リライト（body差し替え） | kensetsu-tenshoku-navi-hyouban | 建設転職ナビ 評判（38位） |

各記事のメタ情報（id以外）は `meta.tsv` に記載。

## 手順A：新規記事2本（求人ナビ・マイナビ）

1. Google Sheets の `articles` シートを開き、**最終行の id を確認**（例: `article-077` なら次は `article-078`、その次は `article-079`）
2. 新しい行に `meta.tsv` の該当行の各列を入力する。`id` 列の「（要採番）」は手順1で決めた連番に置き換える
3. **body セルの貼り付けが最重要**：
   - body セルを**ダブルクリックして編集モードにしてから**、対応する `.md` ファイルの全文をコピーして貼り付ける
   - ⚠️ 編集モードにせずに貼ると改行ごとに別の行へ分割されてしまう。必ずセル編集モードで貼ること
4. `status` 列が `published` になっていることを確認

## 手順B：リライト1本（建設転職ナビ）

1. `articles` シートで `slug = kensetsu-tenshoku-navi-hyouban` の行を探す
2. その行の **body セルだけ**をダブルクリック → 全選択して削除 → `kensetsu-tenshoku-navi-hyouban_rewrite.md` の全文を貼り付け
3. `id` `slug` `publishedAt` は**変更しない**（既に検索評価が付いているため）
4. title は現行と同じなので変更不要。description は `meta.tsv` の値で更新してよい（任意）

## 反映（公開）

1. 貼り付け後、Netlify のビルドをトリガー（GASの自動トリガー or Netlify管理画面から手動 Deploy）
2. 反映後、https://sekoukan-navi.com/articles/ に新記事2本が出ていることを確認
3. Google Search Console で新記事2本のURLを「URL検査」→「インデックス登録をリクエスト」
   - https://sekoukan-navi.com/articles/sekoukan-kyujin-navi-hyouban/
   - https://sekoukan-navi.com/articles/mynavi-agent-sekoukan/
4. リライトした建設転職ナビの記事も同様にURL検査でインデックス再リクエストしておくと再評価が早まる

## コード変更分（記事とは別、push待ち）

このブランチ（main）に以下のコミットが入っている。push すると Netlify が自動デプロイする。
- 東京×造園コンテンツの区レベル深化（/tokyo/landscaping/ 等）— GSCの「東京 造園施工管理 求人」「新宿 造園」対応
- 都道府県×工種ページに「関連コラム」セクション追加 — 記事↔地域ページの内部リンク（記事をSheetsに入れた後に効く）

```bash
cd /Users/yotsutsujiatsuhiro/claudecode/sekoukan-affiliate
git push    # → Netlify自動デプロイ
```

## 内部リンクについて

記事本文中の `（内部リンク：…）` は、ビルド時に既存記事タイトルへの実リンクに自動変換される（lib/internal-links.ts）。
3本は相互に・既存の比較記事にリンクするよう設計済み。リンク先記事が公開されていれば自動でリンク化される。

## 体験談の追記（任意・推奨）

新規記事2本は「編集部調査」のスタンスで執筆している（使っていないサービスの体験談は創作しないため）。
実際にサービスを利用した体験があれば、各記事の「良い評判・口コミ」セクションの直前に体験談を追記すると、
GoogleのE-E-A-T評価が大きく強化される。その場合は同じく body セルを編集モードで開いて加筆する。

## 効果測定（公開から4〜6週間後にGSCで確認）

| 指標 | 現状 | 目標 |
|------|------|------|
| 「施工管理求人ナビ 評判」 | 55位（記事なし） | 記事のインデックスと順位獲得 |
| 「施工管理マイナビエージェント」 | 27位 | 10〜20位 |
| 「建設転職ナビ 評判」 | 38位 | 改善 |
| 「東京 造園施工管理 求人」 | 31位 | 20位以内 |
| /tokyo/landscaping/ 表示回数 | 71回/3か月 | 増加 |
