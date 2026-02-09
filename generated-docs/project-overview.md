Last updated: 2026-02-10

# Project Overview

## プロジェクト概要
- コードブロックに音楽記法を書くだけで、静的サイト「Quartz」に五線譜を表示し、クリック演奏を可能にするプラグインです。
- MML（Music Macro Language）やABC記法、コード進行から自動的に楽譜を生成・再生できます。
- ユーザーが音楽コンテンツを簡単に作成・共有し、インタラクティブな音楽体験を提供します。

## 技術スタック
- フロントエンド: ブラウザ上で楽譜のレンダリングと再生を行うJavaScript環境。CDNから動的にライブラリをロードし、QuartzのSPAナビゲーションにも対応しています。
- 音楽・オーディオ:
    - abcjs: ABC音楽記法をSVG形式の五線譜としてレンダリングし、音楽再生機能を提供する主要ライブラリです。
    - mml2abc: MML（Music Macro Language）を`abcjs`が解釈できるABC記法に変換するライブラリです。
    - chord2mml: コード進行の文字列をMMLに変換し、`mml2abc`と連携してABC記法に変換するライブラリです。
- 開発ツール:
    - npm: Node.jsパッケージマネージャ。プロジェクトの依存関係管理とスクリプト実行に使用されます。
    - TypeScript: 静的型付けを導入することで、コードの品質と保守性を高めています。
- テスト:
    - Vitest: 高速なユニットテストフレームワークで、主にAST（抽象構文木）変換ロジックのテストに使用されます。
    - Playwright: ブラウザ上で実際に動作を確認するエンドツーエンド（インテグレーション）テストフレームワークです。レンダリングやインタラクティブ機能の検証に用いられます。
- ビルドツール:
    - unified: Markdownなどのコンテンツを解析し、抽象構文木（AST）を変換するための基盤となるインターフェースです。
    - unist-util-visit: `unified`と連携し、ASTを効率的に走査して特定のノード（コードブロック）を検出・処理するユーティリティです。
    - copyfiles: ビルドプロセスにおいて、特定のファイルを所定の場所にコピーするために使用されるツールです。
- 言語機能:
    - TypeScript: JavaScriptに型システムを追加した言語。開発時のエラー検出とコードの明確化に貢献しています。
    - ES Modules (ESM) / UMD: ライブラリの読み込みと互換性を確保するためのJavaScriptモジュール形式です。
- 自動化・CI/CD:
    - GitHub Actions: コードの変更を検知し、自動的にテストを実行したり、プロジェクトをデプロイしたりするための継続的インテグレーション・継続的デプロイメント（CI/CD）パイプラインを提供します。
- 開発標準:
    - TypeScriptの採用や包括的なテストスイートの整備により、コードの品質と信頼性の維持に努めています。

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
- **`.gitignore`**: Gitがバージョン管理から無視するファイルやディレクトリを指定する設定ファイルです。
- **`LICENSE`**: プロジェクトがMITライセンスであることを示すファイルです。
- **`README.ja.md` / `README.md`**: プロジェクトの概要、機能、インストール方法、使用方法などを記述したドキュメントです（日本語版と英語版）。
- **`_config.yml`**: GitHub Pagesのビルド設定ファイルですが、このプロジェクトでは直接的な機能は提供していません。
- **`demo.html`**: ローカル環境でプラグインの機能を手動でテスト・確認するためのデモ用HTMLファイルです。
- **`dist/`**: TypeScriptで書かれたソースコードがJavaScriptにコンパイルされて格納されるディレクトリです。
    - **`dist/browser-runtime.js`**: ブラウザ上で実行されるJavaScriptコードです。楽譜のレンダリング、再生、QuartzのSPA（Single Page Application）ナビゲーションへの対応ロジックを含みます。
    - **`dist/index.d.ts`**: TypeScriptの型定義ファイルです。プラグインの公開インターフェースの型情報を提供します。
    - **`dist/index.js`**: Quartzトランスフォーマーのメインロジックを含むJavaScriptファイルです。MarkdownのコードブロックをHTML要素に変換する役割を担います。
- **`example.md`**: プラグインの使用例を示すMarkdownファイルです。
- **`generated-docs/`**: 自動生成されたドキュメント（例: 開発状況）が格納されるディレクトリです。
- **`issue-notes/`**: 開発中に特定された課題やその解決策に関するメモを保存するディレクトリです。
- **`package-lock.json`**: `package.json`に記述された依存関係の正確なバージョンとツリー構造を記録し、再現可能なビルドを保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、スクリプト、依存関係など）を定義するファイルです。
- **`playwright.config.ts`**: Playwrightテストフレームワークの設定ファイルです。
- **`src/`**: プロジェクトの主要なソースコードが格納されるディレクトリです。
    - **`src/browser-runtime.js`**: ブラウザで実行されるランタイムコードのソースファイルです。楽譜のインタラクティブ機能を提供します。
    - **`src/index.test.ts`**: ユニットテストのソースコードです。主にMarkdown ASTの変換ロジックを検証します。
    - **`src/index.ts`**: Quartzトランスフォーマーのメインロジックのソースコードです。Markdownファイル内の特定のコードブロックを処理します。
- **`test/`**: インテグレーションテストやテスト関連の補助ファイルが格納されるディレクトリです。
    - **`test/README.md`**: テストに関する追加情報や説明を記述したドキュメントです。
    - **`test/integration-test.html`**: インテグレーションテストを実行するためのHTMLファイルです。
    - **`test/integration.test.ts`**: Playwrightを使用したインテグレーションテストのソースコードです。
    - **`test/playback-fix.test.ts`**: 音楽再生機能における特定のバグ修正に関連するテストです。
    - **`test/playback-simple.spec.js`**: 音楽再生機能の基本的な動作を確認するためのテストです。
    - **`test/spa-navigation-debug.test.ts`**: SPAナビゲーション時のデバッグを目的としたテストです。
    - **`test/spa-navigation-test.html`**: SPAナビゲーションの動作をテストするためのHTMLファイルです。
- **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルです。
- **`vitest.config.ts`**: Vitestテストフレームワークの設定ファイルです。

## 関数詳細説明
- **`wrapper`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: ブラウザ上で実行される楽譜レンダリング・再生ロジック全体をカプセル化し、Quartzのページナビゲーションイベントに反応して処理を調整します。
    - 機能: ページがロードまたは遷移した際に、`initializeMusicNotation`などを呼び出し、楽譜の表示とインタラクティブ機能のライフサイクルを管理します。
- **`logNavDebug`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: QuartzのSPAナビゲーション中にデバッグ情報をコンソールに出力します。
    - 機能: 開発者がナビゲーションイベントやそれに関連する処理の挙動を追跡し、問題診断を容易にするための補助機能です。
- **`updateNotationTheme`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: Quartzサイトの現在のテーマ（例: ライトモード、ダークモード）に合わせて楽譜の表示スタイルを更新します。
    - 機能: ユーザーが選択したテーマに沿って楽譜の色合いや背景が適切に表示されるよう調整し、視覚的な一貫性を保ちます。
- **`getQuartzTheme`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: 現在のQuartzサイトのテーマ設定（ライト/ダークモードなど）を取得します。
    - 機能: `updateNotationTheme`のような関数が、現在のテーマに基づいて適切なスタイルを適用するためにこの情報を利用します。
- **`initializeMusicNotation`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: ページ内の音楽表記（`mml`, `chord`, `abc`コードブロック）を検出し、ABC記法への変換、SVGでのレンダリング、そして音楽再生機能の初期化を行います。
    - 機能: 必要なライブラリ（`abcjs`, `mml2abc`, `chord2mml`）を動的にロードし、HTML要素として五線譜SVGを生成し、クリック再生のためのオーディオシンセサイザーを準備します。
- **`handlePlayback`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: レンダリングされた楽譜をクリックしたり、キーボード（Enter/Space）を押したりした際の音楽再生を処理します。
    - 機能: 楽譜のSVG要素にイベントリスナーを設定し、ユーザーの操作に応じて対応する音楽データを再生します。
- **`cleanup`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: QuartzのSPAナビゲーション時に、前のページのDOM要素やイベントリスナー、リソースを適切にクリーンアップします。
    - 機能: メモリリークを防ぎ、リソースを解放して新しいページのコンテンツが正しくレンダリング・動作するための準備を行います。
- **`handleNavigation`** (src/browser-runtime.js, dist/browser-runtime.js):
    - 役割: QuartzのSPAナビゲーションイベントを監視し、ページコンテンツが変更された際に`initializeMusicNotation`を呼び出します。
    - 機能: ページ遷移後も楽譜が確実に再レンダリングされ、再生機能が利用できるようにします。
- **`loadBrowserRuntime`** (src/index.ts, dist/index.js):
    - 役割: ブラウザ側で動作するランタイムスクリプト（`browser-runtime.js`）をQuartzのビルド出力に挿入します。
    - 機能: 静的サイトとして生成されたHTMLファイルに、インタラクティブな楽譜表示と再生機能を提供するためのJavaScriptコードを埋め込みます。
- **`escapeHtml`** (src/index.ts, dist/index.js):
    - 役割: HTMLの特殊文字（例: `<`, `>`, `&`）をエスケープ処理します。
    - 機能: ユーザーが入力した文字列やコードブロックの内容がHTMLとして不正に解釈されるのを防ぎ、セキュリティを向上させます。
- **`markdownPlugins`** (src/index.ts, dist/index.js):
    - 役割: Markdownの処理に関連するプラグインの定義や構成を管理します。
    - 機能: コードブロックの変換ロジックなど、Markdownコンテンツに対する特定の処理をQuartzのビルドプロセスに統合します。
- **`externalResources`** (src/index.ts, dist/index.js):
    - 役割: プラグインが必要とする外部CSSやJavaScriptリソース（例: `browser-runtime.js`）をQuartzのビルドシステムに登録します。
    - 機能: これらのリソースが生成されるHTMLページに適切に組み込まれるようにし、プラグインが正常に動作するために必要なファイルが利用可能であることを保証します。
- **`media`** (src/index.ts, dist/index.js):
    - 役割: Quartzのメディア関連の機能の一部として、このプラグインが生成するHTML内の特定のメディア要素やリソースに関する処理を扱います。
    - 機能: プラグインによって動的に追加される楽譜のSVGや関連するオーディオコンテンツが、Quartzのサイト構造内で適切に管理・表示されるようにします。

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
Generated at: 2026-02-10 07:09:41 JST
