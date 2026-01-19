Last updated: 2026-01-20

# Development Status

## 現在のIssues
- [Issue #71](../issue-notes/71.md)では、左ペインから自分のページを開くと五線譜が消えるSPAナビゲーションの問題が最優先で、MutationObserverが根本原因と判明しました。
- [Issue #72](../issue-notes/72.md)は、バグ修正が落ち着いた後に単一責任の原則に従ってソース分割を検討するリファクタリングタスクです。
- [Issue #50](../issue-notes/50.md)は、過去のバグの再発可能性について引き続き様子見が必要な状況です。

## 次の一手候補
1. [Issue #71](../issue-notes/71.md): 既存のMutationObserverベースの楽譜描画ロジックを無効化または削除する
   - 最初の小さな一歩: `src/index.ts`内のMutationObserverのインスタンス生成と`observe`メソッド呼び出しを特定し、コメントアウトまたは削除してビルドが通ることを確認する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/index.ts`

     実行内容: `src/index.ts`ファイルにおいて、現在の五線譜描画処理をトリガーしているMutationObserverのインスタンス生成およびその`observe`メソッドの呼び出し箇所を特定してください。そして、そのMutationObserver関連のコードブロック（定義から`disconnect`まで）を完全に削除してください。削除後もプロジェクトがビルド可能であり、エラーが発生しないことを確認してください。

     確認事項: MutationObserverを削除しても、依存する他の機能が壊れないこと。特に、`initializeMMLABC`関数が別のトリガーで呼び出されるべきであるため、その点に注意してください。既存の`nav`イベントリスナーのデバッグロガーはそのまま残してください。

     期待する出力: 変更後の`src/index.ts`の内容をmarkdown形式のコードブロックで出力してください。また、変更点の概要と、ビルド時にエラーが発生しないことを確認した旨を記述してください。
     ```

2. [Issue #71](../issue-notes/71.md): `nav`イベントリスナーを用いたDOM安定後の楽譜再描画ロジックを実装する
   - 最初の小さな一歩: `src/index.ts`に新しい`document.addEventListener('nav', ...)`を追加し、その内部で既存の楽譜描画関数（`initializeMMLABC`など）を呼び出すように仮実装する。`window.addCleanup`も考慮する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/index.ts`

     実行内容: `src/index.ts`ファイルにおいて、既存の`initializeMMLABC`関数（またはそれに相当する楽譜描画ロジック）を、`document`に対して登録された`nav`イベントリスナーのコールバック内で呼び出すように変更してください。`nav`イベント発生時にDOMが完全に安定してから描画が開始されるように、適切なタイミング（例: `setTimeout(..., 0)`または`requestAnimationFrame`）を考慮してください。また、`window.addCleanup`を使用して、イベントリスナーが適切にクリーンアップされるようにしてください。既存のデバッグロガーはそのまま残してください。

     確認事項: MutationObserverベースの処理が削除されていること（候補1が完了している前提）。`nav`イベントが実際に発火し、`initializeMMLABC`が呼び出されること。複数回のページ遷移でメモリリークや重複処理が発生しないよう、`window.addCleanup`が正しく機能すること。

     期待する出力: 変更後の`src/index.ts`の内容をmarkdown形式のコードブロックで出力してください。変更点の概要と、新しい`nav`イベントリスナーのロジックについて説明してください。
     ```

3. Agent開発ガイドラインを`AGENTS.md`に新規作成し、TypeScriptとJavaScriptの責務分離を明記する
   - 最初の小さな一歩: プロジェクトルートに`AGENTS.md`ファイルを新規作成し、TypeScriptソースファイルを直接編集することと、ビルド成果物を直接編集しないよう明記するガイドラインを追加する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `AGENTS.md` (新規作成)

     実行内容: プロジェクトのルートディレクトリに新規ファイル`AGENTS.md`を作成し、以下の内容を記述してください。
     - エージェントはTypeScriptソースファイル（例: `src/index.ts`）のみを編集対象とし、ビルド後のJavaScriptファイル（例: `dist/index.js`）を直接編集してはならない。
     - TypeScriptでコードを記述し、ビルドプロセスを通じてJavaScriptを生成すること。
     - 開発者はJavaScriptファイルを直接コミットせず、TypeScriptソースのみを管理すること。
     - もしJavaScriptファイルへの変更が必要な場合は、対応するTypeScriptファイルを修正し、ビルドし直す手順を踏むこと。
     - Agentが意図せずJavaScriptファイルを編集した場合は、その変更を破棄し、TypeScriptソースから再生成するよう促すこと。
     - Quartz 3とQuartz 4での実装方法の違い、特にSPAナビゲーションの扱いの検証の重要性について言及すること。

     確認事項: 他のドキュメント（例: `README.ja.md`, `.github/copilot-instructions.md`など）との内容重複がないか、または適切に参照されているかを確認してください。`AGENTS.md`がプロジェクトのルートディレクトリに配置されること。

     期待する出力: 新規作成する`AGENTS.md`の完全な内容をmarkdown形式のコードブロックで出力してください。
     ```

---
Generated at: 2026-01-20 07:01:59 JST
