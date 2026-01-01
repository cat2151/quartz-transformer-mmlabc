# How to Verify Staff Notation Works

## Quick Start

The staff notation (五線譜) feature **IS working correctly**. To see it in action:

```bash
# 1. Start a local web server
python3 -m http.server 8080

# 2. Open demo.html in a browser WITH AD BLOCKERS DISABLED
# Navigate to: http://localhost:8080/demo.html

# 3. You should see:
# - All 7 examples show five-line staff notation
# - Musical notes positioned on the staff lines
# - Treble clef symbols
# - Click any notation to play music
```

## Why Screenshots Don't Show Staff Notation

The browser/environment is blocking the CDN resource:
```
[ERROR] Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
        @ https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js
```

**This is NOT a bug in the code** - it's an environmental issue during screenshot capture.

## Verification Steps

### 1. Disable Ad Blockers
Common blockers that interfere:
- uBlock Origin
- AdBlock Plus
- Privacy Badger
- Brave Browser's built-in blocker
- Browser privacy extensions

### 2. Check DevTools
Open DevTools (F12) and verify:

**Network Tab:**
- `abcjs@6.4.0/dist/abcjs-basic-min.js` → Status: 200 ✅
- No "blocked" or "failed" entries ✅

**Console Tab:**
- No "ABCJS library not loaded" error ✅
- No "ERR_BLOCKED_BY_CLIENT" error ✅

### 3. Visual Confirmation
Each example should show:
- ✅ Five horizontal lines (the staff / 五線譜)
- ✅ Musical notes positioned on lines/spaces
- ✅ Treble clef symbol (𝄞)
- ✅ Time and key signatures
- ✅ "▶ Click to play" indicator

### 4. Test Interactivity
- Click on any notation
- Background should turn green
- "🔊 Playing..." should appear
- Audio should play
- Click again to stop

## What You Should See

### Working Example (from PR #14)
When CDN loads successfully, you see proper staff notation:
![Working Staff Notation](https://github.com/user-attachments/assets/da994517-7b3a-45b3-8551-7fbfd41c73e4)

### Blocked Example
When CDN is blocked, you see empty boxes:
![CDN Blocked](https://github.com/user-attachments/assets/66f428c5-448b-4a2b-b951-31f0a2ce5c4a)

## Technical Details

### How It Works

1. **Build Time** (Quartz transform):
   ```typescript
   // Markdown: ```mml\nt120 l4 cdefgab>c\n```
   // Becomes: <div data-mml="..." data-type="mml"></div>
   ```

2. **Runtime** (Browser):
   ```javascript
   // Load abcjs from CDN
   // Convert MML → ABC notation
   // Render with ABCJS.renderAbc()
   // Result: SVG staff notation
   ```

### Dependencies
- **abcjs v6.4.0**: Renders ABC as SVG staff notation
- **mml2abc**: Converts MML to ABC (commit c32f3f3)
- **chord2mml**: Converts chords to MML (v0.0.4)

All loaded from CDN at runtime.

## Troubleshooting

### "No staff notation appears"
1. ✅ Disable ALL ad blockers
2. ✅ Reload page (Ctrl+Shift+R / Cmd+Shift+R)
3. ✅ Check DevTools Network tab
4. ✅ Verify no console errors

### "ERR_BLOCKED_BY_CLIENT"
- Disable browser extensions
- Try different browser
- Check network firewall
- Verify jsdelivr.net is accessible

### "ABCJS library not loaded"
- Check internet connection
- Verify CDN is not blocked
- Look for CSP errors in console

## Alternative Testing Methods

### Test in Real Quartz Site
```bash
# Install plugin
npm install github:cat2151/quartz-transformer-mmlabc

# Add to quartz.config.ts
import { MMLABCTransformer } from "quartz-transformer-mmlabc"

export default {
  plugins: {
    transformers: [
      MMLABCTransformer(),
    ],
  },
}

# Create test markdown with ```mml blocks
# Build and serve Quartz site
# View in browser
```

### Run Automated Tests
```bash
npm test
# All 38 tests should pass
```

## For More Details

See comprehensive analysis documents:
- [ANALYSIS.md](./ANALYSIS.md) - Full technical analysis (English)
- [ANALYSIS_JP.md](./ANALYSIS_JP.md) - 完全な技術分析（日本語）

Both include:
- Detailed root cause analysis
- Step-by-step verification methods
- Screenshot guidelines
- Future recommendations
