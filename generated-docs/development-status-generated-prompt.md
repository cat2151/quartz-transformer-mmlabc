Last updated: 2026-03-02

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
- .github/actions-tmp/.github/workflows/call-check-large-files.yml
- .github/actions-tmp/.github/workflows/call-daily-project-summary.yml
- .github/actions-tmp/.github/workflows/call-issue-note.yml
- .github/actions-tmp/.github/workflows/call-rust-windows-check.yml
- .github/actions-tmp/.github/workflows/call-translate-readme.yml
- .github/actions-tmp/.github/workflows/callgraph.yml
- .github/actions-tmp/.github/workflows/check-large-files.yml
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
- .github/actions-tmp/.github_automation/check-large-files/README.md
- .github/actions-tmp/.github_automation/check-large-files/check-large-files.toml.default
- .github/actions-tmp/.github_automation/check-large-files/scripts/check_large_files.py
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
- .github/actions-tmp/issue-notes/35.md
- .github/actions-tmp/issue-notes/38.md
- .github/actions-tmp/issue-notes/4.md
- .github/actions-tmp/issue-notes/40.md
- .github/actions-tmp/issue-notes/44.md
- .github/actions-tmp/issue-notes/46.md
- .github/actions-tmp/issue-notes/7.md
- .github/actions-tmp/issue-notes/8.md
- .github/actions-tmp/issue-notes/9.md
- .github/actions-tmp/package-lock.json
- .github/actions-tmp/package.json
- .github/actions-tmp/src/main.js
- .github/copilot-instructions.md
- .github/workflows/call-check-large-files.yml
- .github/workflows/call-daily-project-summary.yml
- .github/workflows/call-issue-note.yml
- .github/workflows/call-translate-readme.yml
- .gitignore
- DEBUG-LOGGING-SUMMARY.md
- ISSUE-71-FIX-SUMMARY.md
- LICENSE
- README.ja.md
- README.md
- SPA-FIX-SUMMARY.md
- _config.yml
- demo.html
- dist/browser-runtime.js
- dist/index.d.ts
- dist/index.js
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
- issue-notes/46-solution.md
- issue-notes/46.md
- issue-notes/47.md
- issue-notes/50.md
- issue-notes/51-solution.md
- issue-notes/51.md
- issue-notes/53.md
- issue-notes/55.md
- issue-notes/56-solution.md
- issue-notes/56.md
- issue-notes/58.md
- issue-notes/59.md
- issue-notes/61.md
- issue-notes/63.md
- issue-notes/65.md
- issue-notes/67-solution.md
- issue-notes/67.md
- issue-notes/69.md
- issue-notes/71.md
- issue-notes/72.md
- issue-notes/75.md
- issue-notes/77.md
- package-lock.json
- package.json
- playwright.config.ts
- src/browser-runtime.js
- src/index.test.ts
- src/index.ts
- test/README.md
- test/integration-test.html
- test/integration.test.ts
- test/playback-fix.test.ts
- test/playback-simple.spec.js
- test/spa-navigation-debug.test.ts
- test/spa-navigation-test-README.md
- test/spa-navigation-test.html
- tsconfig.json
- vitest.config.ts

## 現在のオープンIssues
## [Issue #79](../issue-notes/79.md): 大きなファイルの検出: 2個のファイルが500行を超えています
以下のファイルが500行を超えています。リファクタリングを検討してください。

## 検出されたファイル

| ファイル | 行数 | 超過行数 |
|---------|------|----------|
| `src/index.test.ts` | 879 | +379 |
| `test/spa-navigation-test.html` | 527 | +27 |

## テスト実施のお願い

- リファクタリング前後にテストを実行し、それぞれのテスト失敗件数を報告してください
- リファクタリング前後のどちらかでテストがredの場合、まず別issueでtest greenにしてか...
ラベル: refactoring, code-quality, automated
--- issue-notes/79.md の内容 ---

```markdown

```

## [Issue #50](../issue-notes/50.md): issue 46 の現象がまだ発生する可能性があるので様子見する。また、スーパーリロードでなくリロードで解決できている可能性もある
[issue-notes/50.md](https://github.com/cat2151/quartz-transformer-mmlabc/blob/main/issue-notes/50.md)

...
ラベル: 
--- issue-notes/50.md の内容 ---

```markdown
# issue issue 46 の現象がまだ発生する可能性があるので様子見する。また、スーパーリロードでなくリロードで解決できている可能性もある #50
[issues #50](https://github.com/cat2151/quartz-transformer-mmlabc/issues/50)



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

## ドキュメントで言及されているファイルの内容
### .github/actions-tmp/issue-notes/9.md
```md
{% raw %}
# issue 関数コールグラフhtmlビジュアライズが0件なので、原因を可視化する #9
[issues #9](https://github.com/cat2151/github-actions/issues/9)

# agentに修正させたり、人力で修正したりした
- agentがハルシネーションし、いろいろ根の深いバグにつながる、エラー隠蔽などを仕込んでいたため、検知が遅れた
- 詳しくはcommit logを参照のこと
- WSL + actの環境を少し変更、act起動時のコマンドライン引数を変更し、generated-docsをmountする（ほかはデフォルト挙動であるcpだけにする）ことで、デバッグ情報をコンテナ外に出力できるようにし、デバッグを効率化した

# test green

# closeとする

{% endraw %}
```

### issue-notes/31.md
```md
{% raw %}
# issue ドッグフーディングする #31
[issues #31](https://github.com/cat2151/quartz-transformer-mmlabc/issues/31)



{% endraw %}
```

### issue-notes/50.md
```md
{% raw %}
# issue issue 46 の現象がまだ発生する可能性があるので様子見する。また、スーパーリロードでなくリロードで解決できている可能性もある #50
[issues #50](https://github.com/cat2151/quartz-transformer-mmlabc/issues/50)



{% endraw %}
```

### src/index.test.ts
```ts
{% raw %}
import { describe, it, expect } from 'vitest'
import { MMLABCTransformer } from './index'

// Mock BuildCtx for testing
const mockBuildCtx = {
  allSlugs: [],
  cfg: {},
  argv: {},
}

describe('MMLABCTransformer', () => {
  describe('Plugin initialization', () => {
    it('should create a plugin with default options', () => {
      const plugin = MMLABCTransformer()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('MMLABCTransformer')
    })

    it('should have markdownPlugins function', () => {
      const plugin = MMLABCTransformer()
      expect(plugin.markdownPlugins).toBeDefined()
      expect(typeof plugin.markdownPlugins).toBe('function')
    })

    it('should have externalResources function', () => {
      const plugin = MMLABCTransformer()
      expect(plugin.externalResources).toBeDefined()
      expect(typeof plugin.externalResources).toBe('function')
    })

    it('should accept custom options', () => {
      const plugin = MMLABCTransformer({ enableMML: false, enableChord: false })
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('MMLABCTransformer')
    })

    it('should load browser runtime script from separate file', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)
      
      // Find the inline script resource
      const inlineScript = resources.js?.find(
        js => js.contentType === 'inline' && js.loadTime === 'afterDOMReady'
      )
      
      expect(inlineScript).toBeDefined()
      expect(inlineScript?.script).toBeDefined()
      
      // Verify the script contains expected browser runtime content
      const script = inlineScript?.script || ''
      expect(script).toContain('MML-ABC-Transformer')
      expect(script).toContain('initializeMusicNotation')
      expect(script).toContain('ABCJS')
      expect(script).toContain('visualObjMap')
      
      // Verify it's a non-empty, substantial script (should be ~18KB)
      expect(script.length).toBeGreaterThan(10000)
    })
  })

  describe('AST transformation - MML blocks', () => {
    it('should transform MML code blocks to HTML', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 cdefgab>c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('class="abc-notation mml-block"')
      expect(tree.children[0].value).toContain('data-mml=')
      expect(tree.children[0].value).toContain('data-type="mml"')
      expect(tree.children[0].value).toContain('t120 l4 cdefgab&gt;c')
    })

    it('should escape HTML special characters in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: '<script>alert("xss")</script>'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;script&gt;')
      expect(tree.children[0].value).toContain('&quot;xss&quot;')
      expect(tree.children[0].value).not.toContain('<script>')
    })

    it('should escape newlines in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 'line1\nline2\nline3'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#10;')
      expect(tree.children[0].value).toMatch(/data-mml="[^"]*&#10;[^"]*"/)
    })

    it('should escape tabs and carriage returns in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 'tab\there\rcarriage'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#9;')
      expect(tree.children[0].value).toContain('&#13;')
    })

    it('should escape ampersands and quotes in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 'test & "quote" \'single\''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&amp;')
      expect(tree.children[0].value).toContain('&quot;')
      expect(tree.children[0].value).toContain('&#039;')
    })

    it('should handle case-insensitive language tags', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'MML',
            value: 't120 l4 c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="mml"')
    })

    it('should include ARIA attributes for accessibility', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('role="button"')
      expect(tree.children[0].value).toContain('tabindex="0"')
      expect(tree.children[0].value).toContain('aria-label="Play music notation"')
    })

    it('should not transform MML blocks when enableMML is false', () => {
      const plugin = MMLABCTransformer({ enableMML: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 cdefgab>c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('mml')
    })
  })

  describe('AST transformation - Chord blocks', () => {
    it('should transform chord blocks to HTML', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Dm7 G7 C'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('class="abc-notation chord-block"')
      expect(tree.children[0].value).toContain('data-chord=')
      expect(tree.children[0].value).toContain('data-type="chord"')
      expect(tree.children[0].value).toContain('C Dm7 G7 C')
    })

    it('should escape HTML special characters in chord code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C<maj7> D&m "test"'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;maj7&gt;')
      expect(tree.children[0].value).toContain('&amp;m')
      expect(tree.children[0].value).toContain('&quot;test&quot;')
    })

    it('should handle case-insensitive chord language tags', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'CHORD',
            value: 'C Am F G'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="chord"')
    })

    it('should not transform chord blocks when enableChord is false', () => {
      const plugin = MMLABCTransformer({ enableChord: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Dm7 G7 C'
          }
        ]
      }

      transformer(tree, null)

      // Chord blocks should remain as code blocks when enableChord is false
      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('chord')
    })

    it('should not process chord blocks when enableChord is false', () => {
      const plugin = MMLABCTransformer({ enableChord: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Dm7 G7 C'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('chord')
    })

    it('should handle empty chord code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: ''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-chord=""')
    })

    it('should escape newlines in chord code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am\nF G\nC'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#10;')
    })
  })

  describe('AST transformation - ABC blocks', () => {
    it('should transform ABC blocks to HTML', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nT:Simple Scale\nM:4/4\nL:1/4\nK:C\nC D E F|G A B c|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('class="abc-notation abc-block"')
      expect(tree.children[0].value).toContain('data-abc=')
      expect(tree.children[0].value).toContain('data-type="abc"')
    })

    it('should escape HTML special characters in ABC code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nT:Test<Title>\nK:C\n"C"cdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;Title&gt;')
      expect(tree.children[0].value).toContain('&quot;C&quot;')
    })

    it('should escape newlines in ABC code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nT:Title\nM:4/4\nK:C'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#10;')
    })

    it('should handle case-insensitive ABC language tags', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'ABC',
            value: 'X:1\nK:C\ncdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="abc"')
    })

    it('should not transform ABC blocks when enableABC is false', () => {
      const plugin = MMLABCTransformer({ enableABC: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nK:C\ncdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('abc')
    })

    it('should handle empty ABC code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: ''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-abc=""')
    })
  })

  describe('AST transformation - Multiple blocks', () => {
    it('should transform multiple MML blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          },
          {
            type: 'code',
            lang: 'mml',
            value: 't140 l8 defg'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('t120 l4 c')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('t140 l8 defg')
    })

    it('should transform multiple chord blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am F G'
          },
          {
            type: 'code',
            lang: 'chord',
            value: 'Dm7 G7 Cmaj7'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('C Am F G')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('Dm7 G7 Cmaj7')
    })

    it('should transform both MML and chord blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          },
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am F G'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="mml"')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('data-type="chord"')
    })

    it('should transform MML, chord, and ABC blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          },
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am F G'
          },
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nK:C\ncdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="mml"')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('data-type="chord"')
      expect(tree.children[2].type).toBe('html')
      expect(tree.children[2].value).toContain('data-type="abc"')
    })

    it('should not transform non-MML code blocks', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'javascript',
            value: 'console.log("hello")'
          },
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('javascript')
      expect(tree.children[1].type).toBe('html')
    })
  })

  describe('External resources', () => {
    it('should include abcjs library from CDN', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      expect(resources.js).toBeDefined()
      expect(resources.js!.length).toBeGreaterThan(0)
      
      const abcjsScript = resources.js!.find(js => js.src?.includes('abcjs'))
      expect(abcjsScript).toBeDefined()
      expect(abcjsScript?.loadTime).toBe('afterDOMReady')
      expect(abcjsScript?.contentType).toBe('external')
    })

    it('should include CSS for abc-notation class', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      expect(resources.css).toBeDefined()
      expect(resources.css!.length).toBeGreaterThan(0)
      
      const css = resources.css![0]
      expect(css.content).toContain('.abc-notation')
      expect(css.inline).toBe(true)
    })

    it('should include inline afterDOMReady script', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline' && js.loadTime === 'afterDOMReady')
      expect(inlineScript).toBeDefined()
      expect(inlineScript?.script).toContain('ABCJS')
      expect(inlineScript?.script).toContain('mml2abc')
      expect(inlineScript?.script).toContain('chord2mml')
      expect(inlineScript?.script).toContain('renderAbc')
    })

    it('should use mml2abc from CDN without version tag', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      expect(inlineScript?.script).toContain('cat2151/mml2abc/dist/mml2abc.mjs')
      expect(inlineScript?.script).not.toContain('mml2abc@')
    })

    it('should use chord2mml from CDN without version tag', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      expect(inlineScript?.script).toContain('cat2151/chord2mml/dist/chord2mml.js')
      expect(inlineScript?.script).not.toContain('chord2mml@')
    })

    it('should include theme detection and switching code', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      expect(inlineScript?.script).toContain('updateNotationTheme')
      expect(inlineScript?.script).toContain('getQuartzTheme')
      expect(inlineScript?.script).toContain('themechange')
      expect(inlineScript?.script).toContain('theme-dark')
      expect(inlineScript?.script).toContain('theme-light')
    })

    it('should not contain TypeScript syntax in inline script', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      
      // Check for TypeScript type annotations that would cause browser errors
      // More comprehensive pattern that matches:
      // - Type assertions: (\w+\s+as\s+[A-Z]\w*[^a-z])
      //   Matches "node as Element" but not "as a" or "as playing" in comments
      //   Requires: word before 'as', capitalized type, and non-lowercase after
      // - Type annotations: :\s*(string|number|boolean|any|void|Element|Node|[A-Z]\w*)\s*(\)|;|=|,)
      //   Matches variable, parameter, and return type annotations
      //   Examples: "const x: string =", "(param: number)", "function(): void;"
      // Note: Uses word boundaries and character class checks to avoid false positives
      const typeAnnotationPattern = /(\w+\s+as\s+[A-Z]\w*[^a-z])|:\s*(string|number|boolean|any|void|Element|Node|[A-Z]\w*)\s*(\)|;|=|,)/
      
      expect(inlineScript?.script).toBeDefined()
      expect(typeAnnotationPattern.test(inlineScript!.script!)).toBe(false)
      
      // Specifically check for the problematic patterns from issues
      expect(inlineScript?.script).not.toContain('(source: string)')
      expect(inlineScript?.script).not.toContain('as Element')
    })

    it('should include dynamic theme classes in CSS', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const css = resources.css![0]
      expect(css.content).toContain('.abc-notation.theme-dark')
      expect(css.content).toContain('.abc-notation.theme-light')
      expect(css.content).toContain('Dynamic theme classes')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: ''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-mml=""')
    })

    it('should handle code blocks without lang property', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'no language'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
    })

    it('should handle complex MML with all special characters', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const complexMml = 't120 l4\ncdefg<ab>c\n& "test" \'quote\'\r\n\ttab'
      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: complexMml
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;')
      expect(tree.children[0].value).toContain('&gt;')
      expect(tree.children[0].value).toContain('&amp;')
      expect(tree.children[0].value).toContain('&quot;')
      expect(tree.children[0].value).toContain('&#039;')
      expect(tree.children[0].value).toContain('&#10;')
      expect(tree.children[0].value).toContain('&#13;')
      expect(tree.children[0].value).toContain('&#9;')
    })
  })
})

{% endraw %}
```

### test/spa-navigation-test.html
```html
{% raw %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA Navigation Test - MML ABC Transformer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        
        .nav-buttons {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        
        .nav-buttons button {
            margin: 5px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
        }
        
        .nav-buttons button:hover {
            background-color: #45a049;
        }
        
        .page {
            display: none;
            padding: 20px;
            border: 2px solid #ddd;
            border-radius: 4px;
            min-height: 300px;
        }
        
        .page.active {
            display: block;
        }
        
        .test-info {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .test-info h3 {
            margin-top: 0;
            color: #2e7d32;
        }
        
        /* Include the ABC notation styles from the plugin */
        .abc-notation {
            margin: 1em 0;
            padding: 1em;
            background-color: #f5f5f5;
            border-radius: 4px;
            overflow-x: auto;
            cursor: pointer;
            position: relative;
            max-width: 95%;
        }
        
        .abc-notation svg {
            max-width: 100%;
            height: auto;
        }
        
        .abc-notation svg path,
        .abc-notation svg text {
            fill: #000;
        }
        
        .abc-notation.playing {
            background-color: #e8f5e9;
        }
        
        .abc-notation::before {
            content: "▶ Click to play";
            position: absolute;
            top: 0.5em;
            right: 0.5em;
            font-size: 0.8em;
            color: #666;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 0.3em 0.6em;
            border-radius: 3px;
            pointer-events: none;
        }
        
        .abc-notation.playing::before {
            content: "🔊 Playing...";
            color: #2e7d32;
        }
    </style>
</head>
<body>
    <h1>SPA Navigation Test</h1>
    
    <div class="test-info">
        <h3>Test Instructions:</h3>
        <ol>
            <li>Click "Page 2 (Music)" - music notation should render</li>
            <li>Click "Page 1 (No Music)" - page changes to a simple page</li>
            <li>Click "Page 2 (Music)" again - <strong>THIS IS THE TEST:</strong> music notation should render even after navigation</li>
            <li>Click "Page 3 (More Music)" - another music page should render correctly</li>
        </ol>
        <p><strong>Expected behavior:</strong> Music notation should render on every navigation, not just the first time you visit a music page.</p>
    </div>
    
    <div class="nav-buttons">
        <button onclick="navigateTo('page1')">Page 1 (No Music)</button>
        <button onclick="navigateTo('page2')">Page 2 (Music)</button>
        <button onclick="navigateTo('page3')">Page 3 (More Music)</button>
    </div>
    
    <div id="page1" class="page active">
        <h2>Page 1 - Simple Content</h2>
        <p>This page has no music notation. It's just a regular page with text.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. This simulates navigating to a page without music notation.</p>
    </div>
    
    <div id="page2" class="page">
        <h2>Page 2 - Music Notation Examples</h2>
        <p>This page contains music notation that should render after navigation.</p>
        
        <h3>Example 1: Simple Scale (MML)</h3>
        <div class="abc-notation mml-block" data-mml="t120 l4 cdefgab>c" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>
        
        <h3>Example 2: Chord Progression</h3>
        <div class="abc-notation chord-block" data-chord="C Am F G" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>
    
    <div id="page3" class="page">
        <h2>Page 3 - More Music</h2>
        <p>Another page with different music notation.</p>
        
        <h3>Complex Melody</h3>
        <div class="abc-notation mml-block" data-mml="t140 l8 o4 c d e f g4 g4 a g f e d4 d4 c2" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>
        
        <h3>Jazz Chords</h3>
        <div class="abc-notation chord-block" data-chord="Cmaj7 Am7 Dm7 G7" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>
    </div>

    <!-- Load abcjs from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js"></script>
    
    <!-- Use the plugin's script from dist (inline it for testing) -->
    <script type="module" src="../dist/index.js"></script>
    
    <!-- Inline the plugin's afterDOMReady script for testing -->
    <script type="module">
// Initialize abcjs rendering for all ABC notation blocks
// Supports Quartz v4 SPA navigation by listening for "nav" events
(function() {
  // Plugin version for debugging
  const PLUGIN_VERSION = '0.1.0-debug';
  console.log('[MML-ABC-Transformer] Plugin loaded. Version:', PLUGIN_VERSION);
  
  // Check if ABCJS is available
  if (typeof ABCJS === 'undefined') {
    console.error('[MML-ABC-Transformer] ABCJS library not loaded');
    return;
  }

  // Global state that persists across SPA navigations
  // Cache the mml2abc module to avoid duplicate imports
  let mml2abcModule = null;
  
  // Cache the chord2mml loading promise to avoid race conditions
  let chord2mmlLoadPromise = null;
  
  // Global synth instance for audio playback
  let currentSynth = null;
  let currentPlayingElement = null;
  
  // Shared AudioContext (create once and reuse across navigations)
  let sharedAudioContext = null;
  
  // WeakMap to store visual objects for each element
  const visualObjMap = new WeakMap();
  
  // Track processed elements to avoid duplicate initialization
  const processedElements = new WeakSet();

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

  // Helper to detect Quartz's theme from document attributes or classes
  const getQuartzTheme = function() {
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
  
  // Main initialization function - called on initial load and SPA navigation
  const initializeMusicNotation = async function() {
    console.log('[MML-ABC-Transformer] 五線譜表示処理を開始します');
    const startTime = performance.now();
    
    // Apply current theme
    const currentTheme = getQuartzTheme();
    updateNotationTheme(currentTheme === 'dark');

    // Process all abc-notation blocks
    const blocks = document.querySelectorAll('.abc-notation');
    console.log('[MML-ABC-Transformer] 処理対象の楽譜ブロック数:', blocks.length);
    
    for (const element of blocks) {
      // Skip if this element was already processed (idempotent initialization)
      if (processedElements.has(element)) {
        console.log('[MML-ABC-Transformer] スキップ: 既に処理済みの要素');
        continue;
      }
      
      // Mark as processed
      processedElements.add(element);
      console.log('[MML-ABC-Transformer] 新しい楽譜要素を処理します。Type:', element.getAttribute('data-type'));
      
      const type = element.getAttribute('data-type');
      
      try {
        let abcNotation = '';
      
      if (type === 'mml') {
        const mmlData = element.getAttribute('data-mml');
        if (mmlData) {
          // Dynamically import mml2abc ES module from CDN
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'chord') {
        const chordData = element.getAttribute('data-chord');
        if (chordData) {
          // Load chord2mml as a script (UMD bundle, not ES module)
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
        // Calculate responsive staff width
        const containerWidth = element.offsetWidth || element.clientWidth || 600;
        const availableWidth = containerWidth - 40;
        const staffWidth = Math.min(Math.max(availableWidth, 300), 800);
        
        // Render the ABC notation with abcjs
        const visualObj = ABCJS.renderAbc(element, abcNotation, {
          responsive: 'resize',
          staffwidth: staffWidth,
          scale: 1.0
        });
        
        console.log('Rendered notation successfully');
        
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
            
            // Ensure audio context is running
            if (sharedAudioContext.state === 'suspended') {
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
              const playbackPromise = currentSynth.start();
              
              // If start() returns a promise, use it to detect completion
              if (playbackPromise && typeof playbackPromise.then === 'function') {
                playbackPromise.then(function() {
                  cleanup();
                }).catch(function(error) {
                  console.error('Playback ended or error:', error);
                  cleanup();
                });
              }
            } else {
              console.error('ABCJS synth API not available');
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
        
        // Add keyboard handler for accessibility
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
  
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  console.log('[MML-ABC-Transformer] 五線譜表示処理が完了しました。処理時間:', duration, 'ms');
};

  // Listen for Quartz theme changes
  document.addEventListener('themechange', (e) => {
    const theme = e.detail?.theme;
    if (theme === 'dark' || theme === 'light') {
      updateNotationTheme(theme === 'dark');
    }
  });

  // Listen for Quartz SPA navigation events
  // This ensures notation renders on every page navigation
  window.addEventListener('nav', () => {
    console.log('[MML-ABC-Transformer] SPA page 遷移を検知しました');
    // Call async initialization and handle any errors
    initializeMusicNotation().catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
    });
  });

  // Register cleanup function for SPA navigation
  // This prevents memory leaks when navigating away
  if (typeof window.addCleanup === 'function') {
    window.addCleanup(() => {
      // Stop any playing audio
      if (currentSynth && typeof currentSynth.stop === 'function') {
        currentSynth.stop();
      }
      if (currentPlayingElement) {
        currentPlayingElement.classList.remove('playing');
      }
      currentSynth = null;
      currentPlayingElement = null;
    });
  }

  // Initial render on page load
  console.log('[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します');
  initializeMusicNotation().catch(err => {
    console.error('[MML-ABC-Transformer] Error initializing music notation on page load:', err);
  });
})();
    </script>
    
    <!-- SPA Navigation Simulation -->
    <script>
        // Simulate Quartz's SPA navigation
        function navigateTo(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show target page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Dispatch the 'nav' event that Quartz uses for SPA navigation
                const navEvent = new CustomEvent('nav', {
                    detail: { url: '#' + pageId }
                });
                window.dispatchEvent(navEvent);
                
                console.log('Navigated to', pageId);
            }
        }
        
        // Mock addCleanup function (Quartz provides this)
        if (!window.addCleanup) {
            window.addCleanup = function(fn) {
                console.log('Cleanup function registered');
                // In a real Quartz environment, this would be called on navigation
            };
        }
    </script>
</body>
</html>

{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
e0dc173 check large files

### 変更されたファイル:
.github/workflows/call-check-large-files.yml
.gitignore
README.ja.md
README.md
dist/browser-runtime.js
dist/index.d.ts
dist/index.js
generated-docs/development-status-generated-prompt.md
generated-docs/development-status.md
generated-docs/project-overview-generated-prompt.md
generated-docs/project-overview.md
issue-notes/75.md
issue-notes/77.md
package-lock.json
src/index.ts
tsconfig.json


---
Generated at: 2026-03-02 07:01:33 JST
