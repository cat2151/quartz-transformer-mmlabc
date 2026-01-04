Last updated: 2026-01-05

# Development Status

## 現在のIssues
- [Issue #31](../issue-notes/31.md) は、プロジェクトの機能を自身で試用する「ドッグフーディング」フェーズへの移行を示しています。
- [Issue #2](../issue-notes/2.md) は、READMEや関連ドキュメントを読み込み、プロジェクトの動作を理解し、次の開発のヒントを得るための調査タスクです。
- これらと並行して、GitHub Actionsのワークフロー共通化やREADMEの自動翻訳機能の開発・改善が継続されています。

## 次の一手候補
1. 関数コールグラフ生成ワークフローの動作検証と生成HTML内容の確認 [Issue #31](../issue-notes/31.md)
   - 最初の小さな一歩: `.github/actions-tmp/.github/workflows/call-callgraph.yml` を手動実行し、生成されるHTMLファイル (`.github/actions-tmp/generated-docs/callgraph.html`) の内容が期待通りかを確認する。
   - Agent実行プロンプ:
     ```
     対象ファイル: .github/actions-tmp/.github/workflows/call-callgraph.yml, .github/actions-tmp/generated-docs/callgraph.html, .github/actions-tmp/.github_automation/callgraph/docs/callgraph.md

     実行内容: 対象のワークフローファイルの手動実行方法を調査し、実行後の `.github/actions-tmp/generated-docs/callgraph.html` の内容を確認するための手順をmarkdown形式で出力してください。具体的には、ワークフローディスパッチのトリガー方法、生成された成果物（HTML）の確認方法、およびHTML内容の簡単な評価方法（例：ファイルサイズ、特定の要素の有無、リンクの有効性）を含めてください。また、`issue-notes/2.md` で言及されている「html内容が0件NG」の可能性を考慮し、その確認方法も記述してください。

     確認事項: `.github/actions-tmp/.github/workflows/call-callgraph.yml` が現在どの `callgraph.yml` (e.g., `.github/actions-tmp/.github/workflows/callgraph.yml` または `.github/actions-tmp/.github/workflows/callgraph_enhanced.yml` のようなもの) を参照しているか、およびワークフローの実行に必要な権限と環境変数（例：`GITHUB_TOKEN`）が適切に設定されていることを確認してください。`src/` ディレクトリが存在しない場合のワークフローの挙動も考慮に入れてください。

     期待する出力: ワークフロー実行からHTML内容確認、そして潜在的な問題点（0件NGなど）の検証手順までの詳細な手順書をmarkdown形式で出力する。
     ```

2. プロジェクト全体のREADMEおよび主要ドキュメントからの現状把握と次なる改善点の洗い出し [Issue #2](../issue-notes/2.md)
   - 最初の小さな一歩: プロジェクトルートの`README.md`と`README.ja.md`、そして`.github/copilot-instructions.md`、`.github/actions-tmp/.github_automation/project_summary/docs/daily-summary-setup.md`を読み込み、プロジェクトの目的、構成、主要機能を概観する。
   - Agent実行プロンプト:
     ```
     対象ファイル: README.md, README.ja.md, _config.yml, .github/copilot-instructions.md, .github/actions-tmp/.github_automation/project_summary/docs/daily-summary-setup.md, .github/actions-tmp/.github_automation/callgraph/docs/callgraph.md

     実行内容: 指定されたドキュメントファイルの内容を読み込み、プロジェクトの全体像、主要な機能（特にGitHub Actionsによる自動化）、各機能間の関連性、および設定について、網羅的に分析し、主要なポイントをmarkdown形式で出力してください。特に、現在の開発状況（Issue #31, #2）と照らし合わせて、次の開発ステップに繋がりそうな課題や改善点をリストアップしてください。

     確認事項: ドキュメント間で記述の矛盾がないか、あるいは古い情報が含まれていないかを確認してください。また、現在実装されている機能（例：ファイル一覧から推測される機能）との整合性も考慮に入れてください。

     期待する出力: プロジェクトの全体像を理解するための主要な情報、各ドキュメントから得られる重要な洞察、そして次の開発ステップに繋がる具体的な改善提案や課題点をまとめたmarkdown形式のレポート。
     ```

3. README自動翻訳ワークフローの実行効率と翻訳品質の検証
   - 最初の小さな一歩: `.github/workflows/call-translate-readme.yml` と `.github/actions-tmp/.github/workflows/translate-readme.yml` を確認し、翻訳がトリガーされる条件、および翻訳スクリプト（`.github/actions-tmp/.github_automation/translate/scripts/translate-readme.cjs`）がどのような翻訳サービスを利用しているか（GEMINI_API_KEY言及あり）を調査する。
   - Agent実行プロンプト:
     ```
     対象ファイル: .github/workflows/call-translate-readme.yml, .github/actions-tmp/.github/workflows/translate-readme.yml, .github/actions-tmp/.github_automation/translate/scripts/translate-readme.cjs, README.md, README.ja.md

     実行内容: README自動翻訳ワークフローのトリガー条件（`workflow_dispatch` および `push` イベントなど）、および `.github/actions-tmp/.github_automation/translate/scripts/translate-readme.cjs` スクリプトの動作を分析してください。特に、翻訳サービス（GEMINI_API_KEYが使われている前提）の利用方法と、翻訳がどのように実行され、`README.md` にコミットされるかを詳細に記述してください。また、無駄な翻訳実行を防ぐための効率化の可能性や、翻訳品質を向上させるためのパラメータ調整の余地があるかを検討し、改善提案をmarkdown形式で出力してください。

     確認事項: 既存のREADMEファイル（`README.md`, `README.ja.md`）の更新頻度と、ワークフローが適切に動作しているかを確認してください。また、`GEMINI_API_KEY` の設定が正しく行われていることを前提とします。翻訳が冪等であるか、または常に最新の変更を正確に反映しているかを評価してください。

     期待する出力: ワークフローの分析結果、効率化の提案、および翻訳品質改善のための具体的なアクションプランをmarkdown形式で出力する。

---
Generated at: 2026-01-05 07:01:57 JST
