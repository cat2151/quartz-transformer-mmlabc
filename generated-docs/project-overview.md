Last updated: 2026-01-20

# Project Overview

## プロジェクト概要
- Obsidianで、コード進行をコードブロックに書くと、五線譜を表示して鳴らすことができます。
- Quartz4でもそれを実現するため、新たにトランスフォーマープラグインを作りました。
- Obsidian版と同じく、MML（Music Macro Language）とABC Notationも利用できます。

## 技術スタック
- フロントエンド: 
  - **abcjs**: ABC音楽記法をレンダリングし、楽譜のインタラクティブな再生機能を提供するJavaScriptライブラリ。
  - **mml2abc**: Music Macro Language (MML) 形式の音楽データをABC記法に変換するライブラリ。
  - **chord2mml**: コード進行記法をMMLに変換するライブラリ。
- 音楽・オーディオ: 
  - **Music Macro Language (MML)**: 音楽をテキストで記述するための簡易言語。
  - **ABC Notation**: 楽譜をテキストで記述するためのコンパクトな記法。
  - **AudioContext API**: ブラウザ内でオーディオ処理を行うためのWeb API（abcjsが内部的に利用）。
- 開発ツール: 
  - **npm**: JavaScriptのパッケージ管理ツール。依存関係の管理やスクリプトの実行に使用。
  - **TypeScript**: JavaScriptに静的型付けを追加した言語。大規模なアプリケーション開発を支援。
  - **unified**: コンテンツの解析と変換のためのインターフェースを提供するツールキット。
  - **unist-util-visit**: unifiedのエコシステムで構文木を走査するためのユーティリティ。
- テスト: 
  - **Vitest**: 高速なユニットテストフレームワーク。AST変換ロジックのテストに利用。
  - **Playwright**: ブラウザ自動化ライブラリ。実際のブラウザ環境でのレンダリングやインタラクティブ機能のインテグレーションテストに利用。
- ビルドツール: 
  - **npm scripts**: `package.json`に定義されたビルドコマンドを実行。
- 言語機能: 
  - **JavaScript (ES Modules)**: Webブラウザで動的にライブラリをロードするために利用。
- 自動化・CI/CD: 
  - **GitHub Actions**: リポジトリのイベント（プッシュなど）に基づいて、ビルド、テスト、デプロイなどのワークフローを自動化。
  - **Dependabot**: 依存関係の更新を自動的に検出し、プルリクエストを作成するツール。
- 開発標準: 
  - **tsconfig.json**: TypeScriptコンパイラの設定を定義し、プロジェクト全体の型チェックとコンパイル挙動を統一。
  - **.gitignore**: Gitが追跡すべきでないファイルを指定し、リポジトリをクリーンに保つ。

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
  📖 67-solution.md
  📖 67.md
  📖 69.md
  📖 71.md
  📖 72.md
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
- **.gitignore**: Gitがバージョン管理の対象外とするファイルやディレクトリを指定する設定ファイルです。
- **DEBUG-LOGGING-SUMMARY.md**: デバッグログに関する概要や経緯をまとめたドキュメントです。
- **LICENSE**: 本プロジェクトがMITライセンスであることを示すライセンス情報ファイルです。
- **README.ja.md**: プロジェクトの目的、機能、インストール方法、使用方法などを日本語で説明する主要なドキュメントファイルです。
- **README.md**: `README.ja.md`の英語版であり、多言語対応のためのドキュメントです。
- **SPA-FIX-SUMMARY.md**: シングルページアプリケーション (SPA) ナビゲーションの修正に関する概要をまとめたドキュメントです。
- **_config.yml**: Quartzサイトジェネレーターの全体設定ファイルです。
- **demo.html**: 本プラグインの機能をブラウザで手動テストするためのデモ用HTMLファイルです。
- **example.md**: プラグインの使用例を示すMarkdownファイルで、MML、chord、ABC記法がどのようにレンダリングされるかを示します。
- **generated-docs/**: 自動生成されたドキュメントを格納するディレクトリです。
- **issue-notes/**: 開発中に発生した課題やその解決策に関するメモを保存するディレクトリです。
- **package-lock.json**: `package.json`に記載された依存関係の正確なバージョンと依存ツリーを記録し、ビルドの再現性を保証するファイルです。
- **package.json**: プロジェクトのメタデータ（名前、バージョン）、スクリプト、依存関係（ランタイムと開発用）を定義するファイルです。
- **playwright.config.ts**: Playwrightを用いたインテグレーションテストの設定を定義するファイルです。
- **src/index.test.ts**: メインプラグイン `src/index.ts` のユニットテストコードです。AST変換ロジックやプラグインのオプション処理などを検証します。
- **src/index.ts**: Quartzトランスフォーマープラグインの主要な実装ファイルです。Markdownのコードブロックを処理し、楽譜のレンダリングと再生ロジックをウェブページに注入します。Quartz v4のSPAナビゲーション対応ロジックも含まれます。
- **test/README.md**: テストディレクトリに関する説明ドキュメントです。
- **test/integration-test.html**: Playwrightインテグレーションテストで使用されるHTMLファイルです。
- **test/integration.test.ts**: Playwrightを使用して、ブラウザ環境でのプラグインの全体的な動作とレンダリングを検証するインテグレーションテストです。
- **test/playback-fix.test.ts**: Playwrightを使用して、楽譜の再生機能における特定のバグ修正や改善が正しく機能するかを検証するテストです。
- **test/playback-simple.spec.js**: Playwrightを使用して、楽譜のシンプルな再生機能が期待通りに動作するかを検証するテストです。
- **test/spa-navigation-debug.test.ts**: Playwrightを使用して、QuartzのSPAナビゲーションにおける楽譜のレンダリングとクリーンアップが正しく行われるかをデバッグ目的で検証するテストです。
- **test/spa-navigation-test.html**: PlaywrightのSPAナビゲーションテストで使用されるHTMLファイルです。
- **tsconfig.json**: TypeScriptコンパイラの設定ファイルです。コンパイルオプション、インクルード/エクスクルードパスなどを定義します。
- **vitest.config.ts**: Vitestテストフレームワークの設定ファイルです。

## 関数詳細説明
- **wrapper**: Quartzトランスフォーマープラグインのエントリーポイントとなる関数です。MMLABCプラグインのロジックをカプセル化し、オプションの設定を受け付けて変換処理を構成します。
- **logNavDebug**: QuartzのSPAナビゲーション関連のデバッグ情報をコンソールに出力するための補助関数です。
- **escapeHtml**: HTMLの特殊文字をエスケープ処理し、クロスサイトスクリプティング (XSS) などのセキュリティ脆弱性を防ぐユーティリティ関数です。
- **updateNotationTheme**: Quartzサイトの現在のテーマ（ライトモードかダークモードか）に基づいて、レンダリングされる楽譜の表示テーマを更新する関数です。
- **getQuartzTheme**: 現在のQuartzサイトのテーマ設定（ライト/ダーク）を検出して返す関数です。
- **initializeMusicNotation**: ブラウザ内で楽譜のレンダリングと再生に必要な外部JavaScriptライブラリ（abcjs, mml2abc, chord2mml）を動的に読み込み、初期化する主要な関数です。
- **handlePlayback**: レンダリングされた楽譜のクリックまたはキーボード操作イベントを処理し、対応する音楽を再生する機能を提供する関数です。
- **cleanup**: QuartzのSPAナビゲーション時に、以前のページのDOM要素、イベントリスナー、AudioContextなどのリソースを適切に解放し、メモリリークを防ぐためのクリーンアップ関数です。
- **handleNavigation**: Quartz v4のSPAナビゲーションイベント（ページ遷移）をリッスンし、新しいページの内容に応じて楽譜の再レンダリングや初期化処理をトリガーする関数です。
- **markdownPlugins**: Markdownの処理パイプラインに関連するプラグインのコンテナ、またはその設定を扱う関数です。特にコードブロックの検出と変換に関与します。
- **externalResources**: abcjs、mml2abc、chord2mmlといったCDNから動的にロードされる外部ライブラリのリソースを管理し、それらが適切に読み込まれるように調整する関数です。

## 関数呼び出し階層ツリー
```
- wrapper (src/index.ts)
  - logNavDebug (src/index.ts)
    - escapeHtml (src/index.ts)
      - updateNotationTheme (src/index.ts)
      - getQuartzTheme (src/index.ts)
      - initializeMusicNotation (src/index.ts)
      - handlePlayback (src/index.ts)
      - cleanup (src/index.ts)
      - handleNavigation (src/index.ts)
      - markdownPlugins (src/index.ts)
      - externalResources (src/index.ts)
      - addEventListener (Web API)
      - some (JavaScript Array Method)

---
Generated at: 2026-01-20 07:02:00 JST
