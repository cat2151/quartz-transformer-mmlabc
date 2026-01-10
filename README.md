# quartz-transformer-mmlabc

**A Quartz transformer plugin that allows you to display sheet music and enable click-to-play functionality by simply writing chord progressions in code blocks. MML (Music Macro Language) and ABC Notation are also supported.**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※Portions of this document are AI-generated.

## Quick Links
| Item | Link |
|------|--------|
| 📊 Development Status | [generated-docs/development-status](generated-docs/development-status.md) |

## Current State
- Implementation is largely complete.
- Currently dogfooding.
- Breaking changes may occur.

## In 3 Lines
- In Obsidian, you can display and play sheet music by writing chord progressions in code blocks: https://github.com/cat2151/obsidian-plugin-mmlabc
- To achieve the same functionality in Quartz 4, a new transformer plugin has been created.
- Similar to the Obsidian version, MML (Music Macro Language) and ABC Notation are also available.

## Features

- 🎵 Converts `mml` code blocks to ABC Notation and renders them with abcjs.
- 🎸 Converts `chord` code blocks to MML, then to ABC Notation, and renders them with abcjs.
- 🎼 Supports `abc` notation code blocks for troubleshooting.
- 🎨 Displays sheet music as SVG.
- 🎧 Click-to-Play Music - Click on the rendered sheet music to play the music.
- ⌨️ Keyboard accessibility support (play with Enter or Space key).

## Installation

Execute the following in your Quartz installation directory:

```powershell
npm install github:cat2151/quartz-transformer-mmlabc; pushd node_modules/quartz-transformer-mmlabc; npm run build; popd
```

Reason for this step:
- The plugin is installed directly from GitHub (not from npm).
- The `dist` directory containing compiled JavaScript is not included in the repository.
- Skipping this step will cause an error when running Quartz, as the plugin's entry point (`dist/index.js`) will not exist.

Furthermore, add the following before `Build Quartz` in `.github\workflows\deploy.yml`:
```yml
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```
Reason for this step:
- When deploying with GitHub Actions, without this, the plugin's entry point (`dist/index.js`) will not exist, causing an error during `Build Quartz`.

### How to Update the Plugin (2 Options)

**IMPORTANT**: This plugin is currently Work In Progress and may undergo frequent breaking changes (non-stable). You have two options for updating the plugin:

#### Option 1: Always Use the Latest Version on Deployment (Recommended for Development)

If you want to use the latest version of the plugin with every deployment, add the following steps to `.github/workflows/deploy.yml`:

```yml
      - name: Install Dependencies
        run: npm ci
      - name: Update quartz-transformer-mmlabc to latest
        run: npm update quartz-transformer-mmlabc
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```

**Pros**:
- Always applies the latest features and bug fixes.
- Critical bug fixes are reflected immediately.

**Cons**:
- Breaking changes may be applied immediately.
- Build time is slightly increased.

#### Option 2: Rely on Dependabot for Weekly Updates

If Dependabot is configured, it will automatically create weekly PRs for plugin updates. With this method, you can review the updates before merging.

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
- You can review updates before merging.
- Allows for operation with a stable version.

**Cons**:
- Plugin updates may be delayed by up to one week.
- Critical bug fixes may also require waiting up to one week.

## Usage

### Using in Quartz Configuration

Add the transformer to `quartz.config.ts`:

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

const config: QuartzConfig = {
  configuration: {
    // ... Site configuration
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      // Add MMLABC Transformer
      MMLABCTransformer(),
      // ... Other transformers
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // ... Other emitters
    ],
  },
}

export default config
```

**Key Points:**
- Import `QuartzConfig` and built-in plugins from Quartz's internal paths.
- Import this plugin by its npm package name.
- Add it to the `transformers` array along with other transformers.
- The order usually doesn't matter unless there are dependencies between plugins.

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

This is useful for troubleshooting or when you want to write ABC Notation directly.

## Options

The plugin accepts optional settings:

```typescript
MMLABCTransformer({
  enableMML: true,    // Enable MML block conversion (default: true)
  enableChord: true,  // Enable chord progression block conversion (default: true)
  enableABC: true,    // Enable ABC block conversion (default: true)
})
```

## How It Works

1. During Quartz's build process, the plugin detects code blocks with `mml`, `chord`, or `abc` language tags.
2. These code blocks are replaced with HTML div elements containing the source notation as a data attribute.
3. In the browser:
   - Loads abcjs and mml2abc from CDN.
   - For MML blocks: Converts MML to ABC Notation using mml2abc.
   - For chord progression blocks: Converts chord progressions to MML using chord2mml, then to ABC Notation.
   - For ABC blocks: Uses the notation directly without conversion.
   - Renders ABC Notation as an interactive SVG using abcjs.
   - Initializes an audio synthesizer to support music playback.
   - Adds click event handlers to allow playing music by clicking on the sheet music.

### Quartz v4 SPA Navigation Support

This plugin fully supports Quartz v4's SPA (Single Page Application) navigation:

- **Automatic Reinitialization**: Listens for Quartz's `nav` event and automatically renders sheet music on page transitions.
- **Memory Leak Prevention**: Uses `window.addCleanup()` for proper cleanup during navigation.
- **Idempotency**: Uses `WeakSet` to track elements and avoid processing the same element multiple times.
- **Performance Optimization**: Caches CDN modules (mml2abc, chord2mml) and AudioContext across navigations.

This ensures reliable rendering not only on initial access but also when navigating to pages containing sheet music from other pages (Fix for Issue #63).

## Notes

- Conversion to HTML occurs during Quartz's build process.
- Actual sheet music conversion and rendering occur in the browser.
- CDN library versions are specified based on verified operation with easychord2mml by @cat2151.
- Conversion from MML to ABC uses mml2abc loaded from CDN.
- Conversion from chord progression to MML uses chord2mml loaded from CDN.
- Rendering uses abcjs (latest version 6.x.x) loaded from CDN.
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
- Unit tests for AST transformation logic (Vitest).
- HTML escaping tests (newlines, tabs, special characters).
- Plugin options and configuration tests.
- Edge case handling.
- External resource validation.
- Integration tests for browser rendering and interactive features (Playwright).

For manual testing, use the included `demo.html` file.

**Note**: When a Coding Agent runs tests on a Linux Runner, CDN access may be blocked, preventing the display of sheet music. If you wish to verify the sheet music display, please test on a physical machine (local environment).

## Dependencies

### Runtime (Loaded via CDN)

**IMPORTANT**: The following library versions are specified based on verified operation with [easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html) by @cat2151. Do not change these URLs.

- [abcjs](https://github.com/paulrosen/abcjs) - A JavaScript library for rendering ABC music notation.
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - Specifying `@6` ensures the latest version 6.x.x is always retrieved.
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC Notation.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - Loaded via dynamic ES module import.
- [chord2mml](https://github.com/cat2151/chord2mml) - Converts chord progression notation to MML.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - Loaded in UMD bundle format.
  - Ensures security using SRI (Subresource Integrity) checksum.
  - Checksum: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - *Checksum re-verification is required when the library is updated.

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

## Reasons for Adopting an External Package Approach

This plugin adopts a distribution method as an external npm package, rather than being integrated directly into Quartz itself. This design decision is based on the following reasons:

1.  **Reusability**
    -   The same plugin can be used across multiple Quartz projects.
    -   Eliminates the need to copy code into each project.

2.  **Independence**
    -   Allows for independent release cycles and version management for the plugin.
    -   Can be developed and updated without being affected by Quartz core updates.

3.  **Shareability**
    -   Easily shareable with the community via GitHub.
    -   Increases accessibility for a wider user base as an open-source project.

This approach maximizes the plugin's value and allows it to cater to a broader user base.

## License

MIT License - See the LICENSE file for details.

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - A fast, battery-included static site generator.
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC music notation.
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter.
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord progression notation to MML converter.

Note: The English README.md is automatically generated from README.ja.md via Gemini translation using GitHub Actions.