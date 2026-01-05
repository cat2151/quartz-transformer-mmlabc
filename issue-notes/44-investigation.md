# Quartz 4の方法に従ったTypeScriptソースコード構成へのリファクタリング検討

## 概要

このドキュメントは、issue #44「Quartz4の方法に従ったTypeScriptソースコード構成にリファクタリングする方法の検討」のための調査結果をまとめたものです。

## Quartz 4のTransformer Plugin推奨構造

### 公式の推奨ディレクトリ構造

Quartz 4では、transformerプラグインは以下のディレクトリ構造に配置することが推奨されています：

```
quartz/
  plugins/
    transformers/
      frontmatter.ts
      lastmod.ts
      syntax.ts
      toc.ts
      description.ts
      ofm.ts
      ...your-transformer.ts  ← カスタムtransformerはここに配置
```

この構造は、Quartz本体プロジェクトの内部でtransformerプラグインを開発する場合の標準的な配置です。

### Transformer Pluginのインターフェース

Quartz 4のtransformerプラグインは以下のTypeScriptインターフェースに従います：

```typescript
export type QuartzTransformerPluginInstance = {
  name: string;
  textTransform?: (ctx: BuildCtx, src: string) => string;
  markdownPlugins?: (ctx: BuildCtx) => PluggableList;
  htmlPlugins?: (ctx: BuildCtx) => PluggableList;
  externalResources?: (ctx: BuildCtx) => Partial<StaticResources>;
}
```

プラグインは、オプションを受け取り、上記のインスタンスを返す関数として実装されます：

```typescript
export default function myTransformer(opts?: Options): QuartzTransformerPluginInstance {
  return {
    name: "MyTransformer",
    markdownPlugins: () => [/* remark plugins */],
    // ...
  }
}
```

## 現在のプロジェクト構造

### 現在の構造

`quartz-transformer-mmlabc`は外部npmパッケージとして設計されており、以下の構造を持っています：

```
quartz-transformer-mmlabc/
├── src/
│   ├── index.ts          # メインプラグイン実装（約410行）
│   └── index.test.ts     # ユニットテスト（約800行）
├── test/
│   └── integration.test.ts # インテグレーションテスト
├── dist/                 # ビルド出力（gitignore）
│   ├── index.js
│   └── index.d.ts
├── package.json          # npmパッケージ設定
│   main: "dist/index.js"
│   types: "dist/index.d.ts"
├── tsconfig.json
└── README.md
```

### 現在のインストール方法

ユーザーは以下のコマンドでQuartzプロジェクトにインストールします：

```bash
npm install github:cat2151/quartz-transformer-mmlabc
pushd node_modules/quartz-transformer-mmlabc
npm run build
popd
```

### 現在の使用方法

`quartz.config.ts`で以下のようにインポートして使用します：

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { MMLABCTransformer } from "quartz-transformer-mmlabc"  // 外部パッケージからインポート

const config: QuartzConfig = {
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      MMLABCTransformer(),  // 外部プラグインとして使用
      // ...
    ],
  },
}
```

## Quartz 4の推奨方法との比較

### 内部プラグイン vs 外部プラグイン

| 観点 | 内部プラグイン（Quartz推奨） | 外部プラグイン（現在の構造） |
|------|---------------------------|---------------------------|
| **配置場所** | `quartz/plugins/transformers/mmlabc.ts` | `node_modules/quartz-transformer-mmlabc/` |
| **インポート方法** | `import * as Plugin from "./quartz/plugins"`<br>`Plugin.MMLABC()` | `import { MMLABCTransformer } from "quartz-transformer-mmlabc"` |
| **ビルド** | Quartzのビルドプロセスに統合 | 独立したビルドプロセスが必要 |
| **依存関係** | Quartzと同じnode_modules | 独自のnode_modules（または共有） |
| **バージョン管理** | Quartzリポジトリと一体 | 独立したリポジトリ |
| **再利用性** | 他のQuartzプロジェクトで再利用不可 | npmパッケージとして複数プロジェクトで再利用可能 |
| **開発の柔軟性** | Quartz本体の変更と密結合 | 独立して開発・リリース可能 |
| **メンテナンス** | Quartz本体と同時にメンテナンス | 独立してメンテナンス可能 |

## リファクタリングの選択肢

### オプション1：内部プラグインとして統合（Quartz公式推奨に準拠）

Quartzプロジェクト内に直接コードを配置する方法：

```
<Quartzプロジェクトルート>/
  quartz/
    plugins/
      transformers/
        mmlabc.ts  ← プラグインコードをここに配置
```

**実装方法：**
1. `src/index.ts`の内容を`quartz/plugins/transformers/mmlabc.ts`にコピー
2. エクスポート名を調整（`export const MMLABC: QuartzTransformerPlugin = ...`）
3. `quartz/plugins/index.ts`に追加：
   ```typescript
   export { MMLABC } from "./transformers/mmlabc"
   ```
4. `quartz.config.ts`で使用：
   ```typescript
   import * as Plugin from "./quartz/plugins"
   
   transformers: [
     Plugin.MMLABC(),
   ]
   ```

**メリット：**
- ✅ Quartz公式の推奨構造に完全準拠
- ✅ 統一されたビルドプロセス
- ✅ インストール手順が不要（Quartzと一体）
- ✅ 型定義の整合性が保証される

**デメリット：**
- ❌ 再利用性が低い（各Quartzプロジェクトにコピーが必要）
- ❌ 独立したバージョン管理ができない
- ❌ npmパッケージとしての配布ができない
- ❌ 複数のQuartzサイトで使用する場合、各サイトでコードをコピーする必要がある

### オプション2：外部プラグインとして維持（現在の構造）

現在の外部npmパッケージ構造を維持する方法：

**メリット：**
- ✅ 複数のQuartzプロジェクトで再利用可能
- ✅ 独立したバージョン管理・リリースサイクル
- ✅ GitHubから直接インストール可能
- ✅ オープンソースとしての共有が容易
- ✅ 既存のテストインフラストラクチャを維持

**デメリット：**
- ❌ Quartz公式の推奨ディレクトリ構造に従っていない
- ❌ ビルド手順が必要（`npm run build`）
- ❌ GitHub Actionsでの追加設定が必要

### オプション3：ハイブリッドアプローチ

両方の方法をサポートする柔軟なアプローチ：

1. **外部パッケージとして配布**（主要用途）
   - 現在の構造を維持
   - `npm install github:cat2151/quartz-transformer-mmlabc`

2. **内部プラグイン化のためのドキュメント提供**
   - READMEに内部プラグイン化の手順を追加
   - ユーザーが選択できるようにする

**手順ドキュメント例：**

```markdown
## インストール方法

### 方法A：外部パッケージとして使用（推奨）

複数のQuartzサイトで使用する場合や、プラグインの更新を簡単に受け取りたい場合：

\`\`\`bash
npm install github:cat2151/quartz-transformer-mmlabc
pushd node_modules/quartz-transformer-mmlabc
npm run build
popd
\`\`\`

### 方法B：Quartz内部プラグインとして統合

単一のQuartzサイトで使用し、Quartz本体と一体でビルドしたい場合：

1. `src/index.ts`の内容を`quartz/plugins/transformers/mmlabc.ts`にコピー
2. `quartz/plugins/index.ts`に以下を追加：
   \`\`\`typescript
   export { MMLABCTransformer as MMLABC } from "./transformers/mmlabc"
   \`\`\`
3. `quartz.config.ts`で使用：
   \`\`\`typescript
   import * as Plugin from "./quartz/plugins"
   transformers: [Plugin.MMLABC()]
   \`\`\`
```

**メリット：**
- ✅ ユーザーが用途に応じて選択可能
- ✅ 外部パッケージの再利用性を維持
- ✅ Quartz公式推奨にも対応可能
- ✅ 既存ユーザーへの影響なし

**デメリット：**
- ❌ ドキュメントが複雑になる
- ❌ 2つの使用方法をサポートする必要がある

### オプション4：ファイル名の変更のみ

ディレクトリ構造は維持しつつ、ファイル名をQuartz 4の命名規則に合わせる：

```
quartz-transformer-mmlabc/
├── src/
│   ├── mmlabc.ts         # index.ts から改名
│   ├── mmlabc.test.ts    # index.test.ts から改名
│   └── index.ts          # エクスポート用バレルファイル（新規作成）
```

**index.ts（新規）:**
```typescript
export { MMLABCTransformer } from "./mmlabc"
```

**package.json:**
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

**メリット：**
- ✅ Quartzの命名規則（`mmlabc.ts`）に従う
- ✅ 外部パッケージとしての機能を維持
- ✅ 影響が最小限（エクスポートは同じ）
- ✅ 将来的に内部プラグイン化しやすい

**デメリット：**
- ❌ ディレクトリ構造自体は変わらない
- ❌ 既存のインポートパスに影響がある可能性（軽微）

## 推奨アプローチ

### 第一推奨：オプション3（ハイブリッドアプローチ）

**理由：**

1. **現状維持の価値**
   - 現在の外部パッケージ構造は、複数のQuartzサイトでの再利用性という大きな利点がある
   - オープンソースプロジェクトとして、多くのユーザーに使ってもらうには外部パッケージが適している

2. **Quartz推奨への対応**
   - ドキュメントで内部プラグイン化の手順を提供することで、Quartz公式の推奨構造を望むユーザーにも対応できる
   - 必要に応じてユーザーが選択できる柔軟性を提供

3. **実装コスト**
   - READMEの更新のみで対応可能
   - 既存コードへの変更が不要
   - 既存ユーザーへの影響がゼロ

4. **将来性**
   - 両方の使用方法をサポートすることで、より広いユーザーベースに対応できる
   - Quartzのアーキテクチャ変更にも柔軟に対応できる

### 第二推奨：オプション4（ファイル名の変更）

**理由：**

1. **命名規則の統一**
   - `mmlabc.ts`という名前は、Quartzの他のtransformerと統一感がある
   - 将来的に内部プラグイン化する場合の移行が容易

2. **影響の小ささ**
   - パブリックAPIは変わらない（`index.ts`経由でエクスポート）
   - 既存ユーザーへの影響が最小限

3. **実装コスト**
   - ファイル名の変更とバレルファイルの追加のみ
   - テストも同様に改名すれば完了

## 実装計画（第一推奨の場合）

### ステップ1：READMEの更新

`README.md`および`README.ja.md`に新しいセクションを追加：

```markdown
## インストール方法

### 方法A：外部パッケージとして使用（推奨）

このプラグインを複数のQuartzサイトで使用する場合や、プラグインの更新を簡単に受け取りたい場合は、この方法を使用してください。

[既存のインストール手順をここに記載]

### 方法B：Quartz内部プラグインとして統合

Quartz公式の推奨ディレクトリ構造に従い、単一のQuartzサイトでプラグインを使用する場合は、この方法を選択できます。

#### 手順：

1. このリポジトリの`src/index.ts`の内容を、Quartzプロジェクトの`quartz/plugins/transformers/mmlabc.ts`にコピーします。

2. `quartz/plugins/index.ts`を開き、以下の行を追加します：
   \`\`\`typescript
   export { MMLABCTransformer as MMLABC } from "./transformers/mmlabc"
   \`\`\`

3. `quartz.config.ts`で以下のようにインポートして使用します：
   \`\`\`typescript
   import { QuartzConfig } from "./quartz/cfg"
   import * as Plugin from "./quartz/plugins"
   
   const config: QuartzConfig = {
     plugins: {
       transformers: [
         Plugin.FrontMatter(),
         Plugin.MMLABC(),  // 内部プラグインとして使用
         // ...
       ],
     },
   }
   \`\`\`

#### メリット：
- Quartzのビルドプロセスに完全統合
- 別途ビルドステップが不要
- Quartz公式の推奨構造に準拠

#### 注意事項：
- この方法では、プラグインの更新を受け取るには手動でファイルを更新する必要があります
- 複数のQuartzサイトで使用する場合は、各サイトにコードをコピーする必要があります
```

### ステップ2：ドキュメントの追加

`issue-notes/`に本ドキュメント（44-investigation.md）を追加し、検討内容を記録します。

### ステップ3：生成ドキュメントの更新（オプション）

`generated-docs/development-status.md`に、このアーキテクチャ決定を記録します。

## 実装計画（第二推奨の場合）

### ステップ1：ファイルの改名

```bash
# ファイル名の変更
mv src/index.ts src/mmlabc.ts
mv src/index.test.ts src/mmlabc.test.ts
```

### ステップ2：バレルファイルの作成

`src/index.ts`を新規作成：

```typescript
export { MMLABCTransformer, type MMLABCOptions } from "./mmlabc"
```

### ステップ3：テストファイルのインポート更新

`src/mmlabc.test.ts`のインポートを更新：

```typescript
import { MMLABCTransformer } from "./mmlabc"  // "./index" から変更
```

### ステップ4：ビルドとテスト

```bash
npm run build
npm run test:all
```

### ステップ5：READMEの更新

プロジェクト構造のセクションを更新：

```markdown
### プロジェクト構造

\`\`\`
quartz-transformer-mmlabc/
├── src/
│   ├── mmlabc.ts         # メインプラグイン実装
│   ├── mmlabc.test.ts    # ユニットテスト
│   └── index.ts          # パブリックAPIエクスポート
...
\`\`\`
```

## 結論

このプロジェクトは**外部npmパッケージ**として設計されており、その設計判断には以下の明確な利点があります：

1. **再利用性** - 複数のQuartzプロジェクトで使用可能
2. **独立性** - 独自のリリースサイクルとバージョン管理
3. **共有性** - GitHubを通じてコミュニティと共有可能

Quartz 4の推奨ディレクトリ構造（`quartz/plugins/transformers/`）は、**Quartz本体のリポジトリ内でプラグインを開発する場合**の推奨であり、外部パッケージとして配布するプラグインには必ずしも適用されません。

**推奨実装：オプション3（ハイブリッドアプローチ）**

READMEに両方の使用方法を記載することで：
- 外部パッケージとしての再利用性を維持
- Quartz公式推奨に従いたいユーザーにも対応
- 最小限の実装コストで最大限の柔軟性を提供

これにより、プロジェクトの価値を最大化しつつ、さまざまなユーザーのニーズに対応できます。

## 参考資料

- [Quartz 4 - Making your own plugins](https://quartz.jzhao.xyz/advanced/making-plugins)
- [Quartz 4 Plugin Architecture](https://deepwiki.com/jackyzha0/quartz/2.3-plugin-architecture)
- [Quartz GitHub - transformers directory](https://github.com/jackyzha0/quartz/tree/v4/quartz/plugins/transformers)
- [TypeScript Project Organization](https://gist.github.com/coltenkrauter/870b2654520a5366b072e4c460686efa)
- [Best Practices for TypeScript Naming Conventions](https://www.webdevtutor.net/blog/typescript-naming-convention-file)
