Last updated: 2026-02-02

# Project Overview

## プロジェクト概要
- Markdownのコードブロックにコード進行、MML、またはABC記法を記述するだけで、動的な五線譜を表示します。
- Quartz静的サイトジェネレーター用のトランスフォーマープラグインとして機能し、五線譜のクリック演奏も可能です。
- 音楽教育、作曲支援、または単に音楽コンテンツを共有したいユーザーが、手軽に楽譜をウェブページに埋め込むことを可能にします。

## 技術スタック
- フロントエンド: abcjs (ABC記法レンダリングとインタラクティブなSVG表示、オーディオ再生機能を提供)、mml2abc (MML記法をABC記法に変換)、chord2mml (コード進行をMML記法に変換)
- 音楽・オーディオ: abcjs (楽譜の表示と内蔵シンセサイザーによる楽曲再生)
- 開発ツール: TypeScript (型安全なJavaScript開発を実現)、unified (コンテンツの解析と変換のためのインターフェース)、unist-util-visit (Unified構文木の走査ユーティリティ)、npm (パッケージ管理)
- テスト: Vitest (ユニットテストフレームワーク)、Playwright (ブラウザベースのインテグレーションテストフレームワーク)
- ビルドツール: TypeScript Compiler (TypeScriptコードをJavaScriptにコンパイル)
- 言語機能: TypeScript (JavaScriptのスーパーセットであり、静的型付けによるコード品質向上)
- 自動化・CI/CD: GitHub Actions (リポジトリのビルド、テスト、デプロイを自動化し、プラグインの自動更新やビルドを管理)
- 開発標準: TypeScript (統一された開発言語と型定義によるコード品質の維持)

## ファイル階層ツリー
```
.
├── .gitignore
├── DEBUG-LOGGING-SUMMARY.md
├── LICENSE
├── README.ja.md
├── README.md
├── SPA-FIX-SUMMARY.md
├── _config.yml
├── demo.html
├── example.md
├── generated-docs/
├── package-lock.json
├── package.json
├── playwright.config.ts
├── src/
│   ├── browser-runtime.js
│   ├── index.test.ts
│   └── index.ts
├── test/
│   ├── README.md
│   ├── integration-test.html
│   ├── integration.test.ts
│   ├── playback-fix.test.ts
│   ├── playback-simple.spec.js
│   ├── spa-navigation-debug.test.ts
│   ├── spa-navigation-test-README.md
│   └── spa-navigation-test.html
├── tsconfig.json
└── vitest.config.ts
```

## ファイル詳細説明
- **`.gitignore`**: Gitがバージョン管理の対象外とするファイルやディレクトリを指定するファイルです。
- **`DEBUG-LOGGING-SUMMARY.md`**: 開発中にデバッグログに関連して記録された情報のまとめドキュメントです。
- **`LICENSE`**: プロジェクトのライセンス情報（MIT License）を記載しています。
- **`README.ja.md`**: プロジェクトの日本語版説明書です。機能、インストール方法、使い方などが記述されています。
- **`README.md`**: プロジェクトの英語版説明書です。日本語版と同様にプロジェクトの概要を説明します。
- **`SPA-FIX-SUMMARY.md`**: Quartz v4のSPA（Single Page Application）ナビゲーション対応に関する修正内容や考慮事項をまとめたドキュメントです。
- **`_config.yml`**: GitHub Pagesなどの静的サイトホスティングサービスで使用される可能性のある設定ファイルです。
- **`demo.html`**: プラグインの機能を手動でテストするためのデモ用HTMLファイルです。
- **`example.md`**: プラグインの使用例を示すMarkdown形式のファイルです。
- **`generated-docs/`**: 自動生成されたドキュメントを格納するためのディレクトリです。
- **`package-lock.json`**: `package.json`に記載された依存関係の正確なバージョンと依存ツリーを記録し、ビルドの再現性を保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）と、依存関係、スクリプト、設定などを定義するファイルです。
- **`playwright.config.ts`**: Playwrightを使用したインテグレーションテストの設定ファイルです。
- **`src/browser-runtime.js`**: ブラウザ上で実行されるスクリプトです。Markdownから変換されたHTML要素を検出し、CDNからライブラリをロードして楽譜のレンダリング、オーディオ再生、SPAナビゲーションへの対応を行います。
- **`src/index.test.ts`**: メインプラグイン（`src/index.ts`）のユニットテストをVitestで実行するためのファイルです。AST変換ロジックなどがテストされます。
- **`src/index.ts`**: Quartzトランスフォーマープラグインのメイン実装ファイルです。Markdownのコードブロック（`mml`, `chord`, `abc`）を検出し、それらをブラウザでのレンダリングに必要なHTML構造に変換します。
- **`test/README.md`**: テストディレクトリに関する説明ドキュメントです。
- **`test/integration-test.html`**: インテグレーションテストで使用されるHTMLファイルの一つです。
- **`test/integration.test.ts`**: Playwrightを使用したインテグレーションテストの定義ファイルです。
- **`test/playback-fix.test.ts`**: 再生機能のバグ修正に関連するインテグレーションテストを記述したファイルです。
- **`test/playback-simple.spec.js`**: 再生機能のシンプルなシナリオをテストするJavaScriptファイルです。
- **`test/spa-navigation-debug.test.ts`**: SPAナビゲーションに関連するデバッグシナリオのインテグレーションテストを記述したファイルです。
- **`test/spa-navigation-test-README.md`**: SPAナビゲーションテストに関する説明ドキュメントです。
- **`test/spa-navigation-test.html`**: SPAナビゲーションテストで使用されるHTMLファイルの一つです。
- **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルです。コンパイルオプションなどが定義されています。
- **`vitest.config.ts`**: Vitestユニットテストフレームワークの設定ファイルです。

## 関数詳細説明
- **`wrapper`** (src/browser-runtime.js):
    - **役割**: ブラウザランタイムの主要なロジックをカプセル化し、実行を制御するラッパー関数です。初期化、イベントリスナーの登録、クリーンアップ処理などを管理します。
    - **引数**: なし
    - **戻り値**: なし
    - **機能**: Quartzのナビゲーションイベントを監視し、ページ遷移時に楽譜のレンダリングを再初期化し、不要なリソースをクリーンアップします。
- **`logNavDebug`** (src/browser-runtime.js):
    - **役割**: SPAナビゲーション時のデバッグ情報をコンソールに出力するためのユーティリティ関数です。
    - **引数**: なし
    - **戻り値**: なし
    - **機能**: 開発中にSPA動作の検証や問題特定を支援するために、ナビゲーションイベントや処理状況をログとして出力します。
- **`updateNotationTheme`** (src/browser-runtime.js):
    - **役割**: 楽譜の表示テーマ（例: ダークモード、ライトモード）をQuartzサイトのテーマに合わせて更新する関数です。
    - **引数**: なし
    - **戻り値**: なし
    - **機能**: サイト全体の見た目と楽譜の見た目を統一し、ユーザーエクスペリエンスを向上させます。
- **`getQuartzTheme`** (src/browser-runtime.js):
    - **役割**: 現在のQuartzサイトのテーマ設定（ダークモード/ライトモードなど）を取得する関数です。
    - **引数**: なし
    - **戻り値**: 現在のテーマを表す文字列（例: 'dark', 'light'）
    - **機能**: 楽譜のレンダリング時に適切なカラースキームを適用するために、QuartzのCSS変数などからテーマ情報を抽出します。
- **`initializeMusicNotation`** (src/browser-runtime.js):
    - **役割**: ページ内の楽譜コードブロックを検出し、`abcjs`やその他のコンバーター（`mml2abc`, `chord2mml`）を用いて楽譜をレンダリングし、オーディオシンセサイザーを初期化する中心的な関数です。
    - **引数**: `cleanupNeeded` (boolean) - クリーンアップが必要かどうかを示すフラグ。
    - **戻り値**: なし
    - **機能**: `mml`, `chord`, `abc`コードブロックの内容を解析し、必要に応じて変換（MML→ABC, Chord→MML→ABC）を行い、最終的に`abcjs`でSVGとして五線譜を表示し、再生可能な状態にします。
- **`handlePlayback`** (src/browser-runtime.js):
    - **役割**: 楽譜がクリックされた際やキーボード操作時に、対応する音楽を再生するイベントハンドラ関数です。
    - **引数**: `abc`オブジェクト (abcjsの内部オブジェクト)
    - **戻り値**: なし
    - **機能**: `abcjs`のオーディオ機能を利用して、表示された楽譜の音楽データを再生し、ユーザーにインタラクティブな体験を提供します。
- **`cleanup`** (src/browser-runtime.js):
    - **役割**: SPAナビゲーション時に、前のページの楽譜に関連するイベントリスナーやリソースを適切に解放するための関数です。
    - **引数**: なし
    - **戻り値**: なし
    - **機能**: メモリリークを防ぎ、新たなページがロードされた際に正しく楽譜が初期化されるように、不要な要素を削除し、イベントハンドラを解除します。
- **`handleNavigation`** (src/browser-runtime.js):
    - **役割**: QuartzのSPAナビゲーションイベントをリスニングし、ページ遷移が発生した際に`initializeMusicNotation`を呼び出して楽譜の再レンダリングをトリガーする関数です。
    - **引数**: なし
    - **戻り値**: なし
    - **機能**: ページ遷移時に楽譜が正しく表示され、機能することを保証し、ユーザーが快適にサイトを閲覧できるようにします。
- **`loadBrowserRuntime`** (src/index.ts):
    - **役割**: ブラウザ側で楽譜のレンダリングと再生を行う`browser-runtime.js`スクリプトを、生成されるHTMLに注入するためのトランスフォーマープラグインの一部です。
    - **引数**: なし
    - **戻り値**: unifiedのプラグイン関数
    - **機能**: Quartzのビルドプロセス中に、必要なJavaScriptファイルをウェブページに動的にロードさせるためのメカニズムを提供します。
- **`escapeHtml`** (src/index.ts):
    - **役割**: HTMLの特殊文字をエスケープ処理するユーティリティ関数です。
    - **引数**: `unsafe` (string) - エスケープする文字列
    - **戻り値**: エスケープされた文字列 (string)
    - **機能**: コードブロックの内容をHTML属性や要素内に安全に埋め込むために、クロスサイトスクリプティング (XSS) などのセキュリティ脆弱性を防ぎます。
- **`markdownPlugins`** (src/index.ts):
    - **役割**: Markdown内の特定のコードブロック（`mml`, `chord`, `abc`）を検出し、それらをカスタムHTML要素に変換するためのUnifiedプラグインを定義します。
    - **引数**: なし
    - **戻り値**: unifiedのプラグイン関数
    - **機能**: Quartzのビルド時AST変換フェーズで、楽譜データを含むコードブロックをブラウザ側で処理できる適切なHTML構造に置き換えます。
- **`externalResources`** (src/index.ts):
    - **役割**: プラグインが必要とする外部CSSやJavaScriptリソース（CDN経由でロードされるもの）を管理し、Quartzのビルド出力に追加するためのトランスフォーマーです。
    - **引数**: なし
    - **戻り値**: unifiedのプラグイン関数
    - **機能**: `abcjs`, `mml2abc`, `chord2mml` などのライブラリを適切にウェブページに含めることで、ブラウザランタイムが正しく機能するための依存関係を提供します。
- **`media`** (src/index.ts):
    - **役割**: Quartzのトランスフォーマーチェーンにカスタムメディア処理ロジックを追加する関数です。
    - **引数**: なし
    - **戻り値**: unifiedのプラグイン関数
    - **機能**: このプラグインのコンテキストでは、主に`markdownPlugins`を通じて`mml`, `chord`, `abc`コードブロックのメディア（音楽コンテンツ）変換を扱うための抽象化されたエントリポイントとして機能します。

## 関数呼び出し階層ツリー
```
- wrapper (src/browser-runtime.js)
  - logNavDebug ()
  - updateNotationTheme ()
    - getQuartzTheme ()
  - initializeMusicNotation ()
  - handlePlayback ()
  - cleanup ()
  - handleNavigation ()
- loadBrowserRuntime (src/index.ts)
  - escapeHtml ()
  - markdownPlugins ()
  - externalResources ()
- media (src/index.ts)

---
Generated at: 2026-02-02 07:02:12 JST
