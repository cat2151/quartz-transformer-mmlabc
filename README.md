# quartz-transformer-mmlabc

A Quartz transformer plugin that converts MML (Music Macro Language) and chord notation code blocks to interactive music notation using abcjs.

## Features

- 🎵 Converts `mml` code blocks to ABC notation and renders with abcjs
- 🎸 Converts `chord` code blocks to MML, then ABC notation, and renders with abcjs
- 🎼 Supports direct `abc` notation code blocks for troubleshooting and direct usage
- 🎨 Automatic rendering of music notation as SVG (displays staff notation)
- 🎧 Click-to-play audio playback - click on any rendered notation to hear the music
- ⚡ Lightweight and standalone npm module
- 🔧 TypeScript support

## Installation

Since this package is not published to npm, install directly from GitHub:

```bash
npm install github:cat2151/quartz-transformer-mmlabc
```

Or with yarn:

```bash
yarn add github:cat2151/quartz-transformer-mmlabc
```

## Usage

### In your Quartz configuration

Add the transformer to your `quartz.config.ts`:

```typescript
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

export default {
  plugins: {
    transformers: [
      // ... other transformers
      MMLABCTransformer(),
    ],
  },
}
```

### In your Markdown files

#### MML notation

````markdown
```mml
t120 l4 cdefgab>c
```
````

#### Chord notation

````markdown
```chord
C Dm7 G7 C
```
````

#### ABC notation (direct)

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

This is useful for troubleshooting or when you prefer to write ABC notation directly.

## Options

The plugin accepts optional configuration:

```typescript
MMLABCTransformer({
  enableMML: true,    // Enable MML block transformation (default: true)
  enableChord: true,  // Enable chord block transformation (default: true)
  enableABC: true,    // Enable ABC block transformation (default: true)
})
```

## How it works

1. The plugin detects code blocks with `mml`, `chord`, or `abc` language tags during Quartz's build process
2. Replaces these code blocks with HTML div elements containing the source notation as data attributes
3. In the browser:
   - Loads abcjs and mml2abc from CDN
   - For MML blocks: converts MML to ABC notation using mml2abc
   - For chord blocks: converts chords to MML using chord2mml, then to ABC notation
   - For ABC blocks: uses the notation directly without conversion
   - Renders the ABC notation as interactive SVG using abcjs
   - Initializes audio synthesizer for playback
   - Adds click event handlers to enable music playback when clicking on the notation

## Current Status

### Implemented Features
- ✅ MML block detection and transformation
- ✅ Chord block detection and transformation
- ✅ ABC block detection and direct rendering (useful for troubleshooting)
- ✅ ABC notation rendering with abcjs (staff notation display)
- ✅ CDN dependencies pinned to specific commit hash
- ✅ Interactive audio playback (click on notation to play music from the beginning)
  - Uses abcjs synth API with Web Audio API
  - Visual feedback during playback (background color change and status indicator)
  - Automatic stop when playback completes
  - Click again to stop playback

## Notes

- The transformation to HTML happens during Quartz's build process
- The actual music notation conversion and rendering happens in the browser
- MML to ABC conversion uses mml2abc loaded from CDN (pinned to commit `c32f3f3`)
- abcjs is loaded from CDN for rendering
- Libraries are loaded dynamically to avoid bundling issues

## Testing

The plugin includes a comprehensive automated test suite using Vitest:

### Running tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test coverage

The test suite includes:
- Unit tests for AST transformation logic
- Tests for HTML escaping (newlines, tabs, special characters)
- Tests for plugin options and configuration
- Edge case handling
- External resource validation

For manual testing, use the included `demo.html` file.

## Dependencies

### Runtime (loaded via CDN)
- [abcjs](https://github.com/paulrosen/abcjs) - JavaScript library for rendering ABC music notation
- [mml2abc](https://github.com/cat2151/mml2abc) - Converts Music Macro Language to ABC notation

### Build-time
- [unified](https://github.com/unifiedjs/unified) - Interface for parsing and transforming content
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - Utility for walking syntax trees

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
├── dist/                 # Compiled output (generated)
│   ├── index.js
│   └── index.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [Quartz](https://quartz.jzhao.xyz/) - A fast, batteries-included static-site generator
- [abcjs](https://www.abcjs.net/) - JavaScript for rendering ABC music notation
- [mml2abc](https://cat2151.github.io/mml2abc/) - MML to ABC converter
- [chord2mml](https://cat2151.github.io/chord2mml/) - Chord notation to MML converter
