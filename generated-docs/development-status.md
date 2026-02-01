Last updated: 2026-02-02

# Development Status

## 現在のIssues
- [Issue #74](../issue-notes/74.md) は、QuartzのSPAナビゲーション時に五線譜が消えるという [Issue #71](../issue-notes/71.md) の問題を解決するため、MutationObserverではなく`nav`イベント主導の設計に切り替えることを目指しています。
- [Issue #71](../issue-notes/71.md) の詳細分析では、現在のMutationObserver主導の設計がSPAライフサイクルと噛み合っておらず、`nav`イベントより先に不適切な描画が行われることが根本原因と特定されました。
- [Issue #50](../issue-notes/50.md) は過去のレンダリング問題の再発有無を監視するもので、[Issue #31](../issue-notes/31.md) はドッグフーディングの継続を促しています。

## 次の一手候補
1. [Issue #74](../issue-notes/74.md): `src/browser-runtime.js` をnavイベント主導の設計に再構築
   - 最初の小さな一歩: `src/browser-runtime.js` からMutationObserver関連コードを削除し、`document.addEventListener('nav', ...)` と `setTimeout(0)` を用いた再描画ロジックのスケルトンを作成する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/browser-runtime.js`

     実行内容: `src/browser-runtime.js` の現状のMutationObserverに基づいた五線譜レンダリングロジックを削除し、[Issue #71](../issue-notes/71.md) で推奨された「document 中央集権 + nav 主導」の設計思想に基づき、`document.addEventListener('nav', ...)` を利用した新しい初期化・再描画ロジックのスケルトンを実装してください。具体的には、
     1. 既存のMutationObserver関連コードをすべて削除する。
     2. `document` オブジェクトに対して `nav` イベントリスナーを設定する。
     3. イベントリスナー内で、五線譜のレンダリングを行うためのPlaceholder関数（例: `initializeMMLABCNotation()`）を呼び出すコードを記述し、その呼び出しを `setTimeout(0)` でラップしてDOMの安定を待つようにする。
     4. レンダリング前の既存の五線譜要素をクリアするロジック（`document.querySelectorAll(".abc-notation").forEach(el => { el.innerHTML = ""; });`）をnavイベントリスナーの先頭に追加する。

     確認事項: 変更前に、`src/browser-runtime.js` の既存ロジックがMutationObserverに強く依存していることを確認してください。また、`package.json`や`package-lock.json`に変更がないことを確認してください。

     期待する出力: 更新された `src/browser-runtime.js` ファイルのコードをmarkdown形式で出力してください。また、変更点の概要と、なぜこの変更が必要か（MutationObserverの問題とnavイベントへの移行）を簡潔に説明してください。
     ```

2. [Issue #71](../issue-notes/71.md): AGENTS.md を更新し、TypeScript/JavaScriptの責務分離とQuartzバージョン間の注意点を明記
   - 最初の小さな一歩: `AGENTS.md` （存在しない場合は新規作成）に、TypeScriptとJavaScriptの役割分担に関するガイドラインと、Quartzのバージョン（v3 vs v4）による挙動の違いに関する検証第一の方針を追記する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `AGENTS.md` (ファイルが存在しない場合は新規作成)

     実行内容: エージェントがTypeScriptコードをJavaScript部分に誤って記述する問題を回避し、またQuartzのバージョンによる動作の違いで無効な実装を行わないよう、`AGENTS.md` ファイルを更新または新規作成してください。以下の内容を含めてください。
     1. **TypeScriptとJavaScriptの責務分離**: エージェントが変更すべきファイルが `.ts` ファイル（ビルド時のトランスフォーマーロジックなど）か、`src/browser-runtime.js` のような `.js` ファイル（クライアントサイドのスクリプト）かを明確に指示するガイドラインを記述してください。特に、`src/browser-runtime.js` は直接ブラウザで実行されるJavaScriptであり、TypeScriptのコードを記述してはならないことを強調してください。
     2. **Quartzバージョン間の注意点**: 過去のQuartzバージョン（例: v3）で有効だった実装が、現在のQuartz v4では不適切である可能性があること、そしてその際には必ず**検証を第一**とする方針を示す注意書きを追記してください。

     確認事項: `AGENTS.md` ファイルが既に存在するかどうかを確認してください。存在しない場合は新規作成します。記述内容が開発者の混乱を招かないよう、簡潔かつ明確であることを確認してください。

     期待する出力: 更新または新規作成された `AGENTS.md` ファイルの内容をmarkdown形式で出力してください。
     ```

3. [Issue #50](../issue-notes/50.md) / [Issue #31](../issue-notes/31.md): ドッグフーディングによる主要機能と過去バグの動作検証
   - 最初の小さな一歩: 開発環境でプロジェクトを起動し、五線譜の表示、クリック再生、SPAナビゲーションの基本的な動作、および[Issue #50](../issue-notes/50.md) で言及された過去バグの再発がないかを手動で確認する。
   - Agent実行プロンプト:
     ```
     対象ファイル: (なし。必要に応じて README.ja.md, issue-notes/50.md, issue-notes/31.md の更新)

     実行内容: 現在のプロジェクトの主要機能（五線譜の表示、クリック再生、SPAナビゲーション）を動作確認し、[Issue #50](../issue-notes/50.md) で言及されている以前のバグ（Issue #46関連）が再発していないかを確認してください。[Issue #31](../issue-notes/31.md) のドッグフーディングの一環として、基本的なユーザー体験に問題がないかを検証し、その結果を報告してください。具体的には、
     1. プロジェクトをローカルでビルドし、Quartzサイトを起動する。
     2. 五線譜を含むページにアクセスし、表示とクリック再生が正常に行われるか確認する。
     3. 左ペインのリンクをクリックして複数回ページ遷移を行い、五線譜の再描画が問題なく行われるか、特にIssue #71で報告された自己ナビゲーション時の問題が発生しないかを確認する（ただし、これはIssue #74で修正中であることを考慮する）。
     4. 特に過去のIssue #46に関連する「五線譜が消える、描画されない」現象が再発していないかを確認する。

     確認事項: テスト環境の準備（npm run buildとサイトの起動）が整っていることを確認してください。また、確認中に発見された異常動作やエラーがあれば詳細に記録してください。

     期待する出力: ドッグフーディングとバグ再発有無の確認結果をmarkdown形式で報告してください。以下の項目を含めてください。
     - 検証日時と環境
     - 各機能の動作確認結果（正常/異常）
     - [Issue #50](../issue-notes/50.md) で言及された現象の再発有無
     - [Issue #31](../issue-notes/31.md) の観点からの全体的な所感
     - 発見された問題点があれば、その詳細な説明。
     ```

---
Generated at: 2026-02-02 07:02:11 JST
