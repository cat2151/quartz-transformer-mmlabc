# quartz-transformer-mmlabc

**A Quartz transformer plugin that allows you to display sheet music and play it by clicking, just by writing chord progressions in a code block. MML (Music Macro Language) and ABC Notation are also available.**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※Parts of this document are AI-generated

## Quick Links
| Item | Link |
|------|--------|
| 📊 Development Status | [generated-docs/development-status](generated-docs/development-status.md) |

## Status
- Core features are implemented
- Currently dogfooding
- Subject to breaking changes
- Demo: https://cat2151.github.io/digital-garden/Quartz-%E3%82%B3%E3%83%BC%E3%83%89%E9%80%B2%E8%A1%8C%E3%82%92%E4%BA%94%E7%B7%9A%E8%AD%9C%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%97%E3%81%A6%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A7%E6%BC%94%E5%A5%8F%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%97%E3%81%9F

## In 3 Lines
- In Obsidian, you can display and play sheet music by writing chord progressions in a code block: https://github.com/cat2151/obsidian-plugin-mmlabc
- To achieve the same in Quartz 4, a new transformer plugin has been created
- Similar to the Obsidian version, MML (Music Macro Language) and ABC Notation are also supported

## Features

- 🎵 Converts `mml` code blocks to ABC Notation and renders them with abcjs
- 🎸 Converts `chord` code blocks to MML, then to ABC Notation, and renders them with abcjs
- 🎼 Supports `abc` notation code blocks for troubleshooting
- 🎨 Displays sheet music as SVG
- 🎧 Play music by clicking - Clicking the rendered sheet music will play the music
- ⌨️ Keyboard accessibility (Play with Enter or Space key)

## Installation

Run the following in your Quartz installation directory:

```powershell
npm install github:cat2151/quartz-transformer-mmlabc
```

The plugin is installed directly from GitHub (not from npm). Since pre-built files (the `dist` directory) are included in the repository, it can be used immediately after installation.

### Migration Guide for Existing Users

**Important**: Starting from this version, the `dist` folder is included in the repository, eliminating the need for manual builds.

#### Updating GitHub Actions Workflow

If you are already building the plugin with GitHub Actions, please **remove the build step**.

**Before:**
```yml
      - name: Install Dependencies
        run: npm ci
      - name: Update quartz-transformer-mmlabc to latest
        run: npm update quartz-transformer-mmlabc
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
      - name: Build Quartz
        run: npx quartz build
```

**After:**
```yml
      - name: Install Dependencies
        run: npm ci
      - name: Update quartz-transformer-mmlabc to latest
        run: npm update quartz-transformer-mmlabc
      - name: Build Quartz
        run: npx quartz build
```

**Change**: Remove the `Build quartz-transformer-mmlabc` step. This step is no longer necessary as pre-built files are included in the repository.

### How to Update the Plugin (2 Options)

**Important**: This plugin is currently Work In Progress and may undergo frequent breaking changes (nonstable). There are two options for updating the plugin:

#### Option 1: Always use the latest version during deployment (Recommended for development)

If you want to use the latest version of the plugin with each deployment, add the following steps to `.github/workflows/deploy.yml`:

```yml
      - name: Install Dependencies
        run: npm ci
      - name: Update quartz-transformer-mmlabc to latest
        run: npm update quartz-transformer-mmlabc
```

**Pros**:
- Always applies the latest features and bug fixes
- Critical bug fixes are reflected immediately

**Cons**:
- Breaking changes may be reflected immediately
- Build time might be slightly longer

#### Option 2: Rely on weekly updates via Dependabot

If Dependabot is configured, it will automatically create weekly PRs for plugin updates. With this method, you can review the changes before merging.

Example `.github/dependabot.yml`:
```yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

**Pros**:
- You can review changes before merging
- You can operate with a stable version

**Cons**:
- Plugin updates may be delayed by up to one week
- Critical bug fixes may also require waiting up to one week

## Usage

### Using in Quartz Configuration

Add the transformer to `quartz.config.ts`:

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

const config: QuartzConfig = {
  configuration: {
    // ... site configuration
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      // Add MMLABC transformer
      MMLABCTransformer(),
      // ... other transformers
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // ... other emitters
    ],
  },
}

export default config
```

**Key Points:**
- Import `QuartzConfig` and built-in plugins from Quartz's internal paths
- Import this plugin by its npm package name
- Add it to the `transformers` array along with other transformers
- The order typically doesn't matter unless there are inter-plugin dependencies

### Using in Markdown Files

#### MML Notation

````markdown
```mml
t120 l4 cdefgab<c
```
````

#### Chord Progression Notation

````markdown
```chord
C Dm7 G7 C
```
````

#### ABC Notation (Direct Specification)

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

Useful for troubleshooting or when you want to write ABC Notation directly.

## Options

The plugin accepts optional settings:

```typescript
MMLABCTransformer({
  enableMML: true,    // Enable MML block transformation (default: true)
  enableChord: true,  // Enable chord progression block transformation (default: true)
  enableABC: true,    // Enable ABC block transformation (default: true)
})
```

## How It Works

1. During Quartz's build process, the plugin detects code blocks with `mml`, `chord`, or `abc` language tags.
2. These code blocks are replaced with HTML div elements containing the source notation as a data attribute.
3. In the browser:
   - Loads abcjs and mml2abc from CDN.
   - For MML blocks: Uses mml2abc to convert MML to ABC Notation.
   - For chord progression blocks: Uses chord2mml to convert chord progressions to MML, then to ABC Notation.
   - For ABC blocks: Uses the notation directly without conversion.
   - Uses abcjs to render the ABC Notation as interactive SVG.
   - Initializes an audio synthesizer to support music playback.
   - Adds click event handlers to allow playing music by clicking the sheet music.

### Quartz v4 SPA Navigation Support

This plugin fully supports Quartz v4's SPA (Single Page Application) navigation:

- **Automatic Re-initialization**: Listens to Quartz's `nav` event and automatically renders sheet music on page transitions.
- **Memory Leak Prevention**: Uses `window.addCleanup()` for proper cleanup during navigation.
- **Idempotency**: Tracks elements with `WeakSet` to avoid processing the same element multiple times.
- **Performance Optimization**: Caches CDN modules (mml2abc, chord2mml) and AudioContext between navigations.

This ensures that sheet music is rendered reliably not only on initial access but also when navigating to a page containing sheet music from other pages (fixes Issue #63).

## Notes

- Conversion to HTML occurs during Quartz's build process.
- Actual sheet music conversion and rendering happen within the browser.
- CDN library versions are specified based on operational verification with easychord2mml by @cat2151.
- MML to ABC conversion uses mml2abc loaded from CDN.
- Chord progression to MML conversion uses chord2mml loaded from CDN.
- Rendering uses abcjs (latest version 6.x) loaded from CDN.
- Libraries are loaded dynamically to avoid bundling issues.

## Testing

The plugin includes a comprehensive automated test suite:

### Running Tests

```bash
# Run unit tests once
npm test

# Run integration tests (Playwright)
npm run test:integration

# Run all tests
npm run test:all

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Coverage

The test suite includes:
- Unit tests for AST transformation logic (Vitest)
- Tests for HTML escaping (newlines, tabs, special characters)
- Tests for plugin options and configuration
- Edge case handling
- External resource validation
- Integration tests for browser rendering and interactive features (Playwright)

For manual testing, use the included `demo.html` file.

**Note**: When a Coding Agent runs tests on a Linux Runner, CDN access may be blocked, preventing the display of sheet music. To verify sheet music display, please test on a physical machine (local environment).

## Dependencies

### Runtime (Loaded via CDN)

**Important**: The following library versions are specified based on operational verification with [easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html) by @cat2151. Do not change these URLs.

- [abcjs](https://github.com/paulrosen/abcjs) - A JavaScript library for rendering ABC music notation.
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - By specifying `@6`, the latest version of the 6.x.x series is always retrieved.
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC Notation.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - Loaded with dynamic ES module import.
- [chord2mml](https://github.com/cat2151/chord2mml) - Converts chord progression notation to MML.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - Loaded in UMD bundle format.
  - Ensures security using SRI (Subresource Integrity) checksum.
  - Checksum: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - ※Checksum re-verification is required when updating the library.

### Build-time
- [unified](https://github.com/unifiedjs/unified) - An interface for parsing and transforming content.
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - Utility for traversing syntax trees.

## Development

### Build

```bash
npm run build
```

### Project Structure

```
quartz-transformer-mmlabc/
├── src/
│   ├── index.ts          # Main plugin implementation
│   └── index.test.ts     # Unit tests
├── test/
│   └── integration.test.ts # Integration tests
├── dist/                 # Compiled output (generated)
│   ├── index.js
│   └── index.d.ts
├── demo.html             # Demo file for manual testing
├── package.json
├── tsconfig.json
├── vitest.config.ts      # Vitest test configuration
├── playwright.config.ts  # Playwright test configuration
└── README.md
```

## Reasons for Adopting an External Package Approach

This plugin is distributed as an external npm package rather than being built into the Quartz core. The design decision was made for the following reasons:

1.  **Reusability**
    -   The same plugin can be used across multiple Quartz projects.
    -   Eliminates the need to copy code into each project.

2.  **Independence**
    -   Allows for its own release cycle and version management.
    -   Can be developed and updated independently of Quartz core updates.

3.  **Shareability**
    -   Easily shareable with the community via GitHub.
    -   Increases accessibility for a wider user base as an open-source project.

This approach maximizes the plugin's value and caters to a broader user base.

## License

MIT License - See LICENSE file for details

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - A fast, batteries-included static site generator.
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC music notation.
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter.
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord progression notation to MML converter.

※The English README.md is automatically generated by GitHub Actions using Gemini's translation based on README.ja.md.