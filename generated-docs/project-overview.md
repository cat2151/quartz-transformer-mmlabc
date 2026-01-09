Last updated: 2026-01-10

# Project Overview

## プロジェクト概要
- Markdownファイル内でコード進行やMMLを記述するだけで、五線譜の表示とクリック演奏を可能にするQuartzトランスフォーマープラグイン。
- `mml`、`chord`、`abc`タグを持つコードブロックを検出・変換し、ブラウザ上でインタラクティブな楽譜SVGとしてレンダリングします。
- abcjs、mml2abc、chord2mmlといった外部ライブラリをCDN経由で動的にロードすることで、多様な音楽表現とQuartzサイト連携を実現します。

## 技術スタック
- フロントエンド: 
    - **abcjs**: ABC音楽記法をSVGとしてレンダリングし、オーディオ再生機能を提供するJavaScriptライブラリ。
    - **mml2abc**: Music Macro Language (MML) をABC記法に変換するJavaScriptライブラリ。CDN経由で動的に読み込まれます。
    - **chord2mml**: コード進行記法をMMLに変換するJavaScriptライブラリ。CDN経由で動的に読み込まれます。
- 音楽・オーディオ: 
    - **MML (Music Macro Language)**: 音楽をテキストで記述するための言語記法。
    - **ABC Notation**: 楽譜をテキストで記述するための記法。
    - **abcjs**: レンダリングされた楽譜のクリック再生機能を提供します。
- 開発ツール: 
    - **TypeScript**: JavaScriptに型付けを追加し、大規模な開発を支援する言語。
    - **Vitest**: 高速なユニットテストフレームワーク。
    - **Playwright**: ブラウザ上でのインテグレーションテストを自動化するツール。
    - **npm**: Node.jsのパッケージマネージャーで、依存関係の管理とビルドスクリプトの実行に使用。
- テスト: 
    - **Vitest**: AST変換ロジック、HTMLエスケープ、プラグインオプション、エッジケース処理のユニットテストに利用。
    - **Playwright**: ブラウザでの楽譜レンダリングとインタラクティブ機能のインテグレーションテストに利用。
- ビルドツール: 
    - **TypeScript Compiler (tsc)**: TypeScriptコードをJavaScriptにコンパイルします。
    - **npm scripts**: ビルド、テストなどの開発ワークフローを自動化します。
- 言語機能: 
    - **TypeScript**: 型安全性と開発効率を向上させます。
    - **JavaScript**: ブラウザでの動的な楽譜生成と再生ロジックの実装に使用されます。
- 自動化・CI/CD: 
    - **GitHub Actions**: リポジトリのビルド、テスト、デプロイなどのワークフローを自動化します。
    - **Dependabot**: プロジェクトの依存関係を自動的に監視し、更新プルリクエストを生成します。
- 開発標準: 
    - **unified**: コンテンツの解析と変換のためのインターフェースを提供し、Markdown AST処理の基盤となります。
    - **unist-util-visit**: unist (ユニバーサル構文ツリー) を効率的に走査するためのユーティリティ。

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
- **README.ja.md / README.md**: プロジェクトの概要、機能、インストール方法、使い方、開発状況などを日本語および英語で説明する主要なドキュメント。
- **_config.yml**: GitHub Pagesなどのデプロイ環境で使用される可能性のある、サイト全体の設定ファイル。
- **.gitignore**: Gitがバージョン管理の対象から除外するファイルやディレクトリを指定するファイル。
- **LICENSE**: プロジェクトのライセンス情報（MIT License）が記載されています。
- **demo.html**: プラグインのレンダリングおよび再生機能を手動で確認するためのデモンストレーション用HTMLファイル。
- **example.md**: MML、コード進行、ABC記法のコードブロックの具体的な使用例を示すMarkdownファイル。
- **generated-docs/**: Quartzによって生成されたドキュメントや関連情報を格納するディレクトリ。
- **issue-notes/**: 開発中に発生した課題やその調査、解決策に関するメモを記録したMarkdownファイルの集合。
- **package.json**: プロジェクトのメタデータ、スクリプト、および開発・実行時の依存関係が定義されているファイル。
- **package-lock.json**: `package.json`で定義された依存関係の正確なツリー構造とバージョンを記録し、ビルドの再現性を保証します。
- **playwright.config.ts**: Playwrightを用いたブラウザベースのインテグレーションテストの設定を定義するファイル。
- **src/index.ts**: Quartzトランスフォーマープラグインのメイン実装ファイル。Markdown ASTを走査し、コードブロックをHTMLに変換し、ブラウザ側でのレンダリングと再生ロジックを注入します。
- **src/index.test.ts**: `src/index.ts`で実装されたコアロジック（AST変換、HTMLエスケープなど）に対するユニットテストコードを含むファイル。Vitestで実行されます。
- **test/README.md**: テストディレクトリに関する追加情報やガイドラインを記述するためのドキュメント。
- **test/integration-test.html**: Playwrightのインテグレーションテストで使用される、特定のテストシナリオに特化したHTMLファイル。
- **test/integration.test.ts**: Playwrightを利用して、ブラウザでの楽譜のレンダリング、インタラクティブ機能、外部ライブラリのロードなどを検証するインテグレーションテストコードを含むファイル。
- **tsconfig.json**: TypeScriptコンパイラのオプション、コンパイル対象ファイルなどを設定するファイル。
- **vitest.config.ts**: Vitestテストフレームワークの設定ファイル。テストランナーの挙動やカバレッジ設定などを定義します。

## 関数詳細説明
- **`checkPlaybackStatus` (src/index.ts)**:
    - 役割: 現在の楽譜の再生状態（再生中か停止中かなど）を確認します。
    - 引数: 不明 (通常は再生中のIDやDOM要素など)
    - 戻り値: 不明 (通常は真偽値や状態を示す文字列など)
    - 機能: ユーザーインターフェースが楽譜の再生状態に基づいて適切に表示されるよう、現在の再生状況をチェックします。
- **`escapeHtml` (src/index.ts)**:
    - 役割: HTMLの特殊文字をエスケープします。
    - 引数: `text: string` (エスケープ対象の文字列)
    - 戻り値: `string` (エスケープされた文字列)
    - 機能: 入力された文字列に含まれるHTML予約文字（`<`, `>`, `&`, `"`, `'`）を対応するHTMLエンティティに変換し、クロスサイトスクリプティング（XSS）攻撃を防ぎ、正しく表示されるようにします。
- **`updateNotationTheme` (src/index.ts)**:
    - 役割: 楽譜の表示テーマをQuartzサイトのテーマに合わせて更新します。
    - 引数: 不明 (通常はテーマ設定オブジェクトやDOM要素など)
    - 戻り値: `void`
    - 機能: QuartzサイトのCSS変数やダークモード設定を読み取り、abcjsに適用可能なテーマ設定に変換・適用し、サイト全体のデザインと楽譜表示の一貫性を保ちます。
- **`getQuartzTheme` (src/index.ts)**:
    - 役割: 現在のQuartzサイトのテーマ設定（ライト/ダークモードなど）を取得します。
    - 引数: なし
    - 戻り値: `string` (テーマ名またはモードを示す文字列)
    - 機能: DOMからQuartzサイトに現在適用されているテーマに関する情報を取得し、`updateNotationTheme`などの関連関数に提供します。
- **`handlePlayback` (src/index.ts)**:
    - 役割: 楽譜の再生を開始または停止するロジックを処理します。
    - 引数: 不明 (通常はイベントオブジェクト、楽譜ID、またはデータなど)
    - 戻り値: `void`
    - 機能: ユーザーが楽譜をクリックまたはキーボードで操作した際に、abcjsのオーディオシンセサイザーと連携して楽曲の再生を開始・停止・一時停止する一連の処理を実行します。
- **`cleanup` (src/index.ts)**:
    - 役割: リソースの解放やイベントリスナーの解除など、クリーンアップ処理を行います。
    - 引数: 不明 (通常は解除対象のDOM要素やイベントハンドラなど)
    - 戻り値: `void`
    - 機能: プラグインによって追加されたDOM要素やイベントリスナーをページから削除する際、メモリリークを防ぎ、不要なリソースを解放します。
- **`markdownPlugins` (src/index.ts)**:
    - 役割: Markdown AST変換に関わるunifiedプラグインのリストまたは設定を定義します。
    - 引数: 不明 (通常はプラグインを構成するためのオプションなど)
    - 戻り値: `Array<Plugin>` (unifiedプラグインの配列)
    - 機能: unifiedjsエコシステムにおいて、Markdownの解析と変換プロセスに適用されるカスタムプラグイン（本プラグイン自身を含む）を管理・提供します。
- **`if` (src/index.ts, test/integration.test.ts)**:
    - 役割: コードの条件分岐を制御します。
    - 引数: `condition: boolean` (評価される条件式)
    - 戻り値: `void` (または条件によって異なる処理の結果)
    - 機能: 特定の条件が真の場合にのみ、関連するコードブロックを実行します。これは、TypeScript/JavaScriptにおける一般的な制御構造です。
- **`externalResources` (src/index.ts)**:
    - 役割: 外部のCDNライブラリ（abcjs, mml2abc, chord2mml）の動的なロードを管理します。
    - 引数: なし
    - 戻り値: `void`
    - 機能: これらのライブラリのURLを生成し、必要に応じてスクリプトタグとしてDOMに挿入することで、ブラウザが動的にライブラリを読み込めるようにします。
- **`blocks` (src/index.ts)**:
    - 役割: 特定の言語タグを持つコードブロック（`mml`, `chord`, `abc`）の処理に関連するロジックをカプセル化します。
    - 引数: 不明 (通常はASTノードやオプションなど)
    - 戻り値: `void` (または変換されたASTノード)
    - 機能: Markdown ASTを走査し、指定されたコードブロックを検出し、それらをレンダリング可能なHTMLのdiv要素に変換する処理を担います。
- **`function` (src/index.ts)**:
    - 役割: 匿名関数または内部関数の定義を指します。
    - 引数: 不明 (定義される関数による)
    - 戻り値: 不明 (定義される関数による)
    - 機能: 特定の処理をカプセル化し、必要に応じて呼び出せる再利用可能なコード単位を作成します。これはTypeScript/JavaScriptの基本的な構成要素です。
- **`forEach` (src/index.ts)**:
    - 役割: 配列やリストの各要素に対して繰り返し処理を実行します。
    - 引数: `callback: (element, index, array) => void` (各要素で実行される関数)
    - 戻り値: `void`
    - 機能: 配列の各要素を順番に処理し、要素ごとに指定されたコールバック関数を実行します。
- **`for` (src/index.ts)**:
    - 役割: 特定の回数または条件が満たされるまで繰り返し処理を実行します。
    - 引数: `initializer`, `condition`, `finalExpression` (ループの初期化、継続条件、最終処理)
    - 戻り値: `void` (またはループ内で実行される処理の結果)
    - 機能: 定義された初期値から始まり、条件が真である限り、コードブロックを繰り返し実行します。これはTypeScript/JavaScriptの一般的なループ構造です。
- **`catch` (src/index.ts)**:
    - 役割: 例外処理ブロックの一部として、エラーを捕捉します。
    - 引数: `error: Error` (捕捉されたエラーオブジェクト)
    - 戻り値: `void`
    - 機能: `try`ブロック内で発生した例外を捕捉し、プログラムがクラッシュすることなくエラーを処理するためのロジックを実行します。
- **`addEventListener` (src/index.ts)**:
    - 役割: 指定したイベントが発生したときに実行される関数（イベントリスナー）を要素に登録します。
    - 引数: `type: string`, `listener: EventListenerOrEventListenerObject`, `options?: boolean | AddEventListenerOptions`
    - 戻り値: `void`
    - 機能: DOM要素（例: レンダリングされた楽譜SVG）に対してクリックイベントやキーボードイベントを登録し、ユーザーのインタラクションに応じて`handlePlayback`などの関数を呼び出します。
- **`media` (src/index.ts)**:
    - 役割: メディア関連の処理、特にオーディオ再生に関連する機能の管理を行います。
    - 引数: 不明 (通常はオーディオコンテキスト、設定など)
    - 戻り値: 不明 (通常はメディア管理オブジェクトなど)
    - 機能: 楽譜の再生に使用されるオーディオシンセサイザーの初期化や制御、メディア再生の状態管理などを行うと推測されます。

## 関数呼び出し階層ツリー
```
- checkPlaybackStatus (src/index.ts)
  - escapeHtml (src/index.ts)
    - updateNotationTheme ()
      - getQuartzTheme ()
      - handlePlayback ()
      - cleanup ()
      - markdownPlugins ()
      - externalResources ()
      - function ()
      - forEach ()
      - addEventListener ()
- if (src/index.ts)
- blocks (src/index.ts)
- for (src/index.ts)
- catch (src/index.ts)
- media (src/index.ts)

---
Generated at: 2026-01-10 07:02:20 JST
