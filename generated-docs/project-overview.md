Last updated: 2026-01-09

# Project Overview

## プロジェクト概要
- コード進行をコードブロックに書くだけで、五線譜を表示してクリック演奏も可能にするQuartzトランスフォーマープラグインです。
- Music Macro Language (MML) とABC Notationの両方をサポートし、Quartzサイトに音楽機能を追加します。
- ブラウザ上で楽譜のレンダリングと再生を動的に行い、ユーザー体験を豊かにします。

## 技術スタック
- フロントエンド: `abcjs` (ABC音楽記法をSVGでレンダリングし、クリックによる再生機能を提供します。バージョン6系の最新を使用)、HTML/CSS/JavaScript (ブラウザ上での楽譜表示とインタラクションの基盤となります)、SVG (五線譜の表示形式として利用されます)。
- 音楽・オーディオ: `mml2abc` (Music Macro Language (MML) をABC記法に変換します)、`chord2mml` (コード進行記法をMMLに変換します)、ABC Notation (楽譜を表現するための標準的なテキスト記法)、MML (音楽をテキストで記述するための言語)、オーディオシンセサイザー (楽譜のクリック時に音源を再生するために使用されます)。
- 開発ツール: `TypeScript` (型安全なJavaScript開発を可能にするプログラミング言語)、`Vitest` (ユニットテストフレームワーク)、`Playwright` (ブラウザ自動化およびインテグレーションテストフレームワーク)、`npm` (パッケージ管理ツール)、`Node.js` (開発環境のランタイム)。
- テスト: `Vitest` (AST変換ロジック、プラグインオプション、エッジケースなどのユニットテストを実行します)、`Playwright` (ブラウザでの楽譜レンダリングとインタラクティブ機能のインテグレーションテストを実行します)。
- ビルドツール: `unified` (Markdownの抽象構文木 (AST) を解析し、変換するためのインターフェースを提供します)、`unist-util-visit` (構文木を効率的に走査するためのユーティリティ)、`npm run build` (TypeScriptコードをJavaScriptにコンパイルし、配布可能なパッケージを生成します)。
- 言語機能: `TypeScript` (モダンなJavaScriptの機能に加えて、型定義による堅牢なコードを記述します)、`JavaScript` (ブラウザ側で楽譜のレンダリングや再生を行うための主要なスクリプト言語です)。
- 自動化・CI/CD: `GitHub Actions` (GitHubでのデプロイ時に、プラグインの自動ビルドを行うワークフローが設定されています)。
- 開発標準: `tsconfig.json` (TypeScriptコンパイラの挙動を定義し、プロジェクト全体の型チェックやコンパイル設定を統一します)、`package.json` (プロジェクトのメタデータ、スクリプト、および依存関係を管理し、開発標準を確立します)。

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
│   ├── 26.md
│   ├── 31.md
│   ├── 32.md
│   ├── 33.md
│   ├── 34.md
│   ├── 38.md
│   ├── 40.md
│   ├── 42.md
│   ├── 44-investigation.md
│   ├── 44.md
│   ├── 46-solution.md
│   ├── 46.md
│   ├── 47.md
│   ├── 50.md
│   ├── 51-solution.md
│   ├── 51.md
│   ├── 53.md
│   ├── 55.md
│   ├── 56-solution.md
│   ├── 56.md
│   └── 58.md
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
├── vitest.config.ts
└── README.md
```

## ファイル詳細説明
- **`.gitignore`**: Gitによるバージョン管理から除外すべきファイルやディレクトリのパターンを定義します。
- **`LICENSE`**: このプロジェクトがMITライセンスの下で配布されることを示し、利用条件を明記しています。
- **`README.ja.md`**: プロジェクトの目的、機能、インストール方法、使い方などを日本語で説明するメインドキュメントです。
- **`README.md`**: `README.ja.md`の英語版であり、プロジェクトの概要を英語で提供します。
- **`_config.yml`**: GitHub Pagesなどの静的サイト設定に関連するファイルですが、Quartzの直接的な設定ではありません。
- **`demo.html`**: プラグインの機能を手動でテストするためのデモファイルです。様々なMML、chord、ABCコードブロックのレンダリングと再生を確認できます。
- **`example.md`**: プラグインの特定の機能や使用例を示すMarkdown形式のサンプルファイルです。
- **`generated-docs/`**: AI生成されたドキュメントや開発状況レポートなどが格納されるディレクトリです。
- **`issue-notes/`**: 開発中の課題やその調査、解決策に関するメモを記録するためのディレクトリです。（内容は開発者向けのためここでは省略します）
- **`package-lock.json`**: `package.json`にリストされた依存関係の正確なバージョンと依存ツリーを記録し、ビルドの一貫性を保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）、スクリプト（ビルド、テストなど）、および開発・実行時の依存関係を定義するファイルです。
- **`playwright.config.ts`**: Playwrightテストフレームワークの設定ファイルで、インテグレーションテストの実行環境やオプションを定義します。
- **`src/index.test.ts`**: メインのプラグインロジック（`src/index.ts`）に対するユニットテストコードが含まれています。AST変換、オプションの処理、エッジケースなどを検証します。
- **`src/index.ts`**: Quartzトランスフォーマープラグインの核心となるファイルです。Markdown内のMML、chord、ABCコードブロックを検出し、ブラウザで楽譜としてレンダリング・再生するためのHTML構造とJavaScriptコードを生成する役割を担います。
- **`test/README.md`**: テストディレクトリに関する追加情報やガイダンスが記述されている可能性があります。
- **`test/integration-test.html`**: インテグレーションテストのために使用される特定のHTML構造を持つファイルです。
- **`test/integration.test.ts`**: Playwrightを使用して、実際にブラウザ環境で楽譜が正しくレンダリングされ、クリック再生機能が動作するかを検証するインテグレーションテストです。
- **`tsconfig.json`**: TypeScriptコンパイラのための設定ファイルで、TypeScriptファイルのコンパイル方法やプロジェクトのルート、使用するライブラリなどを指定します。
- **`vitest.config.ts`**: Vitestユニットテストフレームワークの設定ファイルで、テストの実行方法、カバレッジ設定、モックなどに関するオプションを定義します。

## 関数詳細説明
- **`escapeHtml`** (src/index.ts): HTML特殊文字（`<`, `>`, `&`, `"` など）をエスケープし、HTMLコンテンツとして安全に表示できる文字列を生成します。
- **`updateNotationTheme`** (src/index.ts): Quartzサイトの現在のテーマ（ライトモード/ダークモードなど）に基づいて、レンダリングされる楽譜の表示テーマを調整します。
- **`getQuartzTheme`** (src/index.ts): Quartzサイトで現在適用されているテーマ設定（例: CSS変数から色情報を取得）をプログラム的に取得します。
- **`handlePlayback`** (src/index.ts): レンダリングされた五線譜がクリックされたり、キーボード操作があったりした際に、対応する楽曲の再生を開始または停止するイベントハンドラーとして機能します。
- **`cleanup`** (src/index.ts): 楽曲再生の終了時やページ遷移時などに、使用されたオーディオリソースやイベントリスナーなどを適切に解放・停止するクリーンアップ処理を行います。
- **`checkPlaybackStatus`** (src/index.ts): 現在、楽曲が再生中であるかどうか（オーディオシンセサイザーがアクティブかどうか）の状態を確認します。
- **`markdownPlugins`** (src/index.ts): Markdownのコードブロックを検出・処理し、最終的なHTML出力に変換するためにunifiedライブラリで使用される一連の変換ロジックを構成します。
- **`if`** (src/index.ts, test/integration.test.ts): コード内の条件分岐のブロックを示します。特定の条件下で異なる処理を実行するために使用されます。
- **`externalResources`** (src/index.ts): abcjs、mml2abc、chord2mmlといった外部のJavaScriptライブラリをCDNから動的に読み込むためのHTML要素（`<script>`タグなど）を生成します。
- **`blocks`** (src/index.ts): `mml`、`chord`、`abc`という言語タグを持つMarkdownコードブロックを特定し、その内容をHTMLに変換するための処理を行います。
- **`function`** (src/index.ts): コード内で定義される汎用的な関数または匿名関数ブロックを示します。
- **`forEach`** (src/index.ts): 配列やリストの各要素に対して指定されたコールバック関数を一度ずつ実行するループ処理を示します。
- **`for`** (src/index.ts): 繰り返し処理を行うための構文を示します。
- **`catch`** (src/index.ts): エラーが発生した場合にそのエラーを捕捉し、指定された処理を実行するエラーハンドリングのブロックを示します。
- **`addEventListener`** (src/index.ts): DOM要素に特定のイベント（例: クリック、キー入力）に対するイベントリスナーを登録し、イベント発生時に指定された関数を実行させます。
- **`media`** (src/index.ts): メディア関連の操作や処理を行うための関数またはコードブロックを示します。

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
Generated at: 2026-01-09 07:02:24 JST
