# quartz-transformer-mmlabc

**A Quartz transformer plugin that allows you to display sheet music and enable click-to-play functionality by simply writing chord progressions in a code block. MML (Music Macro Language) and ABC Notation are also available.**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※Some parts of this document are AI-generated.

## Quick Links
| Item | Link |
|------|--------|
| 📊 Development Status | [generated-docs/development-status](generated-docs/development-status.md) |

## Status
- Most features have been implemented.
- Currently dogfooding.
- Breaking changes may occur.
- demo: https://cat2151.github.io/digital-garden/Quartz-%E3%82%B3%E3%83%BC%E3%83%89%E9%80%B2%E8%A1%8C%E3%82%92%E4%BA%94%E7%B7%9A%E8%AD%9C%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%97%E3%81%A6%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A7%E6%BC%94%E5%A5%8F%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%97%E3%81%9F

## In 3 Lines
- In Obsidian, you can write chord progressions in a code block to display sheet music and play them: https://github.com/cat2151/obsidian-plugin-mmlabc
- To achieve the same functionality in Quartz4, a new transformer plugin was created.
- Similar to the Obsidian version, MML (Music Macro Language) and ABC Notation are also available.

## Features

- 🎵 Converts `mml` code blocks to ABC Notation and renders them with abcjs.
- 🎸 Converts `chord` code blocks to MML, then to ABC Notation, and renders them with abcjs.
- 🎼 Supports `abc` notation code blocks for troubleshooting.
- 🎨 Displays sheet music as SVG.
- 🎧 Click to Play Music - Clicking the rendered sheet music plays the music.
- ⌨️ Keyboard Accessibility (Play with Enter or Space key).

## Installation

Please run the following in your Quartz installation directory:

```powershell
npm install github:cat2151/quartz-transformer-mmlabc
```

The plugin is installed directly from GitHub (not from npm). Pre-built files (the `dist` directory) are included in the repository, so you can use it immediately after installation.

### Migration Guide for Existing Users

**Important**: Starting from this version, the `dist` folder is included in the repository, eliminating the need for manual builds.

#### Updating GitHub Actions Workflow

If you are already building the plugin in GitHub Actions, **remove the build step**.

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

**Changes**: Remove the `Build quartz-transformer-mmlabc` step. This step is no longer needed because pre-built files are included in the repository.

### How to Update the Plugin (2 Options)

**Important**: This plugin is currently Work In Progress, and breaking changes may occur frequently (nonstable). There are two options for updating the plugin:

#### Option 1: Always Use the Latest Version on Deployment (Recommended for Development)

If you want to use the latest version of the plugin with each deployment, please add the following steps to `.github/workflows/deploy.yml`:

```yml
      - name: Install Dependencies
        run: npm ci
      - name: Update quartz-transformer-mmlabc to latest
        run: npm update quartz-transformer-mmlabc
```

**Pros**:
- Always benefits from the latest features and bug fixes.
- Critical bug fixes are applied immediately.

**Cons**:
- Breaking changes may be applied immediately.
- Build time will be slightly longer.

#### Option 2: Rely on Weekly Updates via Dependabot

If you have Dependabot configured, it will automatically create weekly PRs for plugin updates. With this method, you can review the updates before merging.

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
- Allows reviewing updates before merging.
- Enables operating with stable versions.

**Cons**:
- Plugin updates may be delayed by up to one week.
- Critical bug fixes may also require waiting up to one week.

## Usage

### Usage in Quartz Configuration

Add the transformer to `quartz.config.ts`:

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

const config: QuartzConfig = {
  configuration: {
    // ... site settings
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      // Add the MMLABC transformer
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

**Important points:**
- Import `QuartzConfig` and built-in plugins from Quartz's internal paths.
- This plugin is imported by its npm package name.
- Add to the `transformers` array along with other transformers.
- The order is usually not an issue unless there are dependencies between plugins.

### Usage in Markdown Files

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

Useful for troubleshooting or when you want to write ABC notation directly.

## Options

The plugin accepts optional settings:

```typescript
MMLABCTransformer({
  enableMML: true,    // Enable MML block conversion (default: true)
  enableChord: true,  // Enable chord progression block conversion (default: true)
  enableABC: true,    // Enable ABC block conversion (default: true)
})
```

## How it Works

1. The plugin detects code blocks with `mml`, `chord`, or `abc` language tags during the Quartz build process.
2. These code blocks are replaced with HTML div elements containing the source notation as a data attribute.
3. In the browser:
   - Loads abcjs and mml2abc from a CDN.
   - For MML blocks: Converts MML to ABC Notation using mml2abc.
   - For chord progression blocks: Converts chord progressions to MML using chord2mml, then to ABC Notation.
   - For ABC blocks: Uses the notation directly without conversion.
   - Renders ABC Notation as interactive SVG using abcjs.
   - Initializes an audio synthesizer to support music playback.
   - Adds a click event handler to allow playing music by clicking the sheet music.

### Quartz v4 SPA Navigation Support

This plugin is fully compatible with Quartz v4's SPA (Single Page Application) navigation:

- **Automatic Re-initialization**: Listens for Quartz's `nav` event and automatically renders sheet music on page transitions.
- **Memory Leak Prevention**: Uses `window.addCleanup()` for proper cleanup during navigation.
- **Idempotence**: Tracks elements with a `WeakSet` to avoid processing the same element multiple times.
- **Performance Optimization**: Caches CDN modules (mml2abc, chord2mml) and AudioContext between navigations.

This ensures that sheet music is rendered not only on initial access but also when navigating to a page containing music from other pages (fixes Issue #63).

## Notes

- Conversion to HTML occurs during Quartz's build process.
- The actual sheet music conversion and rendering happen in the browser.
- CDN library versions are specified based on verified operation with easychord2mml by @cat2151.
- MML to ABC conversion uses mml2abc loaded from a CDN.
- Chord progression to MML conversion uses chord2mml loaded from a CDN.
- Rendering uses abcjs (latest version 6.x.x) loaded from a CDN.
- To avoid bundling issues, libraries are loaded dynamically.

## Testing

The plugin includes a comprehensive automated test suite:

### Running Tests

```bash
# Run unit tests once
npm test

# Run integration tests (Playwright)
npm run test:integration

# Run all tests
npm run test:testall

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Coverage

The test suite includes:
- Unit tests for AST transformation logic (Vitest)
- HTML escaping tests (newlines, tabs, special characters)
- Tests for plugin options and configuration
- Handling of edge cases
- Validation of external resources
- Integration tests for browser rendering and interactive features (Playwright)

For manual testing, please use the included `demo.html` file.

**Note**: When a Coding Agent runs tests on a Linux Runner, CDN access may be blocked, preventing sheet music from being displayed. If you want to verify sheet music display, please test on a physical machine (local environment).

## Dependencies

### Runtime (Loaded via CDN)

**Important**: The following library versions are specified based on verified operation with [easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html) by @cat2151. Please do not change these URLs.

- [abcjs](https://github.com/paulrosen/abcjs) - A JavaScript library for rendering ABC music notation.
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - Specifying `@6` always fetches the latest version 6.x.x.
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC Notation.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - Loaded via dynamic ES module import.
- [chord2mml](https://github.com/cat2151/chord2mml) - Converts chord progression notation to MML.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - Loaded in UMD bundle format.
  - Ensures security using SRI (Subresource Integrity) checksum.
  - Checksum: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - ※Checksum re-validation is required when the library is updated.

### Build Time
- [unified](https://github.com/unifiedjs/unified) - Interface for parsing and transforming content.
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

## Reason for Adopting an External Package Approach

This plugin adopts a method of distribution as an external npm package, rather than being embedded within the Quartz core. This design decision is based on the following reasons:

1. **Reusability**
   - The same plugin can be used across multiple Quartz projects.
   - No need to copy code into each project.

2. **Independence**
   - The plugin can have its own release cycle and version management.
   - Development and updates can occur independently of Quartz core updates.

3. **Shareability**
   - Easily shareable with the community via GitHub.
   - Increases adoption by a wider user base as an open-source project.

This approach maximizes the plugin's value and caters to a broader user base.

## License

MIT License - See the LICENSE file for details.

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - A fast, battery-included static site generator.
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC music notation.
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter.
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord progression notation to MML converter.

※This English README.md is automatically generated from README.ja.md by GitHub Actions using Gemini's translation.