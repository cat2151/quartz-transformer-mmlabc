# quartz-transformer-mmlabc のための Copilot 指示書

## プロジェクト概要

MML (Music Macro Language)、コード進行、ABC記譜法のコードブロックを、abcjsでレンダリングされるインタラクティブな楽譜に変換する **Quartz transformer plugin** です。2段階で動作します：
1. **ビルド時 (Node.js)**: markdownコードブロック → データ属性付きHTML divに変換
2. **ブラウザ実行時**: CDNライブラリを読み込み → 記譜法を変換 → SVGをレンダリング → 再生を有効化

## アーキテクチャ

### Transformer Plugin パターン
プラグインは [src/index.ts](src/index.ts) で Quartz の `QuartzTransformerPlugin<T>` インターフェースを実装しています：
```typescript
export const MMLABCTransformer: QuartzTransformerPlugin<MMLABCOptions | undefined>
```

主要なメソッド：
- `markdownPlugins()` - ASTコードブロックをHTMLに変換するremarkプラグインを返す
- `externalResources()` - CDNスクリプト、インラインCSS、`afterDOMLoaded` JavaScriptを注入

### AST変換フロー
`unist-util-visit` を使用してmarkdown ASTを巡回・変更：
1. lang が `mml`/`chord`/`abc` の `code` ノードを訪問
2. データ属性を持つdiv要素を含む `html` ノードに置き換え
3. `escapeHtml()` ヘルパーで `&`, `<`, `>`, `"`, `'`, `\n`, `\r`, `\t` をエスケープ

### ブラウザランタイム (src/browser-runtime.js)
**重要**: このファイルはトランスパイルされず、ブラウザで直接実行されるJavaScriptです。
- **TypeScript構文を書かないこと**: 型アノテーション、interface等は使用不可
- 純粋なJavaScriptのみを記述してください

約471行のJavaScriptが処理：
- `mml2abc` と `chord2mml` のCDNからの動的ESモジュールインポート
- 変換チェーン: `chord → chord2mml → mml → mml2abc → abc → abcjs.renderAbc`
- Web Audio API再生用の共有 `AudioContext`
- DOM要素にビジュアルオブジェクトを関連付ける `WeakMap`

## 開発コマンド

```bash
npm run build      # TypeScript → dist/
npm test           # vitestを1回実行
npm run test:watch # Vitestをウォッチモードで実行
npm run test:ui    # VitestをUIモードで実行
```

手動ブラウザテスト: [demo.html](demo.html) を直接開く。

## テストパターン

テストは [src/index.test.ts](src/index.test.ts) にあり、Vitestを使用。AST変換をテストするパターン：
```typescript
const plugin = MMLABCTransformer({ enableMML: true })
const transformer = plugin.markdownPlugins!()[0]()
const tree = { type: 'root', children: [{ type: 'code', lang: 'mml', value: '...' }] }
transformer(tree, null)
expect(tree.children[0].type).toBe('html')
```

主要なテストカテゴリ：
- HTMLエスケープ（XSS防止、改行、特殊文字）
- オプション切り替え（`enableMML`, `enableChord`, `enableABC`）
- 大文字小文字を区別しない言語タグ
- ARIAアクセシビリティ属性

## 重要なパターン

### HTMLエスケープ
XSS防止のため、データ属性に埋め込むユーザーコンテンツには必ず `escapeHtml()` を使用：
```typescript
data-mml="${escapeHtml(mmlCode)}"
```

### CDNピン留め
安定性のため、外部依存関係は特定のコミット/バージョンに固定：
- `mml2abc@c32f3f36022201547b68d76e0307a62a4c2b173b`
- `chord2mml@v0.0.4`
- `abcjs@6.4.0`

### アクセシビリティ
レンダリングされる全要素に含む: `role="button"`, `tabindex="0"`, `aria-label="Play music notation"`

## ⚠️ 重要な注意事項: TypeScript/JavaScript の分離

このプロジェクトは**Issue #72**の対応として、TypeScriptとJavaScriptを物理的に分離しています。

**問題の背景:**
- 以前は`src/index.ts`内の文字列テンプレートにJavaScriptコードが埋め込まれていた
- この部分はトランスパイルされず、ブラウザで直接実行される
- Coding agentが編集時に誤ってTypeScript構文（型アノテーション、interface等）を書き込んでしまう
- ブラウザで構文エラーが発生

**現在の構造:**
- `src/index.ts` - **TypeScript専用**（トランスパイル対象）
- `src/browser-runtime.js` - **JavaScript専用**（非トランスパイル、ブラウザ直接実行）

**編集時の注意:**
- `browser-runtime.js`を編集する際は、**TypeScript構文を絶対に使用しないこと**
- 型アノテーション、interface、enum等は使用不可
- 純粋なJavaScript（ES6+）のみを記述すること

## ファイル構造

- `src/index.ts` - TypeScript transformer plugin実装（約316行、トランスパイル対象）
- `src/browser-runtime.js` - ブラウザ実行JavaScript（約471行、**非トランスパイル**）
  - ⚠️ **重要**: TypeScript構文を使用しないこと
- `src/index.test.ts` - 包括的なテストスイート（約800行）
- `dist/` - ビルド出力（gitignore、`npm run build` で生成）
  - `index.js` - トランスパイルされたTypeScript
  - `browser-runtime.js` - コピーされたJavaScript（ビルド時に`copyfiles`でコピー）

## インテグレーションの注意点

このプラグインはQuartzの **peer dependency** です。ユーザーはインストールします：
```bash
npm install github:cat2151/quartz-transformer-mmlabc
```

`quartz.config.ts` で設定：
```typescript
import { MMLABCTransformer } from "quartz-transformer-mmlabc"
transformers: [MMLABCTransformer()]
```

# プルリクエストとレビュー
- プルリクエストは日本語で記述してください
- レビューは日本語で記述してください
