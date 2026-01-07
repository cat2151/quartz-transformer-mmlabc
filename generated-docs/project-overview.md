Last updated: 2026-01-08

# Project Overview

## プロジェクト概要
- 静的サイトジェネレーターQuartzで、Markdown内に音楽コードブロックを記述可能にするプラグインです。
- コード進行やMML、ABC記法で書かれた音楽情報を、五線譜として表示し、クリックで再生もできます。
- ユーザーは複雑な設定なしに、ウェブサイト上でインタラクティブな音楽コンテンツを楽しめます。

## 技術スタック
- フロントエンド: 
    - **abcjs**: ABC音楽記法をSVG形式の五線譜としてレンダリングし、インタラクティブな再生機能を提供します。CDNから動的に読み込まれます。
    - **mml2abc**: Music Macro Language (MML) 形式の音楽データをABC記法に変換するためのライブラリです。CDNから動的に読み込まれます。
    - **chord2mml**: コード進行（例: C Dm7 G7 C）をMML形式に変換するためのライブラリです。CDNから動的に読み込まれます。
- 音楽・オーディオ: 
    - **abcjs**: 五線譜の表示と内蔵オーディオシンセサイザーによる楽曲再生を担当します。
    - **mml2abc**: MML形式の音楽を標準的なABC記法に変換し、abcjsでのレンダリングと再生を可能にします。
    - **chord2mml**: 汎用的なコード進行表記をMMLに変換し、上記ライブラリと連携して五線譜表示・再生を実現します。
- 開発ツール: 
    - **TypeScript**: JavaScriptに静的型付けを導入し、大規模なプロジェクトにおけるコードの品質と保守性を向上させるプログラミング言語です。
    - **npm**: JavaScriptプロジェクトのパッケージ管理ツールで、依存ライブラリのインストールやスクリプトの実行に利用されます。
    - **Vitest**: 高速なユニットテストフレームワークで、コードの各機能が単体で正しく動作するかを検証します。
    - **Playwright**: ブラウザ自動化ライブラリであり、ウェブアプリケーションのUI操作やエンドツーエンド（E2E）テストを実行し、ブラウザ上での実際の動作を確認します。
- テスト: 
    - **Vitest**: プラグインのロジックやAST変換などの単体機能を網羅的にテストするために使用されます。ウォッチモードやUIでのテスト実行も可能です。
    - **Playwright**: ブラウザ環境での五線譜のレンダリング、クリックによる再生、キーボードアクセシビリティなどのインタラクティブ機能を検証するインテグレーションテストに利用されます。
- ビルドツール: 
    - **TypeScript Compiler (tsc)**: TypeScriptで書かれたソースコードを、ブラウザやNode.jsで実行可能なJavaScriptコードにコンパイルします。
    - **unified**: コンテンツの解析（Markdownなど）と変換のための統一インターフェースを提供するエコシステムです。
    - **unist-util-visit**: `unified`エコシステムの一部で、構文木（AST）を効率的に走査し、特定のノードタイプを処理するためのユーティリティです。
- 言語機能: 
    - **TypeScript**: 最新のJavaScript機能に加えて型安全性を提供し、開発中のエラーを早期に検出し、コードの可読性と保守性を高めます。
- 自動化・CI/CD: 
    - **GitHub Actions**: コードのビルド、テスト、デプロイなどの開発ワークフローを自動化するCI/CDプラットフォームです。プラグインのGitHub Actionsでのビルドも含まれます。
- 開発標準: 
    - (特筆すべきツールはありませんが、TypeScriptの利用がコード品質と統一性維持に貢献しています。)

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
-   **README.ja.md, README.md**: このプロジェクトの概要、機能、インストール手順、使用方法、依存関係などが記述された主要なドキュメントです。日本語版と英語版があります。
-   **demo.html**: プラグインの動作を手動で確認するためのデモンストレーション用HTMLファイルです。ブラウザで直接開いて、MMLやコード進行が五線譜としてレンダリングされ、再生できるかを確認できます。
-   **example.md**: プラグインの使用例を示すMarkdownファイルで、`mml`、`chord`、`abc`の各コードブロックの記述例が含まれています。
-   **generated-docs/**: プロジェクトの自動生成ドキュメント（開発状況など）が格納されるディレクトリです。
-   **package-lock.json**: プロジェクトの依存関係ツリーの正確なスナップショットを記録し、ビルドの再現性を保証するファイルです。
-   **package.json**: プロジェクトのメタデータ（名前、バージョン、スクリプト、開発・実行時依存関係）を定義するファイルです。
-   **playwright.config.ts**: インテグレーションテストフレームワークであるPlaywrightの設定ファイルです。テストの実行環境やオプションを定義します。
-   **src/index.test.ts**: メインプラグイン（`src/index.ts`）のAST変換ロジックやオプション処理などに対するユニットテストコードです。Vitestフレームワークで記述されています。
-   **src/index.ts**: Quartzトランスフォーマープラグインの主要な実装ファイルです。Markdownのコードブロックを検出・変換し、動的に外部ライブラリをロードして五線譜レンダリングと再生機能を提供します。
-   **test/integration-test.html**: Playwrightのインテグレーションテストで使用される補助的なHTMLファイルです。
-   **test/integration.test.ts**: Playwrightフレームワークを使用した、ブラウザ上でのプラグインの実際のレンダリングやインタラクティブ機能を検証するインテグレーションテストコードです。
-   **test/README.md**: `test`ディレクトリ内のテストに関する補足説明が記述されています。
-   **tsconfig.json**: TypeScriptコンパイラの設定ファイルで、コンパイルターゲット、モジュール解決戦略、型チェックオプションなどを定義します。
-   **vitest.config.ts**: ユニットテストフレームワークであるVitestの設定ファイルです。テストの実行方法やカバレッジレポートに関するオプションを定義します。

## 関数詳細説明
-   **`escapeHtml(unsafe: string)`**: HTMLコンテンツ内で特殊文字（`<`, `>`, `&`, `"`, `'`）が正しく表示されるように、これらの文字をエスケープ処理するユーティリティ関数です。これにより、クロスサイトスクリプティング（XSS）などのセキュリティ脆弱性を防ぎます。
-   **`waitForABCJS()`**: `abcjs`ライブラリがCDNから動的にロードされ、使用可能になるまで待機する非同期関数です。ライブラリの準備が完了してから関連する操作を実行することを保証します。
-   **`checkABCJS()`**: `abcjs`ライブラリが既にロードされているかを確認する関数です。これにより、ライブラリの重複ロードを防ぎ、リソースの無駄を省きます。
-   **`updateNotationTheme(container: HTMLElement)`**: Quartzサイトの現在のテーマ（ライトモードまたはダークモード）に基づいて、レンダリングされた五線譜の表示テーマを調整する関数です。
-   **`getQuartzTheme()`**: 現在のQuartzサイトのグローバルテーマ設定（例: 'light' または 'dark'）を取得する関数です。
-   **`handlePlayback(abcElement: HTMLElement)`**: レンダリングされた五線譜要素に対するクリックイベントを処理し、楽曲の再生または一時停止を制御する関数です。キーボードのEnterキーやSpaceキーによる操作もサポートします。
-   **`cleanup(container: HTMLElement)`**: 特定のHTMLコンテナ要素に関連付けられた動的に生成されたオーディオリソースやイベントリスナーをクリーンアップする関数です。これにより、DOM要素が削除された後のメモリリークを防ぎます。
-   **`checkPlaybackStatus()`**: 現在のオーディオ再生がアクティブであるか（つまり、楽曲が再生中であるか）を確認する関数です。
-   **`markdownPlugins()`**: Quartzトランスフォーマーの中核となる関数で、Markdownの抽象構文木（AST）を走査し、`mml`、`chord`、`abc`タグを持つコードブロックを検出して、適切なHTML構造に変換します。
-   **`externalResources()`**: このプラグインがCDNから動的に読み込む外部JavaScriptライブラリ（`abcjs`、`mml2abc`、`chord2mml`）のURLと、セキュリティ強化のためのSubresource Integrity (SRI) チェックサムなどの属性を定義し、提供する関数です。

## 関数呼び出し階層ツリー
```
- checkPlaybackStatus (src/index.ts)
  - escapeHtml (src/index.ts)
    - waitForABCJS
      - checkABCJS
      - updateNotationTheme
      - getQuartzTheme
      - handlePlayback
      - cleanup
      - markdownPlugins
      - externalResources

---
Generated at: 2026-01-08 07:02:11 JST
