# quartz-transformer-mmlabc

MML（Music Macro Language）とコード進行記法のコードブロックを、abcjsを使用してインタラクティブな楽譜に変換するQuartzトランスフォーマープラグインです。

## 機能

- 🎵 `mml`コードブロックをABC記法に変換し、abcjsでレンダリング
- 🎸 `chord`コードブロックをMMLに変換してからABC記法に変換し、abcjsでレンダリング
- 🎨 楽譜をSVGとして自動レンダリング
- ⚡ 軽量でスタンドアロンなnpmモジュール
- 🔧 TypeScriptサポート

## インストール

```bash
npm install quartz-transformer-mmlabc
```

またはyarnを使用する場合：

```bash
yarn add quartz-transformer-mmlabc
```

## 使い方

### Quartz設定での使用

`quartz.config.ts`にトランスフォーマーを追加します：

```typescript
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

export default {
  plugins: {
    transformers: [
      // ... 他のトランスフォーマー
      MMLABCTransformer(),
    ],
  },
}
```

### Markdownファイルでの使用

#### MML記法

````markdown
```mml
t120 l4 cdefgab>c
```
````

#### コード進行記法

````markdown
```chord
C Dm7 G7 C
```
````

## オプション

プラグインはオプションの設定を受け付けます：

```typescript
MMLABCTransformer({
  enableMML: true,    // MMLブロック変換を有効化（デフォルト: true）
  enableChord: true,  // コード進行ブロック変換を有効化（デフォルト: true）
})
```

## 仕組み

1. プラグインはQuartzのビルドプロセス中に`mml`または`chord`言語タグを持つコードブロックを検出
2. これらのコードブロックを、ソース記法をデータ属性として含むHTMLのdiv要素に置き換え
3. ブラウザ内で：
   - CDNからabcjsとmml2abcを読み込み
   - MMLブロックの場合：mml2abcを使用してMMLをABC記法に変換
   - コード進行ブロックの場合：（予定）コード進行をMMLに変換してからABC記法に変換
   - abcjsを使用してABC記法をインタラクティブなSVGとしてレンダリング

## 現在の状態

- ✅ MMLブロックの検出と変換
- ✅ abcjsを使用したABC記法のレンダリング
- ✅ CDN依存関係を特定のコミットハッシュに固定
- ❌ コード進行ブロックのレンダリング（未実装 - 今後の課題セクションを参照）

プラグインはMML記法に対して機能します。コード進行記法のブロックは認識されますが、chord2mmlのCDN統合が未完了のため変換されません。

## 注意事項

- HTMLへの変換はQuartzのビルドプロセス中に行われます
- 実際の楽譜の変換とレンダリングはブラウザ内で行われます
- MMLからABCへの変換は、CDNから読み込まれるmml2abcを使用します（コミット`c32f3f3`に固定）
- レンダリングにはCDNから読み込まれるabcjsを使用します
- バンドルの問題を避けるため、ライブラリは動的に読み込まれます

## テスト

プラグインには現在、自動テストがありません。今後の貢献には以下を含めるべきです：
- AST変換ロジックのユニットテスト
- HTMLエスケープのテスト（特に改行や特殊文字）
- 完全な変換パイプラインの統合テスト

手動テストには、同梱の`demo.html`ファイルを使用してください。

## 依存関係

### ランタイム（CDN経由で読み込み）
- [abcjs](https://github.com/paulrosen/abcjs) - ABC音楽記法をレンダリングするJavaScriptライブラリ
- [mml2abc](https://github.com/cat2151/mml2abc) - Music Macro LanguageをABC記法に変換

### ビルド時
- [unified](https://github.com/unifiedjs/unified) - コンテンツの解析と変換のためのインターフェース
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - 構文木を走査するためのユーティリティ

## 開発

### ビルド

```bash
npm run build
```

### プロジェクト構造

```
quartz-transformer-mmlabc/
├── src/
│   └── index.ts          # メインプラグイン実装
├── dist/                 # コンパイル出力（生成）
│   ├── index.js
│   └── index.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## ライセンス

MIT

## コントリビューション

コントリビューションを歓迎します！お気軽にPull Requestをお送りください。

## 関連プロジェクト

- [Quartz](https://quartz.jzhao.xyz/) - 高速でバッテリー同梱の静的サイトジェネレーター
- [abcjs](https://www.abcjs.net/) - ABC音楽記法をレンダリングするJavaScript
- [mml2abc](https://cat2151.github.io/mml2abc/) - MMLからABCへのコンバーター
- [chord2mml](https://cat2151.github.io/chord2mml/) - コード進行記法からMMLへのコンバーター
