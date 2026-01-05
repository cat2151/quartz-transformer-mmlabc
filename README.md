# quartz-transformer-mmlabc

**A Quartz transformer plugin that allows you to display sheet music and play it by clicking, simply by writing chord progressions and MML (Music Macro Language) in code blocks.**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※ This document is largely AI-generated. Issues were submitted to an agent for generation.

## Quick Links
| Item | Link |
|------|--------|
| 📊 Development Status | [generated-docs/development-status](generated-docs/development-status.md) |

## Status
- Implementation is largely complete.
- Currently dogfooding.
- May introduce breaking changes.

## Two-Line Summary
- In Obsidian, you can display and play sheet music by writing chord progressions in code blocks: https://github.com/cat2151/obsidian-plugin-mmlabc
- To achieve the same functionality in Quartz, a new transformer plugin has been created.

## Features

- 🎵 Converts `mml` code blocks to ABC notation and renders them with abcjs
- 🎸 Converts `chord` code blocks to MML, then to ABC notation, and renders them with abcjs
- 🎼 Supports `abc` notation code blocks for troubleshooting
- 🎨 Displays sheet music as SVG
- 🎧 Click to play music - You can play music by clicking on the rendered sheet music
- ⌨️ Keyboard accessibility (Play with Enter or Space key)

## Installation

Execute the following in your Quartz installation directory:

```powershell
npm install github:cat2151/quartz-transformer-mmlabc; pushd node_modules/quartz-transformer-mmlabc; npm run build; popd
```

Why this step is necessary:
- The plugin is installed directly from GitHub (not from npm)
- The `dist` directory containing compiled JavaScript is not included in the repository
- Skipping this step will cause an error when running Quartz because the plugin's entry point (`dist/index.js`) will not exist.

Additionally, before `Build Quartz` in `.github\workflows\deploy.yml`, add the following:
```yml
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```
Why this step is necessary:
- When deploying with GitHub Actions, without this, the plugin's entry point (`dist/index.js`) will not exist, causing an error during `Build Quartz`.

## Usage

### Using with Quartz Configuration

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
      // Add MMLABC Transformer
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
- Add to the `transformers` array along with other transformers
- Order is usually not an issue unless there are dependencies between plugins

### Using in Markdown Files

#### MML Notation

````markdown
```mml
t120 l4 cdefgab>c
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

1. The plugin detects code blocks with `mml`, `chord`, or `abc` language tags during the Quartz build process
2. These code blocks are replaced with HTML div elements containing the source notation as data attributes
3. In the browser:
   - Loads abcjs and mml2abc from CDN
   - For MML blocks: Converts MML to ABC notation using mml2abc
   - For chord progression blocks: Converts chord progressions to MML using chord2mml, then to ABC notation
   - For ABC blocks: Uses the notation directly without conversion
   - Renders ABC notation as interactive SVG using abcjs
   - Initializes an audio synthesizer to support music playback
   - Adds a click event handler to allow playing music by clicking on the sheet music

## Current State

### Implemented Features
- ✅ Detection and conversion of MML blocks
- ✅ Detection and conversion of chord progression blocks
- ✅ Detection and direct rendering of ABC blocks (useful for troubleshooting)
- ✅ Rendering of ABC notation using abcjs (displaying sheet music)
- ✅ Uses CDN dependencies with versions confirmed to be working by @cat2151
- ✅ Quartz dark mode support (automatic theme detection and theme switching)
- ✅ Accessibility support (ARIA attributes, keyboard operation support)
- ✅ Interactive audio playback function (click sheet music to play the piece from the beginning)
  - Uses abcjs synth API and Web Audio API
  - Visual feedback during playback (background color change and status display)
  - Automatically stops when playback is complete
  - Click again to stop playback

## Important Considerations

- Conversion to HTML occurs during the Quartz build process
- Actual sheet music conversion and rendering occur in the browser
- CDN library versions are specified based on operational verification by @cat2151 with easychord2mml
- Conversion from MML to ABC uses mml2abc loaded from CDN
- Conversion from chord progression to MML uses chord2mml loaded from CDN
- Rendering uses abcjs (latest version 6.x) loaded from CDN
- Libraries are loaded dynamically to avoid bundling issues

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
- HTML escaping tests (newlines, tabs, special characters)
- Plugin options and configuration tests
- Edge case handling
- External resource validation
- Integration tests for browser rendering and interactive features (Playwright)

For manual testing, use the included `demo.html` file.

**Note**: When the Coding Agent performs tests on a Linux Runner, the CDN is blocked, so sheet music will not be displayed. If you want to verify the display of sheet music, please test on a physical machine (local environment).

## Dependencies

### Runtime (Loaded via CDN)

**Important**: The following library versions are specified based on operational verification by @cat2151 with [easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html). Do not change these URLs.

- [abcjs](https://github.com/paulrosen/abcjs) - JavaScript library for rendering ABC music notation
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - Specifying `@6` always fetches the latest version of the 6.x series (6.x.x)
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC notation
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - Loaded via dynamic ES module import
- [chord2mml](https://github.com/cat2151/chord2mml) - Converts chord progression notation to MML
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - Loaded in UMD bundle format
  - Ensures security using SRI (Subresource Integrity) checksum
  - Checksum: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - ※ Re-verification of the checksum is required when the library is updated

### Build-time
- [unified](https://github.com/unifiedjs/unified) - Interface for parsing and transforming content
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - Utility for traversing syntax trees

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

## License

MIT License - See the LICENSE file for details

※ The English README.md is automatically generated by GitHub Actions using Gemini's translation based on README.ja.md

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - Fast, battery-included static site generator
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC music notation
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord progression notation to MML converter