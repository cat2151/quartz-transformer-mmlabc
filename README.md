# quartz-transformer-mmlabc

A Quartz transformer plugin that converts MML (Music Macro Language) and chord progression notation code blocks into interactive musical scores using abcjs.

\*This document is temporary and was generated quickly by an LLM. It will be refined in the future.

## Features

- 🎵 Converts `mml` code blocks to ABC notation and renders them with abcjs
- 🎸 Converts `chord` code blocks to MML, then to ABC notation, and renders them with abcjs
- 🎼 Supports `abc` notation code blocks for troubleshooting or direct use
- 🎨 Automatically renders scores as SVG (displaying musical staves)
- 🎧 Click to Play Music - Click the rendered score to play the music
- ⚡ Lightweight and standalone npm module
- 🔧 TypeScript support

## Installation

In the directory where Quartz is installed, run the following:

```powershell
npm install github:cat2151/quartz-transformer-mmlabc; pushd node_modules/quartz-transformer-mmlabc; npm run build; popd
```

Why this step is necessary:
- The plugin is installed directly from GitHub (not from npm).
- The `dist` directory containing compiled JavaScript is not included in the repository.
- Skipping this step will cause an error when Quartz runs because the plugin's entry point (`dist/index.js`) does not exist.

Additionally, add the following before `Build Quartz` in `.github\workflows\deploy.yml`:
```yml
      - name: Build quartz-transformer-mmlabc
        run: npm run build
        working-directory: node_modules/quartz-transformer-mmlabc
```
Why this step is necessary:
- During deployment with GitHub Actions, without this, the plugin's entry point (`dist/index.js`) will be missing, causing an error during `Build Quartz`.

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

**Important Points:**
- Import `QuartzConfig` and built-in plugins from Quartz's internal paths
- Import this plugin from its npm package name
- Add it to the `transformers` array along with other transformers
- The order usually doesn't matter unless there are dependencies between plugins

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

1.  During Quartz's build process, the plugin detects code blocks with `mml`, `chord`, or `abc` language tags.
2.  It replaces these code blocks with HTML div elements containing the source notation as a data attribute.
3.  In the browser:
    - Loads abcjs and mml2abc from CDN.
    - For MML blocks: Uses mml2abc to convert MML to ABC notation.
    - For chord progression blocks: Uses chord2mml to convert chord progression to MML, then converts MML to ABC notation.
    - For ABC blocks: Uses the notation directly without conversion.
    - Renders the ABC notation as an interactive SVG using abcjs.
    - Initializes an audio synthesizer to support music playback.
    - Adds a click event handler to allow playing music by clicking on the score.

## Current Status

### Implemented Features
- ✅ MML block detection and conversion
- ✅ Chord progression block detection and conversion
- ✅ ABC block detection and direct rendering (useful for troubleshooting)
- ✅ Rendering of ABC notation using abcjs (displaying musical staves)
- ✅ CDN dependencies use versions verified by @cat2151 to work
- ✅ Interactive audio playback (click the score to play the music from the beginning)
  - Uses abcjs synth API and Web Audio API
  - Visual feedback during playback (background color change and status display)
  - Automatic stop upon playback completion
  - Click again to stop playback

## Notes

- Conversion to HTML occurs during Quartz's build process.
- Actual score conversion and rendering occur in the browser.
- CDN library versions are strongly specified based on @cat2151's verification with easychord2mml.
- MML to ABC conversion uses mml2abc loaded from CDN.
- Chord progression to MML conversion uses chord2mml loaded from CDN.
- Rendering uses abcjs (latest version 6 series) loaded from CDN.
- Libraries are loaded dynamically to avoid bundling issues.

## Tests

The plugin includes a comprehensive automated test suite using Vitest:

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Coverage

The test suite includes:
- Unit tests for AST transformation logic
- Tests for HTML escaping (newlines, tabs, special characters)
- Tests for plugin options and configuration
- Handling of edge cases
- Validation of external resources

For manual testing, please use the bundled `demo.html` file.

**Note**: When the Coding Agent performs tests on a Linux Runner, the CDN may be blocked, preventing the display of musical staves. If you want to confirm the display of musical staves, please test on a physical machine (local environment).

## Dependencies

### Runtime (Loaded via CDN)

**Important**: The following library versions are strongly specified based on @cat2151's verification with [easychord2mml](https://github.com/cat2151/easychord2mml/blob/main/index.html). Do not change these URLs.

- [abcjs](https://github.com/paulrosen/abcjs) - A JavaScript library for rendering ABC musical notation
  - CDN: `https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js`
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC notation
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs`
- [chord2mml](https://github.com/cat2151/chord2mml) - Converts chord progression notation to MML
  - CDN: `https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js`

### Build-time
- [unified](https://github.com/unifiedjs/unified) - An interface for parsing and transforming content
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
│   └── index.ts          # Main plugin implementation
├── dist/                 # Compiled Output (Generated)
│   ├── index.js
│   └── index.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - A fast, batteries-included static site generator
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC musical notation
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord progression notation to MML converter