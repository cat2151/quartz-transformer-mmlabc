# quartz-transformer-mmlabc

**コード進行とMML（Music Macro Language）をコードブロックに書くだけで、五線譜を表示してクリック演奏も可能にするQuartzトランスフォーマープラグイン**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※このドキュメントは大部分がAI生成です。issueをagentに投げて生成させました。

## Quick Links
| 項目 | リンク |
|------|--------|
| 📊 開発状況 | [generated-docs/development-status](generated-docs/development-status.md) |

## 状況
- 一通り実装しました
- ドッグフーディング中です
- 破壊的変更をする可能性があります

## 2行で説明
- Obsidianで、コード進行をコードブロックに書くと、五線譜を表示して鳴らすことができます : https://github.com/cat2151/obsidian-plugin-mmlabc
- Quartz4でもそれを実現するため、新たにトランスフォーマープラグインを作りました

## 機能

- 🎵 `mml`コードブロックをABC記法に変換し、abcjsでレンダリング
- 🎸 `chord`コードブロックをMMLに変換してからABC記法に変換し、abcjsでレンダリング
- 🎼 トラブルシューティングのための`abc`記法コードブロックをサポート
- 🎨 SVGで五線譜を表示
- 🎧 クリックで楽曲を再生 - レンダリングされた楽譜をクリックすると音楽を再生できます
- ⌨️ キーボードアクセシビリティ対応（EnterキーまたはSpaceキーで再生）

## インストール

Quartzをインストールしたディレクトリにて以下を実行してください

```powershell
npm install github:cat2151/quartz-transformer-mmlabc; pushd node_modules/quartz-transformer-mmlabc; npm run build; popd
```

この手順が必要な理由：
- プラグインはGitHubから直接インストールされます（npmからではありません）
- コンパイルされたJavaScriptを含む`dist`ディレクトリはリポジトリに含まれていません
- この手順をスキップすると、プラグインのエントリーポイント（`dist/index.js`）が存在しないため、Quartzの実行時にエラーが発生します。

さらに、`.github\workflows\deploy.yml` の `Build Quartz`の前に、以下を追加してください
```yml
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```
この手順が必要な理由：
- GitHub Actionsでのdeploy時に、これがないと、プラグインのエントリーポイント（`dist/index.js`）が存在しないため、`Build Quartz`時にエラーが発生します。

## 使い方

### Quartz設定での使用

`quartz.config.ts`にトランスフォーマーを追加します：

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

const config: QuartzConfig = {
  configuration: {
    // ... サイト設定
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      // MMLABCトランスフォーマーを追加
      MMLABCTransformer(),
      // ... 他のトランスフォーマー
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // ... 他のエミッター
    ],
  },
}

export default config
```

**重要なポイント:**
- Quartzの内部パスから`QuartzConfig`と組み込みプラグインをインポート
- このプラグインはnpmパッケージ名からインポート
- `transformers`配列に他のトランスフォーマーと一緒に追加
- プラグイン間に依存関係がない限り、順序は通常問題ありません

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

#### ABC記法（直接指定）

````markdown
```abc
X:1
T:Simple Scale
M:4/4
L:1/4
K:C
C D E F|G A B c|
```
````

トラブルシューティングや、ABC記法を直接記述したい場合に便利です。

## オプション

プラグインはオプションの設定を受け付けます：

```typescript
MMLABCTransformer({
  enableMML: true,    // MMLブロック変換を有効化（デフォルト: true）
  enableChord: true,  // コード進行ブロック変換を有効化（デフォルト: true）
  enableABC: true,    // ABCブロック変換を有効化（デフォルト: true）
})
```

## 仕組み

1. プラグインはQuartzのビルドプロセス中に`mml`、`chord`、または`abc`言語タグを持つコードブロックを検出
2. これらのコードブロックを、ソース記法をデータ属性として含むHTMLのdiv要素に置き換え
3. ブラウザ内で：
   - CDNからabcjsとmml2abcを読み込み
   - MMLブロックの場合：mml2abcを使用してMMLをABC記法に変換
   - コード進行ブロックの場合：chord2mmlを使用してコード進行をMMLに変換してからABC記法に変換
   - ABCブロックの場合：変換せずに記法を直接使用
   - abcjsを使用してABC記法をインタラクティブなSVGとしてレンダリング
   - オーディオシンセサイザーを初期化して楽曲の再生に対応
   - 楽譜をクリックして音楽を再生できるようにクリックイベントハンドラーを追加

## 現在の状態

### 実装済み機能
- ✅ MMLブロックの検出と変換
- ✅ コード進行ブロックの検出と変換
- ✅ ABCブロックの検出と直接レンダリング（トラブルシューティングに便利）
- ✅ abcjsを使用したABC記法のレンダリング（五線譜の表示）
- ✅ CDN依存関係は@cat2151により動作確認済みのバージョンを使用
- ✅ Quartzのダークモード対応（自動テーマ検出とテーマ切り替えに対応）
- ✅ アクセシビリティ対応（ARIA属性、キーボード操作サポート）
- ✅ インタラクティブな音声再生機能（楽譜をクリックして楽曲を先頭から演奏）
  - abcjs synth APIとWeb Audio APIを使用
  - 再生中の視覚的フィードバック（背景色の変更とステータス表示）
  - 再生完了時に自動停止
  - もう一度クリックすると再生を停止

## 注意事項

- HTMLへの変換はQuartzのビルドプロセス中に行われます
- 実際の楽譜の変換とレンダリングはブラウザ内で行われます
- CDNライブラリのバージョンは、@cat2151 によりeasychord2mmlでの動作確認に基づいて指定されています
- MMLからABCへの変換は、CDNから読み込まれるmml2abcを使用します
- コード進行からMMLへの変換は、CDNから読み込まれるchord2mmlを使用します
- レンダリングにはCDNから読み込まれるabcjs（バージョン6系の最新）を使用します
- バンドルの問題を避けるため、ライブラリは動的に読み込まれます

## テスト

プラグインには、包括的な自動テストスイートが含まれています：

### テストの実行

```bash
# ユニットテストを1回実行
npm test

# インテグレーションテスト（Playwright）を実行
npm run test:integration

# 全テストを実行
npm run test:all

# ウォッチモードでテストを実行
npm run test:watch

# UIでテストを実行
npm run test:ui
```

### テストカバレッジ

テストスイートには以下が含まれます：
- AST変換ロジックのユニットテスト（Vitest）
- HTMLエスケープのテスト（改行、タブ、特殊文字）
- プラグインオプションと設定のテスト
- エッジケースの処理
- 外部リソースの検証
- ブラウザでのレンダリングとインタラクティブ機能のインテグレーションテスト（Playwright）

手動テストには、同梱の`demo.html`ファイルを使用してください。

**注意**: Coding AgentがLinux Runnerでテストを行う際には、CDNがブロックされるため五線譜の表示が行われません。五線譜の表示を確認したい場合は、実機（ローカル環境）でテストしてください。

## 依存関係

### ランタイム（CDN経由で読み込み）

**重要**: 以下のライブラリバージョンは、@cat2151 により[easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html)での動作確認に基づいて指定されています。これらのURLを変更しないでください。

- [abcjs](https://github.com/paulrosen/abcjs) - ABC音楽記法をレンダリングするJavaScriptライブラリ
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - `@6`を指定することで、バージョン6系の最新版（6.x.x）を常に取得
- [mml2abc](https://github.com/cat2151/mml2abc) - Music Macro LanguageをABC記法に変換
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - 動的ESモジュールインポートで読み込み
- [chord2mml](https://github.com/cat2151/chord2mml) - コード進行記法をMMLに変換
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - UMDバンドル形式で読み込み
  - SRI (Subresource Integrity) チェックサムを使用してセキュリティを確保
  - チェックサム: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - ※ライブラリ更新時にはチェックサムの再検証が必要です

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
│   ├── index.ts          # メインプラグイン実装
│   └── index.test.ts     # ユニットテスト
├── test/
│   └── integration.test.ts # インテグレーションテスト
├── dist/                 # コンパイル出力（生成）
│   ├── index.js
│   └── index.d.ts
├── demo.html             # 手動テスト用デモファイル
├── package.json
├── tsconfig.json
├── vitest.config.ts      # Vitestテスト設定
├── playwright.config.ts  # Playwrightテスト設定
└── README.md
```

## ライセンス

MIT License - 詳細はLICENSEファイルを参照してください

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています

## 関連プロジェクト

- [Quartz](https://quartz.jzhao.xyz/) - 高速でバッテリー同梱の静的サイトジェネレーター
- [abcjs](https://www.abcjs.net/) - ABC音楽記法をレンダリングするJavaScript
- [mml2abc](https://cat2151.github.io/mml2abc/) - MMLからABCへのコンバーター
- [chord2mml](https://cat2151.github.io/chord2mml/) - コード進行記法からMMLへのコンバーター
