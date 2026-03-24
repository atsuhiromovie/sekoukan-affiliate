/**
 * Google Apps Script: Netlify Build Hook トリガー
 * ========================================================
 * 使い方:
 * 1. Googleスプレッドシートのメニュー「拡張機能」→「Apps Script」を開く
 * 2. このコードを貼り付ける
 * 3. NETLIFY_BUILD_HOOK_URL に Netlify で生成したURLを設定
 * 4. 「トリガーを設定」から onEdit または 時間ベースのトリガーを設定
 * ========================================================
 */

// ===== Netlify Build Hook URL =====
// Netlify: Site configuration → Build hooks → "Google Sheets Trigger" で生成
const NETLIFY_BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/ここにIDを入れる';

// ===== デバウンス用プロパティキー =====
const DEBOUNCE_KEY = 'lastBuildTriggered';
const DEBOUNCE_MINUTES = 10; // 10分以内の連続編集は1回だけビルド

/**
 * スプレッドシート編集時に自動呼び出されるトリガー関数
 * 「編集時」トリガーに設定してください
 */
function onSheetEdit(e) {
  // 変更されたシートが対象シートか確認
  const targetSheets = ['affiliate_items', 'pref_salary', 'faqs'];
  const sheetName = e.source.getActiveSheet().getName();

  if (!targetSheets.includes(sheetName)) {
    console.log(`シート "${sheetName}" は対象外です。スキップ。`);
    return;
  }

  // デバウンス処理（短時間の連続編集でビルドが連発しないよう制御）
  const props = PropertiesService.getScriptProperties();
  const lastBuild = props.getProperty(DEBOUNCE_KEY);
  const now = new Date();

  if (lastBuild) {
    const lastBuildDate = new Date(lastBuild);
    const diffMinutes = (now - lastBuildDate) / (1000 * 60);
    if (diffMinutes < DEBOUNCE_MINUTES) {
      console.log(`前回ビルドから ${diffMinutes.toFixed(1)}分。デバウンス中（${DEBOUNCE_MINUTES}分待機）`);
      return;
    }
  }

  // Netlify Build Hook を呼び出し
  triggerNetlifyBuild();
  props.setProperty(DEBOUNCE_KEY, now.toISOString());
}

/**
 * Netlify Build Hook を呼び出す
 */
function triggerNetlifyBuild() {
  try {
    const response = UrlFetchApp.fetch(NETLIFY_BUILD_HOOK_URL, {
      method: 'POST',
      payload: '',
      muteHttpExceptions: true,
    });

    const statusCode = response.getResponseCode();

    if (statusCode === 200 || statusCode === 201) {
      console.log('✅ Netlify ビルドを正常にトリガーしました');
      // ビルド通知をスプレッドシートに記録（オプション）
      logBuildHistory('SUCCESS');
    } else {
      console.error(`❌ Netlify Build Hook エラー: HTTP ${statusCode}`);
      logBuildHistory('ERROR: HTTP ' + statusCode);
    }
  } catch (error) {
    console.error('❌ Build Hook 呼び出しエラー:', error.message);
    logBuildHistory('ERROR: ' + error.message);
  }
}

/**
 * ビルド履歴をスプレッドシートの "build_log" シートに記録
 * シートが存在しない場合は自動作成
 */
function logBuildHistory(status) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName('build_log');

    if (!logSheet) {
      logSheet = ss.insertSheet('build_log');
      logSheet.appendRow(['日時', 'ステータス', '備考']);
    }

    logSheet.appendRow([
      new Date().toLocaleString('ja-JP'),
      status,
      'Sheets自動トリガー',
    ]);
  } catch (e) {
    // ログ記録の失敗はメイン処理に影響させない
    console.warn('ビルドログ記録失敗:', e.message);
  }
}

/**
 * 手動でビルドをトリガーするテスト関数
 * Apps Scriptエディタから直接実行して動作確認できる
 */
function manualTriggerTest() {
  console.log('手動ビルドトリガーを実行します...');
  triggerNetlifyBuild();
}
