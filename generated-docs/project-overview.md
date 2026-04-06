Last updated: 2026-04-07

# Project Overview

## プロジェクト概要
- コード進行をコードブロックに書くだけで、五線譜を表示してクリック演奏も可能にするQuartzトランスフォーマープラグインです。
- Obsidian版の機能をQuartz4でも実現し、MML（Music Macro Language）とABC Notationに対応しています。
- Webページ上でインタラクティブな楽譜表示と再生を提供し、SPAナビゲーションにも完全対応しています。

## 技術スタック
- フロントエンド: 
    - **abcjs**: ABC音楽記法をレンダリングし、インタラクティブなSVG形式で五線譜を表示します。楽曲の再生機能も提供します。
    - **mml2abc**: MML記法をブラウザ内でABC記法に変換します。
    - **chord2mml**: コード進行記法をブラウザ内でMMLに変換し、さらにABC記法へと変換します。
    - **JavaScript (ES Modules)**: ブラウザ上で動的にライブラリをロードし、楽譜のレンダリングや再生を行うロジックを実装しています。
    - **Quartz v4 SPAナビゲーション**: QuartzのSingle Page Application形式のページ遷移に対応し、ページ間の移動後も楽譜が正しく再レンダリングされるようにします。
- 音楽・オーディオ: 
    - **abcjs (再生機能)**: レンダリングされた楽譜をクリックすることで、対応する楽曲を再生します。
    - **AudioContext**: Web Audio APIを利用して、ブラウザ内でオーディオシンセサイザーを初期化し、楽曲再生を可能にします。
- 開発ツール: 
    - **TypeScript**: コードの型安全性を高め、大規模なプロジェクトでもメンテナンスしやすい開発を可能にします。
    - **unified**: コンテンツの解析（AST化）と変換のための統一インターフェースを提供し、Quartzプラグイン開発の基盤となります。
    - **unist-util-visit**: unifiedの構文木（AST）を効率的に走査し、特定のノード（コードブロックなど）を検出・処理するためのユーティリティです。
- テスト: 
    - **Vitest**: AST変換ロジックのユニットテストに使用され、高速なテスト実行と開発体験を提供します。
    - **Playwright**: ブラウザ上での実際のレンダリングやインタラクティブ機能（再生、SPAナビゲーション）のインテグレーションテストに使用され、ブラウザ互換性と機能の正当性を確認します。
- ビルドツール: 
    - **npm**: パッケージの依存関係管理、スクリプトの実行（ビルド、テストなど）に使用されます。
    - **TypeScript Compiler (tsc)**: TypeScriptソースコードをJavaScriptにコンパイルし、配布可能な形式に変換します。
- 言語機能: 
    - **JavaScript (ES Modules)**: `mml2abc`などの外部ライブラリを動的にインポート・実行するために活用されています。
- 自動化・CI/CD: 
    - **GitHub Actions**: プロジェクトのデプロイプロセスを自動化し、依存関係の更新やQuartzサイトのビルドを実行します。
    - **Dependabot**: プロジェクトの依存関係を定期的にチェックし、セキュリティパッチや機能更新があった場合に自動でプルリクエストを生成します。
- 開発標準: 
    - **tsconfig.json**: TypeScriptコンパイラの設定を定義し、プロジェクト全体で一貫したコード品質を維持します。
    - **vitest.config.ts**, **playwright.config.ts**: それぞれVitestとPlaywrightのテスト実行設定を定義し、テスト環境の統一と効率的な運用を支援します。

## ファイル階層ツリー
```
📄 .gitignore
📖 DEBUG-LOGGING-SUMMARY.md
📖 ISSUE-71-FIX-SUMMARY.md
📄 LICENSE
📖 README.ja.md
📖 README.md
📖 SPA-FIX-SUMMARY.md
📄 _config.yml
🌐 demo.html
📁 dist/
  📜 browser-runtime.js
  📘 index.d.ts
  📜 index.js
📖 example.md
📁 generated-docs/
📁 issue-notes/
  📖 25.md
  📖 31.md
  📖 44-investigation.md
  📖 46-solution.md
  📖 51-solution.md
  📖 56-solution.md
  📖 56.md
  📖 67-solution.md
  📖 71.md
  📖 81.md
📊 package-lock.json
📊 package.json
📘 playwright.config.ts
📁 src/
  📘 ast-abc-multiple.test.ts
  📘 ast-mml-chord.test.ts
  📜 browser-runtime.js
  📘 index.test.ts
  📘 index.ts
📁 test/
  📖 README.md
  🌐 integration-test.html
  📘 integration.test.ts
  📘 playback-fix.test.ts
  📜 playback-simple.spec.js
  📘 spa-navigation-debug.test.ts
  📜 spa-navigation-runtime.js
  📖 spa-navigation-test-README.md
  🌐 spa-navigation-test.html
📊 tsconfig.json
📘 vitest.config.ts
```

## ファイル詳細説明
-   **`.gitignore`**: Gitが追跡しないファイルやディレクトリを指定し、クリーンなリポジトリ状態を保つための設定ファイルです。
-   **`DEBUG-LOGGING-SUMMARY.md`**: プロジェクトにおけるデバッグログの設計や実装、運用に関するまとめドキュメントです。
-   **`ISSUE-71-FIX-SUMMARY.md`**: 特定のIssue #71の修正内容、経緯、影響などをまとめたドキュメントです。
-   **`LICENSE`**: プロジェクトがMIT Licenseで配布されていることを示すライセンスファイルです。
-   **`README.ja.md`**: プロジェクトの目的、機能、インストール方法、使い方などを日本語で説明する主要ドキュメントです。
-   **`README.md`**: プロジェクトの目的、機能、インストール方法、使い方などを英語で説明する主要ドキュメントです。
-   **`SPA-FIX-SUMMARY.md`**: Single Page Application (SPA) ナビゲーションに関する問題とその解決策をまとめたドキュメントです。
-   **`_config.yml`**: GitHub Pagesなどのサイト設定に関する設定ファイルです。
-   **`demo.html`**: プラグインが正しく動作するかを手動で確認するためのシンプルなHTMLデモページです。MML、Chord、ABC記法それぞれのコードブロックが含まれています。
-   **`dist/`**: TypeScriptソースコードがJavaScriptにコンパイルされた成果物が格納されるディレクトリです。
    -   **`dist/browser-runtime.js`**: ブラウザ上で楽譜のレンダリング、音楽再生、SPAナビゲーション対応を行うためのランタイムスクリプトの最終的なビルド済みバージョンです。
    -   **`dist/index.d.ts`**: TypeScriptで書かれたプラグインの型定義ファイルで、他のTypeScriptプロジェクトからこのプラグインを利用する際に型情報を提供します。
    -   **`dist/index.js`**: プラグインのメインロジックを含むコンパイル済みJavaScriptファイルです。Quartzのビルドプロセス中にMarkdownの抽象構文木（AST）を変換する役割を担います。
-   **`example.md`**: プラグインの具体的な使用方法や記述例を示すMarkdownファイルです。
-   **`generated-docs/`**: 自動生成されるドキュメント（開発状況など）が格納されるディレクトリです。
-   **`issue-notes/`**: 特定のIssueに関する調査メモや解決策、議論などが格納されているディレクトリです。
    -   **`25.md`**, **`31.md`**, **`44-investigation.md`**, **`46-solution.md`**, **`51-solution.md`**, **`56-solution.md`**, **`56.md`**, **`67-solution.md`**, **`71.md`**, **`81.md`**: 各ファイルは、対応するIssue番号に関連する詳細な情報、調査結果、解決策、または議論を記述しています。
-   **`package-lock.json`**: `package.json`に記述された依存関係の具体的なバージョンと依存ツリーをロックし、ビルドの再現性を保証するファイルです。
-   **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）、スクリプト（ビルド、テストなど）、およびプロジェクトが依存するライブラリを定義するファイルです。
-   **`playwright.config.ts`**: Playwrightを使用したインテグレーションテストの設定ファイルです。テスト環境や実行オプションを定義します。
-   **`src/`**: プロジェクトのTypeScriptソースコードが格納されるディレクトリです。
    -   **`src/ast-abc-multiple.test.ts`**: ABC記法を複数使用した場合の抽象構文木（AST）変換ロジックをテストするユニットテストファイルです。
    -   **`src/ast-mml-chord.test.ts`**: MML記法やコード進行記法からASTへの変換ロジックをテストするユニットテストファイルです。
    -   **`src/browser-runtime.js`**: `dist/browser-runtime.js`のソースコードです。ブラウザ上で動作するランタイムロジックを定義します。
    -   **`src/index.test.ts`**: プラグインのメインロジック（`src/index.ts`）に関するユニットテストファイルです。
    -   **`src/index.ts`**: プラグインのメインとなるTypeScriptソースファイルです。MarkdownコードブロックをHTMLに変換するQuartzトランスフォーマーのロジックを実装しています。
-   **`test/`**: さまざまな種類のテストコードやテスト関連の資産が格納されるディレクトリです。
    -   **`test/README.md`**: テストディレクトリの目的や内容に関する説明ドキュメントです。
    -   **`test/integration-test.html`**: インテグレーションテストで実際に使用されるHTMLファイルです。
    -   **`test/integration.test.ts`**: Playwrightによるインテグレーションテストを定義するファイルです。ブラウザ上での実際の動作を確認します。
    -   **`test/playback-fix.test.ts`**: 音楽再生機能に関する特定のバグ修正が正しく適用されたかを検証するテストファイルです。
    -   **`test/playback-simple.spec.js`**: 音楽再生の基本的な動作を確認するためのシンプルなPlaywrightテストスクリプトです。
    -   **`test/spa-navigation-debug.test.ts`**: SPAナビゲーションに関連するデバッグシナリオをテストするファイルです。
    -   **`test/spa-navigation-runtime.js`**: SPAナビゲーションテスト中にブラウザで実行されるランタイムスクリプトです。
    -   **`test/spa-navigation-test.html`**: SPAナビゲーションテスト用のHTMLファイルです。
-   **`tsconfig.json`**: TypeScriptのコンパイラオプションやプロジェクト設定を定義するファイルです。
-   **`vitest.config.ts`**: Vitestテストフレームワークの設定ファイルです。テストの挙動やプラグインを定義します。

## 関数詳細説明
-   **`wrapper`** (dist/browser-runtime.js, src/browser-runtime.js)
    -   役割: ブラウザ上で楽譜のレンダリングと再生機能を初期化し、QuartzのSPAナビゲーションに対応するための主要なロジックを管理します。
    -   引数: なし
    -   戻り値: なし
    -   機能: ページ読み込み時やページ遷移時に`initializeMusicNotation`などを呼び出し、イベントリスナーを設定・解除することで、機能の再初期化とメモリリーク防止を両立させます。
-   **`logNavDebug`** (dist/browser-runtime.js)
    -   役割: SPAナビゲーションに関連するデバッグ情報をコンソールに出力します。
    -   引数: なし
    -   戻り値: なし
    -   機能: 開発者がSPAナビゲーション中のプラグイン動作を追跡・デバッグする際に役立つログを提供します。
-   **`updateNotationTheme`** (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    -   役割: 現在のQuartzサイトのテーマ（ダークモード/ライトモード）に合わせて、レンダリングされる楽譜の表示スタイルを更新します。
    -   引数: なし
    -   戻り値: なし
    -   機能: `getQuartzTheme`を呼び出して現在のテーマを検出し、楽譜のSVG要素に適切なCSSクラスや属性を適用することで、テーマに合わせた表示を実現します。
-   **`getQuartzTheme`** (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    -   役割: 現在のQuartzサイトが設定しているテーマモード（例: "dark"または"light"）を特定します。
    -   引数: なし
    -   戻り値: 文字列 (`"dark"` または `"light"`)
    -   機能: `document.body`要素のデータ属性やクラス名を検査し、アクティブなテーマモードを検出して返します。
-   **`initializeMusicNotation`** (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    -   役割: ページ内のMML、Chord、ABC記法で書かれたコードブロックを検出し、それらをABC記法に変換してabcjsでインタラクティブな五線譜としてレンダリングします。
    -   引数: なし
    -   戻り値: なし
    -   機能: 各コードブロックのデータ属性から記法を読み取り、`mml2abc`や`chord2mml`を介して変換後、`abcjs`を用いてSVGとしてDOMに描画し、クリック再生のためのイベントリスナーを設定します。
-   **`handlePlayback`** (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    -   役割: レンダリングされた五線譜がクリックされた際に、対応する楽曲の再生を開始します。
    -   引数: `event: Event` (クリックまたはキーボードイベントオブジェクト)
    -   戻り値: なし
    -   機能: イベントのターゲットから楽譜データを抽出し、`abcjs`のオーディオシンセサイザーを用いて楽曲を再生します。キーボードアクセシビリティ（EnterキーやSpaceキー）にも対応しています。
-   **`cleanup`** (dist/browser-runtime.js, src/browser-runtime.js, test/spa-navigation-runtime.js)
    -   役割: QuartzのSPAナビゲーション時に、前のページのイベントリスナーやリソースを適切に解放し、メモリリークや重複処理を防ぎます。
    -   引数: なし
    -   戻り値: なし
    -   機能: `window.addCleanup()`メカニズムを利用して、ページ遷移前に不要になったリソース（例: `abcjs`のオーディオコンテキスト、カスタムイベントリスナー）を解除します。
-   **`handleNavigation`** (dist/browser-runtime.js, src/browser-runtime.js)
    -   役割: QuartzのSPAナビゲーションイベント（ページ遷移）を監視し、新しいページが完全にロードされた後に楽譜の再初期化をトリガーします。
    -   引数: なし
    -   戻り値: なし
    -   機能: `window.addEventListener('nav', ...)` を利用して、ナビゲーション完了時に`initializeMusicNotation`を呼び出し、新しいページの楽譜をレンダリングします。
-   **`loadBrowserRuntime`** (dist/index.js, src/index.ts)
    -   役割: プラグインのブラウザランタイムスクリプト（`browser-runtime.js`）を、Quartzのビルドプロセスで生成されるHTMLページに注入します。
    -   引数: `vfile: VFile` (処理中の仮想ファイルオブジェクト)
    -   戻り値: `Promise<void>`
    -   機能: ビルド時に`dist/browser-runtime.js`の内容を読み込み、`<script type="module">`タグとして出力HTMLの適切な位置に埋め込むことで、ブラウザ側の動的な処理を有効にします。
-   **`escapeHtml`** (dist/index.js, src/index.ts)
    -   役割: HTMLコンテンツとして安全に表示するために、特定の特殊文字（`<`, `>`, `&`, `"`, `'`）をHTMLエンティティに変換します。
    -   引数: `unsafe: string` (エスケープ前の文字列)
    -   戻り値: `string` (HTMLエスケープが施された文字列)
    -   機能: クロスサイトスクリプティング (XSS) 攻撃などの脆弱性を防ぐため、ユーザー入力や動的に生成される文字列をサニタイズします。
-   **`MMLABCTransformer`** (dist/index.js, src/index.ts)
    -   役割: Quartzトランスフォーマープラグインの中核となる関数で、Markdownの抽象構文木（AST）を走査し、`mml`、`chord`、`abc`コードブロックをカスタムHTMLの`div`要素に変換します。
    -   引数: `options?: MMLABCTransformerOptions` (プラグインの動作をカスタマイズするオプション)
    -   戻り値: `Plugin<[], Root, Root>` (Unifiedプラグインのインターフェースに準拠する関数)
    -   機能: `unist-util-visit`を使用してコードブロックノードを見つけ、その言語タグに基づいてHTMLの`div`要素に置き換え、元の記法をデータ属性として保持することで、ブラウザランタイムでの処理を可能にします。
-   **`markdownPlugins`** (dist/index.js, src/index.ts)
    -   役割: QuartzのMarkdown処理パイプラインに登録されるUnifiedプラグインの配列を定義します。
    -   引数: なし
    -   戻り値: `Array<Plugin>` (Unifiedプラグイン関数の配列)
    -   機能: `MMLABCTransformer`インスタンスを生成し、Quartzの`transformers`配列に組み込むためのインターフェースを提供します。
-   **`externalResources`** (dist/index.js, src/index.ts)
    -   役割: Quartzプロジェクトが外部のJavaScriptやCSSリソースを参照できるようにする設定を提供します。
    -   引数: なし
    -   戻り値: `{ js: string[]; css: string[] }` (参照するJavaScriptとCSSファイルのURLまたはパスの配列)
    -   機能: CDNから読み込まれる`abcjs`やその他のライブラリ（このプラグインでは動的インポートが主ですが）が、Quartzのサイト全体で利用可能になるように設定します。
-   **`media`** (dist/index.js, src/index.ts)
    -   役割: Quartzのメディア処理に関するプラグインや設定を返します。
    -   引数: なし
    -   戻り値: オブジェクトまたは配列
    -   機能: (このプラグインの文脈では直接的な記述はありませんが、一般的に画像や動画などのメディアアセットの最適化、変換、埋め込みに関連する設定やプラグインを提供する可能性があります。)
-   **`events`** (test/spa-navigation-runtime.js)
    -   役割: テスト環境において、SPAナビゲーションイベントの発生をシミュレートまたは処理します。
    -   引数: なし
    -   戻り値: なし
    -   機能: `test/spa-navigation-runtime.js`内部で、テストシナリオに応じてナビゲーション関連の動作を再現し、プラグインがイベントに正しく反応するかを検証します。

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
  - addEventListener ()
  - MutationObserver ()
  - setTimeout ()
  - finally ()
- loadBrowserRuntime (dist/index.js)
  - escapeHtml ()
  - MMLABCTransformer ()
  - markdownPlugins ()
  - externalResources ()
- media (dist/index.js)
- events (test/spa-navigation-runtime.js)

---
Generated at: 2026-04-07 07:07:18 JST
