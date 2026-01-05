# quartz-transformer-mmlabc

**A Quartz transformer plugin that allows you to display sheet music and play it by clicking, simply by writing chord progressions in a code block. MML (Music Macro Language) and ABC Notation are also supported.**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/quartz-transformer-mmlabc"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

*Some parts of this document are AI-generated.*

## Quick Links
| Item | Link |
|------|--------|
| 📊 Development Status | [generated-docs/development-status](generated-docs/development-status.md) |

## Status
- Core features have been implemented.
- Currently dogfooding.
- Breaking changes are possible.

## Explanation in 3 Lines
- In Obsidian, you can write chord progressions in a code block to display and play sheet music: https://github.com/cat2151/obsidian-plugin-mmlabc
- To achieve the same functionality in Quartz4, a new transformer plugin has been created.
- Similar to the Obsidian version, MML (Music Macro Language) and ABC Notation are also available.

## Features

- 🎵 Converts `mml` code blocks to ABC Notation and renders them with abcjs.
- 🎸 Converts `chord` code blocks to MML, then to ABC Notation, and renders them with abcjs.
- 🎼 Supports `abc` notation code blocks for troubleshooting.
- 🎨 Displays sheet music as SVG.
- 🎧 Play music by clicking - clicking the rendered sheet music plays the audio.
- ⌨️ Keyboard accessibility support (play with Enter or Space key).

## Installation

In your Quartz installation directory, run the following:

```powershell
npm install github:cat2151/quartz-transformer-mmlabc; pushd node_modules/quartz-transformer-mmlabc; npm run build; popd
```

Why this step is necessary:
- The plugin is installed directly from GitHub (not from npm).
- The `dist` directory, which contains the compiled JavaScript, is not included in the repository.
- If you skip this step, Quartz will throw an error during execution because the plugin's entry point (`dist/index.js`) will not exist.

Additionally, before the `Build Quartz` step in `.github\workflows\deploy.yml`, add the following:
```yml
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```
Why this step is necessary:
- During deployment with GitHub Actions, without this, the plugin's entry point (`dist/index.js`) will not exist, causing an error during the `Build Quartz` step.

## Usage

### Usage in Quartz Configuration

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
- Add it to the `transformers` array along with other transformers.
- The order generally doesn't matter unless there are dependencies between plugins.

### Usage in Markdown Files

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

#### ABC Notation (Direct)

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

This is useful for troubleshooting or when you want to write ABC notation directly.

## Options

The plugin accepts optional configurations:

```typescript
MMLABCTransformer({
  enableMML: true,    // Enable MML block conversion (default: true)
  enableChord: true,  // Enable chord progression block conversion (default: true)
  enableABC: true,    // Enable ABC block conversion (default: true)
})
```

## How It Works

1. The plugin detects code blocks with `mml`, `chord`, or `abc` language tags during Quartz's build process.
2. These code blocks are replaced with HTML div elements containing the source notation as a data attribute.
3. In the browser:
   - abcjs and mml2abc are loaded from a CDN.
   - For MML blocks: MML is converted to ABC notation using mml2abc.
   - For chord progression blocks: Chord progressions are converted to MML using chord2mml, then to ABC notation.
   - For ABC blocks: The notation is used directly without conversion.
   - abcjs is used to render the ABC notation as an interactive SVG.
   - An audio synthesizer is initialized to support music playback.
   - Click event handlers are added to allow playing music by clicking the sheet music.

## Notes

- The conversion to HTML occurs during Quartz's build process.
- The actual sheet music conversion and rendering happen in the browser.
- CDN library versions are specified based on compatibility confirmed by @cat2151 with easychord2mml.
- MML to ABC conversion uses mml2abc, loaded from a CDN.
- Chord progression to MML conversion uses chord2mml, loaded from a CDN.
- Rendering uses abcjs (latest version 6.x.x), loaded from a CDN.
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
- HTML escaping tests (newlines, tabs, special characters)
- Plugin option and configuration tests
- Edge case handling
- External resource validation
- Integration tests for browser rendering and interactive features (Playwright)

For manual testing, use the included `demo.html` file.

**Note**: When a Coding Agent runs tests on a Linux Runner, the CDN may be blocked, preventing the display of sheet music. If you want to confirm sheet music display, please test on a physical machine (local environment).

## Dependencies

### Runtime (loaded via CDN)

**Important**: The following library versions are specified based on compatibility confirmed by @cat2151 with [easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html). Do not change these URLs.

- [abcjs](https://github.com/paulrosen/abcjs) - A JavaScript library for rendering ABC music notation.
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
  - By specifying `@6`, the latest version 6.x.x will always be retrieved.
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC Notation.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
  - Loaded via dynamic ES module import.
- [chord2mml](https://github.com/cat2151/chord2mml) - Converts chord progression notation to MML.
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`
  - Loaded as a UMD bundle.
  - Security is ensured using SRI (Subresource Integrity) checksums.
  - Checksum: `sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz`
  - *Checksum re-validation is required when the library is updated.*

### Build Time
- [unified](https://github.com/unifiedjs/unified) - An interface for parsing and transforming content.
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - A utility for traversing syntax trees.

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

## Reasons for Adopting the External Package Method

This plugin is distributed as an external npm package, rather than being integrated directly into the Quartz core. This design decision was made for the following reasons:

1. **Reusability**
   - The same plugin can be used across multiple Quartz projects.
   - There is no need to copy code into each project.

2. **Independence**
   - The plugin can have its own release cycle and version management.
   - Development and updates can proceed without being affected by Quartz core updates.

3. **Shareability**
   - It can be easily shared with the community via GitHub.
   - As an open-source project, it can be easily adopted by a wider user base.

This approach maximizes the plugin's value and allows it to cater to a broader user base.

## License

MIT License - See the LICENSE file for details.

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - A fast, battery-included static site generator.
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC music notation.
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter.
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord progression notation to MML converter.

*The English README.md is automatically generated from README.ja.md via Gemini's translation in GitHub Actions.*