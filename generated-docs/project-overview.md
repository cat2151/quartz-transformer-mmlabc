Last updated: 2026-03-02

# Project Overview

## プロジェクト概要
- Markdown形式で書かれたコード進行やMML記法から、五線譜を生成しブラウザ上に表示します。
- 表示された楽譜はクリックすることで演奏可能であり、Quartz v4の静的サイトジェネレーターにプラグインとして組み込まれます。
- MML (Music Macro Language) とABC Notationの両方に対応し、コード進行の表現を豊かにします。

## 技術スタック
- フロントエンド:
    - **abcjs**: ABC音楽記法をSVGでレンダリングし、オーディオ再生機能を提供するJavaScriptライブラリ。CDN経由で動的にロードされます。
    - **mml2abc**: MML記法をABC記法に変換するJavaScriptライブラリ。CDN経由で動的にESモジュールとしてロードされます。
    - **chord2mml**: コード進行記法をMMLに変換するJavaScriptライブラリ。CDN経由で動的にUMDバンドルとしてロードされます。
- 音楽・オーディオ:
    - **abcjs**: 楽譜のレンダリングだけでなく、ブラウザのAudioContextを利用して楽譜の再生を担当します。
    - **mml2abc**: ユーザーが記述したMMLを音楽処理に適したABC記法に変換します。
    - **chord2mml**: ユーザーが記述したコード進行をMMLに変換し、さらにABC記法へと繋げます。
- 開発ツール:
    - **TypeScript**: 静的型付けを導入し、JavaScript開発の堅牢性と保守性を向上させる言語。
    - **Node.js**: JavaScriptランタイム環境。開発環境およびビルドスクリプトの実行に使用されます。
    - **npm**: JavaScriptのパッケージ管理ツール。依存関係のインストールとプロジェクトスクリプトの実行に使用されます。
- テスト:
    - **Vitest**: 高速なユニットテストフレームワーク。AST変換ロジックなどの単体テストに使用されます。
    - **Playwright**: ブラウザ自動化ライブラリ。ブラウザ上でのレンダリングやインタラクティブ機能のインテグレーションテストに使用されます。
- ビルドツール:
    - **TypeScript Compiler (tsc)**: TypeScriptコードをJavaScriptにコンパイルします。
    - **unified**: コンテンツの抽象構文木 (AST) を解析・変換するための統一インターフェース。
    - **unist-util-visit**: unifiedエコシステムの一部で、ASTを効率的に走査しノードを訪問するためのユーティリティ。
- 言語機能:
    - **TypeScript**: 最新のJavaScript機能に加えて、型安全性を提供し、大規模プロジェクトでの開発を支援します。
- 自動化・CI/CD:
    - **GitHub Actions**: リポジトリの変更をトリガーとして、テストの実行、プラグインの更新、Quartzサイトのビルドとデプロイなどのワークフローを自動化します。
- 開発標準:
    - **tsconfig.json**: TypeScriptコンパイラの設定を定義し、プロジェクト全体のコード品質と一貫性を保証します。

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
- **`.gitignore`**: Gitがバージョン管理の対象外とするファイルやディレクトリを指定します。
- **`DEBUG-LOGGING-SUMMARY.md`**: デバッグロギングに関する要約ドキュメントです。
- **`ISSUE-71-FIX-SUMMARY.md`**: 特定のIssue（Issue #71）の修正に関する要約ドキュメントです。
- **`LICENSE`**: プロジェクトのライセンス情報（MIT License）を記載しています。
- **`README.ja.md`**: プロジェクトの日本語版説明書です。プロジェクトの概要、機能、使い方、開発情報などが含まれます。
- **`README.md`**: プロジェクトの英語版説明書です。日本語版を元に自動生成されています。
- **`SPA-FIX-SUMMARY.md`**: SPA (Single Page Application) ナビゲーションの修正に関する要約ドキュメントです。
- **`_config.yml`**: GitHub PagesのJekyll設定ファイルです。
- **`demo.html`**: プラグインの機能を手動でテストするためのデモ用HTMLファイルです。様々なMML、コード進行、ABC記法のサンプルが含まれています。
- **`dist/`**: `src`ディレクトリ内のTypeScriptコードがJavaScriptにコンパイルされた成果物を格納するディレクトリです。
    - **`dist/browser-runtime.js`**: ブラウザ上で実行されるJavaScriptコード。楽譜のレンダリング、再生、SPAナビゲーションへの対応など、インタラクティブな機能を提供します。
    - **`dist/index.d.ts`**: TypeScriptの型定義ファイル。プラグインのAPIがどのような型を持つかを定義し、TypeScriptプロジェクトでの利用を容易にします。
    - **`dist/index.js`**: プラグインのメインロジックを含むJavaScriptファイル。QuartzのビルドプロセスでMarkdownのASTを変換します。
- **`example.md`**: プラグインの使用例を示すMarkdownファイルです。
- **`generated-docs/`**: 自動生成されたドキュメントを格納するディレクトリです。例えば、開発状況のドキュメントなどが含まれます。
- **`issue-notes/`**: 過去のIssueに関するメモや詳細情報が格納されているディレクトリです。
- **`package-lock.json`**: `package.json`に記述された依存関係の正確なツリー構造とバージョンを記録し、ビルドの一貫性を保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）、スクリプト、依存関係が定義されています。
- **`playwright.config.ts`**: Playwrightのインテグレーションテスト設定ファイルです。テスト環境や実行オプションなどを指定します。
- **`src/`**: プロジェクトのソースコードを格納するディレクトリです。
    - **`src/browser-runtime.js`**: `dist/browser-runtime.js`のソースコード。ブラウザ側で楽譜のレンダリングと再生を担当します。
    - **`src/index.test.ts`**: プラグインのユニットテストコード。`src/index.ts`のAST変換ロジックなどを検証します。
    - **`src/index.ts`**: プラグインのメイン実装。Quartzトランスフォーマーとして、Markdownのコードブロックを解析し、HTMLに変換するロジックが含まれています。
- **`test/`**: 各種テスト関連ファイルを格納するディレクトリです。
    - **`test/README.md`**: テストディレクトリに関する説明書です。
    - **`test/integration-test.html`**: インテグレーションテストで使用されるHTMLファイルです。
    - **`test/integration.test.ts`**: Playwrightを使用したインテグレーションテストコード。ブラウザ上での機能の結合を検証します。
    - **`test/playback-fix.test.ts`**: 再生機能の修正に関するPlaywrightテストコードです。
    - **`test/playback-simple.spec.js`**: シンプルな再生機能のPlaywrightテストコードです。
    - **`test/spa-navigation-debug.test.ts`**: SPAナビゲーションデバッグ用のPlaywrightテストコードです。
    - **`test/spa-navigation-test-README.md`**: SPAナビゲーションテストに関する説明書です。
    - **`test/spa-navigation-test.html`**: SPAナビゲーションテストで使用されるHTMLファイルです。
- **`tsconfig.json`**: TypeScriptのコンパイラ設定ファイルです。コンパイルオプション、ターゲットECMAScriptバージョン、モジュール解決などが定義されています。
- **`vitest.config.ts`**: Vitestのユニットテスト設定ファイルです。テストの実行方法やカバレッジ設定などを指定します。

## 関数詳細説明
- **`wrapper`**:
    - 役割: `browser-runtime.js`の主要なロジックをカプセル化し、DOMが完全にロードされた後、またはQuartzのSPAナビゲーションイベント発生時に、音楽表記の初期化とクリーンアップを実行します。
    - 引数: なし
    - 戻り値: なし
    - 機能: イベントリスナーを設定し、`initializeMusicNotation`や`cleanup`などの関数を適切なタイミングで呼び出します。
- **`logNavDebug`**:
    - 役割: QuartzのSPAナビゲーション関連のデバッグ情報をコンソールに出力します。
    - 引数: なし
    - 戻り値: なし
    - 機能: 開発者がSPAナビゲーション時の動作を追跡するのに役立つログを提供します。
- **`updateNotationTheme`**:
    - 役割: Quartzサイトの現在のテーマ（ライトモードまたはダークモード）に基づいて、楽譜の表示テーマを調整します。
    - 引数: `theme` (string) - 現在のサイトテーマ（例: "light", "dark"）
    - 戻り値: なし
    - 機能: サイトの見た目に合わせて楽譜の色や背景を動的に変更し、一貫したユーザー体験を提供します。
- **`getQuartzTheme`**:
    - 役割: 現在のQuartzサイトのテーマ（ライトモードまたはダークモード）を検出し、その情報を返します。
    - 引数: なし
    - 戻り値: string - "light" または "dark"
    - 機能: サイトのCSSクラスや設定を読み取り、現在のテーマ状態を判断します。
- **`initializeMusicNotation`**:
    - 役割: ページ内のMML、コード進行、ABC記法のコードブロックを検出し、対応するライブラリ（mml2abc, chord2mml, abcjs）を動的にロードして、五線譜としてレンダリングします。
    - 引数: なし
    - 戻り値: Promise<void> - 音楽表記の初期化が完了したときに解決されます。
    - 機能: ABC記法への変換、abcjsによるSVGレンダリング、そしてクリックによる音楽再生機能のセットアップを行います。
- **`handlePlayback`**:
    - 役割: レンダリングされた五線譜のクリックイベントを処理し、対応する音楽データを再生します。
    - 引数: `target` (HTMLElement) - クリックされた楽譜の要素。
    - 戻り値: なし
    - 機能: `abcjs`のオーディオシンセサイザーを制御し、楽譜の再生を開始/停止します。
- **`cleanup`**:
    - 役割: ページ遷移時やリソース解放が必要な際に、AudioContextなどのブラウザリソースを適切にクリーンアップします。
    - 引数: なし
    - 戻り値: なし
    - 機能: メモリリークを防ぎ、リソースを効率的に管理します。
- **`handleNavigation`**:
    - 役割: Quartz v4のSPAナビゲーションイベント（ページ遷移）を監視し、新しいページの内容に応じて音楽表記を再初期化します。
    - 引数: なし
    - 戻り値: なし
    - 機能: ページ遷移後も楽譜が正しく表示され、再生可能であることを保証します。
- **`function`**:
    - 役割: プロジェクト内で使用される汎用的な無名関数またはコールバック関数です。
    - 引数: 特定の文脈に依存
    - 戻り値: 特定の文脈に依存
    - 機能: イベントリスナーのコールバックや非同期処理のハンドラーなど、様々な目的で使用されます。
- **`if` (条件分岐)**:
    - 役割: プロジェクト内の様々な箇所で、特定の条件が満たされた場合にのみコードブロックを実行するために使用されます。
    - 引数: なし（JavaScriptの制御構文）
    - 戻り値: なし
    - 機能: ロジックフローを制御し、条件に応じた処理の実行を可能にします。
- **`forEach`**:
    - 役割: 配列やリストの各要素に対して、指定された関数を一度ずつ実行するために使用されます。
    - 引数: なし（JavaScriptの配列メソッド）
    - 戻り値: なし
    - 機能: コレクション内のすべての要素に対して反復処理を行います。
- **`for`**:
    - 役割: 特定の回数だけ、または特定の条件が満たされるまで、コードブロックを繰り返し実行するために使用されるループ構造です。
    - 引数: なし（JavaScriptの制御構文）
    - 戻り値: なし
    - 機能: 反復処理の基本として利用されます。
- **`then`**:
    - 役割: Promiseが正常に解決（成功）されたときに実行されるコールバック関数を指定します。
    - 引数: なし（JavaScriptのPromiseメソッド）
    - 戻り値: Promise - チェーン可能な新しいPromiseを返します。
    - 機能: 非同期処理の成功時の後続処理を定義します。
- **`catch`**:
    - 役割: Promiseが拒否（エラー発生）されたときに実行されるコールバック関数を指定します。
    - 引数: なし（JavaScriptのPromiseメソッド）
    - 戻り値: Promise - チェーン可能な新しいPromiseを返します。
    - 機能: 非同期処理におけるエラーハンドリングを行います。
- **`addEventListener`**:
    - 役割: DOM要素やその他のオブジェクトに特定のイベントが発生したときに実行されるイベントハンドラーを登録します。
    - 引数: なし（JavaScriptのDOMメソッド）
    - 戻り値: なし
    - 機能: ユーザーインタラクションやシステムイベントに応答するインタラクティブな機能を実現します。
- **`loadBrowserRuntime`**:
    - 役割: Quartzのビルドプロセス中に、ブラウザ側で楽譜のレンダリングと再生を担当するJavaScriptコード（`browser-runtime.js`の内容）を最終的なHTMLファイルに注入します。
    - 引数: なし
    - 戻り値: なし
    - 機能: クライアントサイドでの動的な機能を実現するために必要なスクリプトをページに追加します。
- **`escapeHtml`**:
    - 役割: HTML特殊文字（`<`, `>`, `&`, `"`, `'`など）を対応するHTMLエンティティに変換し、クロスサイトスクリプティング (XSS) 攻撃などのセキュリティ脆弱性を防ぎます。
    - 引数: なし
    - 戻り値: なし
    - 機能: ユーザー生成コンテンツが安全にHTMLとして表示されることを保証します。
- **`MMLABCTransformer`**:
    - 役割: このプラグインのメインとなるQuartzトランスフォーマー関数。Markdownの抽象構文木 (AST) を走査し、`mml`, `chord`, `abc`言語タグを持つコードブロックを、ブラウザで処理可能なHTMLの`div`要素に変換します。
    - 引数: なし
    - 戻り値: Quartzのプラグインインターフェースに準拠したオブジェクト
    - 機能: Markdownコンテンツを静的なHTMLに変換するQuartzのビルドプロセスに組み込まれ、動的な楽譜レンダリングのための基盤を準備します。
- **`markdownPlugins`**:
    - 役割: Markdownの解析と変換に関連するプラグインの集合。
    - 引数: なし
    - 戻り値: なし
    - 機能: Markdownコンテンツの処理フローを定義します。
- **`externalResources`**:
    - 役割: 生成されるHTMLファイルに含める外部リソース（CSSファイルやJavaScriptファイルなど）に関する情報や設定を管理します。
    - 引数: なし
    - 戻り値: なし
    - 機能: サイトの見た目や追加機能に必要な外部アセットの読み込みを管理します。
- **`media`**:
    - 役割: CSSメディアクエリに関連する情報や設定を定義します。
    - 引数: なし
    - 戻り値: なし
    - 機能: レスポンシブデザインやデバイスごとの表示調整に役立つ情報を提供します。

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
- if (dist/browser-runtime.js)
  - loadBrowserRuntime (dist/index.js)
    - escapeHtml ()
      - MMLABCTransformer ()
      - markdownPlugins ()
      - externalResources ()
- for (dist/browser-runtime.js)
- media (dist/index.js)

---
Generated at: 2026-03-02 07:02:07 JST
