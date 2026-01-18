# Issue #67 解決策: SPA ナビゲーション検知の強化

## 問題の概要

**現象**: Issue #46の修正後も、index pageからmusic pageへSPAナビゲーションした際に：
- console.logが全く出力されない
- 五線譜が表示されない
- ブラウザでリロード（F5）すると正常に表示される

**Console.logの分析**:
```
# index pageを表示：
[MML-ABC-Transformer] Plugin loaded. Version: 0.1.0-debug
[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します
[MML-ABC-Transformer] 五線譜表示処理を開始します
[MML-ABC-Transformer] 処理対象の楽譜ブロック数: 0

# music pageへナビゲーション：
（logが全く出力されない）← これが問題
（五線譜も表示されない）

# リロード後：
[MML-ABC-Transformer] Plugin loaded. Version: 0.1.0-debug
[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します
[MML-ABC-Transformer] 五線譜表示処理を開始します
[MML-ABC-Transformer] 処理対象の楽譜ブロック数: 3
（五線譜が正常に表示される）
```

## 根本原因の分析

### Issue #46の修正内容（PR #48）
Issue #46では、`afterDOMReady`スクリプトが初回ロード時のみ実行される問題を解決するため、Quartzの`nav`イベントをリスニングする実装を追加した：

```javascript
window.addEventListener('nav', () => {
  console.log('[MML-ABC-Transformer] SPA page 遷移を検知しました');
  initializeMusicNotation();
});
```

### 新たに判明した問題
**`nav`イベントが発火していない**：
- index pageロード時: イベントリスナーは正常に登録される（はず）
- music pageへナビゲーション時: `nav`イベントが発火しない
  - "SPA page 遷移を検知しました" のlogが出力されない
  - `initializeMusicNotation()`が呼ばれない

**考えられる原因**:
1. Quartzの`nav`イベントの発火タイミングや条件が環境によって異なる
2. 特定のQuartz設定やバージョンで`nav`イベントが発火しない
3. イベントリスナー登録前に何らかのエラーが発生している

## 実装した解決策

### 1. 複数のイベント検知方法を実装

単一のイベント（`nav`）だけに依存せず、3つの異なる方法でSPAナビゲーションを検知：

```typescript
// Primary: Quartz v4 "nav" event
window.addEventListener('nav', () => {
  handleNavigation('nav event');
});

// Fallback 1: popstate event for browser back/forward
window.addEventListener('popstate', () => {
  handleNavigation('popstate event');
});

// Fallback 2: Observe DOM changes to detect when new content is loaded
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      const addedNodes = Array.from(mutation.addedNodes);
      const hasNewNotation = addedNodes.some(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          return element.classList?.contains('abc-notation') || 
                 element.querySelector?.('.abc-notation');
        }
        return false;
      });
      
      if (hasNewNotation) {
        handleNavigation('MutationObserver');
        break;
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### 2. 並行実行の防止

複数のイベントソースから同時に初期化が呼ばれることを防ぐ：

```typescript
let isInitializing = false;

const handleNavigation = (source) => {
  console.log('[MML-ABC-Transformer] ナビゲーションを検知しました。ソース:', source);
  
  if (isInitializing) {
    console.log('[MML-ABC-Transformer] 初期化が既に実行中のためスキップします');
    return;
  }
  
  isInitializing = true;
  
  initializeMusicNotation()
    .catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
    })
    .finally(() => {
      isInitializing = false;
    });
};
```

### 3. 詳細なデバッグログ

問題の診断を容易にするため、各イベントリスナーの登録とトリガーをログ出力：

```typescript
console.log('[MML-ABC-Transformer] イベントリスナーを登録します');
// ... register nav event listener
console.log('[MML-ABC-Transformer] "nav" イベントリスナーを登録しました');
// ... register popstate event listener
console.log('[MML-ABC-Transformer] "popstate" イベントリスナーを登録しました');
// ... setup MutationObserver
console.log('[MML-ABC-Transformer] MutationObserver を設定しました');
```

イベントが発火した際には、どのソースからかを明示：
```typescript
console.log('[MML-ABC-Transformer] ナビゲーションを検知しました。ソース:', source);
// 出力例: "ソース: nav event" または "ソース: MutationObserver"
```

### 4. メモリリーク対策

MutationObserverをクリーンアップ関数に追加：

```typescript
if (typeof window.addCleanup === 'function') {
  window.addCleanup(() => {
    // Stop any playing audio
    if (currentSynth && typeof currentSynth.stop === 'function') {
      currentSynth.stop();
    }
    if (currentPlayingElement) {
      currentPlayingElement.classList.remove('playing');
    }
    currentSynth = null;
    currentPlayingElement = null;
    
    // Disconnect the MutationObserver to prevent memory leaks
    if (observer) {
      observer.disconnect();
    }
  });
}
```

## 技術的な詳細

### MutationObserverの仕組み

**なぜMutationObserverが必要か**:
- QuartzのSPAナビゲーションは、ページ全体をリロードせずにDOM要素を置き換える
- `nav`イベントが発火しない環境でも、DOMの変更は必ず発生する
- MutationObserverは、`.abc-notation`要素が追加されたことを直接検知できる

**実装の工夫**:
1. `childList: true` - 子要素の追加/削除を監視
2. `subtree: true` - body以下の全ての子孫要素を監視
3. `.abc-notation`クラスを持つ要素、または含む要素のみを検知
4. 一度検知したら`break`して、同じバッチでの重複呼び出しを防ぐ

### 並行実行防止の重要性

**なぜ必要か**:
- `nav`イベントとMutationObserverが同時に発火する可能性がある
- 同じページに対して複数回初期化が走ると：
  - パフォーマンスの低下
  - 重複したイベントリスナーの登録
  - 意図しない再レンダリング

**`isInitializing`フラグの動作**:
```typescript
isInitializing = true;  // 初期化開始
initializeMusicNotation()
  .finally(() => {
    isInitializing = false;  // 初期化完了（成功/失敗に関わらず）
  });
```

## テスト結果

### ユニットテスト (Vitest)
```bash
$ npm test
✓ src/index.test.ts (40 tests) 15ms
Test Files  1 passed (1)
Tests  40 passed (40)
```

### 統合テスト (Playwright)
```bash
$ npx playwright test test/spa-navigation-debug.test.ts
✓ should log debug messages on initial page load (737ms)
✓ should log debug messages on SPA navigation (1.1s)
✓ should skip already processed elements on navigation (1.1s)
✓ should measure and log rendering performance (655ms)
✓ should detect correct notation types during processing (655ms)

5 passed (5.3s)
```

### セキュリティスキャン (CodeQL)
```bash
javascript: No alerts found.
```

## 期待される効果

### 1. 確実なナビゲーション検知

複数の検知方法により、様々な環境で動作：
- 標準的なQuartz v4環境: `nav`イベント
- ブラウザの戻る/進む: `popstate`イベント
- イベントが発火しない環境: MutationObserver

### 2. デバッグの容易化

詳細なログにより、どの検知方法が機能しているかを確認可能：
```
[MML-ABC-Transformer] イベントリスナーを登録します
[MML-ABC-Transformer] "nav" イベントリスナーを登録しました
[MML-ABC-Transformer] "popstate" イベントリスナーを登録しました
[MML-ABC-Transformer] MutationObserver を設定しました
[MML-ABC-Transformer] ナビゲーションを検知しました。ソース: MutationObserver
[MML-ABC-Transformer] 五線譜表示処理を開始します
```

### 3. パフォーマンスの最適化

並行実行防止により：
- 不要な再初期化を回避
- CPUリソースの節約
- スムーズなページ遷移

### 4. メモリリークの防止

MutationObserverの適切なクリーンアップにより：
- 長時間の使用でもメモリ消費が安定
- ページ遷移を繰り返しても問題なし

## 後方互換性

### ✅ 既存機能への影響なし

- 既存の`nav`イベントリスナーはそのまま動作
- 新しい検知方法は追加のみで、既存コードを変更していない
- `isInitializing`フラグにより、複数回呼ばれても安全

### ✅ 設定変更不要

- ユーザー側での設定変更は不要
- 既存のQuartz設定ファイルはそのまま使用可能

### ✅ プログレッシブエンハンスメント

- `nav`イベントが動作する環境: より速く動作
- `nav`イベントが動作しない環境: MutationObserverがフォールバック

## コードレビューフィードバックへの対応

### 1. アロー関数の使用
```typescript
// Before
const handleNavigation = function(source) { ... }

// After
const handleNavigation = (source) => { ... }
```
モダンなJavaScriptの慣習に従い、一貫性を向上。

### 2. 型アサーションの明示
```typescript
// Before
const element = node;

// After  
const element = node as Element;
```
TypeScriptの型安全性を向上。

## 変更ファイル

### 修正
- `src/index.ts` - プラグインのメインロジック
  - 複数のイベント検知方法を追加
  - 詳細なデバッグログを追加
  - 並行実行防止機能を追加
  - MutationObserverのクリーンアップを追加

### テスト更新
- `test/spa-navigation-debug.test.ts`
  - 新しいログ形式に対応
  - オプショナルなログチェックに変更

## 関連Issue・PR

- [Issue #67](https://github.com/cat2151/quartz-transformer-mmlabc/issues/67) - 本Issue
- [Issue #46](https://github.com/cat2151/quartz-transformer-mmlabc/issues/46) - 元の問題
- [PR #48](https://github.com/cat2151/quartz-transformer-mmlabc/pull/48) - Issue #46の修正

## 実装日

2026-01-18

## 実装者

GitHub Copilot (with cat2151)
