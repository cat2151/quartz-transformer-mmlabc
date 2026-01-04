Last updated: 2026-01-05

# Project Overview

## プロジェクト概要
- Quartzの静的サイトでMMLやコード進行記法をインタラクティブな楽譜として表示するプラグインです。
- Markdown内の専用コードブロックを検出し、abcjsを用いて五線譜と再生機能をブラウザ上で提供します。
- MML、コード進行、ABC記譜法に対応し、音楽コンテンツをWebサイトに手軽に埋め込むことを可能にします。

## 技術スタック
- フロントエンド: **abcjs** (楽譜をSVGでレンダリングし、Web Audio APIで音楽再生を可能にするJavaScriptライブラリ)、**mml2abc** (MML記法をABC記法へ変換するJavaScriptライブラリ)、**chord2mml** (コード進行記法をMMLへ変換するJavaScriptライブラリ)。これらはすべてCDN経由でブラウザ上で動的に読み込まれ、クライアントサイドでの処理を実行します。
- 音楽・オーディオ: **abcjs** (楽譜の表示とWeb Audio APIを活用した音楽再生機能を提供)、**mml2abc** (MMLからABC記法への変換処理)、**chord2mml** (コード進行からMML記法への変換処理)。
- 開発ツール: **TypeScript** (静的型付けにより大規模開発をサポートするJavaScriptのスーパーセット)、**npm** (Node.jsのパッケージ管理ツール)、**unified** (コンテンツの解析と変換のためのインターフェース)、**unist-util-visit** (構文木を走査するためのユーティリティ)。
- テスト: **Vitest** (高速で豊富な機能を持つユニットテストフレームワーク)、**@playwright/test** (ブラウザを自動操作し、E2Eテストを実行するためのフレームワーク)。
- ビルドツール: **TypeScript** (TypeScriptコードをJavaScriptにコンパイルします)。
- 言語機能: **TypeScript** (静的型付けによるコードの品質向上と保守性、モダンなJavaScript機能の利用)。
- 自動化・CI/CD: **GitHub Actions** (プロジェクトのビルドおよびデプロイプロセスを自動化するためのCI/CDプラットフォーム)。
- 開発標準: **TypeScript** (コードの一貫性、可読性、およびメンテナンス性を高めるための型定義と厳格なコーディング規則)。

## ファイル階層ツリー
```
quartz-transformer-mmlabc/
├── src/
│   └── index.ts          # メインプラグイン実装
├── dist/                 # コンパイル出力（生成）
│   ├── index.js
│   └── index.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## ファイル詳細説明
- **`.gitignore`**: Gitによるバージョン管理から除外するファイルやディレクトリを指定します。
- **`LICENSE`**: プロジェクトのライセンス情報（MITライセンス）を記述したファイルです。
- **`README.ja.md`**: プロジェクトの概要、インストール方法、使い方などを日本語で説明する主要なドキュメントです。
- **`README.md`**: プロジェクトの概要、インストール方法、使い方などを英語で説明する主要なドキュメントです。
- **`_config.yml`**: GitHub Actionsのワークフローや、静的サイトジェネレーターの設定に関連する可能性があります。
- **`demo.html`**: プラグインの手動テストやデモンストレーションに使用されるHTMLファイルで、MML、コード進行、ABC記譜のサンプルコンテンツを含んでいます。
- **`example.md`**: プラグインの使用方法をMarkdown形式で示す例のファイルです。
- **`generated-docs/`**: ドキュメントが自動生成される場合に配置されるディレクトリです。
- **`issue-notes/`**: 開発中の課題や検討事項を記録するためのメモファイル群が格納されています。
- **`package-lock.json`**: `package.json`に記述された依存関係の正確なバージョンを記録し、再現性のあるビルドを保証します。
- **`package.json`**: Node.jsプロジェクトのメタデータ、依存関係、スクリプト（ビルド、テストなど）を定義するファイルです。
- **`playwright.config.ts`**: E2E（End-to-End）テストフレームワークであるPlaywrightの設定ファイルです。
- **`src/index.test.ts`**: メインプラグイン`src/index.ts`の機能が正しく動作することを検証するためのユニットテストコードが記述されています。
- **`src/index.ts`**: このQuartzトランスフォーマープラグインの核心となる実装ファイルです。Markdownのコードブロックを検出・変換し、クライアントサイドでの楽譜レンダリングと再生ロジックを注入します。
- **`test/README.md`**: テストに関する説明やガイドラインが記述されている可能性があります。
- **`test/integration-test.html`**: 統合テストでブラウザ環境での実際の動作を確認するために使用されるHTMLテンプレートです。
- **`test/integration.test.ts`**: Playwrightを使用してブラウザ環境でのプラグインの統合的な動作（楽譜のレンダリング、再生機能など）を検証するテストコードです。
- **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルで、プロジェクトのコンパイルオプションを定義します。
- **`vitest.config.ts`**: Vitestテストフレームワークの設定ファイルです。

## 関数詳細説明
- **`escapeHtml`** (src/index.ts)
  - 役割: HTML特殊文字を安全なエンティティに変換し、XSS攻撃の防止や表示の崩れを防ぎます。
  - 引数: `text: string` - エスケープする文字列。
  - 戻り値: `string` - エスケープ処理後の文字列。
  - 機能: 与えられた文字列内の`<`, `>`, `&`, `"`などのHTML特殊文字を、対応するHTMLエンティティ（例: `&lt;`）に変換します。
- **`updateNotationTheme`** (src/index.ts)
  - 役割: Quartzサイトのテーマ（ライト/ダークモードなど）に基づいて、楽譜の表示テーマを動的に調整します。
  - 引数: なし。
  - 戻り値: なし。
  - 機能: `getQuartzTheme`から取得したテーマ情報に基づき、楽譜レンダリングのスタイルや色を更新し、サイト全体との統一感を持たせます。
- **`getQuartzTheme`** (src/index.ts)
  - 役割: Quartzサイトから現在のテーマ設定（例: 'light', 'dark'）を取得します。
  - 引数: なし。
  - 戻り値: `string` - 現在のQuartzテーマ名（'light'または'dark'など）。
  - 機能: WebページのDOM要素からQuartzが設定しているテーマ情報を抽出し、その情報を返します。
- **`handlePlayback`** (src/index.ts)
  - 役割: 楽譜の音楽再生を開始、停止、および一時停止を管理します。再生中の視覚的なフィードバックも制御します。
  - 引数: `element: HTMLElement` - クリックされた楽譜のDOM要素、`notation: string` - 再生する楽譜のABC記譜データ。
  - 戻り値: なし。
  - 機能: abcjsのシンセサイザーAPIとWeb Audio APIを使用して、楽譜をクリックした際に音楽を再生します。再生中は楽譜の背景色を変更するなどの視覚的フィードバックを提供し、再生終了時に自動停止します。
- **`cleanup`** (src/index.ts)
  - 役割: 楽譜要素に関連するすべてのイベントリスナー、タイマー、および動的に生成されたリソースを解放し、メモリリークを防ぎます。
  - 引数: `element: HTMLElement` - クリーンアップ対象の楽譜のDOM要素。
  - 戻り値: なし。
  - 機能: 楽譜要素がDOMから削除される際などに呼び出され、関連するリソースを適切に解放することで、アプリケーションの安定性を保ちます。
- **`checkPlaybackStatus`** (src/index.ts)
  - 役割: 現在の音楽再生の状態（再生中、停止中など）を確認し、その情報を返します。
  - 引数: `element: HTMLElement` - 状態を確認したい楽譜のDOM要素。
  - 戻り値: `boolean` - 楽譜が現在再生中であれば`true`、そうでなければ`false`。
  - 機能: 特定の楽譜が現在音を鳴らしているかどうかを判断するためのステータスチェックを行います。
- **`markdownPlugins`** (src/index.ts)
  - 役割: QuartzのMarkdown処理パイプラインで使用されるUnifiedプラグインのリストを定義します。
  - 引数: なし。
  - 戻り値: `Array<Plugin>` - Markdown ASTを変換するためのUnifiedプラグインの配列。
  - 機能: Markdownの抽象構文木（AST）を走査し、`mml`、`chord`、または`abc`言語タグを持つコードブロックを検出し、これらをHTMLの`div`要素に変換するロジックをカプセル化します。
- **`externalResources`** (src/index.ts)
  - 役割: abcjs、mml2abc、chord2mmlといった外部ライブラリをCDNから動的に読み込むためのHTML文字列を生成します。
  - 引数: なし。
  - 戻り値: `string` - スクリプトタグを含むHTML文字列。
  - 機能: ブラウザ上で楽譜のレンダリングと音楽再生に必要なJavaScriptライブラリを、Quartzのビルドプロセス中にHTMLに注入します。
- **`blocks`** (src/index.ts)
  - 役割: Markdown内の特定の言語タグを持つコードブロック（`mml`, `chord`, `abc`）を処理するためのロジックをラップしたものです。
  - 引数: Markdownのコードブロックノード、ファイル情報など（UnifiedのVisitorパターンに依存）。
  - 戻り値: なし（または変換後のノード）。
  - 機能: コードブロックの内容を抽出し、HTMLの`div`要素に変換して、必要なデータ属性（`data-mml`, `data-chord`, `data-abc`）を付与します。この要素はブラウザ上でJavaScriptによって楽譜としてレンダリングされます。

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
Generated at: 2026-01-05 07:01:59 JST
