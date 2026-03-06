Last updated: 2026-03-07

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
- .github/actions-tmp/issue-notes/52.md
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
- issue-notes/25.md
- issue-notes/31.md
- issue-notes/44-investigation.md
- issue-notes/46-solution.md
- issue-notes/51-solution.md
- issue-notes/56-solution.md
- issue-notes/56.md
- issue-notes/67-solution.md
- issue-notes/71.md
- issue-notes/81.md
- package-lock.json
- package.json
- playwright.config.ts
- src/ast-abc-multiple.test.ts
- src/ast-mml-chord.test.ts
- src/browser-runtime.js
- src/index.test.ts
- src/index.ts
- test/README.md
- test/integration-test.html
- test/integration.test.ts
- test/playback-fix.test.ts
- test/playback-simple.spec.js
- test/spa-navigation-debug.test.ts
- test/spa-navigation-runtime.js
- test/spa-navigation-test-README.md
- test/spa-navigation-test.html
- tsconfig.json
- vitest.config.ts

## 現在のオープンIssues
## [Issue #83](../issue-notes/83.md): 大きなファイルの検出: 1個のファイルが500行を超えています
以下のファイルが500行を超えています。リファクタリングを検討してください。

## 検出されたファイル

| ファイル | 行数 | 超過行数 |
|---------|------|----------|
| `src/browser-runtime.js` | 514 | +14 |

## テスト実施のお願い

- リファクタリング前後にテストを実行し、それぞれのテスト失敗件数を報告してください
- リファクタリング前後のどちらかでテストがredの場合、まず別issueでtest greenにしてからリファクタリングしてください

## 推奨事項

1. 単一責任の原則に従い、ファイル...
ラベル: refactoring, code-quality, automated
--- issue-notes/83.md の内容 ---

```markdown

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
### .github/actions-tmp/issue-notes/3.md
```md
{% raw %}
# issue GitHub Actions「issue note生成」を共通ワークフロー化する #3
[issues #3](https://github.com/cat2151/github-actions/issues/3)

- 前提
  - userは、translateのworkflowを共通ワークフロー化し、動くようにしたので、共通ワークフロー化の知識がある
  - よって、今回は、promptでplanさせ、そのplanをuserがレビューし、planの改善を指示できるので、ハルシネーションのリスクを下げることができる

- prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
このymlはまだ共通ワークフロー化されず、
呼び出し元からコピーされたままの状態です。
このymlファイル名のまま、
中身を共通ワークフロー化してください。
呼び出し元ymlは別途書きますので気にしないでください。
まずplanしてください
```

- plan 生成結果
```
共通ワークフロー化のためのplanは以下の通りです。

1. 目的
現在の issue-note.yml を「共通ワークフロー」として再設計し、他リポジトリや他ワークフローから workflow_call で呼び出せるようにする。
2. 主な変更点
on: トリガーを workflow_call に変更（直接イベントで起動しない）。
必要な入力（inputs）やシークレット（secrets）を workflow_call セクションで定義。
github.event.issue などのイベント依存部分を、inputs経由で受け取る形に修正。
既存の処理（issueノート生成、コミット、issue body更新）はそのまま活かすが、パラメータ化する。
3. 具体的な修正内容
on: issues: → on: workflow_call: に変更。
inputs で必要な値（例: issue_title, issue_number, issue_body, issue_url など）を受け取る。
スクリプト内の ${{ github.event.issue.xxx }} を ${{ inputs.xxx }} に置換。
github-script ステップも同様にinputsを参照。
必要に応じて secrets も workflow_call で受け取れるようにする。
4. ファイル名・配置
ファイル名はそのまま issue-note.yml。
配置場所は workflows でOK（共通ワークフローとしてもこの場所で良い）。
5. 呼び出し元への影響
呼び出し元ワークフローで uses: <repo>/.github/workflows/issue-note.yml@main のように参照し、inputsを渡す形になる。
このplanで進めます。次に、実際の共通ワークフロー化のためのyml修正案を作成しますか？
```

- userがplanレビューし、OKを出した
- agentに生成結果ymlをレビューさせた、OKとなった
  - userはこのレビューは認知負荷が高いのでskipとする（単純な細かい間違い探し作業になるので、それはagentに任せた）
-  エラー。呼び出し元ymlのエラーがあり修正。共通ワークフローのエラー指摘があり、共通ワークフロー側の修正が必要となった
```
原因の分析：

呼び出し元（tonejs-mml-to-jsonのissue-note.yml）は、reusable workflow（cat2151/github-actions/.github/workflows/issue-note.yml@main）をusesで呼び出し、inputsをwithで渡しています。
共通ワークフロー（reusable workflow）は inputs を workflow_call で受け取り、各ステップで ${{ inputs.xxx }} で参照しています。
しかし、エラーが発生したのは actions/github-script@v7 の script 内です。
エラーの本質的な原因：

actions/github-script の script: で ${{ inputs.issue_number }} のような式を直接 JavaScript テンプレートリテラル内で使っていますが、これはサポートされていません。
script: の中は JavaScript であり、YAMLの ${{ ... }} は展開されません（または意図通りに展開されません）。
そのため、inputs 変数は script 内の JavaScript で未定義となり、ReferenceError になります。
正しい書き方：

actions/github-script の script: でワークフローの inputs を使いたい場合は、with: で input を environment 変数や script の引数として渡し、JavaScript で process.env から取得するか、github-script の input 機能を使う必要があります。
例（修正版）：

このように、inputs の値を env で渡し、script 内では process.env で参照してください。

まとめ：

actions/github-script の script 内で ${{ inputs.xxx }} を直接使うと ReferenceError になる
env: で値を渡し、process.env で参照するのが正しい
修正が必要です。修正版のワークフローが必要な場合はお知らせください。
```

- test green
- closeとする

{% endraw %}
```

### dist/browser-runtime.js
```js
{% raw %}
// Initialize abcjs rendering for all ABC notation blocks
// Supports Quartz v4 SPA navigation by listening for "nav" events
// Note: Uses regular function wrapper (not async IIFE) to avoid blocking page load.
// The async initializeMusicNotation() function is called with error handling.
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
  // WeakSet automatically removes references when elements are garbage collected,
  // which is perfect for SPA navigation where DOM elements are dynamically created/destroyed
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

  // ===== nav デバッグ可視化 =====

  function logNavDebug(where) {
    return function (e) {
      const abcNodes = document.querySelectorAll('.abc-notation')
      const processed = document.querySelectorAll('[data-mmlabc-processed]')

      console.groupCollapsed('[nav @ ' + where + ']')

      console.log('event:', e)
      console.log('detail:', e && e.detail)
      console.log('target:', e.target)
      console.log('currentTarget:', e.currentTarget)

      console.log('abc-notation count:', abcNodes.length)
      console.log('processed count:', processed.length)

      if (abcNodes.length > 0) {
        const el = abcNodes[0]
        console.log('sample abc element:', el)
        console.log(
          'sample processed?',
          el.hasAttribute('data-mmlabc-processed')
        )
      }

      console.groupEnd()
    }
  }

  // capture → bubble → window
  document.addEventListener('nav', logNavDebug('document-capture'), true)
  document.addEventListener('nav', logNavDebug('document'))
  window.addEventListener('nav', logNavDebug('window'))

  // ===== 以上、nav デバッグ可視化 =====
  
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
                // abcjs CreateSynth's start() may return a promise that resolves when complete
                const playbackPromise = currentSynth.start();
                
                // If start() returns a promise, use it to detect completion
                if (playbackPromise && typeof playbackPromise.then === 'function') {
                  playbackPromise.then(function() {
                    // Playback completed successfully
                    cleanup();
                  }).catch(function(error) {
                    // Playback error or stopped
                    console.error('Playback ended or error:', error);
                    cleanup();
                  });
                } else {
                  // If start() doesn't return a promise, we have no way to detect completion
                  // This is actually fine - the user can stop playback by clicking again
                  // The cleanup will happen when they click to play something else or stop
                  console.debug('Playback started (no completion detection available)');
                }
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

  // Flag to prevent duplicate initialization from multiple event sources
  let isInitializing = false;
  
  // Flag to track if initial load has completed
  let initialLoadComplete = false;
  
  // Wrapper function to handle navigation with debouncing
  const handleNavigation = (source) => {
    console.log('[MML-ABC-Transformer] ナビゲーションを検知しました。ソース:', source);
    
    // Prevent concurrent initializations
    if (isInitializing) {
      console.log('[MML-ABC-Transformer] 初期化が既に実行中のためスキップします');
      return;
    }
    
    isInitializing = true;
    
    // SPA navigation in Quartz replaces existing DOM elements with new instances.
    // Using a WeakSet to track processed elements means that old elements can be
    // garbage collected when removed from the DOM, and newly created elements
    // (even for the same page) have different object references that are not yet
    // in the WeakSet, so they will be initialized again as expected.
    // Because of this behavior, no manual clearing of the WeakSet is required
    // between navigations.
    
    // Call async initialization and handle any errors
    initializeMusicNotation()
      .catch(err => {
        console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
      })
      .finally(() => {
        isInitializing = false;
      });
  };

  // Listen for Quartz SPA navigation events
  // CRITICAL FIX FOR ISSUE #71:
  // Changed from window.addEventListener to document.addEventListener
  // According to Quartz documentation and issue analysis, nav events are dispatched on document
  // This ensures we catch navigation reliably, including self-navigation
  console.log('[MML-ABC-Transformer] イベントリスナーを登録します');
  
  // Primary: Quartz v4 "nav" event on document (not window)
  document.addEventListener('nav', () => {
    // CRITICAL FIX FOR ISSUE #71:
    // Use setTimeout(0) to defer rendering until after Quartz completes its DOM operations.
    // Quartz dispatches 'nav' synchronously during its DOM replacement process.
    // By deferring to the next event loop tick, we ensure all synchronous DOM updates
    // are complete before we query and process .abc-notation elements.
    // This is sufficient because Quartz's nav event is synchronous and completes
    // all DOM manipulations in the same call stack.
    setTimeout(() => {
      handleNavigation('nav event');
    }, 0);
  });
  console.log('[MML-ABC-Transformer] "nav" イベントリスナーを登録しました (document)');
  
  // Fallback: popstate event for browser back/forward
  // Note: In some browsers, popstate fires on initial page load. We delay registration
  // to avoid redundant initialization with the initial load call.
  setTimeout(() => {
    window.addEventListener('popstate', () => {
      if (initialLoadComplete) {
        handleNavigation('popstate event');
      }
    });
    console.log('[MML-ABC-Transformer] "popstate" イベントリスナーを登録しました（遅延登録）');
  }, 100);
  
  // MutationObserver for popup/popover support (Issue #81)
  // Quartz's "Recent Notes" popovers add .abc-notation elements to the DOM without
  // firing a 'nav' event. This observer detects such new unprocessed elements and
  // calls initializeMusicNotation() directly (not through handleNavigation) so that
  // nav-triggered init is never blocked. processedElements WeakSet ensures each
  // element is rendered at most once even when both MO and nav init run concurrently.
  //
  // Two safeguards prevent redundant work:
  // 1. popupInitPending: deduplicates multiple DOM mutations in the same tick
  //    (e.g. a popover that inserts several nodes at once).
  // 2. The observer is disconnected while initializeMusicNotation() runs to avoid
  //    ABCJS.renderAbc's own SVG/DOM writes triggering the callback again.
  let popupInitPending = false;
  const popupObserver = new MutationObserver(function(mutations) {
    if (popupInitPending) return;
    let hasNew = false;
    for (const mutation of mutations) {
      if (hasNew) break;
      for (const node of mutation.addedNodes) {
        if (hasNew) break;
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList.contains('abc-notation') && !processedElements.has(node)) {
          hasNew = true;
        } else {
          const nested = node.querySelectorAll('.abc-notation');
          for (const el of nested) {
            if (!processedElements.has(el)) {
              hasNew = true;
              break;
            }
          }
        }
      }
    }
    if (hasNew) {
      popupInitPending = true;
      console.log('[MML-ABC-Transformer] 新しい楽譜要素を検知しました。処理を開始します');
      setTimeout(function() {
        popupObserver.disconnect();
        initializeMusicNotation()
          .catch(function(err) {
            console.error('[MML-ABC-Transformer] Error initializing notation (popup):', err);
          })
          .finally(function() {
            popupInitPending = false;
            popupObserver.observe(document.body, { childList: true, subtree: true });
          });
      }, 0);
    }
  });
  popupObserver.observe(document.body, { childList: true, subtree: true });

  // Initial render on page load
  console.log('[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します');
  initializeMusicNotation()
    .catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation on page load:', err);
    })
    .finally(() => {
      initialLoadComplete = true;
      
      // NOTE ON MutationObserver HISTORY (ISSUE #71 FIX):
      // A general-purpose MutationObserver was previously removed because it fired
      // BEFORE the nav event during SPA transitions, rendering on unstable DOM.
      // The nav event remains the primary trigger for SPA re-rendering.
      // A targeted popupObserver (above) was added for Issue #81 to handle Quartz
      // popovers that insert .abc-notation elements without firing a nav event.
      
      console.log('[MML-ABC-Transformer] 初期化完了。nav イベントによる SPA ナビゲーション検知の準備ができました');
      
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
          
          // Note: We keep sharedAudioContext, mml2abcModule, and chord2mmlLoadPromise
          // cached across navigations for performance
        });
      }
    });
})();

{% endraw %}
```

### src/browser-runtime.js
```js
{% raw %}
// Initialize abcjs rendering for all ABC notation blocks
// Supports Quartz v4 SPA navigation by listening for "nav" events
// Note: Uses regular function wrapper (not async IIFE) to avoid blocking page load.
// The async initializeMusicNotation() function is called with error handling.
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
  // WeakSet automatically removes references when elements are garbage collected,
  // which is perfect for SPA navigation where DOM elements are dynamically created/destroyed
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

  // ===== nav デバッグ可視化 =====

  function logNavDebug(where) {
    return function (e) {
      const abcNodes = document.querySelectorAll('.abc-notation')
      const processed = document.querySelectorAll('[data-mmlabc-processed]')

      console.groupCollapsed('[nav @ ' + where + ']')

      console.log('event:', e)
      console.log('detail:', e && e.detail)
      console.log('target:', e.target)
      console.log('currentTarget:', e.currentTarget)

      console.log('abc-notation count:', abcNodes.length)
      console.log('processed count:', processed.length)

      if (abcNodes.length > 0) {
        const el = abcNodes[0]
        console.log('sample abc element:', el)
        console.log(
          'sample processed?',
          el.hasAttribute('data-mmlabc-processed')
        )
      }

      console.groupEnd()
    }
  }

  // capture → bubble → window
  document.addEventListener('nav', logNavDebug('document-capture'), true)
  document.addEventListener('nav', logNavDebug('document'))
  window.addEventListener('nav', logNavDebug('window'))

  // ===== 以上、nav デバッグ可視化 =====
  
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
                // abcjs CreateSynth's start() may return a promise that resolves when complete
                const playbackPromise = currentSynth.start();
                
                // If start() returns a promise, use it to detect completion
                if (playbackPromise && typeof playbackPromise.then === 'function') {
                  playbackPromise.then(function() {
                    // Playback completed successfully
                    cleanup();
                  }).catch(function(error) {
                    // Playback error or stopped
                    console.error('Playback ended or error:', error);
                    cleanup();
                  });
                } else {
                  // If start() doesn't return a promise, we have no way to detect completion
                  // This is actually fine - the user can stop playback by clicking again
                  // The cleanup will happen when they click to play something else or stop
                  console.debug('Playback started (no completion detection available)');
                }
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

  // Flag to prevent duplicate initialization from multiple event sources
  let isInitializing = false;
  
  // Flag to track if initial load has completed
  let initialLoadComplete = false;
  
  // Wrapper function to handle navigation with debouncing
  const handleNavigation = (source) => {
    console.log('[MML-ABC-Transformer] ナビゲーションを検知しました。ソース:', source);
    
    // Prevent concurrent initializations
    if (isInitializing) {
      console.log('[MML-ABC-Transformer] 初期化が既に実行中のためスキップします');
      return;
    }
    
    isInitializing = true;
    
    // SPA navigation in Quartz replaces existing DOM elements with new instances.
    // Using a WeakSet to track processed elements means that old elements can be
    // garbage collected when removed from the DOM, and newly created elements
    // (even for the same page) have different object references that are not yet
    // in the WeakSet, so they will be initialized again as expected.
    // Because of this behavior, no manual clearing of the WeakSet is required
    // between navigations.
    
    // Call async initialization and handle any errors
    initializeMusicNotation()
      .catch(err => {
        console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
      })
      .finally(() => {
        isInitializing = false;
      });
  };

  // Listen for Quartz SPA navigation events
  // CRITICAL FIX FOR ISSUE #71:
  // Changed from window.addEventListener to document.addEventListener
  // According to Quartz documentation and issue analysis, nav events are dispatched on document
  // This ensures we catch navigation reliably, including self-navigation
  console.log('[MML-ABC-Transformer] イベントリスナーを登録します');
  
  // Primary: Quartz v4 "nav" event on document (not window)
  document.addEventListener('nav', () => {
    // CRITICAL FIX FOR ISSUE #71:
    // Use setTimeout(0) to defer rendering until after Quartz completes its DOM operations.
    // Quartz dispatches 'nav' synchronously during its DOM replacement process.
    // By deferring to the next event loop tick, we ensure all synchronous DOM updates
    // are complete before we query and process .abc-notation elements.
    // This is sufficient because Quartz's nav event is synchronous and completes
    // all DOM manipulations in the same call stack.
    setTimeout(() => {
      handleNavigation('nav event');
    }, 0);
  });
  console.log('[MML-ABC-Transformer] "nav" イベントリスナーを登録しました (document)');
  
  // Fallback: popstate event for browser back/forward
  // Note: In some browsers, popstate fires on initial page load. We delay registration
  // to avoid redundant initialization with the initial load call.
  setTimeout(() => {
    window.addEventListener('popstate', () => {
      if (initialLoadComplete) {
        handleNavigation('popstate event');
      }
    });
    console.log('[MML-ABC-Transformer] "popstate" イベントリスナーを登録しました（遅延登録）');
  }, 100);
  
  // MutationObserver for popup/popover support (Issue #81)
  // Quartz's "Recent Notes" popovers add .abc-notation elements to the DOM without
  // firing a 'nav' event. This observer detects such new unprocessed elements and
  // calls initializeMusicNotation() directly (not through handleNavigation) so that
  // nav-triggered init is never blocked. processedElements WeakSet ensures each
  // element is rendered at most once even when both MO and nav init run concurrently.
  //
  // Two safeguards prevent redundant work:
  // 1. popupInitPending: deduplicates multiple DOM mutations in the same tick
  //    (e.g. a popover that inserts several nodes at once).
  // 2. The observer is disconnected while initializeMusicNotation() runs to avoid
  //    ABCJS.renderAbc's own SVG/DOM writes triggering the callback again.
  let popupInitPending = false;
  const popupObserver = new MutationObserver(function(mutations) {
    if (popupInitPending) return;
    let hasNew = false;
    for (const mutation of mutations) {
      if (hasNew) break;
      for (const node of mutation.addedNodes) {
        if (hasNew) break;
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList.contains('abc-notation') && !processedElements.has(node)) {
          hasNew = true;
        } else {
          const nested = node.querySelectorAll('.abc-notation');
          for (const el of nested) {
            if (!processedElements.has(el)) {
              hasNew = true;
              break;
            }
          }
        }
      }
    }
    if (hasNew) {
      popupInitPending = true;
      console.log('[MML-ABC-Transformer] 新しい楽譜要素を検知しました。処理を開始します');
      setTimeout(function() {
        popupObserver.disconnect();
        initializeMusicNotation()
          .catch(function(err) {
            console.error('[MML-ABC-Transformer] Error initializing notation (popup):', err);
          })
          .finally(function() {
            popupInitPending = false;
            popupObserver.observe(document.body, { childList: true, subtree: true });
          });
      }, 0);
    }
  });
  popupObserver.observe(document.body, { childList: true, subtree: true });

  // Initial render on page load
  console.log('[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します');
  initializeMusicNotation()
    .catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation on page load:', err);
    })
    .finally(() => {
      initialLoadComplete = true;
      
      // NOTE ON MutationObserver HISTORY (ISSUE #71 FIX):
      // A general-purpose MutationObserver was previously removed because it fired
      // BEFORE the nav event during SPA transitions, rendering on unstable DOM.
      // The nav event remains the primary trigger for SPA re-rendering.
      // A targeted popupObserver (above) was added for Issue #81 to handle Quartz
      // popovers that insert .abc-notation elements without firing a nav event.
      
      console.log('[MML-ABC-Transformer] 初期化完了。nav イベントによる SPA ナビゲーション検知の準備ができました');
      
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
          
          // Note: We keep sharedAudioContext, mml2abcModule, and chord2mmlLoadPromise
          // cached across navigations for performance
        });
      }
    });
})();

{% endraw %}
```

### issue-notes/31.md
```md
{% raw %}
# issue ドッグフーディングする #31
[issues #31](https://github.com/cat2151/quartz-transformer-mmlabc/issues/31)



{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
5985419 Merge pull request #82 from cat2151/copilot/fix-recent-notes-popup
041fcc7 fix: MutationObserver の重複実行防止とSVG書き込み対策を追加
9e6fe5c fix: ポップアップ表示時に五線譜が描画されない問題を修正 (Issue #81)
eadd033 Initial plan
34828b9 Update issue notes for #81 with debugging suggestions
0627f1f Add issue note for #81 [auto]
bee9a9b Merge pull request #80 from cat2151/copilot/refactor-large-files-detection
91f2d77 fix: レビューコメントに基づきspa-navigation-runtime.jsのインデントとコメントを修正
aafc7da refactor: 大きなファイルを500行以下に分割
2d7d42a chore: start refactoring large files

### 変更されたファイル:
.github/workflows/call-check-large-files.yml
dist/browser-runtime.js
generated-docs/development-status-generated-prompt.md
generated-docs/development-status.md
generated-docs/project-overview-generated-prompt.md
generated-docs/project-overview.md
issue-notes/19.md
issue-notes/21.md
issue-notes/22.md
issue-notes/24.md
issue-notes/26.md
issue-notes/32.md
issue-notes/33.md
issue-notes/34.md
issue-notes/38.md
issue-notes/40.md
issue-notes/42.md
issue-notes/44.md
issue-notes/46.md
issue-notes/47.md
issue-notes/50.md
issue-notes/51.md
issue-notes/53.md
issue-notes/55.md
issue-notes/58.md
issue-notes/59.md
issue-notes/61.md
issue-notes/63.md
issue-notes/65.md
issue-notes/67.md
issue-notes/69.md
issue-notes/72.md
issue-notes/75.md
issue-notes/77.md
issue-notes/81.md
package-lock.json
src/ast-abc-multiple.test.ts
src/ast-mml-chord.test.ts
src/browser-runtime.js
src/index.test.ts
test/spa-navigation-runtime.js
test/spa-navigation-test.html


---
Generated at: 2026-03-07 07:03:06 JST
