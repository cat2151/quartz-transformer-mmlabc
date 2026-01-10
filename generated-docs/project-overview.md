Last updated: 2026-01-11

# Project Overview

## プロジェクト概要
- Obsidianでコードブロックにコード進行を記述すると、五線譜を表示し、クリックで演奏できるQuartzトランスフォーマープラグインです。
- Quartz 4静的サイトジェネレーター向けに開発され、MML（Music Macro Language）とABC Notationにも対応しています。
- このプラグインは、Markdownドキュメントに音楽記譜を埋め込み、ウェブサイト上でインタラクティブな音楽体験を提供します。

## 技術スタック
- フロントエンド: `Quartz`: 高速でバッテリー同梱の静的サイトジェネレーター。本プラグインの動作基盤です。`abcjs`: ABC音楽記法をSVGとしてレンダリングし、音楽再生機能を提供するJavaScriptライブラリです。
- 音楽・オーディオ: `MML (Music Macro Language)`: 音楽をテキストで記述するための言語です。`ABC Notation`: 音楽をテキストで記述するための国際標準記法です。`mml2abc`: MMLをABC記法に変換するためのライブラリです。`chord2mml`: コード進行記法をMMLに変換するためのライブラリです。`AudioContext`: ブラウザのWeb Audio APIの一部で、楽曲再生を可能にします。
- 開発ツール: `npm`: Node.jsのパッケージマネージャー。依存関係の管理とスクリプト実行に使用されます。`unified`: コンテンツの解析と変換のためのJavaScriptインターフェースです。`unist-util-visit`: `unified`が扱う構文木を走査するためのユーティリティです。
- テスト: `Vitest`: 高速なJavaScript/TypeScriptのユニットテストフレームワークです。`Playwright`: WebアプリケーションのE2Eテストやインテグレーションテストを行うためのブラウザ自動化ライブラリです。
- ビルドツール: `TypeScript Compiler (tsc)`: TypeScriptコードをJavaScriptにコンパイルします。
- 言語機能: `TypeScript`: JavaScriptに静的型付けを追加し、大規模開発の堅牢性を高めます。`ES Modules (ESM)`: JavaScriptの標準モジュールシステムで、ライブラリの動的読み込みに使用されます。
- 自動化・CI/CD: `GitHub Actions`: GitHubが提供するCI/CDサービス。デプロイ時のビルド自動化などに使用されます。`Dependabot`: GitHubが提供する依存関係の自動更新ツールです。
- 開発標準: （特筆すべき明示的なツールや規約の記載はありませんが、TypeScriptの採用やテストの導入によりコード品質を担保しています。）

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
- **`.gitignore`**: Gitがバージョン管理の対象外とするファイルやディレクトリを指定します。
- **`LICENSE`**: プロジェクトのライセンス情報（MIT License）を記述しています。
- **`README.ja.md`**: プロジェクトの概要、機能、インストール方法、使用例などを日本語で説明するメインドキュメントです。
- **`README.md`**: プロジェクトの概要、機能、インストール方法、使用例などを英語で説明するメインドキュメントです。
- **`_config.yml`**: Quartzサイトの設定ファイルであり、GitHub Pagesなどの環境でウェブサイトの挙動を定義するために使用されます。
- **`demo.html`**: プラグインの機能を手動でテストしたり、動作を確認したりするためのデモンストレーション用HTMLファイルです。
- **`example.md`**: `mml`, `chord`, `abc`記法を使用したコードブロックの具体的な例を示すMarkdownファイルです。
- **`generated-docs/`**: GitHub Actionsなどの自動化されたプロセスによって生成されるドキュメントを格納するディレクトリです。
- **`issue-notes/`**: 開発中に発生した特定の課題やバグ、その調査内容、解決策などが記録された、開発者向けのメモ群です。（来訪者向けの詳細説明は割愛します。）
- **`package-lock.json`**: `package.json`で定義された依存関係の正確なツリー構造とバージョンを記録し、プロジェクトの再現可能なビルドを保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）、依存関係、開発スクリプト（ビルド、テストなど）を定義します。
- **`playwright.config.ts`**: Playwrightテストフレームワークの設定ファイルで、インテグレーションテストの実行環境やオプションを構成します。
- **`src/index.ts`**: このQuartzトランスフォーマープラグインの主要なロジックが実装されているファイルです。Markdownの音楽記譜コードブロックを検出し、ウェブページ上でインタラクティブな五線譜としてレンダリングするためのHTML構造に変換します。
- **`src/index.test.ts`**: `src/index.ts`で実装されたプラグインのAST変換ロジックやオプション処理に関するユニットテストコードです。
- **`test/`**: インテグレーションテストやその他のテスト関連ファイルを格納するディレクトリです。
- **`test/README.md`**: テストディレクトリの目的や内容について説明するドキュメントです。
- **`test/integration-test.html`**: Playwrightによるインテグレーションテストの対象となるHTMLファイルで、実際のレンダリングとインタラクションを検証します。
- **`test/integration.test.ts`**: Playwrightを使用して、ブラウザ上での楽譜のレンダリングや再生機能などの統合的な挙動を検証するテストコードです。
- **`test/playback-fix.test.ts`**: 音楽再生機能における特定のバグ修正に関連するテストコードです。
- **`test/playback-simple.spec.js`**: 音楽再生の基本的な機能が正しく動作するかを確認するシンプルなテストコードです。
- **`test/spa-navigation-debug.test.ts`**: Quartz v4のSPA（Single Page Application）ナビゲーションに対応するためのデバッグや検証を目的としたテストコードです。
- **`test/spa-navigation-test.html`**: SPAナビゲーションのテストシナリオで使用されるHTMLファイルで、ページ遷移時のプラグインの動作を検証します。
- **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルで、コンパイルの挙動や対象ファイルなどを定義します。
- **`vitest.config.ts`**: Vitestテストフレームワークの設定ファイルで、ユニットテストの実行オプションや環境を構成します。

## 関数詳細説明
- **`MMLABCTransformer()`** (src/index.tsのメインエクスポートとして):
    - **役割**: Quartzのビルドプロセス中に動作するトランスフォーマープラグインのエントリーポイントです。
    - **引数**: オプションオブジェクト`{ enableMML?: boolean, enableChord?: boolean, enableABC?: boolean }`を受け取ります。
    - **戻り値**: Quartzのプラグインインターフェースに準拠したオブジェクト。
    - **機能**: Markdown内の`mml`、`chord`、`abc`コードブロックを検出・解析し、`abcjs`によるレンダリングと再生が可能なHTML要素に変換します。ブラウザ側で実行されるスクリプトを注入し、動的な音楽記譜の表示とインタラクティブな音楽再生を実現します。SPA（Single Page Application）ナビゲーション時も正しく動作するよう、自動再初期化やクリーンアップの仕組みを含んでいます。
- **`wrapper`** (src/index.ts):
    - **役割**: プラグインがDOM要素を処理する際の共通ロジックをカプセル化するラッパー関数。
    - **引数**: 処理対象のDOM要素や関連する設定など。
    - **戻り値**: なし。
    - **機能**: 音楽記譜の初期化やイベントハンドラーの設定など、複数の処理を特定の要素に対して一貫して適用し、エラーハンドリングや効率的なリソース管理をサポートします。
- **`escapeHtml`** (src/index.ts):
    - **役割**: HTML特殊文字をエスケープし、セキュリティを向上させるユーティリティ関数。
    - **引数**: エスケープ対象の文字列。
    - **戻り値**: エスケープ処理された文字列。
    - **機能**: HTMLに表示される文字列中の`<`, `>`, `&`, `"`, `'`などの文字を、それぞれのHTMLエンティティ（例: `&lt;`）に変換することで、クロスサイトスクリプティング（XSS）などの潜在的な脆弱性を防ぎます。
- **`updateNotationTheme`** (src/index.ts):
    - **役割**: 楽譜の表示テーマ（色、スタイルなど）をQuartzサイトの現在のテーマに合わせて更新する関数。
    - **引数**: なし。
    - **戻り値**: なし。
    - **機能**: Quartzウェブサイトのライトモードまたはダークモードのテーマ設定を検出し、それに応じてSVGとしてレンダリングされる楽譜のスタイル（背景色、テキスト色など）を動的に調整し、視覚的な一貫性を保ちます。
- **`getQuartzTheme`** (src/index.ts):
    - **役割**: Quartzサイトの現在のテーマ設定（ライトまたはダーク）を取得する関数。
    - **引数**: なし。
    - **戻り値**: 現在のテーマを表す文字列（例: 'dark' または 'light'）。
    - **機能**: DOMの属性やCSS変数などからQuartzウェブサイトの現在アクティブなテーマ情報を読み取り、他の機能でテーマに応じた処理を行うための基盤を提供します。
- **`initializeMusicNotation`** (src/index.ts):
    - **役割**: 音楽記譜のレンダリングと再生機能を初期化する主要な関数。
    - **引数**: 処理対象のHTML要素（音楽記譜ブロックを含むdiv要素など）。
    - **戻り値**: なし。
    - **機能**: 指定されたHTML要素内の音楽記譜データ（MML, Chord, ABC）を解析し、`mml2abc`や`chord2mml`でABC記法に変換後、`abcjs`ライブラリを使用してインタラクティブな五線譜としてSVGを生成します。また、クリックイベントハンドラーを設定し、楽曲の再生を可能にします。
- **`handlePlayback`** (src/index.ts):
    - **役割**: ユーザーの操作（クリック、キーボード入力）に応じて楽譜の音楽再生を制御する関数。
    - **引数**: イベントオブジェクト、レンダリングされた楽譜要素、または再生対象の識別子など。
    - **戻り値**: なし。
    - **機能**: ユーザーがレンダリングされた楽譜をクリックしたり、関連するキー（EnterまたはSpace）を押したりした際に、`abcjs`のオーディオシンセサイザーを利用して対応する楽曲を再生または停止します。
- **`cleanup`** (src/index.ts):
    - **役割**: QuartzのSPAナビゲーション時に、不要になったリソースを適切に解放し、メモリリークを防ぐための関数。
    - **引数**: なし。
    - **戻り値**: なし。
    - **機能**: ページ遷移が発生した際に、以前のページで設定されたイベントリスナー、初期化された`AudioContext`インスタンス、キャッシュされたデータなどを破棄またはリセットし、システムの安定性とパフォーマンスを維持します。

## 関数呼び出し階層ツリー
```
- wrapper (src/index.ts)
  - escapeHtml ()
  - updateNotationTheme ()
    - getQuartzTheme ()
  - initializeMusicNotation ()
  - handlePlayback ()
  - cleanup ()
  - markdownPlugins () (これはMMLABCTransformerが追加される配列の名前)
  - externalResources () (これはリソース読み込みに関するヘルパーと推測)
  - function () (JavaScriptの一般的な関数構文)
  - forEach () (JavaScriptの配列メソッド)
  - then () (Promiseの解決ハンドラー)
  - catch () (Promiseのエラーハンドラー)
  - addEventListener () (DOMイベントリスナー)
- if (src/index.ts) (条件分岐)
- for (src/index.ts) (繰り返し処理)
- media (src/index.ts) (おそらくメディアクエリ関連またはメディア要素処理)

---
Generated at: 2026-01-11 07:02:11 JST
