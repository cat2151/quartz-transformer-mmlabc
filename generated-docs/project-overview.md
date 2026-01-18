Last updated: 2026-01-19

# Project Overview

## プロジェクト概要
- Obsidianで、コード進行をコードブロックに書くと、五線譜を表示して鳴らすことができます。
- Quartz v4でも同様の機能を実現するため、新たにトランスフォーマープラグインとして開発されました。
- Music Macro Language (MML) とABC Notationのどちらの記法も利用して楽譜を作成・再生できます。

## 技術スタック
- フロントエンド:
    - **Quartz**: 高速でバッテリー同梱の静的サイトジェネレーターで、本プラグインはQuartzのトランスフォーマープラグインとして動作します。
    - **abcjs**: ABC音楽記法をブラウザ上でインタラクティブなSVGとしてレンダリングし、クリック再生機能を提供します。
    - **HTML/CSS/JavaScript**: 生成された静的サイトの表示とインタラクティブな機能は、これらの標準的なWeb技術によって実現されます。
- 音楽・オーディオ:
    - **ABC Notation**: 音楽記譜のためのオープンスタンダードなテキストベースの記法。
    - **MML (Music Macro Language)**: 音楽をテキストで記述するための言語。
    - **mml2abc**: MML記法をABC記法に変換するためのライブラリ（CDN経由で動的に読み込み）。
    - **chord2mml**: コード進行記法をMMLに変換するためのライブラリ（CDN経由で動的に読み込み）。
    - **Web Audio API (AudioContext)**: ブラウザ内で音声の再生、合成、操作を行うためのAPI。楽譜の再生機能に利用されます。
- 開発ツール:
    - **Node.js/npm**: プロジェクトのビルド、テスト、依存関係管理に使用されるJavaScriptランタイムおよびパッケージマネージャー。
    - **TypeScript**: 静的型付けを導入し、大規模なJavaScriptアプリケーション開発を支援する言語。
    - **unified**: コンテンツの解析と変換のためのJavaScriptインターフェース。Markdownの抽象構文木（AST）を操作するのに使用されます。
    - **unist-util-visit**: `unified`と共に使用される、ASTを効率的に走査するためのユーティリティライブラリ。
- テスト:
    - **Vitest**: 高速なユニットテストフレームワーク。AST変換ロジックなどの内部機能を検証します。
    - **Playwright**: ブラウザの自動化とインテグレーションテストフレームワーク。実際のブラウザ環境での楽譜レンダリングや再生、SPAナビゲーションの動作を検証します。
- ビルドツール:
    - **TypeScript Compiler (tsc)**: TypeScriptコードをJavaScriptにコンパイルし、配布可能な`dist`ディレクトリを生成します。
- 言語機能:
    - **ES Modules (ESM)**: JavaScriptの標準的なモジュールシステム。`mml2abc`などの外部ライブラリの動的インポートに利用されます。
    - **UMD (Universal Module Definition)**: JavaScriptモジュールの定義形式の一つ。`chord2mml`の読み込みに使用されます。
- 自動化・CI/CD:
    - **GitHub Actions**: コードのビルド、テスト、デプロイなどのワークフローを自動化するサービス。プラグインのインストールやビルドも自動化されます。
    - **Dependabot**: 依存関係のセキュリティアップデートやバージョン更新を自動化し、プルリクエストを生成します。
- 開発標準:
    - **tsconfig.json**: TypeScriptコンパイラの設定を定義し、プロジェクト全体の型チェックやコンパイル挙動を管理します。
    - **package.json**: プロジェクトのメタデータ、スクリプト、および開発・実行時の依存関係が定義されています。

## ファイル階層ツリー
```
📄 .gitignore
📖 DEBUG-LOGGING-SUMMARY.md
📄 LICENSE
📖 README.ja.md
📖 README.md
📖 SPA-FIX-SUMMARY.md
📄 _config.yml
🌐 demo.html
📖 example.md
📁 generated-docs/
📁 issue-notes/
  📖 19.md
  📖 21.md
  📖 22.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 31.md
  📖 32.md
  📖 33.md
  📖 34.md
  📖 38.md
  📖 40.md
  📖 42.md
  📖 44-investigation.md
  📖 44.md
  📖 46-solution.md
  📖 46.md
  📖 47.md
  📖 50.md
  📖 51-solution.md
  📖 51.md
  📖 53.md
  📖 55.md
  📖 56-solution.md
  📖 56.md
  📖 58.md
  📖 59.md
  📖 61.md
  📖 63.md
  📖 65.md
  📖 67-solution.md
  📖 67.md
  📖 69.md
📊 package-lock.json
📊 package.json
📘 playwright.config.ts
📁 src/
  📘 index.test.ts
  📘 index.ts
📁 test/
  📖 README.md
  🌐 integration-test.html
  📘 integration.test.ts
  📘 playback-fix.test.ts
  📜 playback-simple.spec.js
  📘 spa-navigation-debug.test.ts
  📖 spa-navigation-test-README.md
  🌐 spa-navigation-test.html
📊 tsconfig.json
📘 vitest.config.ts
```

## ファイル詳細説明
- **`.gitignore`**: Gitのバージョン管理から除外するファイルやディレクトリを指定する設定ファイルです。
- **`DEBUG-LOGGING-SUMMARY.md`**: デバッグロギングに関する情報や要約を記述したドキュメントです。
- **`LICENSE`**: プロジェクトのライセンス情報（MIT License）を記載したファイルです。
- **`README.ja.md`**: プロジェクトの概要、機能、インストール、使用方法などを日本語で説明するメインドキュメントです。
- **`README.md`**: プロジェクトの概要、機能、インストール、使用方法などを英語で説明するドキュメントです。
- **`SPA-FIX-SUMMARY.md`**: Single Page Application (SPA) ナビゲーションの修正に関する情報や要約を記述したドキュメントです。
- **`_config.yml`**: QuartzサイトジェネレーターやGitHub Pagesなどの設定ファイルである可能性があります。
- **`demo.html`**: プラグインの機能を手動でテストするためのデモ用HTMLファイルです。ブラウザでの楽譜レンダリングと再生を確認するために使用されます。
- **`example.md`**: プラグインの使用例を示すMarkdownファイルです。
- **`generated-docs/`**: 自動生成されたドキュメントを格納するディレクトリです。
- **`issue-notes/`**: GitHub Issuesなど、特定の課題や問題点に関するメモや解決策を記述したMarkdownファイルを格納するディレクトリです。
- **`package-lock.json`**: `package.json`で定義された依存関係の正確なツリー構造とバージョンを記録し、再現可能なビルドを保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン）、スクリプト（ビルド、テスト）、および開発・実行時の依存関係を定義するファイルです。
- **`playwright.config.ts`**: Playwrightテストフレームワークの設定ファイルで、インテグレーションテストの実行環境やオプションを定義します。
- **`src/index.test.ts`**: メインプラグイン（`src/index.ts`）のユニットテストコードです。Vitestを使用して、AST変換ロジック、オプション処理、HTMLエスケープなど、さまざまな側面を検証します。
- **`src/index.ts`**: このQuartzトランスフォーマープラグインのメイン実装ファイルです。Markdownのコードブロック（`mml`, `chord`, `abc`）を検出し、それらをHTML要素に変換し、ブラウザ内で楽譜のレンダリングと音楽再生を可能にするためのJavaScriptロジックが含まれています。SPAナビゲーション対応や外部CDNライブラリの動的ロードもここで管理されます。
- **`test/`**: テスト関連ファイルを格納するディレクトリです。
    - **`test/README.md`**: テストディレクトリに関する情報や説明を記述したドキュメントです。
    - **`test/integration-test.html`**: Playwrightによるインテグレーションテストで使用されるHTMLファイルです。
    - **`test/integration.test.ts`**: Playwrightを使用したブラウザベースのインテグレーションテストコードです。実際のレンダリング、再生、インタラクションを検証します。
    - **`test/playback-fix.test.ts`**: 再生機能の特定のバグ修正に関連するインテグレーションテストです。
    - **`test/playback-simple.spec.js`**: シンプルな楽譜の再生機能を確認するためのPlaywrightテストです。
    - **`test/spa-navigation-debug.test.ts`**: SPAナビゲーション関連のデバッグや特定のケースを検証するためのPlaywrightテストです。
    - **`test/spa-navigation-test-README.md`**: SPAナビゲーションテストに関する説明ドキュメントです。
    - **`test/spa-navigation-test.html`**: SPAナビゲーションテストで使用されるHTMLファイルです。
- **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルで、コンパイルオプション（ターゲットJSバージョン、モジュール解決、型定義ファイルのパスなど）を定義します。
- **`vitest.config.ts`**: Vitestテストフレームワークの設定ファイルで、ユニットテストの実行オプションや環境を定義します。

## 関数詳細説明
- **`wrapper` (src/index.ts)**:
    - **役割**: プラグインの主要なロジックをカプセル化し、Quartzトランスフォーマーのインターフェースに適合させるための高階関数またはエントリポイント。Markdownの抽象構文木(AST)を受け取り、変換処理を適用したASTを返します。
- **`escapeHtml` (src/index.ts)**:
    - **役割**: HTML特殊文字（`<`, `>`, `&`, `"`など）を対応するHTMLエンティティに変換し、サニタイズされた文字列を生成するユーティリティ関数。XSS攻撃の防止や、安全なHTMLコンテンツの埋め込みに貢献します。
- **`updateNotationTheme` (src/index.ts)**:
    - **役割**: 楽譜の表示テーマ（色やスタイル）を更新する関数。Quartzサイトの現在のテーマ設定（ダークモード/ライトモードなど）に基づいて、レンダリングされる楽譜の見た目を調整する役割を持つと考えられます。
- **`getQuartzTheme` (src/index.ts)**:
    - **役割**: 現在のQuartzサイトのテーマ設定（例: `light`または`dark`）を取得する関数。この情報に基づいて楽譜のテーマを決定します。
- **`initializeMusicNotation` (src/index.ts)**:
    - **役割**: ページ内の楽譜レンダリング機能とオーディオ再生機能を初期化する関数。`abcjs`ライブラリのロード、楽譜要素の検出、レンダリング、オーディオシンセサイザーのセットアップなどを行います。
- **`handlePlayback` (src/index.ts)**:
    - **役割**: 楽譜がクリックされたり、キーボード操作で再生がトリガーされたりした際に、音楽再生ロジックを実行する関数。`abcjs`のオーディオ機能と連携し、楽譜の内容に基づいて音声を生成・再生します。
- **`cleanup` (src/index.ts)**:
    - **役割**: Single Page Application (SPA) ナビゲーション中に、以前のページのDOM要素やイベントリスナー、AudioContextなどのリソースを適切に解放・破棄する関数。メモリリークを防ぎ、アプリケーションの安定性を保ちます。
- **`handleNavigation` (src/index.ts)**:
    - **役割**: QuartzのSPAナビゲーションイベントを監視し、ページ遷移が発生した際に`initializeMusicNotation`や`cleanup`などの関連する処理をトリガーする関数。ページが再ロードされることなくコンテンツが切り替わるSPA環境での楽譜機能の継続性を保証します。
- **`markdownPlugins` (src/index.ts)**:
    - **役割**: MarkdownのASTを操作するための`unified`プラグインを定義、または返す関数。このプラグインは`mml`、`chord`、`abc`コードブロックを検出・変換するロジックを内包していると考えられます。
- **`externalResources` (src/index.ts)**:
    - **役割**: 外部のCDNから`abcjs`、`mml2abc`、`chord2mml`などのJavaScriptライブラリを動的に読み込むためのロジックを管理する関数。必要なライブラリを一度だけロードし、キャッシュすることでパフォーマンスを最適化します。
- **`function` (src/index.ts)**:
    - **役割**: 一般的なJavaScriptの関数定義。コード内で匿名関数や特定の名前を持たない関数が使用されていることを示します。
- **`for` (src/index.ts)**:
    - **役割**: 一般的なループ構造。配列やコレクションの要素を反復処理するために使用されます。
- **`forEach` (src/index.ts)**:
    - **役割**: 配列の各要素に対して提供された関数を一度ずつ実行する配列メソッド。要素の反復処理に利用されます。
- **`then` (src/index.ts)**:
    - **役割**: Promiseオブジェクトの成功時のコールバック関数を指定するメソッド。非同期処理が成功した場合に実行されるロジックを定義します。
- **`catch` (src/index.ts)**:
    - **役割**: Promiseオブジェクトの失敗時のコールバック関数を指定するメソッド。非同期処理が失敗した場合のエラーハンドリングロジックを定義します。
- **`addEventListener` (src/index.ts)**:
    - **役割**: 特定のイベント（例: クリック、ナビゲーション）が発生した際に実行されるイベントハンドラーを要素に登録するWeb API。
- **`some` (src/index.ts)**:
    - **役割**: 配列の要素のいずれかが指定されたテスト関数によって提供された条件を満たすかどうかをテストする配列メソッド。条件が満たされた場合は`true`を返し、そうでなければ`false`を返します。
- **`media` (src/index.ts)**:
    - **役割**: CSS Media Queriesに関連する処理、またはメディア要素（音声、動画）に関する処理。レスポンシブデザインの適応やメディアの操作に使用される可能性があります。

## 関数呼び出し階層ツリー
```
- wrapper (src/index.ts)
  - escapeHtml ()
  - updateNotationTheme ()
    - getQuartzTheme ()
  - initializeMusicNotation ()
  - handlePlayback ()
  - cleanup ()
  - handleNavigation ()
  - markdownPlugins ()
  - externalResources ()
  - function ()
  - forEach ()
  - for ()
  - then ()
  - catch ()
  - addEventListener ()
  - some ()
  - media ()
- if (src/index.ts)
- for (src/index.ts)
- media (src/index.ts)

---
Generated at: 2026-01-19 07:02:04 JST
