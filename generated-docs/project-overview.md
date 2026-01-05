Last updated: 2026-01-06

# Project Overview

## プロジェクト概要
- Quartz静的サイトジェネレーター向けに、MMLやコード進行をMarkdown内で五線譜として表示・再生可能にするプラグインです。
- コードブロックにMMLやコード進行を記述するだけで、音楽記法（ABC記法）に変換し、インタラクティブな楽譜を生成します。
- ユーザーはWebページ上で楽譜をクリックして音楽を再生でき、Quartzのテーマ（ダーク/ライトモード）にも対応しています。

## 技術スタック
- フロントエンド:
    - **abcjs**: ABC音楽記法をレンダリングし、五線譜をSVGとして表示し、インタラクティブな再生機能を提供します。バージョン6系の最新版を使用します。
    - **Web Audio API**: ブラウザ内で音楽を再生するためのAPIです。
    - **HTML/CSS/JavaScript**: ブラウザ内で楽譜のレンダリングとインタラクティブ機能を実現します。
- 音楽・オーディオ:
    - **mml2abc**: Music Macro Language (MML) をABC記法に変換するライブラリです。
    - **chord2mml**: コード進行記法をMMLに変換するライブラリです。
    - **abcjs**: 生成されたABC記法を五線譜として表示し、内蔵シンセサイザーで再生します。
- 開発ツール:
    - **TypeScript**: 型安全なJavaScript開発を可能にし、大規模なプロジェクトでの保守性を高めます。
    - **npm**: プロジェクトの依存関係管理とスクリプト実行に使用されます。
    - **unified**: コンテンツ（Markdown ASTなど）の解析、変換、シリアライズのための統一インターフェースを提供します。Quartzプラグインの基盤となっています。
    - **unist-util-visit**: `unified`が生成する構文木を走査し、特定のノードを検出・処理するためのユーティリティです。
- テスト:
    - **Vitest**: 高速なユニットテストフレームワークで、主にAST変換ロジックやヘルパー関数の検証に使用されます。
    - **Playwright**: ブラウザ環境でのエンドツーエンド（インテグレーション）テストフレームワークで、実際のレンダリングやインタラクティブな再生機能の検証に使用されます。
    - **@vitest/ui**: VitestのテストをブラウザUIで実行・確認するためのツールです。
- ビルドツール:
    - **TypeScript Compiler (tsc)**: TypeScriptコードをJavaScriptにコンパイルします。
    - **npm run build**: プロジェクトのビルドプロセスを自動化し、配布可能なJavaScriptファイルを生成します。
- 言語機能:
    - **TypeScript**: 静的型付けによりコードの品質と堅牢性を向上させます。
- 自動化・CI/CD:
    - **GitHub Actions**: リポジトリへのプッシュやデプロイ時に自動でビルド、テスト、ドキュメント生成などを行うCI/CDワークフローを構築します。
- 開発標準:
    - **TypeScript**: コードの型安全性を強制し、統一されたコーディングスタイルを促進します。

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
- **README.ja.md, README.md**: プロジェクトの概要、機能、インストール、使用方法、開発者向け情報などを記述したドキュメント（日本語版と英語版）。
- **demo.html**: ローカル環境でプラグインのレンダリング機能とインタラクティブな再生機能を直接手動でテストするためのHTMLファイル。
- **example.md**: プラグインの使用例を示すMarkdownファイル。
- **issue-notes/**: 開発過程で生成されたIssueに関するメモや詳細な調査結果を格納するディレクトリ。
- **package-lock.json**: `package.json`に記載された依存関係の正確なバージョンと依存ツリーを記録し、ビルドの再現性を保証します。
- **package.json**: プロジェクトのメタデータ、スクリプト、開発時および実行時の依存関係が定義されています。
- **playwright.config.ts**: Playwrightを用いたインテグレーションテストの設定ファイル。テストランナーの挙動やテスト対象の環境を定義します。
- **src/index.ts**: このQuartzトランスフォーマープラグインのメイン実装ファイルです。Markdown内の`mml`, `chord`, `abc`コードブロックを検出し、それらをHTML要素に変換し、ブラウザ側での動的なABC記法レンダリングと音楽再生のためのロジックを注入します。
- **src/index.test.ts**: `src/index.ts`で実装されている主要なロジック（例: AST変換、HTMLエスケープ、オプション処理）に対するユニットテストをVitestフレームワークで記述しています。
- **test/README.md**: テストディレクトリに関する説明ドキュメント。
- **test/integration-test.html**: インテグレーションテストで使用されるHTMLテンプレート、またはテスト用の静的HTMLコンテンツ。
- **test/integration.test.ts**: Playwrightを用いたブラウザ上でのインテグレーションテストを記述しています。レンダリングされた楽譜の正確性や、クリックによる音楽再生などのインタラクティブ機能を検証します。
- **tsconfig.json**: TypeScriptコンパイラの設定ファイル。コンパイルオプション、ターゲット、モジュール解決などが定義されています。
- **vitest.config.ts**: Vitestテストランナーの設定ファイル。ユニットテストの挙動や環境を定義します。

## 関数詳細説明
- **escapeHtml(text: string): string**:
    - **役割**: 特定の文字（例: `< > & " '`）をHTMLエンティティに変換し、XSS攻撃を防ぎ、HTMLとして安全に表示できるようにします。
    - **引数**: `text` (string) - エスケープする文字列。
    - **戻り値**: `string` - エスケープされた文字列。
- **updateNotationTheme(): void**:
    - **役割**: 現在のQuartzサイトのテーマ（ダークモードかライトモードか）を検出し、それに合わせて楽譜の表示スタイル（例: 色）を動的に更新します。
    - **引数**: なし。
    - **戻り値**: なし。
- **getQuartzTheme(): 'dark' | 'light'**:
    - **役割**: Quartzサイトの現在のテーマ設定を取得します。
    - **引数**: なし。
    - **戻り値**: `'dark'` または `'light'`。
- **handlePlayback(element: HTMLElement, notation: string): Promise<void>**:
    - **役割**: レンダリングされた楽譜の要素がクリックされた際に、音楽の再生または停止を制御します。Web Audio APIとabcjsのシンセサイザー機能を利用して楽曲を演奏します。
    - **引数**:
        - `element` (HTMLElement) - クリックされた楽譜のHTML要素。
        - `notation` (string) - 再生するABC記法の文字列。
    - **戻り値**: `Promise<void>` - 非同期操作の完了を示すPromise。
- **cleanup(element: HTMLElement): void**:
    - **役割**: 楽譜の再生に関連するリソース（例: オーディオコンテキスト、イベントリスナー）を解放し、再生状態をリセットします。
    - **引数**: `element` (HTMLElement) - クリーンアップ対象の楽譜のHTML要素。
    - **戻り値**: なし。
- **checkPlaybackStatus(element: HTMLElement): boolean**:
    - **役割**: 指定された楽譜要素の現在の再生状態（再生中かどうか）を確認します。
    - **引数**: `element` (HTMLElement) - 状態を確認する楽譜のHTML要素。
    - **戻り値**: `boolean` - 再生中であれば`true`、そうでなければ`false`。
- **externalResources(): Promise<void>**:
    - **役割**: abcjs、mml2abc、chord2mmlといった外部ライブラリをCDNから動的に読み込みます。これにより、バンドルサイズを抑え、Quartzのビルドプロセスからライブラリを分離します。
    - **引数**: なし。
    - **戻り値**: `Promise<void>` - 非同期ロードの完了を示すPromise。

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
Generated at: 2026-01-06 07:02:15 JST
