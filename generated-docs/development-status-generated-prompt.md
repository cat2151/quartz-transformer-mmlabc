Last updated: 2026-01-06

# 開発状況生成プロンプト（開発者向け）

## 生成するもの：
- 現在openされているissuesを3行で要約する
- 次の一手の候補を3つlistする
- 次の一手の候補3つそれぞれについて、極力小さく分解して、その最初の小さな一歩を書く

## 生成しないもの：
- 「今日のissue目標」などuserに提案するもの
  - ハルシネーションの温床なので生成しない
- ハルシネーションしそうなものは生成しない（例、無価値なtaskや新issueを勝手に妄想してそれをuserに提案する等）
- プロジェクト構造情報（来訪者向け情報のため、別ファイルで管理）

## 「Agent実行プロンプト」生成ガイドライン：
「Agent実行プロンプト」作成時は以下の要素を必ず含めてください：

### 必須要素
1. **対象ファイル**: 分析/編集する具体的なファイルパス
2. **実行内容**: 具体的な分析や変更内容（「分析してください」ではなく「XXXファイルのYYY機能を分析し、ZZZの観点でmarkdown形式で出力してください」）
3. **確認事項**: 変更前に確認すべき依存関係や制約
4. **期待する出力**: markdown形式での結果や、具体的なファイル変更

### Agent実行プロンプト例

**良い例（上記「必須要素」4項目を含む具体的なプロンプト形式）**:
```
対象ファイル: `.github/workflows/translate-readme.yml`と`.github/workflows/call-translate-readme.yml`

実行内容: 対象ファイルについて、外部プロジェクトから利用する際に必要な設定項目を洗い出し、以下の観点から分析してください：
1) 必須入力パラメータ（target-branch等）
2) 必須シークレット（GEMINI_API_KEY）
3) ファイル配置の前提条件（README.ja.mdの存在）
4) 外部プロジェクトでの利用時に必要な追加設定

確認事項: 作業前に既存のworkflowファイルとの依存関係、および他のREADME関連ファイルとの整合性を確認してください。

期待する出力: 外部プロジェクトがこの`call-translate-readme.yml`を導入する際の手順書をmarkdown形式で生成してください。具体的には：必須パラメータの設定方法、シークレットの登録手順、前提条件の確認項目を含めてください。
```

**避けるべき例**:
- callgraphについて調べてください
- ワークフローを分析してください
- issue-noteの処理フローを確認してください

## 出力フォーマット：
以下のMarkdown形式で出力してください：

```markdown
# Development Status

## 現在のIssues
[以下の形式で3行でオープン中のissuesを要約。issue番号を必ず書く]
- [1行目の説明]
- [2行目の説明]
- [3行目の説明]

## 次の一手候補
1. [候補1のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```

2. [候補2のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```

3. [候補3のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```
```


# 開発状況情報
- 以下の開発状況情報を参考にしてください。
- Issue番号を記載する際は、必ず [Issue #番号](../issue-notes/番号.md) の形式でMarkdownリンクとして記載してください。

## プロジェクトのファイル一覧
- .github/actions-tmp/.github/workflows/call-callgraph.yml
- .github/actions-tmp/.github/workflows/call-daily-project-summary.yml
- .github/actions-tmp/.github/workflows/call-issue-note.yml
- .github/actions-tmp/.github/workflows/call-rust-windows-check.yml
- .github/actions-tmp/.github/workflows/call-translate-readme.yml
- .github/actions-tmp/.github/workflows/callgraph.yml
- .github/actions-tmp/.github/workflows/check-recent-human-commit.yml
- .github/actions-tmp/.github/workflows/daily-project-summary.yml
- .github/actions-tmp/.github/workflows/issue-note.yml
- .github/actions-tmp/.github/workflows/rust-windows-check.yml
- .github/actions-tmp/.github/workflows/translate-readme.yml
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/callgraph.ql
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/codeql-pack.lock.yml
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/qlpack.yml
- .github/actions-tmp/.github_automation/callgraph/config/example.json
- .github/actions-tmp/.github_automation/callgraph/docs/callgraph.md
- .github/actions-tmp/.github_automation/callgraph/presets/callgraph.js
- .github/actions-tmp/.github_automation/callgraph/presets/style.css
- .github/actions-tmp/.github_automation/callgraph/scripts/analyze-codeql.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/callgraph-utils.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/check-codeql-exists.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/check-node-version.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/common-utils.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/copy-commit-results.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/extract-sarif-info.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/find-process-results.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/generate-html-graph.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/generateHTML.cjs
- .github/actions-tmp/.github_automation/check_recent_human_commit/scripts/check-recent-human-commit.cjs
- .github/actions-tmp/.github_automation/project_summary/docs/daily-summary-setup.md
- .github/actions-tmp/.github_automation/project_summary/prompts/development-status-prompt.md
- .github/actions-tmp/.github_automation/project_summary/prompts/project-overview-prompt.md
- .github/actions-tmp/.github_automation/project_summary/scripts/ProjectSummaryCoordinator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/DevelopmentStatusGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/GitUtils.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/IssueTracker.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/generate-project-summary.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/CodeAnalyzer.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectAnalysisOrchestrator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectDataCollector.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectDataFormatter.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectOverviewGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/BaseGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/FileSystemUtils.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/ProjectFileUtils.cjs
- .github/actions-tmp/.github_automation/translate/docs/TRANSLATION_SETUP.md
- .github/actions-tmp/.github_automation/translate/scripts/translate-readme.cjs
- .github/actions-tmp/.gitignore
- .github/actions-tmp/.vscode/settings.json
- .github/actions-tmp/LICENSE
- .github/actions-tmp/README.ja.md
- .github/actions-tmp/README.md
- .github/actions-tmp/_config.yml
- .github/actions-tmp/generated-docs/callgraph.html
- .github/actions-tmp/generated-docs/callgraph.js
- .github/actions-tmp/generated-docs/development-status-generated-prompt.md
- .github/actions-tmp/generated-docs/development-status.md
- .github/actions-tmp/generated-docs/project-overview-generated-prompt.md
- .github/actions-tmp/generated-docs/project-overview.md
- .github/actions-tmp/generated-docs/style.css
- .github/actions-tmp/googled947dc864c270e07.html
- .github/actions-tmp/issue-notes/10.md
- .github/actions-tmp/issue-notes/11.md
- .github/actions-tmp/issue-notes/12.md
- .github/actions-tmp/issue-notes/13.md
- .github/actions-tmp/issue-notes/14.md
- .github/actions-tmp/issue-notes/15.md
- .github/actions-tmp/issue-notes/16.md
- .github/actions-tmp/issue-notes/17.md
- .github/actions-tmp/issue-notes/18.md
- .github/actions-tmp/issue-notes/19.md
- .github/actions-tmp/issue-notes/2.md
- .github/actions-tmp/issue-notes/20.md
- .github/actions-tmp/issue-notes/21.md
- .github/actions-tmp/issue-notes/22.md
- .github/actions-tmp/issue-notes/23.md
- .github/actions-tmp/issue-notes/24.md
- .github/actions-tmp/issue-notes/25.md
- .github/actions-tmp/issue-notes/26.md
- .github/actions-tmp/issue-notes/27.md
- .github/actions-tmp/issue-notes/28.md
- .github/actions-tmp/issue-notes/29.md
- .github/actions-tmp/issue-notes/3.md
- .github/actions-tmp/issue-notes/30.md
- .github/actions-tmp/issue-notes/4.md
- .github/actions-tmp/issue-notes/7.md
- .github/actions-tmp/issue-notes/8.md
- .github/actions-tmp/issue-notes/9.md
- .github/actions-tmp/package-lock.json
- .github/actions-tmp/package.json
- .github/actions-tmp/src/main.js
- .github/copilot-instructions.md
- .github/workflows/call-daily-project-summary.yml
- .github/workflows/call-issue-note.yml
- .github/workflows/call-translate-readme.yml
- .gitignore
- LICENSE
- README.ja.md
- README.md
- _config.yml
- demo.html
- example.md
- generated-docs/project-overview-generated-prompt.md
- issue-notes/19.md
- issue-notes/21.md
- issue-notes/22.md
- issue-notes/24.md
- issue-notes/25.md
- issue-notes/26.md
- issue-notes/31.md
- issue-notes/32.md
- issue-notes/33.md
- issue-notes/34.md
- issue-notes/38.md
- issue-notes/40.md
- issue-notes/42.md
- issue-notes/44-investigation.md
- issue-notes/44.md
- issue-notes/46.md
- issue-notes/47.md
- package-lock.json
- package.json
- playwright.config.ts
- src/index.test.ts
- src/index.ts
- test/README.md
- test/integration-test.html
- test/integration.test.ts
- tsconfig.json
- vitest.config.ts

## 現在のオープンIssues
## [Issue #48](../issue-notes/48.md): [WIP] Fix issue with abcjs container not displaying correctly
## タスク完了 ✅

- [x] Issue #46の理解：abcjsコンテナの表示問題を調査
- [x] コードの分析：`afterDOMReady`でのタイミング問題を特定
- [x] 根本原因の特定：ABCJSライブラリの非同期読み込みタイミングとレイアウト計算のタイミング問題
- [x] 修正の実装
  - [x] ABCJSライブラリの読み込み待機ロジックを追加（最大50回、100msごとにリトライ）
  - [x] レイアウト完了待機処理を追加（要素のサイズが有効になるまで待機）
  - [x] src/index.tsとdemo.htmlの両方を更新
- [x] ビルド成功
-...
ラベル: 
--- issue-notes/48.md の内容 ---

```markdown

```

## [Issue #47](../issue-notes/47.md): PR 45 を参考に、外部パッケージ方式を選んだ理由をREADME.ja.mdに反映する。なおハイブリッド方式の記述は不要
[issue-notes/47.md](https://github.com/cat2151/quartz-transformer-mmlabc/blob/main/issue-notes/47.md)

...
ラベル: 
--- issue-notes/47.md の内容 ---

```markdown
# issue PR 45 を参考に、外部パッケージ方式を選んだ理由をREADME.ja.mdに反映する。なおハイブリッド方式の記述は不要 #47
[issues #47](https://github.com/cat2151/quartz-transformer-mmlabc/issues/47)



```

## [Issue #46](../issue-notes/46.md): abcjsのコンテナあるいは中身が表示されず、スーパーリロードで表示される、という現象が発生した
[issue-notes/46.md](https://github.com/cat2151/quartz-transformer-mmlabc/blob/main/issue-notes/46.md)

...
ラベル: 
--- issue-notes/46.md の内容 ---

```markdown
# issue abcjsのコンテナあるいは中身が表示されず、スーパーリロードで表示される、という現象が発生した #46
[issues #46](https://github.com/cat2151/quartz-transformer-mmlabc/issues/46)



```

## [Issue #31](../issue-notes/31.md): ドッグフーディングする
[issue-notes/31.md](https://github.com/cat2151/quartz-transformer-mmlabc/blob/main/issue-notes/31.md)

...
ラベル: 
--- issue-notes/31.md の内容 ---

```markdown
# issue ドッグフーディングする #31
[issues #31](https://github.com/cat2151/quartz-transformer-mmlabc/issues/31)



```

## [Issue #2](../issue-notes/2.md): READMEと関連ドキュメントを読み、動作確認し、次の手のヒントにする

ラベル: 
--- issue-notes/2.md の内容 ---

```markdown

```

## ドキュメントで言及されているファイルの内容
### .github/actions-tmp/README.ja.md
```md
{% raw %}
# GitHub Actions 共通ワークフロー集

このリポジトリは、**複数プロジェクトで使い回せるGitHub Actions共通ワークフロー集**です

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
</p>

# 3行で説明
- 🚀 プロジェクトごとのGitHub Actions管理をもっと楽に
- 🔗 共通化されたワークフローで、どのプロジェクトからも呼ぶだけでOK
- ✅ メンテは一括、プロジェクト開発に集中できます

## Quick Links
| 項目 | リンク |
|------|--------|
| 📖 プロジェクト概要 | [generated-docs/project-overview.md](generated-docs/project-overview.md) |
| 📖 コールグラフ | [generated-docs/callgraph.html](https://cat2151.github.io/github-actions/generated-docs/callgraph.html) |
| 📊 開発状況 | [generated-docs/development-status.md](generated-docs/development-status.md) |

# notes
- まだ共通化の作業中です
- まだワークフロー内容を改善中です

※README.md は README.ja.md を元にGeminiの翻訳でGitHub Actionsで自動生成しています

{% endraw %}
```

### README.ja.md
```md
{% raw %}
# quartz-transformer-mmlabc

**コード進行とMML（Music Macro Language）をコードブロックに書くだけで、五線譜を表示してクリック演奏も可能にするQuartzトランスフォーマープラグイン**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※このドキュメントは大部分がAI生成です。issueをagentに投げて生成させました。

## Quick Links
| 項目 | リンク |
|------|--------|
| 📊 開発状況 | [generated-docs/development-status](generated-docs/development-status.md) |

## 状況
- 一通り実装しました
- ドッグフーディング中です
- 破壊的変更をする可能性があります

## 2行で説明
- Obsidianで、コード進行をコードブロックに書くと、五線譜を表示して鳴らすことができます : https://github.com/cat2151/obsidian-plugin-mmlabc
- Quartz4でもそれを実現するため、新たにトランスフォーマープラグインを作りました

## 機能

- 🎵 `mml`コードブロックをABC記法に変換し、abcjsでレンダリング
- 🎸 `chord`コードブロックをMMLに変換してからABC記法に変換し、abcjsでレンダリング
- 🎼 トラブルシューティングのための`abc`記法コードブロックをサポート
- 🎨 SVGで五線譜を表示
- 🎧 クリックで楽曲を再生 - レンダリングされた楽譜をクリックすると音楽を再生できます
- ⌨️ キーボードアクセシビリティ対応（EnterキーまたはSpaceキーで再生）

## インストール

Quartzをインストールしたディレクトリにて以下を実行してください

```powershell
npm install github:cat2151/quartz-transformer-mmlabc; pushd node_modules/quartz-transformer-mmlabc; npm run build; popd
```

この手順が必要な理由：
- プラグインはGitHubから直接インストールされます（npmからではありません）
- コンパイルされたJavaScriptを含む`dist`ディレクトリはリポジトリに含まれていません
- この手順をスキップすると、プラグインのエントリーポイント（`dist/index.js`）が存在しないため、Quartzの実行時にエラーが発生します。

さらに、`.github\workflows\deploy.yml` の `Build Quartz`の前に、以下を追加してください
```yml
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```
この手順が必要な理由：
- GitHub Actionsでのdeploy時に、これがないと、プラグインのエントリーポイント（`dist/index.js`）が存在しないため、`Build Quartz`時にエラーが発生します。

## 使い方

### Quartz設定での使用

`quartz.config.ts`にトランスフォーマーを追加します：

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

const config: QuartzConfig = {
  configuration: {
    // ... サイト設定
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      // MMLABCトランスフォーマーを追加
      MMLABCTransformer(),
      // ... 他のトランスフォーマー
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // ... 他のエミッター
    ],
  },
}

export default config
```

**重要なポイント:**
- Quartzの内部パスから`QuartzConfig`と組み込みプラグインをインポート
- このプラグインはnpmパッケージ名からインポート
- `transformers`配列に他のトランスフォーマーと一緒に追加
- プラグイン間に依存関係がない限り、順序は通常問題ありません

### Markdownファイルでの使用

#### MML記法

````markdown
```mml
t120 l4 cdefgab>c
```
````

#### コード進行記法

````markdown
```chord
C Dm7 G7 C
```
````

#### ABC記法（直接指定）

````markdown
```abc
X:1
T:Simple Scale
M:4/4
L:1/4
K:C
C D E F|G A B c|
```
````

トラブルシューティングや、ABC記法を直接記述したい場合に便利です。

## オプション

プラグインはオプションの設定を受け付けます：

```typescript
MMLABCTransformer({
  enableMML: true,    // MMLブロック変換を有効化（デフォルト: true）
  enableChord: true,  // コード進行ブロック変換を有効化（デフォルト: true）
  enableABC: true,    // ABCブロック変換を有効化（デフォルト: true）
})
```

## 仕組み

1. プラグインはQuartzのビルドプロセス中に`mml`、`chord`、または`abc`言語タグを持つコードブロックを検出
2. これらのコードブロックを、ソース記法をデータ属性として含むHTMLのdiv要素に置き換え
3. ブラウザ内で：
   - CDNからabcjsとmml2abcを読み込み
   - MMLブロックの場合：mml2abcを使用してMMLをABC記法に変換
   - コード進行ブロックの場合：chord2mmlを使用してコード進行をMMLに変換してからABC記法に変換
   - ABCブロックの場合：変換せずに記法を直接使用
   - abcjsを使用してABC記法をインタラクティブなSVGとしてレンダリング
   - オーディオシンセサイザーを初期化して楽曲の再生に対応
   - 楽譜をクリックして音楽を再生できるようにクリックイベントハンドラーを追加

## 現在の状態

### 実装済み機能
- ✅ MMLブロックの検出と変換
- ✅ コード進行ブロックの検出と変換
- ✅ ABCブロックの検出と直接レンダリング（トラブルシューティングに便利）
- ✅ abcjsを使用したABC記法のレンダリング（五線譜の表示）
- ✅ CDN依存関係は@cat2151により動作確認済みのバージョンを使用
- ✅ Quartzのダークモード対応（自動テーマ検出とテーマ切り替えに対応）
- ✅ アクセシビリティ対応（ARIA属性、キーボード操作サポート）
- ✅ インタラクティブな音声再生機能（楽譜をクリックして楽曲を先頭から演奏）
  - abcjs synth APIとWeb Audio APIを使用
  - 再生中の視覚的フィードバック（背景色の変更とステータス表示）
  - 再生完了時に自動停止
  - もう一度クリックすると再生を停止

## 注意事項

- HTMLへの変換はQuartzのビルドプロセス中に行われます
- 実際の楽譜の変換とレンダリングはブラウザ内で行われます
- CDNライブラリのバージョンは、@cat2151 によりeasychord2mmlでの動作確認に基づいて指定されています
- MMLからABCへの変換は、CDNから読み込まれるmml2abcを使用します
- コード進行からMMLへの変換は、CDNから読み込まれるchord2mmlを使用します
- レンダリングにはCDNから読み込まれるabcjs（バージョン6系の最新）を使用します
- バンドルの問題を避けるため、ライブラリは動的に読み込まれます

## テスト

プラグインには、包括的な自動テストスイートが含まれています：

### テストの実行

```bash
# ユニットテストを1回実行
npm test

# インテグレーションテスト（Playwright）を実行
npm run test:integration

# 全テストを実行
npm run test:all

# ウォッチモードでテストを実行
npm run test:watch

# UIでテストを実行
npm run test:ui
```

### テストカバレッジ

テストスイートには以下が含まれます：
- AST変換ロジックのユニットテスト（Vitest）
- HTMLエスケープのテスト（改行、タブ、特殊文字）
- プラグインオプションと設定のテスト
- エッジケースの処理
- 外部リソースの検証
- ブラウザでのレンダリングとインタラクティブ機能のインテグレーションテスト（Playwright）

手動テストには、同梱の`demo.html`ファイルを使用してください。

**注意**: Coding AgentがLinux Runnerでテストを行う際には、CDNがブロックされるため五線譜の表示が行われません。五線譜の表示を確認したい場合は、実機（ローカル環境）でテストしてください。

## 依存関係

### ランタイム（CDN経由で読み込み）

**重要**: 以下のライブラリバージョンは、@cat2151 により[easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html)での動作確認に基づいて指定されています。これらのURLを変更しないでください。

- [abcjs](https://github.com/paulrosen/abcjs) - ABC音楽記法をレンダリングするJavaScriptライブラリ
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - `@6`を指定することで、バージョン6系の最新版（6.x.x）を常に取得
- [mml2abc](https://github.com/cat2151/mml2abc) - Music Macro LanguageをABC記法に変換
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - 動的ESモジュールインポートで読み込み
- [chord2mml](https://github.com/cat2151/chord2mml) - コード進行記法をMMLに変換
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - UMDバンドル形式で読み込み
  - SRI (Subresource Integrity) チェックサムを使用してセキュリティを確保
  - チェックサム: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - ※ライブラリ更新時にはチェックサムの再検証が必要です

### ビルド時
- [unified](https://github.com/unifiedjs/unified) - コンテンツの解析と変換のためのインターフェース
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - 構文木を走査するためのユーティリティ

## 開発

### ビルド

```bash
npm run build
```

### プロジェクト構造

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

## ライセンス

MIT License - 詳細はLICENSEファイルを参照してください

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています

## 関連プロジェクト

- [Quartz](https://quartz.jzhao.xyz/) - 高速でバッテリー同梱の静的サイトジェネレーター
- [abcjs](https://www.abcjs.net/) - ABC音楽記法をレンダリングするJavaScript
- [mml2abc](https://cat2151.github.io/mml2abc/) - MMLからABCへのコンバーター
- [chord2mml](https://cat2151.github.io/chord2mml/) - コード進行記法からMMLへのコンバーター

{% endraw %}
```

### .github/actions-tmp/issue-notes/2.md
```md
{% raw %}
# issue GitHub Actions「関数コールグラフhtmlビジュアライズ生成」を共通ワークフロー化する #2
[issues #2](https://github.com/cat2151/github-actions/issues/2)


# prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
このymlファイルを、以下の2つのファイルに分割してください。
1. 共通ワークフロー       cat2151/github-actions/.github/workflows/callgraph_enhanced.yml
2. 呼び出し元ワークフロー cat2151/github-actions/.github/workflows/call-callgraph_enhanced.yml
まずplanしてください
```

# 結果
- indent
    - linter？がindentのエラーを出しているがyml内容は見た感じOK
    - テキストエディタとagentの相性問題と判断する
    - 別のテキストエディタでsaveしなおし、テキストエディタをreload
    - indentのエラーは解消した
- LLMレビュー
    - agent以外の複数のLLMにレビューさせる
    - prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
以下の2つのファイルをレビューしてください。最優先で、エラーが発生するかどうかだけレビューしてください。エラー以外の改善事項のチェックをするかわりに、エラー発生有無チェックに最大限注力してください。

--- 共通ワークフロー

# GitHub Actions Reusable Workflow for Call Graph Generation
name: Generate Call Graph

# TODO Windowsネイティブでのtestをしていた名残が残っているので、今後整理していく。今はWSL act でtestしており、Windowsネイティブ環境依存問題が解決した
#  ChatGPTにレビューさせるとそこそこ有用そうな提案が得られたので、今後それをやる予定
#  agentに自己チェックさせる手も、セカンドオピニオンとして選択肢に入れておく

on:
  workflow_call:

jobs:
  check-commits:
    runs-on: ubuntu-latest
    outputs:
      should-run: ${{ steps.check.outputs.should-run }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 50 # 過去のコミットを取得

      - name: Check for user commits in last 24 hours
        id: check
        run: |
          node .github/scripts/callgraph_enhanced/check-commits.cjs

  generate-callgraph:
    needs: check-commits
    if: needs.check-commits.outputs.should-run == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      security-events: write
      actions: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set Git identity
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Remove old CodeQL packages cache
        run: rm -rf ~/.codeql/packages

      - name: Check Node.js version
        run: |
          node .github/scripts/callgraph_enhanced/check-node-version.cjs

      - name: Install CodeQL CLI
        run: |
          wget https://github.com/github/codeql-cli-binaries/releases/download/v2.22.1/codeql-linux64.zip
          unzip codeql-linux64.zip
          sudo mv codeql /opt/codeql
          echo "/opt/codeql" >> $GITHUB_PATH

      - name: Install CodeQL query packs
        run: |
          /opt/codeql/codeql pack install .github/codeql-queries

      - name: Check CodeQL exists
        run: |
          node .github/scripts/callgraph_enhanced/check-codeql-exists.cjs

      - name: Verify CodeQL Configuration
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs verify-config

      - name: Remove existing CodeQL DB (if any)
        run: |
          rm -rf codeql-db

      - name: Perform CodeQL Analysis
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs analyze

      - name: Check CodeQL Analysis Results
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs check-results

      - name: Debug CodeQL execution
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs debug

      - name: Wait for CodeQL results
        run: |
          node -e "setTimeout(()=>{}, 10000)"

      - name: Find and process CodeQL results
        run: |
          node .github/scripts/callgraph_enhanced/find-process-results.cjs

      - name: Generate HTML graph
        run: |
          node .github/scripts/callgraph_enhanced/generate-html-graph.cjs

      - name: Copy files to generated-docs and commit results
        run: |
          node .github/scripts/callgraph_enhanced/copy-commit-results.cjs

--- 呼び出し元
# 呼び出し元ワークフロー: call-callgraph_enhanced.yml
name: Call Call Graph Enhanced

on:
  schedule:
    # 毎日午前5時(JST) = UTC 20:00前日
    - cron: '0 20 * * *'
  workflow_dispatch:

jobs:
  call-callgraph-enhanced:
    # uses: cat2151/github-actions/.github/workflows/callgraph_enhanced.yml
    uses: ./.github/workflows/callgraph_enhanced.yml # ローカルでのテスト用
```

# レビュー結果OKと判断する
- レビュー結果を人力でレビューした形になった

# test
- #4 同様にローカル WSL + act でtestする
- エラー。userのtest設計ミス。
  - scriptの挙動 : src/ がある前提
  - 今回の共通ワークフローのリポジトリ : src/ がない
  - 今回testで実現したいこと
    - 仮のソースでよいので、関数コールグラフを生成させる
  - 対策
    - src/ にダミーを配置する
- test green
  - ただしcommit pushはしてないので、html内容が0件NG、といったケースの検知はできない
  - もしそうなったら別issueとしよう

# test green

# commit用に、yml 呼び出し元 uses をlocal用から本番用に書き換える

# closeとする
- もしhtml内容が0件NG、などになったら、別issueとするつもり

{% endraw %}
```

### .github/actions-tmp/issue-notes/7.md
```md
{% raw %}
# issue issue note生成できるかのtest用 #7
[issues #7](https://github.com/cat2151/github-actions/issues/7)

- 生成できた
- closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/8.md
```md
{% raw %}
# issue 関数コールグラフhtmlビジュアライズ生成の対象ソースファイルを、呼び出し元ymlで指定できるようにする #8
[issues #8](https://github.com/cat2151/github-actions/issues/8)

# これまでの課題
- 以下が決め打ちになっていた
```
  const allowedFiles = [
    'src/main.js',
    'src/mml2json.js',
    'src/play.js'
  ];
```

# 対策
- 呼び出し元ymlで指定できるようにする

# agent
- agentにやらせることができれば楽なので、初手agentを試した
- 失敗
    - ハルシネーションしてscriptを大量破壊した
- 分析
    - 修正対象scriptはagentが生成したもの
    - 低品質な生成結果でありソースが巨大
    - ハルシネーションで破壊されやすいソース
    - AIの生成したソースは、必ずしもAIフレンドリーではない

# 人力リファクタリング
- 低品質コードを、最低限agentが扱えて、ハルシネーションによる大量破壊を防止できる内容、にする
- 手短にやる
    - そもそもビジュアライズは、agentに雑に指示してやらせたもので、
    - 今後別のビジュアライザを選ぶ可能性も高い
    - 今ここで手間をかけすぎてコンコルド効果（サンクコストバイアス）を増やすのは、project群をトータルで俯瞰して見たとき、損
- 対象
    - allowedFiles のあるソース
        - callgraph-utils.cjs
            - たかだか300行未満のソースである
            - この程度でハルシネーションされるのは予想外
            - やむなし、リファクタリングでソース分割を進める

# agentに修正させる
## prompt
```
allowedFilesを引数で受け取るようにしたいです。
ないならエラー。
最終的に呼び出し元すべてに波及して修正したいです。

呼び出し元をたどってエントリポイントも見つけて、
エントリポイントにおいては、
引数で受け取ったjsonファイル名 allowedFiles.js から
jsonファイル allowedFiles.jsonの内容をreadして
変数 allowedFilesに格納、
後続処理に引き渡す、としたいです。

まずplanしてください。
planにおいては、修正対象のソースファイル名と関数名を、呼び出し元を遡ってすべて特定し、listしてください。
```

# 修正が順調にできた
- コマンドライン引数から受け取る作りになっていなかったので、そこだけ指示して修正させた
- yml側は人力で修正した

# 他のリポジトリから呼び出した場合にバグらないよう修正する
- 気付いた
    - 共通ワークフローとして他のリポジトリから使った場合はバグるはず。
        - ymlから、共通ワークフロー側リポジトリのcheckoutが漏れているので。
- 他のyml同様に修正する
- あわせて全体にymlをリファクタリングし、修正しやすくし、今後のyml読み書きの学びにしやすくする

# local WSL + act : test green

# closeとする
- もし生成されたhtmlがNGの場合は、別issueとするつもり

{% endraw %}
```

### demo.html
```html
{% raw %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MML ABC Transformer Demo - MML, Chord, and ABC Notation</title>
    <style>
        :root {
            --body-bg: #ffffff;
            --body-color: #333;
            --section-border: #ddd;
            --heading-color: #333;
            --theme-toggle-bg: #4CAF50;
            --theme-toggle-hover-bg: #45a049;
            --theme-toggle-color: #ffffff;
        }

        [data-theme="dark"] {
            --body-bg: #1a1a1a;
            --body-color: #e0e0e0;
            --section-border: #444;
            --heading-color: #e0e0e0;
            --theme-toggle-bg: #388E3C;
            --theme-toggle-hover-bg: #2E7D32;
            --theme-toggle-color: #ffffff;
        }

        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background-color: var(--body-bg);
            color: var(--body-color);
            transition: background-color 0.3s, color 0.3s;
        }
        h1, h2 {
            color: var(--heading-color);
        }
        
        /* Theme toggle button */
        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.5em 1em;
            background-color: var(--theme-toggle-bg);
            color: var(--theme-toggle-color);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            z-index: 1000;
            transition: background-color 0.3s;
        }
        .theme-toggle:hover {
            background-color: var(--theme-toggle-hover-bg);
        }

        /* ABC notation styles with dark mode support */
        .abc-notation {
            margin: 1em 0;
            padding: 1em;
            background-color: var(--abc-bg, #f5f5f5);
            border-radius: 4px;
            overflow-x: auto;
            cursor: pointer;
            position: relative;
            max-width: 95%;
        }
        /* Let SVG use full container width */
        .abc-notation svg {
            max-width: 100%;
            height: auto;
        }
        .abc-notation svg path,
        .abc-notation svg text {
            fill: var(--abc-svg-color, #000);
        }
        .abc-notation.playing {
            background-color: var(--abc-playing-bg, #e8f5e9);
        }
        .abc-notation::before {
            content: "▶ Click to play";
            position: absolute;
            top: 0.5em;
            right: 0.5em;
            font-size: 0.8em;
            color: var(--abc-label-color, #666);
            background-color: var(--abc-label-bg, rgba(255, 255, 255, 0.9));
            padding: 0.3em 0.6em;
            border-radius: 3px;
            pointer-events: none;
        }
        .abc-notation.playing::before {
            content: "🔊 Playing...";
            color: var(--abc-playing-label-color, #2e7d32);
        }

        /* Dark mode overrides */
        [data-theme="dark"] .abc-notation {
            --abc-bg: #2d2d2d;
            --abc-playing-bg: #1a3a1a;
            --abc-label-color: #aaa;
            --abc-label-bg: rgba(50, 50, 50, 0.9);
            --abc-playing-label-color: #4caf50;
            --abc-svg-color: #e0e0e0;
        }

        .source-code {
            background-color: #2d2d2d;
            color: #f8f8f2;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1em 0;
        }
        .section {
            margin: 2em 0;
            padding: 1em;
            border: 1px solid var(--section-border);
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <button class="theme-toggle" onclick="toggleTheme()">🌓 Toggle Dark Mode</button>
    
    <h1>MML ABC Transformer Demo</h1>
    
    <p>This page demonstrates the MML, Chord, and ABC notation transformation to ABC notation and rendering with abcjs.</p>
    <p><strong>Try toggling dark mode using the button in the top right corner!</strong></p>
    
    <div class="section">
        <h2>Example 1: Simple Melody</h2>
        <p>Source MML:</p>
        <div class="source-code">t120 l4 cdefgab&gt;c</div>
        <p>Rendered notation:</p>
        <div class="abc-notation mml-block" data-mml="t120 l4 cdefgab>c" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>
    
    <div class="section">
        <h2>Example 2: Complex Melody</h2>
        <p>Source MML:</p>
        <div class="source-code">t140 l8 o4 c d e f g4 g4 a g f e d4 d4 c2</div>
        <p>Rendered notation:</p>
        <div class="abc-notation mml-block" data-mml="t140 l8 o4 c d e f g4 g4 a g f e d4 d4 c2" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>
    
    <div class="section">
        <h2>Example 3: Different Tempo</h2>
        <p>Source MML:</p>
        <div class="source-code">t90 l4 o5 c d e c c d e c e f g2 e f g2</div>
        <p>Rendered notation:</p>
        <div class="abc-notation mml-block" data-mml="t90 l4 o5 c d e c c d e c e f g2 e f g2" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>

    <div class="section">
        <h2>Example 4: Simple Chord Progression</h2>
        <p>Source Chord:</p>
        <div class="source-code">C Am F G</div>
        <p>Rendered notation:</p>
        <div class="abc-notation chord-block" data-chord="C Am F G" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>

    <div class="section">
        <h2>Example 5: Jazz Chord Progression</h2>
        <p>Source Chord:</p>
        <div class="source-code">Cmaj7 Am7 Dm7 G7</div>
        <p>Rendered notation:</p>
        <div class="abc-notation chord-block" data-chord="Cmaj7 Am7 Dm7 G7" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>

    <div class="section">
        <h2>Example 6: Common Progression (I-V-vi-IV)</h2>
        <p>Source Chord:</p>
        <div class="source-code">C G Am F</div>
        <p>Rendered notation:</p>
        <div class="abc-notation chord-block" data-chord="C G Am F" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>

    <div class="section">
        <h2>Example 7: Direct ABC Notation (Troubleshooting)</h2>
        <p>Source ABC:</p>
        <div class="source-code">X:1&#10;T:Twinkle Twinkle Little Star&#10;M:4/4&#10;L:1/4&#10;K:C&#10;C C G G|A A G2|F F E E|D D C2|</div>
        <p>Rendered notation:</p>
        <div class="abc-notation abc-block" data-abc="X:1&#10;T:Twinkle Twinkle Little Star&#10;M:4/4&#10;L:1/4&#10;K:C&#10;C C G G|A A G2|F F E E|D D C2|" data-type="abc" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>

    <!-- Load abcjs from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js"></script>
    
    <!-- Initialize abcjs rendering for all ABC notation blocks -->
    <script type="module">
        (async function() {
            // Wait for ABCJS to be available
            if (typeof ABCJS === 'undefined') {
                console.error('ABCJS library not loaded');
                return;
            }

            // Cache the mml2abc module to avoid duplicate imports
            let mml2abcModule = null;
            
            // Cache the chord2mml loading promise to avoid race conditions
            let chord2mmlLoadPromise = null;
            
            // Global synth instance for audio playback
            let currentSynth = null;
            let currentPlayingElement = null;
            
            // Shared AudioContext (create once and reuse)
            let sharedAudioContext = null;
            
            // WeakMap to store visual objects for each element
            const visualObjMap = new WeakMap();

            // Process all abc-notation blocks
            const blocks = document.querySelectorAll('.abc-notation');
            
            for (const element of blocks) {
                const type = element.getAttribute('data-type');
                
                try {
                    let abcNotation = '';
                    
                    if (type === 'mml') {
                        const mmlData = element.getAttribute('data-mml');
                        if (mmlData) {
                            // Dynamically import mml2abc ES module from CDN
                            // Version specified by @cat2151 based on verified compatibility in easychord2mml
                            if (!mml2abcModule) {
                                mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
                            }
                            abcNotation = mml2abcModule.parse(mmlData);
                        }
                    } else if (type === 'chord') {
                        const chordData = element.getAttribute('data-chord');
                        if (chordData) {
                            // Load chord2mml as a script (UMD bundle, not ES module)
                            // Version specified by @cat2151 based on verified compatibility in easychord2mml
                            if (typeof window.chord2mml === 'undefined') {
                                if (!chord2mmlLoadPromise) {
                                    chord2mmlLoadPromise = new Promise((resolve, reject) => {
                                        const script = document.createElement('script');
                                        script.src = 'https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js';
                                        script.integrity = 'sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz';
                                        script.crossOrigin = 'anonymous';
                                        script.onload = resolve;
                                        script.onerror = () => reject(new Error('Failed to load chord2mml script'));
                                        document.head.appendChild(script);
                                    });
                                }
                                await chord2mmlLoadPromise;
                            }
                            const mmlData = window.chord2mml.parse(chordData);
                            // Then convert MML to ABC (reuse cached module)
                            if (!mml2abcModule) {
                                mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
                            }
                            abcNotation = mml2abcModule.parse(mmlData);
                        }
                    } else if (type === 'abc') {
                        // For ABC notation, no conversion needed - use directly
                        const abcData = element.getAttribute('data-abc');
                        if (abcData) {
                            abcNotation = abcData;
                        }
                    }
                    
                    if (abcNotation) {
                        // コンテナのサイズに基づいて五線譜の幅をレスポンシブに計算
                        const containerWidth = element.offsetWidth || element.clientWidth || 600;
                        // .abc-notation の padding: 1em は左右で合計2em（約32px）
                        // フォントサイズが16pxと仮定すると、2em ≈ 32px + 安全マージン約8px = 40px
                        const availableWidth = containerWidth - 40;
                        // 最小300px、最大800pxの範囲に制限
                        const staffWidth = Math.min(Math.max(availableWidth, 300), 800);
                        
                        // Render the ABC notation with abcjs
                        const visualObj = ABCJS.renderAbc(element, abcNotation, {
                            responsive: 'resize',
                            staffwidth: staffWidth,
                            scale: 1.0
                        });
                        
                        // Store the visual object using WeakMap
                        visualObjMap.set(element, visualObj);
                        
                        // Define the playback handler function
                        const handlePlayback = async function(e) {
                            e.preventDefault();
                            
                            // Stop any currently playing music
                            if (currentSynth) {
                                currentSynth.stop();
                                if (currentPlayingElement) {
                                    currentPlayingElement.classList.remove('playing');
                                }
                            }
                            
                            // If clicking the same element that's playing, just stop
                            if (currentPlayingElement === element) {
                                currentPlayingElement = null;
                                currentSynth = null;
                                return;
                            }
                            
                            try {
                                // Create audio context once (requires user gesture for first time)
                                if (!sharedAudioContext) {
                                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                                    if (AudioContextClass) {
                                        sharedAudioContext = new AudioContextClass();
                                    } else {
                                        console.error('Web Audio API not supported');
                                        return;
                                    }
                                }
                                
                                // Ensure audio context is running (some browsers start it in a suspended state)
                                if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
                                    await sharedAudioContext.resume();
                                }
                                
                                // Get the visual object for this element
                                const visualObj = visualObjMap.get(element);
                                if (!visualObj || !visualObj[0]) {
                                    console.error('Visual object not found for element');
                                    return;
                                }
                                
                                // Create synth
                                if (ABCJS.synth.CreateSynth) {
                                    currentSynth = new ABCJS.synth.CreateSynth();
                                    
                                    // Initialize synth
                                    await currentSynth.init({
                                        audioContext: sharedAudioContext,
                                        visualObj: visualObj[0],
                                        options: {}
                                    });
                                    
                                    // Prime the synth with the tune
                                    await currentSynth.prime();
                                    
                                    // Mark as playing
                                    element.classList.add('playing');
                                    currentPlayingElement = element;
                                    
                                    // Set up event listener for when playback finishes
                                    const cleanup = function() {
                                        if (currentPlayingElement === element) {
                                            element.classList.remove('playing');
                                            currentPlayingElement = null;
                                            if (currentSynth && typeof currentSynth.stop === 'function') {
                                                currentSynth.stop();
                                            }
                                            currentSynth = null;
                                        }
                                    };
                                    
                                    // Start playback
                                    currentSynth.start();
                                    
                                    // Store a unique ID for this playback to handle race conditions
                                    const playbackId = Date.now();
                                    element.setAttribute('data-playback-id', playbackId.toString());
                                    
                                    // Check playback status with safety limit
                                    let pollCount = 0;
                                    const maxPolls = 6000; // Max 10 minutes (6000 * 100ms)
                                    
                                    const checkPlaybackStatus = function() {
                                        pollCount++;
                                        
                                        // Check if this playback has been superseded
                                        const currentPlaybackId = element.getAttribute('data-playback-id');
                                        if (currentPlaybackId !== playbackId.toString()) {
                                            return; // Stop polling for this playback
                                        }
                                        
                                        // Safety check: stop after max polls
                                        if (pollCount >= maxPolls) {
                                            console.warn('Playback check timeout reached');
                                            cleanup();
                                            return;
                                        }
                                        
                                        // Check if synth is still playing
                                        if (currentSynth && currentSynth.isRunning && !currentSynth.isRunning()) {
                                            cleanup();
                                        } else if (currentSynth) {
                                            // Check again in 100ms
                                            setTimeout(checkPlaybackStatus, 100);
                                        }
                                    };
                                    
                                    // Start checking after a short delay
                                    setTimeout(checkPlaybackStatus, 100);
                                } else {
                                    console.error('ABCJS synth API not available');
                                    const errorParagraph = document.createElement('p');
                                    errorParagraph.style.color = 'orange';
                                    errorParagraph.style.fontSize = '0.9em';
                                    errorParagraph.textContent = 'Audio playback is not available in this version of abcjs.';
                                    element.appendChild(errorParagraph);
                                }
                            } catch (error) {
                                console.error('Error playing music:', error);
                                element.classList.remove('playing');
                                currentPlayingElement = null;
                                currentSynth = null;
                            }
                        };
                        
                        // Add click handler for audio playback
                        element.addEventListener('click', handlePlayback);
                        
                        // Add keyboard handler for accessibility (Enter and Space keys)
                        element.addEventListener('keydown', async function(e) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                await handlePlayback(e);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error rendering notation:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    const errorParagraph = document.createElement('p');
                    errorParagraph.style.color = 'red';
                    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
                        errorParagraph.textContent = 'Error loading music notation library. Please check your internet connection.';
                    } else if (errorMessage.includes('parse')) {
                        const notationType = type === 'chord' ? 'chord' : type === 'abc' ? 'ABC' : 'MML';
                        errorParagraph.textContent = 'Error parsing ' + notationType + ' notation. Please check the syntax.';
                    } else {
                        errorParagraph.textContent = 'Error rendering music notation';
                    }
                    element.innerHTML = '';
                    element.appendChild(errorParagraph);
                }
            }
        })();
    </script>

    <!-- Theme toggle script -->
    <script>
        // Initialize theme from localStorage or system preference
        function initTheme() {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
            
            // Emit themechange event (Quartz-like behavior)
            const event = new CustomEvent('themechange', {
                detail: { theme: theme }
            });
            document.dispatchEvent(event);
        }

        // Toggle theme
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Emit themechange event (Quartz-like behavior)
            const event = new CustomEvent('themechange', {
                detail: { theme: newTheme }
            });
            document.dispatchEvent(event);
            
            console.log('Theme changed to', newTheme);
        }

        // Initialize theme on page load
        initTheme();
    </script>
</body>
</html>

{% endraw %}
```

### issue-notes/31.md
```md
{% raw %}
# issue ドッグフーディングする #31
[issues #31](https://github.com/cat2151/quartz-transformer-mmlabc/issues/31)



{% endraw %}
```

### issue-notes/46.md
```md
{% raw %}
# issue abcjsのコンテナあるいは中身が表示されず、スーパーリロードで表示される、という現象が発生した #46
[issues #46](https://github.com/cat2151/quartz-transformer-mmlabc/issues/46)



{% endraw %}
```

### issue-notes/47.md
```md
{% raw %}
# issue PR 45 を参考に、外部パッケージ方式を選んだ理由をREADME.ja.mdに反映する。なおハイブリッド方式の記述は不要 #47
[issues #47](https://github.com/cat2151/quartz-transformer-mmlabc/issues/47)



{% endraw %}
```

### src/index.ts
```ts
{% raw %}
import { visit } from "unist-util-visit"
import type { Pluggable } from "unified"

// Type definitions for Quartz plugin interface
interface BuildCtx {
  allSlugs: string[]
  cfg: Record<string, any> // Quartz configuration object
  argv: Record<string, any> // Command-line arguments
}

interface QuartzTransformerPluginInstance {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx: BuildCtx) => Pluggable[]
  htmlPlugins?: (ctx: BuildCtx) => Pluggable[]
  externalResources?: (ctx: BuildCtx) => Partial<StaticResources>
}

interface StaticResources {
  css: Array<{ content?: string; src?: string; inline?: boolean }>
  js: Array<{
    src?: string
    loadTime?: "beforeDOMReady" | "afterDOMReady"
    contentType?: "external" | "inline"
    script?: string
  }>
}

type QuartzTransformerPlugin<T = undefined> = (
  opts?: T,
) => QuartzTransformerPluginInstance

// Type definitions for AST nodes
interface Root {
  type: "root"
  children: any[]
}

/**
 * Options for MMLABCTransformer plugin
 */
interface MMLABCOptions {
  /** Enable transformation of MML code blocks (default: true) */
  enableMML?: boolean
  /** Enable transformation of chord code blocks (default: true) */
  enableChord?: boolean
  /** Enable transformation of ABC code blocks (default: true) */
  enableABC?: boolean
}

const defaultOptions: MMLABCOptions = {
  enableMML: true,
  enableChord: true,
  enableABC: true,
}

/**
 * Quartz transformer plugin for converting MML (Music Macro Language), chord progression,
 * and ABC notation code blocks into interactive sheet music using abcjs.
 * 
 * This plugin operates in two stages:
 * 1. Build-time: Transforms markdown code blocks into HTML divs with data attributes
 * 2. Browser runtime: Loads CDN libraries, converts notation, and renders interactive SVG
 * 
 * @param userOpts - Configuration options for enabling/disabling specific notation types
 * @returns A Quartz transformer plugin instance
 * 
 * @example
 * ```typescript
 * // quartz.config.ts
 * import { QuartzConfig } from "./quartz/cfg"
 * import * as Plugin from "./quartz/plugins"
 * import { MMLABCTransformer } from "quartz-transformer-mmlabc"
 * 
 * const config: QuartzConfig = {
 *   configuration: {
 *     // ... your Quartz configuration (siteTitle, theme, etc.)
 *   },
 *   plugins: {
 *     transformers: [
 *       // Built-in Quartz transformers
 *       Plugin.FrontMatter(),
 *       Plugin.TableOfContents(),
 *       // Add the MML/Chord/ABC transformer
 *       MMLABCTransformer({
 *         enableMML: true,
 *         enableChord: true,
 *         enableABC: true,
 *       }),
 *     ],
 *     filters: [
 *       // ... your filters
 *     ],
 *     emitters: [
 *       // ... your emitters
 *     ],
 *   },
 * }
 * 
 * export default config
 * ```
 */
export const MMLABCTransformer: QuartzTransformerPlugin<MMLABCOptions | undefined> = (
  userOpts?: MMLABCOptions,
) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "MMLABCTransformer",
    markdownPlugins(_ctx: BuildCtx) {
      return [
        () => {
          return (tree: Root, _file: any) => {
            visit(tree, "code", (node: any) => {
              const lang = node.lang?.toLowerCase()

              // Handle MML blocks - replace with HTML that will be processed in browser
              if (opts.enableMML && lang === "mml") {
                const mmlCode = node.value as string

                // Replace the code block with an HTML block containing the MML data
                node.type = "html"
                node.value = `<div class="abc-notation mml-block" data-mml="${escapeHtml(
                  mmlCode,
                )}" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>`
                delete node.lang
              }

              // Handle chord blocks - replace with HTML that will be processed in browser
              if (opts.enableChord && lang === "chord") {
                const chordCode = node.value as string

                // Replace the code block with an HTML block containing the chord data
                node.type = "html"
                node.value = `<div class="abc-notation chord-block" data-chord="${escapeHtml(
                  chordCode,
                )}" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>`
                delete node.lang
              }

              // Handle ABC blocks - replace with HTML that will be processed in browser
              if (opts.enableABC && lang === "abc") {
                const abcCode = node.value as string

                // Replace the code block with an HTML block containing the ABC data
                node.type = "html"
                node.value = `<div class="abc-notation abc-block" data-abc="${escapeHtml(
                  abcCode,
                )}" data-type="abc" role="button" tabindex="0" aria-label="Play music notation"></div>`
                delete node.lang
              }
            })
          }
        },
      ]
    },
    externalResources(_ctx: BuildCtx) {
      return {
        js: [
          {
            src: "https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            // Large inline script is intentional for distribution simplicity
            // This ensures the plugin works as a standalone npm package without additional asset management
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: `
// Initialize abcjs rendering for all ABC notation blocks
(async function() {
  // Wait for ABCJS to be available
  if (typeof ABCJS === 'undefined') {
    console.error('ABCJS library not loaded');
    return;
  }

  // Cache the mml2abc module to avoid duplicate imports
  let mml2abcModule = null;
  
  // Cache the chord2mml loading promise to avoid race conditions
  let chord2mmlLoadPromise = null;
  
  // Global synth instance for audio playback
  let currentSynth = null;
  let currentPlayingElement = null;
  
  // Shared AudioContext (create once and reuse)
  let sharedAudioContext = null;
  
  // WeakMap to store visual objects for each element
  const visualObjMap = new WeakMap();

  // Theme detection and switching for Quartz dark mode integration
  const updateNotationTheme = function(isDark) {
    const blocks = document.querySelectorAll('.abc-notation');
    blocks.forEach(block => {
      if (isDark) {
        block.classList.add('theme-dark');
        block.classList.remove('theme-light');
      } else {
        block.classList.add('theme-light');
        block.classList.remove('theme-dark');
      }
    });
  };

  // 1) Initial theme detection
  // First try to detect Quartz's theme from document attributes or classes
  const getQuartzTheme = function() {
    // Check for Quartz-specific theme indicators
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Check data-theme attribute (common in Quartz)
    const dataTheme = htmlElement.getAttribute('data-theme') || bodyElement.getAttribute('data-theme');
    if (dataTheme === 'dark') return 'dark';
    if (dataTheme === 'light') return 'light';
    
    // Check for dark class on html or body
    if (htmlElement.classList.contains('dark') || bodyElement.classList.contains('dark')) {
      return 'dark';
    }
    
    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const initialTheme = getQuartzTheme();
  const initialIsDark = initialTheme === 'dark';
  
  // Apply initial theme
  updateNotationTheme(initialIsDark);

  // 2) Listen for Quartz theme changes
  document.addEventListener('themechange', (e) => {
    const theme = e.detail?.theme;
    if (theme === 'dark' || theme === 'light') {
      updateNotationTheme(theme === 'dark');
    }
  });

  // Process all abc-notation blocks
  const blocks = document.querySelectorAll('.abc-notation');
  
  for (const element of blocks) {
    const type = element.getAttribute('data-type');
    
    try {
      let abcNotation = '';
      
      if (type === 'mml') {
        const mmlData = element.getAttribute('data-mml');
        if (mmlData) {
          // Dynamically import mml2abc ES module from CDN
          // Version specified by @cat2151 based on verified compatibility in easychord2mml
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'chord') {
        const chordData = element.getAttribute('data-chord');
        if (chordData) {
          // Load chord2mml as a script (UMD bundle, not ES module)
          // Version specified by @cat2151 based on verified compatibility in easychord2mml
          if (typeof window.chord2mml === 'undefined') {
            if (!chord2mmlLoadPromise) {
              chord2mmlLoadPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js';
                script.integrity = 'sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz';
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load chord2mml script'));
                document.head.appendChild(script);
              });
            }
            await chord2mmlLoadPromise;
          }
          const mmlData = window.chord2mml.parse(chordData);
          // Then convert MML to ABC (reuse cached module)
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'abc') {
        // For ABC notation, no conversion needed - use directly
        const abcData = element.getAttribute('data-abc');
        if (abcData) {
          abcNotation = abcData;
        }
      }
      
      if (abcNotation) {
        // コンテナのサイズに基づいて五線譜の幅をレスポンシブに計算
        const containerWidth = element.offsetWidth || element.clientWidth || 600;
        // .abc-notation の padding: 1em は左右で合計2em（約32px）
        // フォントサイズが16pxと仮定すると、2em ≈ 32px + 安全マージン約8px = 40px
        const availableWidth = containerWidth - 40;
        // 最小300px、最大800pxの範囲に制限
        const staffWidth = Math.min(Math.max(availableWidth, 300), 800);
        
        // Render the ABC notation with abcjs
        const visualObj = ABCJS.renderAbc(element, abcNotation, {
          responsive: 'resize',
          staffwidth: staffWidth,
          scale: 1.0
        });
        
        // Store the visual object using WeakMap
        visualObjMap.set(element, visualObj);
        
        // Define the playback handler function
        const handlePlayback = async function(e) {
          e.preventDefault();
          
          // Stop any currently playing music
          if (currentSynth) {
            currentSynth.stop();
            if (currentPlayingElement) {
              currentPlayingElement.classList.remove('playing');
            }
          }
          
          // If clicking the same element that's playing, just stop
          if (currentPlayingElement === element) {
            currentPlayingElement = null;
            currentSynth = null;
            return;
          }
          
          try {
            // Create audio context once (requires user gesture for first time)
            if (!sharedAudioContext) {
              const AudioContextClass = window.AudioContext || window.webkitAudioContext;
              if (AudioContextClass) {
                sharedAudioContext = new AudioContextClass();
              } else {
                console.error('Web Audio API not supported');
                return;
              }
            }
            
            // Ensure audio context is running (some browsers start it in a suspended state)
            if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
              await sharedAudioContext.resume();
            }
            
            // Get the visual object for this element
            const visualObj = visualObjMap.get(element);
            if (!visualObj || !visualObj[0]) {
              console.error('Visual object not found for element');
              return;
            }
            
            // Create synth
            if (ABCJS.synth.CreateSynth) {
              currentSynth = new ABCJS.synth.CreateSynth();
              
              // Initialize synth
              await currentSynth.init({
                audioContext: sharedAudioContext,
                visualObj: visualObj[0],
                options: {}
              });
              
              // Prime the synth with the tune
              await currentSynth.prime();
              
              // Mark as playing
              element.classList.add('playing');
              currentPlayingElement = element;
              
              // Set up event listener for when playback finishes
              const cleanup = function() {
                if (currentPlayingElement === element) {
                  element.classList.remove('playing');
                  currentPlayingElement = null;
                  if (currentSynth && typeof currentSynth.stop === 'function') {
                    currentSynth.stop();
                  }
                  currentSynth = null;
                }
              };
              
              // Start playback
              currentSynth.start();
              
              // Store a unique ID for this playback to handle race conditions
              const playbackId = Date.now();
              element.setAttribute('data-playback-id', playbackId.toString());
              
              // Check playback status with safety limit
              let pollCount = 0;
              const maxPolls = 6000; // Max 10 minutes (6000 * 100ms)
              
              const checkPlaybackStatus = function() {
                pollCount++;
                
                // Check if this playback has been superseded
                const currentPlaybackId = element.getAttribute('data-playback-id');
                if (currentPlaybackId !== playbackId.toString()) {
                  return; // Stop polling for this playback
                }
                
                // Safety check: stop after max polls
                if (pollCount >= maxPolls) {
                  console.warn('Playback check timeout reached');
                  cleanup();
                  return;
                }
                
                // Check if synth is still playing
                if (currentSynth && currentSynth.isRunning && !currentSynth.isRunning()) {
                  cleanup();
                } else if (currentSynth) {
                  // Check again in 100ms
                  setTimeout(checkPlaybackStatus, 100);
                }
              };
              
              // Start checking after a short delay
              setTimeout(checkPlaybackStatus, 100);
            } else {
              console.error('ABCJS synth API not available');
              const errorParagraph = document.createElement('p');
              errorParagraph.style.color = 'orange';
              errorParagraph.style.fontSize = '0.9em';
              errorParagraph.textContent = 'Audio playback is not available in this version of abcjs.';
              element.appendChild(errorParagraph);
            }
          } catch (error) {
            console.error('Error playing music:', error);
            element.classList.remove('playing');
            currentPlayingElement = null;
            currentSynth = null;
          }
        };
        
        // Add click handler for audio playback
        element.addEventListener('click', handlePlayback);
        
        // Add keyboard handler for accessibility (Enter and Space keys)
        element.addEventListener('keydown', async function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            await handlePlayback(e);
          }
        });
      }
    } catch (error) {
      console.error('Error rendering notation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorParagraph = document.createElement('p');
      errorParagraph.style.color = 'red';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
        errorParagraph.textContent = 'Error loading music notation library. Please check your internet connection.';
      } else if (errorMessage.includes('parse')) {
        const notationType = type === 'chord' ? 'chord' : type === 'abc' ? 'ABC' : 'MML';
        errorParagraph.textContent = 'Error parsing ' + notationType + ' notation. Please check the syntax.';
      } else {
        errorParagraph.textContent = 'Error rendering music notation';
      }
      element.innerHTML = '';
      element.appendChild(errorParagraph);
    }
  }
})();
            `.trim(),
          },
        ],
        css: [
          {
            content: `
.abc-notation {
  margin: 1em 0;
  padding: 1em;
  background-color: var(--abc-bg, #f5f5f5);
  border-radius: 4px;
  overflow-x: auto;
  cursor: pointer;
  position: relative;
  max-width: 95%;
}

/* Let SVG use full container width */
.abc-notation svg {
  max-width: 100%;
  height: auto;
}

/* Override abcjs default colors for dark mode compatibility */
.abc-notation svg path,
.abc-notation svg text {
  fill: var(--abc-svg-color, #000);
}

.abc-notation.playing {
  background-color: var(--abc-playing-bg, #e8f5e9);
}

.abc-notation::before {
  content: "▶ Click to play";
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  font-size: 0.8em;
  color: var(--abc-label-color, #666);
  background-color: var(--abc-label-bg, rgba(255, 255, 255, 0.9));
  padding: 0.3em 0.6em;
  border-radius: 3px;
  pointer-events: none;
}

.abc-notation.playing::before {
  content: "🔊 Playing...";
  color: var(--abc-playing-label-color, #2e7d32);
}

/* Dark mode support */
/* Note: CSS variable definitions are intentionally duplicated to support both:
   1. System-level dark mode via media query (prefers-color-scheme)
   2. Quartz-specific dark mode implementations (data-theme, .dark class)
   3. Dynamic class-based theme switching via JavaScript
   This ensures compatibility with different Quartz configurations.
   
   The duplication is intentional rather than using root-level custom properties because:
   - Higher specificity ensures theme styles override defaults reliably
   - Each method (media query, data-theme, class-based) may be used independently
   - Simpler to maintain as a self-contained plugin without affecting global styles */
@media (prefers-color-scheme: dark) {
  .abc-notation {
    --abc-bg: #2d2d2d;
    --abc-playing-bg: #1a3a1a;
    --abc-label-color: #aaa;
    --abc-label-bg: rgba(50, 50, 50, 0.9);
    --abc-playing-label-color: #4caf50;
    --abc-svg-color: #e0e0e0;
  }
}

/* Quartz-specific dark mode support (if Quartz uses data-theme or class) */
:root[data-theme="dark"] .abc-notation,
.dark .abc-notation,
html.dark .abc-notation {
  --abc-bg: #2d2d2d;
  --abc-playing-bg: #1a3a1a;
  --abc-label-color: #aaa;
  --abc-label-bg: rgba(50, 50, 50, 0.9);
  --abc-playing-label-color: #4caf50;
  --abc-svg-color: #e0e0e0;
}

/* Dynamic theme classes (applied by JavaScript for Quartz theme integration) */
.abc-notation.theme-dark {
  --abc-bg: #2d2d2d;
  --abc-playing-bg: #1a3a1a;
  --abc-label-color: #aaa;
  --abc-label-bg: rgba(50, 50, 50, 0.9);
  --abc-playing-label-color: #4caf50;
  --abc-svg-color: #e0e0e0;
}

.abc-notation.theme-light {
  --abc-bg: #f5f5f5;
  --abc-playing-bg: #e8f5e9;
  --abc-label-color: #666;
  --abc-label-bg: rgba(255, 255, 255, 0.9);
  --abc-playing-label-color: #2e7d32;
  --abc-svg-color: #000;
}
            `.trim(),
            inline: true,
          },
        ],
      }
    },
  }
}

/**
 * Escape HTML special characters including newlines and whitespace
 * to prevent XSS vulnerabilities and ensure proper data attribute encoding
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "\n": "&#10;",
    "\r": "&#13;",
    "\t": "&#9;",
  }
  return text.replace(/[&<>"'\n\r\t]/g, (m) => map[m])
}


{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
6971e9c Add issue note for #47 [auto]
337747f Merge pull request #45 from cat2151/copilot/refactor-typescript-source-structure
4f78cfb Add issue note for #46 [auto]
ef1f74d Add comprehensive investigation document for Quartz 4 refactoring approach (issue #44)
e1dc638 Initial plan
da2d579 Add issue note for #44 [auto]
deb21a2 Auto-translate README.ja.md to README.md [auto]
aee0316 Revise README for Obsidian and Quartz4 integration
3e2cbd7 Auto-translate README.ja.md to README.md [auto]
ceab6a5 Revise README.ja.md for clarity and features

### 変更されたファイル:
README.ja.md
README.md
issue-notes/44-investigation.md
issue-notes/44.md
issue-notes/46.md
issue-notes/47.md


---
Generated at: 2026-01-06 07:01:48 JST
