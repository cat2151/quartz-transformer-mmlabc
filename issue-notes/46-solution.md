# Issue #46 解決策: abcjsコンテナの表示タイミング問題

## 問題の概要

**現象**: abcjsのコンテナあるいは中身が表示されず、スーパーリロード（Ctrl+Shift+R）で表示される

## 根本原因の分析

### 1. ABCJSライブラリの読み込みタイミング競合

外部スクリプトとインラインスクリプトの両方が`afterDOMReady`で読み込まれるため、実行順序が保証されない：

```javascript
// externalResources() の設定
js: [
  {
    src: "https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js",
    loadTime: "afterDOMReady",  // ← 外部スクリプト
    contentType: "external",
  },
  {
    loadTime: "afterDOMReady",  // ← インラインスクリプト
    contentType: "inline",
    script: `...`
  }
]
```

**問題点**:
- ブラウザによっては、インラインスクリプトが先に実行される
- ABCJSが未定義の状態で`typeof ABCJS === 'undefined'`チェックが行われ、処理が中断
- スーパーリロードではキャッシュが無効化され、読み込み順序が変わることで動作する場合がある

### 2. レイアウト計算のタイミング

`element.offsetWidth`を取得する時点でブラウザのレイアウト計算が完了していない：

```javascript
// 問題のあるコード
const containerWidth = element.offsetWidth || element.clientWidth || 600;
```

**問題点**:
- `afterDOMReady`直後はDOMは存在するが、レイアウト計算が未完了の可能性
- `offsetWidth`が0を返し、五線譜の幅計算が不正確になる

## 実装した解決策

### 1. ABCJSライブラリの確実な読み込み待機

リトライ機能付きの非同期待機ロジックを実装：

```typescript
const waitForABCJS = function(maxAttempts = 50, delay = 100) {
  return new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const checkABCJS = function() {
      attempts++;
      if (typeof ABCJS !== 'undefined') {
        resolve(undefined);
      } else if (attempts >= maxAttempts) {
        reject(new Error('ABCJS library failed to load after ' + maxAttempts + ' attempts'));
      } else {
        setTimeout(checkABCJS, delay);
      }
    };
    checkABCJS();
  });
};

// 使用例
try {
  await waitForABCJS();
} catch (error) {
  console.error('ABCJS library not loaded:', error);
  return;
}
```

**特徴**:
- 最大50回（5秒間）のリトライ
- 100msごとにABCJSの存在をチェック
- タイムアウト時に適切なエラーメッセージ
- `Promise<void>`で型安全性を確保

### 2. レイアウト完了の確実な待機

2段階の待機処理を実装：

```javascript
// Stage 1: 次のイベントループまで待機
await new Promise(resolve => setTimeout(resolve, 0));

let containerWidth = element.offsetWidth || element.clientWidth;

// Stage 2: サイズが0の場合は追加で待機
if (!containerWidth || containerWidth === 0) {
  await new Promise(resolve => setTimeout(resolve, 50));
  containerWidth = element.offsetWidth || element.clientWidth || 600;
}
```

**動作フロー**:
1. `setTimeout(0)`でマクロタスクを作成し、その前にマイクロタスクが完了しブラウザのレンダリングが発生する機会を与える
2. レイアウト情報の取得を試行
3. サイズが0の場合は50ms追加で待機（レンダリング完了を待つ）
4. それでも失敗する場合はデフォルト値600pxを使用

## 技術的な詳細

### なぜ`setTimeout(0)`が必要か

JavaScriptのイベントループの仕組みにより：

1. **同期コード** → **マイクロタスク** → **レンダリング** → **マクロタスク**

`setTimeout(0)`はマクロタスクとしてキューに入るため、その実行前に：
- すべてのマイクロタスクが完了
- ブラウザのレンダリングが発生する可能性

これにより、レイアウト計算が完了した状態で要素のサイズを取得できる確率が高まる。

### なぜ50msの追加待機が必要か

- `setTimeout(0)`でもレンダリングが完了しない場合がある
- 特に複雑なレイアウトや多数の要素がある場合
- 50msは経験的に十分な時間（通常のフレームレート 16.67ms の3フレーム分）

### なぜデフォルト値600pxが必要か

- 最悪の場合のフォールバック
- 五線譜が最低限表示される幅を保証
- 後続の処理でエラーが発生しないようにする

## テスト結果

### ビルドとテスト

```bash
$ npm run build
# ✅ 成功

$ npm test
# ✅ 全40ユニットテスト合格
```

### セキュリティチェック

```bash
# CodeQL静的解析
# ✅ JavaScript: 0 alerts
```

## 期待される効果

### 1. 初回読み込みの成功率向上

- スーパーリロードなしで正常に表示
- ネットワーク遅延やブラウザの処理遅延に強い
- 様々なブラウザや環境で安定動作

### 2. ユーザー体験の向上

- スーパーリロードの必要性がなくなる
- エラーメッセージが適切に表示される
- デバッグが容易になる

### 3. 保守性の向上

- 型安全性の向上（`Promise<void>`）
- コメントによる説明が充実
- 将来の拡張が容易

## 変更ファイル

- `src/index.ts`: プラグインのメインロジック
- `demo.html`: デモページ（同じロジックを適用）

## 後方互換性

- ✅ 既存の機能に影響なし
- ✅ 既存のマークダウンファイルは修正不要
- ✅ 設定変更は不要

## 関連Issue

- [Issue #46](https://github.com/cat2151/quartz-transformer-mmlabc/issues/46)
- [PR #48](https://github.com/cat2151/quartz-transformer-mmlabc/pull/48)

## 実装日

2026-01-05

## 実装者

Copilot (GitHub Copilot Coding Agent)
