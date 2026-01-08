# Issue #56 解決策: AIエージェントのハルシネーション防止 - 現実計測手法の体系化

## 問題の概要

Issue #46において、AIエージェントが実際の問題を計測せずにハルシネーション（幻覚）による解決策を提案し、対応に失敗しました。本ドキュメントでは、このような失敗を防ぐため、**人力で現実を計測する場合の手法を洗い出して整理**します。

## Issue #46の失敗事例分析

### 発生した問題

**現象**: abcjsのコンテナが表示されず、スーパーリロード（Ctrl+Shift+R）で表示される

### エージェントが行った誤った対応

1. **実際の動作確認なし**: ブラウザでの実際の挙動を確認せずに推測
2. **コンソールログ未確認**: ブラウザの開発者ツールでエラーを確認していない
3. **タイミング問題の推測のみ**: 実際のスクリプト読み込み順序を計測していない
4. **テスト実行なし**: Playwrightなどの自動テストで問題を再現していない

### 正しいアプローチとは

実際の動作を**計測**し、**データに基づいて**問題を特定すべきでした：

1. ブラウザで実際の挙動を確認
2. 開発者ツールでエラーメッセージを確認
3. ネットワークタブでスクリプトの読み込み順序を確認
4. コンソールログでタイミングを計測
5. Playwrightテストで問題を再現

## 現実計測手法の体系

本セクションでは、フロントエンドの問題を**人力で計測する**ための具体的な手法を体系化します。

---

## 1. ブラウザベースの計測手法

### 1.1 開発者ツールの活用

#### コンソールタブ

**目的**: エラーメッセージ、警告、ログの確認

**手順**:
```
1. ブラウザでF12キーを押す（または右クリック→「検証」）
2. Consoleタブを選択
3. ページをリロード（Ctrl+R）
4. エラーメッセージ（赤色）を確認
5. 警告メッセージ（黄色）を確認
```

**記録すべき情報**:
- ✅ エラーメッセージの全文
- ✅ エラーが発生したファイル名と行番号
- ✅ スタックトレース
- ✅ エラーが発生したタイミング（ページロード直後、ユーザー操作後など）

**Issue #46での適用例**:
```
Uncaught SyntaxError: Unexpected token '>' (at example.html:258:28)
```
→ このエラーから、`&gt;`がHTMLエンティティとしてエスケープされていることが判明

#### ネットワークタブ

**目的**: リソースの読み込み順序、タイミング、ステータスの確認

**手順**:
```
1. 開発者ツールでNetworkタブを選択
2. 「Preserve log」をチェック
3. ページをリロード
4. すべてのリクエストの順序と時間を確認
5. 失敗したリクエスト（赤色）を確認
```

**記録すべき情報**:
- ✅ 各スクリプトの読み込み開始時間
- ✅ 各スクリプトの読み込み完了時間
- ✅ スクリプトの読み込み順序
- ✅ HTTPステータスコード（200, 404, 500など）
- ✅ キャッシュの有無（Size列で「from cache」の確認）

**Issue #46での適用例**:
- ABCJSライブラリの読み込みタイミング
- インラインスクリプトの実行タイミング
- キャッシュの影響でスーパーリロード時の挙動が変わる

#### Elementsタブ

**目的**: DOMの状態、スタイルの確認

**手順**:
```
1. 開発者ツールでElementsタブを選択
2. 対象の要素を検索（Ctrl+F）
3. 要素のHTML構造を確認
4. 要素のスタイルを確認（右側のStylesパネル）
5. 計算済みスタイルを確認（Computedタブ）
```

**記録すべき情報**:
- ✅ 要素が存在するか
- ✅ 要素の属性値（`data-*`属性など）
- ✅ 要素のサイズ（width, height）
- ✅ 要素の表示状態（display, visibility）
- ✅ 子要素の有無（SVGが挿入されているかなど）

**Issue #46での適用例**:
- `.abc-notation` divが存在するか
- SVG要素が挿入されているか
- `data-mml`属性の値が正しいか

#### Sourcesタブ（デバッガー）

**目的**: JavaScriptのステップ実行、変数の確認

**手順**:
```
1. 開発者ツールでSourcesタブを選択
2. 対象のJavaScriptファイルを開く
3. ブレークポイントを設定（行番号をクリック）
4. ページをリロード
5. 実行が停止したら、変数の値を確認（Scopeパネル）
6. ステップ実行（F10: 次の行、F11: 関数に入る）
```

**記録すべき情報**:
- ✅ ブレークポイントで停止した時点の変数値
- ✅ 条件分岐の実際の経路
- ✅ 関数が呼ばれた回数
- ✅ エラーが発生する直前の状態

**Issue #46での適用例**:
```javascript
// ブレークポイント設定箇所
if (typeof ABCJS === 'undefined') {
  console.error('ABCJS library not loaded');
  return;
}
```
→ `ABCJS`の値を確認して、ライブラリが読み込まれているか確認

### 1.2 コンソールでの動的な確認

#### 変数の確認

**手順**:
```javascript
// グローバル変数の確認
console.log('ABCJS:', typeof ABCJS, ABCJS);

// DOM要素の確認
console.log('Elements:', document.querySelectorAll('.abc-notation'));

// 要素のサイズ確認
const elem = document.querySelector('.abc-notation');
console.log('Size:', elem.offsetWidth, elem.offsetHeight);
```

#### タイミングの計測

**手順**:
```javascript
// 特定のコードブロックの実行時間を計測
console.time('rendering');
// ... レンダリング処理
console.timeEnd('rendering');

// タイムスタンプの記録
console.log('Script loaded at:', new Date().toISOString());
```

### 1.3 スーパーリロードの活用

**目的**: キャッシュの影響を排除して問題を確認

**手順**:
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**確認すべきこと**:
- ✅ 通常のリロードで問題が発生するか
- ✅ スーパーリロードで問題が解決するか
- ✅ 上記の違いがある場合、キャッシュが原因の可能性が高い

**Issue #46での適用例**:
- スーパーリロードで表示される → キャッシュまたはスクリプトの読み込み順序が原因

---

## 2. 自動テストを使った計測手法

### 2.1 Playwrightによるブラウザテスト

**目的**: 実際のブラウザでの動作を自動で検証

#### 基本的なテストパターン

```typescript
import { test, expect } from '@playwright/test';

test('should display ABC notation', async ({ page }) => {
  // 1. ページを開く
  await page.goto('http://localhost:3000/test-page');
  
  // 2. 要素が表示されるまで待機
  await page.waitForSelector('.abc-notation', { timeout: 5000 });
  
  // 3. 要素の存在を確認
  const notation = await page.locator('.abc-notation');
  await expect(notation).toBeVisible();
  
  // 4. SVGが生成されているか確認
  const svg = await notation.locator('svg');
  await expect(svg).toBeVisible();
  
  // 5. スクリーンショットを撮影
  await page.screenshot({ path: 'result.png' });
});
```

#### コンソールエラーのキャプチャ

```typescript
test('should not have console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  
  // コンソールエラーをキャプチャ
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3000/test-page');
  await page.waitForTimeout(2000);
  
  // エラーがないことを確認
  expect(consoleErrors).toHaveLength(0);
  
  // エラーがある場合は内容を表示
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  }
});
```

#### ネットワークリクエストの監視

```typescript
test('should load ABCJS library', async ({ page }) => {
  let abcjsLoaded = false;
  
  // ネットワークリクエストを監視
  page.on('response', response => {
    if (response.url().includes('abcjs')) {
      abcjsLoaded = true;
      console.log('ABCJS loaded from:', response.url());
      console.log('Status:', response.status());
    }
  });
  
  await page.goto('http://localhost:3000/test-page');
  await page.waitForTimeout(2000);
  
  expect(abcjsLoaded).toBe(true);
});
```

#### タイミングの計測

```typescript
test('should measure rendering time', async ({ page }) => {
  await page.goto('http://localhost:3000/test-page');
  
  // JavaScriptでタイミングを計測
  const renderTime = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const start = performance.now();
      
      // レンダリング完了を待つ
      const observer = new MutationObserver(() => {
        const svg = document.querySelector('.abc-notation svg');
        if (svg) {
          const end = performance.now();
          observer.disconnect();
          resolve(end - start);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  });
  
  console.log('Render time:', renderTime, 'ms');
  expect(renderTime).toBeLessThan(1000); // 1秒以内
});
```

### 2.2 ユニットテストによるロジック検証

**目的**: 変換ロジックの正確性を検証

```typescript
import { test, expect } from 'vitest';
import { MMLABCTransformer } from './index';

test('should transform MML code block', () => {
  const plugin = MMLABCTransformer({ enableMML: true });
  const transformer = plugin.markdownPlugins!()[0]();
  
  const tree = {
    type: 'root',
    children: [{
      type: 'code',
      lang: 'mml',
      value: 'cdefgab'
    }]
  };
  
  // 変換を実行
  transformer(tree, null);
  
  // 結果を検証
  expect(tree.children[0].type).toBe('html');
  expect(tree.children[0].value).toContain('data-mml');
  expect(tree.children[0].value).toContain('abc-notation');
});
```

---

## 3. デバッグツールとロギング手法

### 3.1 戦略的なコンソールログの配置

#### タイミングのログ

```javascript
console.log('[1] Script start:', new Date().toISOString());

document.addEventListener('DOMContentLoaded', () => {
  console.log('[2] DOMContentLoaded:', new Date().toISOString());
});

window.addEventListener('load', () => {
  console.log('[3] Window load:', new Date().toISOString());
});

console.log('[4] Script end:', new Date().toISOString());
```

#### 変数の状態ログ

```javascript
console.log('[DEBUG] ABCJS:', {
  exists: typeof ABCJS !== 'undefined',
  version: typeof ABCJS !== 'undefined' ? ABCJS.signature : 'N/A',
  methods: typeof ABCJS !== 'undefined' ? Object.keys(ABCJS) : []
});
```

#### 条件分岐のログ

```javascript
if (attempts >= maxAttempts) {
  console.error('[ERROR] Max attempts reached:', {
    attempts,
    maxAttempts,
    abcjsLoaded: typeof ABCJS !== 'undefined'
  });
  return;
} else {
  console.log('[DEBUG] Retry attempt:', attempts);
}
```

### 3.2 エラーハンドリングの強化

```javascript
try {
  // 危険な操作
  ABCJS.renderAbc(element, abcCode);
} catch (error) {
  console.error('[ERROR] Render failed:', {
    error: error.message,
    stack: error.stack,
    abcCode: abcCode,
    elementId: element.id
  });
}
```

---

## 4. タイミングと実行順序の計測手法

### 4.1 スクリプトの読み込み順序の確認

#### Performance APIの活用

```javascript
// ページロード後に実行
window.addEventListener('load', () => {
  const resources = performance.getEntriesByType('resource');
  
  resources.forEach(resource => {
    if (resource.name.includes('.js')) {
      console.log('Script:', {
        name: resource.name,
        startTime: resource.startTime,
        duration: resource.duration,
        transferSize: resource.transferSize
      });
    }
  });
});
```

#### MutationObserverによるDOM変更の監視

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'SVG') {
          console.log('[OBSERVER] SVG added at:', new Date().toISOString());
          console.log('[OBSERVER] Parent:', mutation.target);
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### 4.2 非同期処理のデバッグ

```javascript
// Promise の状態をログ
const waitForABCJS = function(maxAttempts = 50, delay = 100) {
  console.log('[WAIT] Starting ABCJS wait:', { maxAttempts, delay });
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkABCJS = function() {
      attempts++;
      console.log(`[WAIT] Attempt ${attempts}/${maxAttempts}`);
      
      if (typeof ABCJS !== 'undefined') {
        console.log('[WAIT] ABCJS found!');
        resolve();
      } else if (attempts >= maxAttempts) {
        console.error('[WAIT] ABCJS not found after max attempts');
        reject(new Error('ABCJS library failed to load'));
      } else {
        console.log('[WAIT] ABCJS not found, retrying...');
        setTimeout(checkABCJS, delay);
      }
    };
    
    checkABCJS();
  });
};
```

---

## 5. 実践的なワークフロー

### 5.1 問題発生時の標準調査手順

```
ステップ1: 問題の再現
  □ ブラウザで実際にページを開く
  □ 問題が再現するか確認
  □ スーパーリロードで挙動が変わるか確認

ステップ2: エラーの確認
  □ 開発者ツールのConsoleタブを開く
  □ エラーメッセージを記録
  □ エラーが発生したファイル名と行番号を記録
  □ スタックトレースを記録

ステップ3: リソースの確認
  □ Networkタブで全リソースの読み込み状況を確認
  □ 失敗しているリクエストがないか確認
  □ スクリプトの読み込み順序を記録
  □ キャッシュの影響を確認

ステップ4: DOMの確認
  □ Elementsタブで対象要素の存在を確認
  □ 要素の属性値を確認
  □ 要素のサイズとスタイルを確認
  □ 子要素（SVGなど）の有無を確認

ステップ5: JavaScriptのデバッグ
  □ Sourcesタブでブレークポイントを設定
  □ ページをリロード
  □ 変数の値を確認
  □ 条件分岐の経路を確認

ステップ6: ログの追加
  □ 戦略的な位置にconsole.logを追加
  □ タイミングを計測
  □ 変数の状態をログ
  □ 条件分岐をログ

ステップ7: 自動テストの作成
  □ Playwrightテストで問題を再現
  □ コンソールエラーをキャプチャ
  □ スクリーンショットを撮影
  □ タイミングを計測

ステップ8: 仮説の検証
  □ 問題の原因について仮説を立てる
  □ 仮説を検証する最小限の変更を行う
  □ 変更後の挙動を確認
  □ 自動テストで検証
```

### 5.2 計測結果の記録フォーマット

問題を記録する際は、以下の情報を含めることを推奨します：

```markdown
## 計測結果

### 環境
- ブラウザ: Chrome 120.0.6099.109
- OS: Windows 11
- 日時: 2026-01-08 14:00:00

### 再現手順
1. ページを開く: http://localhost:3000/test-page
2. 開発者ツールを開く（F12）
3. Consoleタブを選択
4. ページをリロード（Ctrl+R）

### 観測結果

#### コンソールエラー
\`\`\`
Uncaught SyntaxError: Unexpected token '>' (at example.html:258:28)
\`\`\`

#### ネットワークタイミング
| リソース | 開始時間 | 完了時間 | ステータス |
|----------|----------|----------|-----------|
| abcjs-basic-min.js | 120ms | 450ms | 200 OK |
| inline-script | 50ms | 60ms | - |

#### DOM状態
- `.abc-notation`要素: 存在する
- SVG要素: 存在しない
- `data-mml`属性: `"cdefgab"`

#### 変数の状態
\`\`\`javascript
console.log('ABCJS:', typeof ABCJS);
// 出力: "undefined"
\`\`\`

### 結論
インラインスクリプトがABCJSライブラリより先に実行されているため、
`typeof ABCJS === 'undefined'` となり、処理が中断している。
```

---

## 6. Issue #46に適用した場合の理想的な調査プロセス

Issue #46の問題を正しく調査する場合、以下の手順で進めるべきでした：

### 1. 初期調査（5分）

```
□ demo.htmlをブラウザで開く
□ 開発者ツールのConsoleタブを確認
□ エラーメッセージを記録: "Unexpected token '>'"
□ Elementsタブで.abc-notation要素の存在を確認
```

### 2. エラー原因の特定（10分）

```
□ エラーが発生した行番号を確認
□ Sourcesタブで該当するコードを表示
□ コード内で `&gt;=` のような文字列を発見
□ HTMLエンティティがエスケープされていることを特定
```

### 3. 根本原因の分析（10分）

```
□ Quartzがどのようにインラインスクリプトを処理するか調査
□ externalResources()の実装を確認
□ 他のQuartzプラグインでの対処方法を調査
□ CDATAセクションという標準的な解決策を発見
```

### 4. 解決策の実装と検証（15分）

```
□ src/index.tsに`//<![CDATA[`と`//]]>`を追加
□ npm run buildでビルド
□ demo.htmlで動作確認
□ Consoleにエラーが出ないことを確認
□ SVGが正しく表示されることを確認
```

### 5. テストによる検証（10分）

```
□ npm testでユニットテストを実行
□ 既存テストが全てパスすることを確認
□ 必要に応じてPlaywrightテストを追加
```

**合計所要時間**: 約50分

**実際のエージェントの対応**: ハルシネーションにより数時間を浪費

---

## 7. まとめ：ハルシネーション防止のための原則

### 原則1: 推測より計測

❌ 悪い例:
```
「スクリプトの読み込みタイミングが問題だと思われる」
→ 根拠なく`setTimeout`を追加
```

✅ 良い例:
```
「Networkタブで確認した結果、abcjs-basic-min.jsが450ms、
 インラインスクリプトが60msで読み込まれており、
 インラインスクリプトが先に実行されている」
→ waitForABCJS()関数を追加
```

### 原則2: エラーメッセージを軽視しない

❌ 悪い例:
```
「エラーメッセージは無視して、とりあえずコードを修正しよう」
```

✅ 良い例:
```
「"Unexpected token '>'"というエラーから、
 HTMLエンティティのエスケープ問題であることが明確」
→ CDATAセクションで解決
```

### 原則3: 実際のブラウザで確認

❌ 悪い例:
```
「理論上は動くはず」
→ コードレビューのみで終了
```

✅ 良い例:
```
「demo.htmlで実際に動作確認した」
→ 問題が解決していることを視覚的に確認
```

### 原則4: 自動テストで検証

❌ 悪い例:
```
「一度動いたからOK」
→ 手動テストのみ
```

✅ 良い例:
```
「Playwrightテストで継続的に検証」
→ 問題の再発を防止
```

### 原則5: データを記録する

❌ 悪い例:
```
「問題が解決した」
→ 何が問題だったか記録なし
```

✅ 良い例:
```
「issue-notes/46-solution.mdに詳細を記録」
→ 将来の参考資料として活用可能
```

---

## 8. 推奨ツールとリソース

### ブラウザ開発者ツール

- **Chrome DevTools**: 最も包括的な開発者ツール
- **Firefox Developer Tools**: CSSグリッドのデバッグに優れる
- **Safari Web Inspector**: iOS/macOSでの問題調査に必須

### 自動テストフレームワーク

- **Playwright**: クロスブラウザの自動テスト
- **Vitest**: 高速なユニットテスト
- **Jest**: 豊富なエコシステム

### パフォーマンス計測

- **Performance API**: ブラウザ標準のパフォーマンス計測API
- **Lighthouse**: Webパフォーマンスの包括的な分析
- **WebPageTest**: 実環境でのパフォーマンス計測

### デバッグツール

- **Console API**: `console.log`, `console.time`, `console.trace`
- **Debugger API**: `debugger;` ステートメント
- **Source Maps**: TypeScriptなどのデバッグに必須

---

## 9. 参考資料

### ブラウザ開発者ツール

- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Firefox Developer Tools](https://firefox-source-docs.mozilla.org/devtools-user/)
- [Safari Web Inspector Guide](https://webkit.org/web-inspector/)

### テストフレームワーク

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

### パフォーマンス計測

- [Performance API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Web Performance Best Practices](https://web.dev/performance/)

### デバッグ技術

- [JavaScript Debugging Reference](https://developer.chrome.com/docs/devtools/javascript/)
- [Console API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Console)

---

## 10. このドキュメントの活用方法

### 問題発生時

1. **セクション5.1**の「標準調査手順」に従って調査を進める
2. 各ステップで**計測結果を記録**する
3. **セクション5.2**のフォーマットで記録する

### レビュー時

1. **原則1-5**に従って対応しているか確認
2. **実際の計測データ**があるか確認
3. **自動テスト**があるか確認

### ドキュメント化時

1. **issue-notes/**に解決策ドキュメントを作成
2. **計測結果**を含める
3. **将来の参考**となるように詳細に記録

---

## 関連Issue

- [Issue #56](https://github.com/cat2151/quartz-transformer-mmlabc/issues/56) - 本ドキュメントの作成Issue
- [Issue #46](https://github.com/cat2151/quartz-transformer-mmlabc/issues/46) - エージェントのハルシネーション事例
- [Issue #46 Solution](https://github.com/cat2151/quartz-transformer-mmlabc/blob/main/issue-notes/46-solution.md) - 解決策の詳細

## 実装日

2026-01-08

## 実装者

Copilot (GitHub Copilot Coding Agent)
