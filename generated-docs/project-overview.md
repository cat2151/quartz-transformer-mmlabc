Last updated: 2026-01-03

# Project Overview

## プロジェクト概要
- MML（Music Macro Language）とコード進行記法を、Web上でインタラクティブな楽譜として表示・再生するQuartzプラグインです。
- Markdownファイル内のコードブロックを検出・変換し、abcjsライブラリを用いて五線譜を自動レンダリングします。
- これにより、音楽コンテンツを視覚的かつ聴覚的に楽しめる形で静的サイトに埋め込むことが可能になります。

## 技術スタック
- フロントエンド: abcjs (ABC音楽記法をSVGとしてレンダリングし、オーディオ再生機能を提供)、mml2abc (MML記法をABC記法に変換し、ブラウザ上で動的にロードされます)、chord2mml (コード進行記法をMMLに変換し、ブラウザ上で動的にロードされます)。
- 音楽・オーディオ: abcjs (内蔵オーディオシンセサイザー)、Web Audio API (ブラウザネイティブの音声処理APIで、楽曲の再生に使用されます)。
- 開発ツール: TypeScript (静的型付け言語で、コードの品質と保守性を向上させます)、npm/yarn (Node.jsのパッケージ管理ツール)、Vitest (高速な単体テストフレームワーク)、Playwright (ブラウザベースのE2Eテストフレームワーク)。
- テスト: Vitest (ユニットテスト、モック、テストカバレッジレポート生成)、Playwright (実際のブラウザ環境での統合テスト、UIテスト)。
- ビルドツール: TypeScript Compiler (TypeScriptコードをJavaScriptにコンパイル)、unified (コンテンツの構文木を解析および変換するためのインターフェース)、unist-util-visit (unifiedのエコシステムで構文木を効率的に走査するユーティリティ)。
- 言語機能: TypeScript (モダンなJavaScriptのスーパーセットとして、高度な型安全性と開発体験を提供します)。
- 自動化・CI/CD: (特になし。ただし、VitestやPlaywrightはCI/CDパイプラインに組み込むことが可能です。)
- 開発標準: (特になし。ただし、TypeScriptの使用自体がコード品質の一貫性に寄与します。)

## ファイル階層ツリー
```
quartz-transformer-mmlabc/
├── .gitignore
├── LICENSE
├── README.ja.md
├── README.md
├── _config.yml
├── demo.html
├── example.md
├── generated-docs/
├── issue-notes/
│   ├── 19.md
│   ├── 21.md
│   ├── 22.md
│   ├── 24.md
│   ├── 25.md
│   └── 26.md
├── package-lock.json
├── package.json
├── playwright.config.ts
├── src/
│   ├── index.test.ts
│   └── index.ts
├── test/
│   ├── README.md
│   ├── integration-test.html
│   └── integration.test.ts
├── tsconfig.json
└── vitest.config.ts
```

## ファイル詳細説明
- **README.ja.md / README.md**: プロジェクトの目的、機能、インストール、使用方法、開発手順、ライセンスなど、プロジェクトに関する包括的な情報を提供するドキュメントです。
- **demo.html**: プラグインが生成する楽譜のレンダリングやオーディオ再生機能を、手動でテスト・確認するためのHTMLファイルです。
- **example.md**: QuartzサイトでプラグインがMarkdownコンテンツをどのように変換するかを示すMarkdownファイルの例です。
- **issue-notes/**: 開発中に発見された問題や検討事項、特定の課題に関するメモを保管するディレクトリです。
- **package-lock.json / package.json**: Node.jsプロジェクトの依存関係、スクリプト、メタデータを定義するファイルです。`package-lock.json`は依存関係の正確なバージョンをロックします。
- **playwright.config.ts**: Playwrightフレームワークを使用したエンドツーエンド（E2E）テストの設定を定義するファイルです。
- **src/index.test.ts**: メインプラグイン（`src/index.ts`）の変換ロジックや内部関数に対する単体テストを含むファイルです。
- **src/index.ts**: `quartz-transformer-mmlabc`プラグインのコア実装ファイルです。Quartzのビルドプロセス中にMarkdownのコードブロックを検出し、ブラウザで楽譜をレンダリング・再生するためのHTML構造を生成します。
- **test/README.md**: テストディレクトリに関する追加情報や説明を含むファイルです。
- **test/integration-test.html**: 統合テストスイートで使用されるHTMLコンテンツの例を提供し、プラグインが生成するHTMLとブラウザの相互作用をテストします。
- **test/integration.test.ts**: Playwrightを使って、実際のブラウザ環境でプラグインの機能（楽譜の表示、再生）が正しく動作するかを検証する統合テストを実装しています。
- **tsconfig.json**: TypeScriptコンパイラのための設定ファイルで、TypeScriptコードのコンパイル方法を定義します。
- **vitest.config.ts**: Vitestテストランナーのための設定ファイルです。

## 関数詳細説明
- **MMLABCTransformer(options?: PluginOptions) (src/index.ts)**
    - **役割**: Quartzプラグインのエントリーポイントとなるファクトリ関数です。この関数がQuartzのトランスフォーマーとして登録され、Markdownコンテンツの抽象構文木（AST）を処理します。
    - **引数**: `options` - プラグインの動作をカスタマイズするためのオプションオブジェクト（`enableMML`, `enableChord`, `enableABC`など）。
    - **戻り値**: MarkdownのASTを変換する`unified`互換のトランスフォーマー関数を返します。
    - **機能**: `mml`、`chord`、`abc`コードブロックを検出し、後続のブラウザ側でのレンダリングと再生のために、それらを適切なHTML要素に置き換えます。
- **escapeHtml(text: string) (src/index.ts)**
    - **役割**: HTML特殊文字をエスケープ処理し、安全にHTMLドキュメント内に埋め込めるようにするユーティリティ関数です。
    - **引数**: `text` - エスケープする文字列。
    - **戻り値**: エスケープされた文字列。
    - **機能**: HTML要素のコンテンツとして文字列を挿入する際に、クロスサイトスクリプティング（XSS）などのセキュリティリスクを低減します。
- **handlePlayback(element: HTMLElement) (src/index.ts)**
    - **役割**: レンダリングされた楽譜のオーディオ再生を管理する関数です。
    - **引数**: `element` - クリックされた楽譜のHTML要素。
    - **戻り値**: なし。
    - **機能**: 楽譜がクリックされたときに楽曲の再生を開始・停止し、再生中の視覚的なフィードバック（背景色の変更など）を提供します。abcjsのシンセサイザーAPIとWeb Audio APIを使用します。
- **cleanup(element: HTMLElement) (src/index.ts)**
    - **役割**: 楽曲の再生が完了した際や停止された後に、再生状態をリセットし、関連するリソースをクリーンアップする関数です。
    - **引数**: `element` - 処理対象の楽譜のHTML要素。
    - **戻り値**: なし。
    - **機能**: 再生完了後の背景色を元に戻し、再生ステータス表示をクリアするなど、UIの状態を初期化します。
- **checkPlaybackStatus(element: HTMLElement) (src/index.ts)**
    - **役割**: 特定の楽譜要素の現在の再生状態を確認し、それに応じて適切なUIの更新や処理をトリガーする関数です。
    - **引数**: `element` - 状態を確認する楽譜のHTML要素。
    - **戻り値**: なし。
    - **機能**: 再生がアクティブであるか、停止しているかなどを判断し、`handlePlayback`や`cleanup`などの関連関数を呼び出すためのロジックをサポートします。

## 関数呼び出し階層ツリー
```
- checkPlaybackStatus (src/index.ts)
  - escapeHtml (src/index.ts)
    - handlePlayback ()
      - cleanup ()
      - markdownPlugins ()
      - externalResources ()
      - function ()
      - addEventListener ()
- if (src/index.ts)
- blocks (src/index.ts)
- for (src/index.ts)
- catch (src/index.ts)

---
Generated at: 2026-01-03 07:02:02 JST
