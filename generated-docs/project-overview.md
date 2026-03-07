Last updated: 2026-03-08

# Project Overview

## プロジェクト概要
- このプロジェクトは、Quartz静的サイトでMarkdown内の音楽記法を五線譜として表示するプラグインです。
- コード進行、MML（Music Macro Language）、ABC記法に対応し、楽譜のレンダリングとクリックによる演奏機能を提供します。
- ブラウザ上で動的に楽譜を生成し、QuartzのSPA（Single Page Application）ナビゲーションにも完全対応しています。

## 技術スタック
- フロントエンド: 
  - **Quartz**: 高速でバッテリー同梱の静的サイトジェネレーターであり、本プラグインの実行環境となります。
  - **HTML/CSS/JavaScript**: ブラウザ上で楽譜のレンダリング、インタラクティブな操作、音楽再生機能を実現するために使用されます。
- 音楽・オーディオ: 
  - **abcjs**: ABC音楽記法をインタラクティブなSVG形式の五線譜としてブラウザでレンダリングするJavaScriptライブラリです。クリック演奏機能も提供します。
  - **mml2abc**: Music Macro Language (MML) 形式の音楽データをABC記法に変換するためのJavaScriptライブラリです。
  - **chord2mml**: コード進行記法（例: `C Dm7 G7 C`）をMML形式に変換するためのJavaScriptライブラリです。
- 開発ツール: 
  - **unified**: コンテンツの抽象構文木（AST）を解析、変換、シリアライズするためのインターフェースを提供するツールです。Markdownの解析に使用されます。
  - **unist-util-visit**: unifiedのエコシステム内で構文木を効率的に走査するためのユーティリティライブラリです。
  - **copyfiles**: ビルドプロセス中にファイルを指定の場所にコピーするために使用されるユーティリティです。
- テスト: 
  - **Vitest**: 高速で機能豊富なユニットテストフレームワークです。プラグインのAST変換ロジックなどの単体テストに使用されます。
  - **Playwright**: Chromium, Firefox, WebKitなどの主要なブラウザを自動化し、エンドツーエンドのインテグレーションテスト（ブラウザ上でのレンダリングやインタラクティブ機能の検証）を行うためのライブラリです。
  - **@vitest/ui**: Vitestのテスト実行結果をGUIで表示するユーザーインターフェースです。
- ビルドツール: 
  - **TypeScript**: 静的型付けを導入したJavaScriptのスーパーセットです。コードの品質向上、保守性、開発効率の向上に貢献し、最終的にJavaScriptにトランスパイルされます。
  - **npm**: Node.jsのパッケージマネージャーであり、プロジェクトの依存関係の管理、スクリプトの実行、パッケージのインストールに使用されます。
- 言語機能: 
  - **TypeScript**: 静的型付けにより、大規模なコードベースでの型安全な開発を可能にし、実行時エラーの削減に役立ちます。
- 自動化・CI/CD: 
  - **GitHub Actions**: リポジトリでのイベント（例: プッシュ、プルリクエスト）をトリガーに、依存関係のインストール、テストの実行、Quartzサイトのビルド、デプロイなどのワークフローを自動化するために使用されます。
- 開発標準: 
  - (特筆すべき開発標準ツールはプロジェクト情報に明示されていません)

## ファイル階層ツリー
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

## ファイル詳細説明
- **DEBUG-LOGGING-SUMMARY.md**: デバッグログの出力や解析に関する要約が記述されたドキュメントです。
- **ISSUE-71-FIX-SUMMARY.md**: プロジェクトで解決された特定の問題（Issue #71）の修正内容と経緯をまとめたドキュメントです。
- **LICENSE**: プロジェクトのライセンス情報（MIT License）が記述されたファイルです。
- **README.ja.md**: プロジェクトの目的、機能、使用方法、開発者向け情報などが日本語で詳細に説明された主要なドキュメントです。
- **README.md**: `README.ja.md`の英語版であり、プロジェクトの情報を英語で提供します。
- **SPA-FIX-SUMMARY.md**: QuartzのSPA（Single Page Application）ナビゲーション関連の課題と、その解決策に関する要約ドキュメントです。
- **_config.yml**: 特定の設定を定義するYAML形式のファイルです。プロジェクト全体の動作に影響する設定が含まれる可能性があります。
- **.gitignore**: Gitのバージョン管理システムが追跡しないファイルやディレクトリのパターンを定義するファイルです。ビルド生成物や一時ファイルなどを除外します。
- **demo.html**: プラグインの動作を手動で確認するためのデモ用HTMLファイルです。様々な音楽記法がどのようにレンダリング・再生されるかを試すことができます。
- **dist/**: TypeScriptコンパイラによって生成されたJavaScriptファイルと型定義ファイルが格納されるディレクトリです。
  - **dist/browser-runtime.js**: ブラウザの実行環境で動的に読み込まれ、音楽記法の解析、楽譜のレンダリング、音楽再生のロジックを担当するJavaScriptファイルです。
  - **dist/index.d.ts**: プラグインのメインファイル(`dist/index.js`)に対応するTypeScriptの型定義ファイルであり、外部から利用する際の型情報を提供します。
  - **dist/index.js**: Quartzトランスフォーマープラグインのメインファイルです。Quartzのビルドプロセス中にMarkdownのコードブロックをHTML要素に変換するサーバーサイド（ビルド時）のロジックが含まれます。
- **example.md**: プラグインの様々な音楽記法（MML, chord, abc）の使用例を示すMarkdownファイルです。
- **generated-docs/**: 自動生成されるドキュメント（例えば、開発状況のレポートなど）が格納されるディレクトリです。
- **issue-notes/**: 開発中に発見された特定の問題（Issue）に関する調査、議論、解決策のメモが格納されているディレクトリです。
  - **issue-notes/25.md**, **issue-notes/31.md**, etc.: 各ファイルが特定のIssueに関する詳細な記録を保持しています。
- **package-lock.json**: `package.json`に記述された依存関係の正確なツリー構造とバージョンを記録するファイルであり、再現可能なビルドを保証します。
- **package.json**: Node.jsプロジェクトのメタデータ（プロジェクト名、バージョン、スクリプト、依存関係など）を定義するファイルです。
- **playwright.config.ts**: Playwrightを用いたブラウザベースのインテグレーションテストの設定ファイルです。テスト環境や実行オプションを定義します。
- **src/**: プロジェクトのソースコードが格納されるディレクトリです。
  - **src/ast-abc-multiple.test.ts**: 複数行のABC記法ブロックのAST変換ロジックをテストするためのユニットテストファイルです。
  - **src/ast-mml-chord.test.ts**: MMLおよびコード進行ブロックのAST変換ロジックをテストするためのユニットテストファイルです。
  - **src/browser-runtime.js**: `dist/browser-runtime.js`の元となるソースファイルであり、ブラウザ側での動的な楽譜処理を担当します。
  - **src/index.test.ts**: プラグインの主要なロジック(`src/index.ts`)のユニットテストを記述したファイルです。
  - **src/index.ts**: Quartzトランスフォーマープラグインのメインソースコードです。Markdownの抽象構文木(AST)を処理し、音楽記法ブロックをブラウザ側で処理するためのHTML要素に変換します。
- **test/**: 様々な種類のテスト関連ファイルが格納されるディレクトリです。
  - **test/README.md**: テストディレクトリに関する情報や、テストの実行方法などを説明するドキュメントです。
  - **test/integration-test.html**: インテグレーションテストで使用される静的なHTMLファイルです。
  - **test/integration.test.ts**: Playwrightを用いた、実際のブラウザでの楽譜レンダリングとインタラクティブ機能の検証を行うインテグレーションテストファイルです。
  - **test/playback-fix.test.ts**: 楽譜の再生機能における特定の修正を検証するためのPlaywrightテストファイルです。
  - **test/playback-simple.spec.js**: 楽譜の基本的な再生機能をテストするPlaywrightのスペックファイルです。
  - **test/spa-navigation-debug.test.ts**: QuartzのSPAナビゲーション環境下でのデバッグとテストを行うためのファイルです。
  - **test/spa-navigation-runtime.js**: SPAナビゲーションテストのためにブラウザで実行されるランタイムスクリプトです。
  - **test/spa-navigation-test-README.md**: SPAナビゲーションテストに関する詳細な説明ドキュメントです。
  - **test/spa-navigation-test.html**: SPAナビゲーションテスト用のHTMLファイルです。
- **tsconfig.json**: TypeScriptコンパイラのための設定ファイルです。コンパイルのターゲット、モジュール解決、出力ディレクトリなどのオプションを定義します。
- **vitest.config.ts**: Vitestテストフレームワークのための設定ファイルであり、テストの実行方法やカバレッジレポートに関するオプションを定義します。

## 関数詳細説明
- **`wrapper`**: (dist/browser-runtime.js, src/browser-runtime.js)
    - **役割**: ブラウザランタイムコード全体をカプセル化し、グローバルスコープを汚染せずにプラグインの機能を初期化します。
    - **機能**: ページ読み込み後またはSPAナビゲーション時に、音楽記法ブロックの検出、レンダリング、再生機能のセットアップを行います。
- **`logNavDebug`**: (dist/browser-runtime.js)
    - **役割**: QuartzのSPAナビゲーションイベントに関連するデバッグ情報をコンソールに出力します。
    - **機能**: ページ遷移時に発生するイベントや処理の状況を可視化し、デバッグを支援します。
- **`updateNotationTheme`**: (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    - **役割**: レンダリングされた楽譜の配色を現在のQuartzサイトのテーマ（ライト/ダークモードなど）に合わせて調整します。
    - **機能**: サイト全体の見た目と楽譜の表示の一貫性を保ちます。
- **`getQuartzTheme`**: (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    - **役割**: 現在のQuartzサイトが使用しているテーマ（ライトまたはダーク）を検出します。
    - **機能**: `document.documentElement`のクラス属性などを参照して、アクティブなテーマを特定します。
- **`initializeMusicNotation`**: (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    - **役割**: ページ内の音楽記法ブロック（MML, chord, abc）を検出し、それらを五線譜としてレンダリングし、演奏可能にします。
    - **機能**: `abcjs`、`mml2abc`、`chord2mml`ライブラリを利用して、コードブロックの内容をSVGの五線譜に変換し、クリックイベントハンドラーを追加して音楽再生を可能にします。
- **`handlePlayback`**: (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    - **役割**: レンダリングされた楽譜がクリックされた際（またはキーボードで操作された際）の音楽再生を処理します。
    - **機能**: AudioContextを用いて、指定された楽譜の音楽データを再生します。
- **`cleanup`**: (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    - **役割**: SPAナビゲーション時やページ離脱時に、登録されたイベントリスナーやリソースを解放します。
    - **機能**: メモリリークを防ぎ、アプリケーションがクリーンな状態を維持できるようにします。
- **`handleNavigation`**: (dist/browser-runtime.js, src/browser-runtime.js)
    - **役割**: QuartzのSPAナビゲーションイベントを監視し、新しいページの内容に応じて音楽記法のレンダリングと初期化を再実行します。
    - **機能**: ユーザーがページ間を移動しても、音楽記法が正しく表示され、機能するようにします。
- **`loadBrowserRuntime`**: (dist/index.js, src/index.ts)
    - **役割**: ブラウザで実行されるランタイムスクリプト（`browser-runtime.js`）をQuartzサイトの最終的なHTMLに注入します。
    - **機能**: ビルド時に、動的な楽譜レンダリングと再生機能に必要なJavaScriptコードをページに追加します。
- **`escapeHtml`**: (dist/index.js, src/index.ts)
    - **役割**: HTML特殊文字を安全なHTMLエンティティに変換します。
    - **機能**: Markdownの内容をHTMLに変換する際に、不正なHTML出力やクロスサイトスクリプティング（XSS）の脆弱性を防ぎます。
- **`MMLABCTransformer`**: (dist/index.js, src/index.ts)
    - **役割**: Quartzトランスフォーマープラグインの主要なエントリポイントです。
    - **機能**: Quartzのビルドプロセス中、Markdownの抽象構文木を走査し、`mml`、`chord`、`abc`の言語タグを持つコードブロックを検出し、ブラウザで処理するための特別なHTML要素に変換します。
- **`markdownPlugins`**: (dist/index.js, src/index.ts)
    - **役割**: Markdownの解析と変換に使用されるunifiedJSプラグインのリストを定義します。
    - **機能**: `MMLABCTransformer`を含むカスタムプラグインがMarkdown処理のパイプラインに組み込まれるようにします。
- **`externalResources`**: (dist/index.js, src/index.ts)
    - **役割**: 外部からCDN経由で読み込むJavaScriptやCSSリソースをQuartzサイトに登録します。
    - **機能**: `abcjs`、`mml2abc`、`chord2mml`などのライブラリが動的にロードされるためのURLを提供します。
- **`media`**: (dist/index.js)
    - **役割**: 特定のメディア関連情報を処理する可能性があります。
    - **機能**: 詳細な機能はプロジェクト情報から明確ではありませんが、ビルドプロセス中のメディアリソースの管理に関連する処理を行うことが推測されます。
- **`events`**: (test/spa-navigation-runtime.js)
    - **役割**: SPAナビゲーションテストのために、特定のイベントリスナーを登録します。
    - **機能**: テスト環境において、Quartzの`nav`イベントなどのカスタムイベントを監視し、SPAナビゲーション時の動作を検証します。

## 関数呼び出し階層ツリー
```
- wrapper (dist/browser-runtime.js)
  - logNavDebug ()
    - updateNotationTheme ()
      - getQuartzTheme ()
      - initializeMusicNotation ()
      - handlePlayback ()
      - cleanup ()
      - handleNavigation ()
      - function ()
      - forEach ()
      - then ()
      - catch ()
      - addEventListener ()
      - MutationObserver ()
      - setTimeout ()
      - finally ()
- if (dist/browser-runtime.js)
  - loadBrowserRuntime (dist/index.js)
    - escapeHtml ()
      - MMLABCTransformer ()
      - markdownPlugins ()
      - externalResources ()
- for (dist/browser-runtime.js)
- media (dist/index.js)
- events (test/spa-navigation-runtime.js)

---
Generated at: 2026-03-08 07:02:01 JST
