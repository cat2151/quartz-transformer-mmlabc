Last updated: 2026-03-08

# Development Status

## 現在のIssues
- プロジェクトを実際に利用して改善点を発見するドッグフーディング ([Issue #31](../issue-notes/31.md)) が重要な次のステップとして挙げられている。
- ポップアップ表示時の五線譜描画不具合 ([Issue #81](../issue-notes/81.md)) に対する修正が最近適用されたが、さらなる安定性確認が必要である。
- `browser-runtime.js` からデバッグコードが削除され ([Issue #84 (implied)](../issue-notes/84.md))、大規模ファイルの改善が進められているが、さらなる最適化の余地がある。

## 次の一手候補
1. [Issue #31](../issue-notes/31.md): ドッグフーディングによる初期フィードバック収集
   - 最初の小さな一歩: MML記譜法を簡単なスコアで変換し、ブラウザで表示する基本的なフローを実際に試し、UI/UX上の問題点を洗い出す。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/browser-runtime.js, test/spa-navigation-test.html, test/playback-simple.spec.js

     実行内容: `test/spa-navigation-test.html` を利用してMML記譜を変換し、表示する一連のユーザー操作をシミュレートするPlaywrightテストケースを新規作成または既存を拡張してください。特に、簡単なMML入力から五線譜表示までのUXフローに焦点を当て、潜在的なボトルネックや不具合がないかを確認します。

     確認事項: 既存のテストスイートとの整合性、およびユーザーインターフェースが変更された場合のテストケースの維持容易性を考慮してください。

     期待する出力: `test/dogfooding.test.ts` という名前で新しいPlaywrightテストファイルを作成し、MMLから五線譜表示までの基本フローを検証するテストコードを記述してください。
     ```

2. [Issue #81](../issue-notes/81.md): ポップアップ時の五線譜描画安定性向上のためのテスト強化
   - 最初の小さな一歩: ポップアップ表示時に五線譜が正しく描画されることを保証するため、`MutationObserver` の挙動とSVG描画の確認に特化した単体テストを追加する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/browser-runtime.js, test/spa-navigation-runtime.js, test/spa-navigation-test.html

     実行内容: `src/browser-runtime.js` 内のMutationObserverによるDOM変更監視と、その後のSVG描画ロジックについて、特にIssue #81で修正された箇所の回帰を防ぐためのテストケースを `test/playback-fix.test.ts` に追加してください。具体的には、特定のDOM要素が変更された後にSVGが期待通りに生成・更新されることを検証するテストを記述します。

     確認事項: 既存の`playback-fix.test.ts`内のテスト構造との整合性、および`MutationObserver`と非同期処理を適切にモックまたは待機させる方法を考慮してください。

     期待する出力: `test/playback-fix.test.ts` に、Issue #81の修正に関連するシナリオ（例: ポップアップ要素が動的に追加された際の五線譜描画）を検証する新しいテスト関数を追加してください。
     ```

3. [Issue #84 (implied)](../issue-notes/84.md): `browser-runtime.js` のコード品質と保守性向上
   - 最初の小さな一歩: `src/browser-runtime.js` のファイルサイズと複雑性をさらに評価し、特に肥大化している関数や重複コードを特定する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/browser-runtime.js

     実行内容: `src/browser-runtime.js` のコードベースを分析し、特に50行を超える関数、ネストが深いロジック、または他のファイルに抽出可能なユーティリティ関数候補を特定してください。分析結果は、モジュール化やリファクタリングの候補としてmarkdown形式でリストアップしてください。

     確認事項: 既存の機能への影響を最小限に抑えることを考慮し、変更が既存のテストスイートによって適切にカバーされるかを確認してください。

     期待する出力: `browser-runtime-refactor-analysis.md` というファイルに、`src/browser-runtime.js` のリファクタリングが必要な領域（関数名、行数、簡単な理由）を詳細に記述したmarkdown形式の分析レポートを生成してください。

---
Generated at: 2026-03-08 07:01:37 JST
