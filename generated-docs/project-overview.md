Last updated: 2026-03-07

# Project Overview

## プロジェクト概要
- コード進行をMarkdownのコードブロックに書くだけで、五線譜表示とクリック演奏を可能にするQuartzトランスフォーマープラグインです。
- Music Macro Language (MML) とABC Notationのコードブロックもサポートし、音楽表現を豊かにします。
- Quartz v4のSPAナビゲーションに対応しており、ページ遷移後もスムーズに楽譜をレンダリング・再生できます。

## 技術スタック
- フロントエンド: `abcjs` (ABC音楽記法のレンダリングとインタラクティブなSVG表示、音声再生)、動的に読み込まれる`mml2abc` (MMLからABCへの変換)、`chord2mml` (コード進行からMMLへの変換) を使用し、ブラウザ上で楽譜の描画と再生を行います。
- 音楽・オーディオ: `abcjs`が提供するオーディオシンセサイザーにより、レンダリングされた楽譜のクリック再生機能を実現します。`mml2abc`と`chord2mml`が記法変換の中核を担います。
- 開発ツール: `TypeScript` (静的型付けされたJavaScript開発)、`unified`と`unist-util-visit` (Markdown ASTの解析と変換)、`copyfiles` (ビルドファイルのコピー) を使用しています。
- テスト: `Vitest` (ユニットテストフレームワーク) を用いてAST変換ロジックなどをテストし、`Playwright` (ブラウザ自動化ライブラリ) でブラウザ上でのレンダリングやインタラクティブ機能のインテグレーションテストを実行しています。
- ビルドツール: `TypeScript`コンパイラがTypeScriptソースコードをJavaScriptに変換し、配布可能な`dist`ディレクトリを生成します。
- 言語機能: `TypeScript`を採用することで、コードの可読性、保守性、および開発効率を高めています。
- 自動化・CI/CD: GitHub Actionsを利用して、プラグインのデプロイ時の依存関係インストールやQuartzビルドの自動化、テストの実行を行っています。
- 開発標準: TypeScriptによる型定義とVitest/Playwrightによる包括的なテストスイートを通じて、コード品質と安定性を確保しています。

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
- **`.gitignore`**: Gitが追跡しないファイルやディレクトリを指定する設定ファイルです。
- **`DEBUG-LOGGING-SUMMARY.md`**: デバッグロギングに関する情報や要約を記述したドキュメントです。
- **`ISSUE-71-FIX-SUMMARY.md`**: 特定のIssue (Issue #71) の修正内容に関する要約ドキュメントです。
- **`LICENSE`**: プロジェクトのライセンス情報（MIT License）が記述されています。
- **`README.ja.md` / `README.md`**: プロジェクトの概要、機能、インストール方法、使い方、開発ガイド、関連情報などを記述した主要なドキュメント（日本語版と英語版）です。
- **`SPA-FIX-SUMMARY.md`**: SPA (Single Page Application) ナビゲーションに関する修正内容の要約ドキュメントです。
- **`_config.yml`**: GitHub Pagesなどの設定ファイルとして使用される可能性があります。
- **`demo.html`**: プラグインが実際にどのように動作するかを、手動で確認するためのデモ用HTMLファイルです。
- **`dist/`**: TypeScriptソースコードをコンパイルした結果のJavaScriptファイルと型定義ファイルが格納されるディレクトリです。
    - **`dist/browser-runtime.js`**: ブラウザ上で楽譜のレンダリング、音声再生、およびQuartz v4 SPAナビゲーション対応を処理するJavaScriptコードです。CDNから動的に読み込まれるライブラリの管理も行います。
    - **`dist/index.d.ts`**: `src/index.ts`の型定義ファイルで、他のTypeScriptプロジェクトでこのプラグインを使用する際に型の情報を提供します。
    - **`dist/index.js`**: Quartzトランスフォーマーのメインロジックを含むJavaScriptファイルです。Markdown ASTを走査し、`mml`, `chord`, `abc`コードブロックをHTML要素に変換します。
- **`example.md`**: プラグインのMarkdown記述例を示すファイルです。
- **`generated-docs/`**: `development-status.md`のような、自動生成されたドキュメントを格納するディレクトリです。
- **`issue-notes/`**: 過去のGitHub Issueに関する詳細な調査メモや解決策が記述されたMarkdownファイル群です。
- **`package-lock.json`**: `package.json`に記述された依存関係の正確なバージョンと依存ツリーを記録するファイルです。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）、スクリプト、および開発・実行時の依存関係を定義するファイルです。
- **`playwright.config.ts`**: Playwrightを使ったインテグレーションテストの設定を定義するTypeScriptファイルです。
- **`src/`**: プラグインのソースコードが格納されるディレクトリです。
    - **`src/ast-abc-multiple.test.ts` / `src/ast-mml-chord.test.ts`**: Vitestを用いたユニットテストファイルで、AST (Abstract Syntax Tree) 変換ロジック（特に複数ブロックやMML/Chordブロックの処理）の正確性を検証します。
    - **`src/browser-runtime.js`**: `dist/browser-runtime.js`の元となるソースコードで、ブラウザ上での実行を担当するJavaScriptロジックを記述しています。
    - **`src/index.test.ts`**: Vitestを用いたユニットテストファイルで、プラグインのコア機能やエッジケースの処理などをテストします。
    - **`src/index.ts`**: QuartzトランスフォーマーのメインエントリポイントとなるTypeScriptソースファイルです。Markdownのコードブロックを検出・変換するロジックが含まれます。
- **`test/`**: テスト関連のファイル（インテグレーションテスト、テスト用HTML/JSなど）が格納されるディレクトリです。
    - **`test/README.md`**: テストディレクトリに関する説明ドキュメントです。
    - **`test/integration-test.html`**: Playwrightによるインテグレーションテストで使用されるHTMLファイルです。
    - **`test/integration.test.ts`**: Playwrightを用いたインテグレーションテストファイルで、ブラウザ上での実際のレンダリングやDOM操作、CDNリソースの読み込みなどを検証します。
    - **`test/playback-fix.test.ts`**: Playwrightを用いたインテグレーションテストファイルで、楽譜の再生機能に関する特定のバグ修正の検証に焦点を当てています。
    - **`test/playback-simple.spec.js`**: Playwrightを用いた簡易的な楽譜再生テストスクリプトです。
    - **`test/spa-navigation-debug.test.ts`**: Playwrightを用いたインテグレーションテストファイルで、QuartzのSPAナビゲーション中の楽譜の再初期化やクリーンアップ処理のデバッグと検証を行います。
    - **`test/spa-navigation-runtime.js`**: SPAナビゲーションテスト中にブラウザ側で実行されるJavaScriptコードです。
    - **`test/spa-navigation-test-README.md`**: SPAナビゲーションテストに関する説明ドキュメントです。
    - **`test/spa-navigation-test.html`**: PlaywrightによるSPAナビゲーションテストで使用されるHTMLファイルです。
- **`tsconfig.json`**: TypeScriptコンパイラの設定を定義するファイルです。
- **`vitest.config.ts`**: Vitestの設定を定義するTypeScriptファイルです。

## 関数詳細説明
- **`wrapper`**:
    - 役割: ブラウザ側のJavaScriptコード全体をラップし、実行環境を隔離する即時実行関数（またはそれに近い構造）。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: 楽譜のレンダリングや再生、SPAナビゲーション対応など、ブラウザで実行されるすべてのロジックのエントリポイントとなります。
- **`logNavDebug`**:
    - 役割: SPAナビゲーション時のデバッグ情報をコンソールに出力する。
    - 引数: `message` (string) - 出力するデバッグメッセージ。
    - 戻り値: なし。
    - 機能: 開発中にナビゲーションイベントの動作を追跡し、問題診断を支援します。
- **`updateNotationTheme`**:
    - 役割: Quartzサイトの現在のテーマ（ライト/ダークモード）に応じて、レンダリングされた楽譜のスタイルを更新する。
    - 引数: なし (ただし、内部でDOM要素を参照して更新)。
    - 戻り値: なし。
    - 機能: ユーザーがテーマを切り替えた際に、楽譜の背景や線の色などがサイトのデザインと調和するように調整します。
- **`getQuartzTheme`**:
    - 役割: 現在のQuartzサイトのテーマ（'light'または'dark'）を検出する。
    - 引数: なし。
    - 戻り値: `string` - 'light' または 'dark'。
    - 機能: `document.body`のクラス名やデータ属性を読み取り、サイトの視覚テーマを判定します。
- **`initializeMusicNotation`**:
    - 役割: ページ内のMML、Chord、ABCコードブロックを検出し、それらをabcjsで楽譜としてレンダリングし、インタラクティブな再生機能を設定する。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: コードブロックから記法を抽出し、必要に応じて`mml2abc`や`chord2mml`でABC記法に変換後、`abcjs`を使ってSVG形式で楽譜を描画。再生のためのオーディオシンセサイザーも初期化します。
- **`handlePlayback`**:
    - 役割: レンダリングされた楽譜のクリックやキーボード操作に応じて、音楽再生を開始または停止する。
    - 引数: `event` (MouseEvent | KeyboardEvent) - 発生したイベントオブジェクト。
    - 戻り値: なし。
    - 機能: イベントの発生源を特定し、`abcjs`の再生機能を呼び出して、対応する楽曲データを再生します。
- **`cleanup`**:
    - 役割: SPAナビゲーション時に、前のページで生成されたリソース（イベントリスナー、オーディオコンテキストなど）を適切に解放する。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: メモリリークを防ぎ、不要なリソースをクリアすることで、新しいページでの処理をスムーズに行えるようにします。
- **`handleNavigation`**:
    - 役割: QuartzのSPAナビゲーションイベントを監視し、ページ遷移が完了した際に楽譜の再初期化処理をトリガーする。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: `nav`カスタムイベントをリッスンし、`initializeMusicNotation`を呼び出すことで、遷移先のページの楽譜を確実にレンダリングします。
- **`loadBrowserRuntime`**:
    - 役割: Quartzのビルドプロセス中に、ブラウザ側で実行されるJavaScriptファイル (`browser-runtime.js`) の内容を読み込む。
    - 引数: `path` (string) - `browser-runtime.js`ファイルへのパス。
    - 戻り値: `string` - `browser-runtime.js`ファイルのテキスト内容。
    - 機能: `fs`モジュールを使用してファイルの内容を同期的に読み込み、トランスフォーマー処理中に利用できるようにします。
- **`escapeHtml`**:
    - 役割: HTML特殊文字（`<`, `>`, `&`, `"`, `'`）を対応するHTMLエンティティに変換し、XSS攻撃を防ぐ。
    - 引数: `text` (string) - エスケープする元の文字列。
    - 戻り値: `string` - エスケープ処理後の安全なHTML文字列。
    - 機能: ユーザー入力や動的に生成されるコンテンツをHTMLに挿入する際に、セキュリティリスクを低減します。
- **`MMLABCTransformer`**:
    - 役割: QuartzのMarkdownトランスフォーマーとして、Markdown内の`mml`、`chord`、`abc`コードブロックを、ブラウザで処理可能なカスタムHTML `div`要素に変換する。
    - 引数: `options` (object, optional) - `enableMML`, `enableChord`, `enableABC`などのプラグイン設定オプション。
    - 戻り値: `(tree: Node) => void` - Unified/Remarkプラグインのインターフェースに準拠した関数。
    - 機能: `unist-util-visit`を使用してMarkdownの抽象構文木 (AST) を走査し、対応するコードブロックを検出。その言語と内容をデータ属性として持つ`<div class="mmlabc-notation">`に置き換え、ブラウザでのレンダリング準備をします。
- **`markdownPlugins`**:
    - 役割: Unified/Remarkエコシステムで使用されるMarkdown処理プラグインの配列を定義する。
    - 引数: なし。
    - 戻り値: `Array<Plugin>` - UnifiedがMarkdownの解析と変換に使用するプラグインのリスト。
    - 機能: プロジェクトで必要とされる様々なMarkdown拡張機能や変換ロジックを構成します。
- **`externalResources`**:
    - 役割: `abcjs`、`mml2abc`、`chord2mml`など、CDN経由で動的に読み込まれる外部JavaScriptライブラリのURLとメタデータを定義する。
    - 引数: なし。
    - 戻り値: `Array<{ src: string, id: string, type?: string, integrity?: string }>` - 外部リソースの設定オブジェクトの配列。
    - 機能: これらのライブラリをブラウザで効率的かつ安全に読み込むための情報を提供します。
- **`media`**:
    - 役割: （提供された情報だけでは具体的な実装内容は不明ですが、Quartzプラグインの文脈から）メディアアセット（画像、音声など）の処理や埋め込みに関連する設定やロジックを提供する。
    - 引数: なし。
    - 戻り値: 不明 (設定オブジェクト、またはプラグイン関数)。
    - 機能: おそらく、Markdownファイル内のメディア参照を適切に処理し、HTML出力に組み込むためのメカニズムの一部です。
- **`events`**:
    - 役割: （テストファイル内で定義されているため）SPAナビゲーションテスト中に、手動でカスタムイベントを発火させるためのオブジェクト。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: テストハーネスがQuartzのナビゲーション挙動をシミュレートし、プラグインのSPA対応ロジックを検証するために使用されます。
- **汎用的な制御フロー関数/キーワード**:
    - **`if`**: 条件分岐を記述し、特定の条件が満たされた場合にのみコードブロックを実行します。
    - **`for` / `forEach`**: 配列やコレクションの要素を順番に処理するために反復処理を行います。
    - **`then` / `catch` / `finally`**: Promiseオブジェクトを用いた非同期処理の結果（成功、失敗、完了）を処理するためのメソッドです。
    - **`addEventListener`**: 指定されたイベント（例: 'click', 'nav'）が発生したときに、特定の関数（イベントハンドラー）を実行するように登録します。
    - **`MutationObserver`**: DOMツリーへの変更（ノードの追加/削除、属性の変更など）を非同期に監視し、変更が発生したときにコールバック関数を実行します。
    - **`setTimeout`**: 指定されたミリ秒数が経過した後に、一度だけ関数を実行するようにスケジュールします。

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
Generated at: 2026-03-07 07:03:40 JST
