# quartz-transformer-mmlabc

A Quartz transformer plugin that converts MML (Music Macro Language) and chord notation code blocks to interactive music notation using abcjs.

## Features

- 🎵 Converts `mml` code blocks to ABC notation and renders with abcjs
- 🎸 Converts `chord` code blocks to MML, then ABC notation, and renders with abcjs
- 🎨 Automatic rendering of music notation as SVG
- ⚡ Lightweight and standalone npm module
- 🔧 TypeScript support

## Installation

```bash
npm install quartz-transformer-mmlabc
```

Or with yarn:

```bash
yarn add quartz-transformer-mmlabc
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

```markdown
\`\`\`mml
t120 l4 cdefgab>c
\`\`\`
```

#### Chord notation

```markdown
\`\`\`chord
C Dm7 G7 C
\`\`\`
```

## Options

The plugin accepts optional configuration:

```typescript
MMLABCTransformer({
  enableMML: true,    // Enable MML block transformation (default: true)
  enableChord: true,  // Enable chord block transformation (default: true)
})
```

## How it works

1. The plugin detects code blocks with `mml` or `chord` language tags during Quartz's build process
2. Replaces these code blocks with HTML div elements containing the source notation as data attributes
3. In the browser:
   - Loads abcjs and mml2abc from CDN
   - For MML blocks: converts MML to ABC notation using mml2abc
   - For chord blocks: (planned) converts chords to MML, then to ABC notation
   - Renders the ABC notation as interactive SVG using abcjs

## Current Status

- ✅ MML block detection and transformation
- ✅ ABC notation rendering with abcjs
- ⚠️  Chord block detection (structure in place)
- ⏳ Chord to MML conversion (requires additional CDN integration)

The plugin is functional for MML notation. Chord support structure is in place but requires additional CDN-based chord2mml integration.

## Notes

- The transformation to HTML happens during Quartz's build process
- The actual music notation conversion and rendering happens in the browser
- MML to ABC conversion uses mml2abc loaded from CDN
- abcjs is loaded from CDN for rendering

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
