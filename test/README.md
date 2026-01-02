# Integration Tests

This directory contains integration tests that verify the audio playback functionality without relying on CDN resources.

## Background

Issue #22 reported that clicking on rendered musical notation to play audio throws an error:
```
Error playing music: TypeError: Cannot read properties of undefined (reading 'swing')
```

The fix adds an `options: {}` parameter to the `synth.init()` call to prevent this error.

## Test Setup

### Local Libraries

Since CDN resources are often blocked in automated testing environments, we use locally installed libraries:

- **abcjs**: Installed via npm as a devDependency
- **mml2abc** and **chord2mml**: Cloned from GitHub into `test/lib/` (excluded from git via .gitignore)

### Test Files

1. **integration-test.html**: A standalone HTML file that tests the synth.init() fix
   - Uses locally installed abcjs from node_modules
   - Tests that synth.init() works with the options parameter
   - Provides visual feedback (green for pass, red for fail)

2. **integration.test.ts**: Playwright test that automates the HTML test
   - Runs in headless Chromium
   - Verifies no swing-related errors occur
   - Takes screenshots on failure

## Running the Tests

### Method 1: Manual Browser Test (Recommended)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Open `test/integration-test.html` in a web browser

3. The page will automatically run the test and show results:
   - ✓ Green background = Test PASSED
   - ✗ Red background = Test FAILED

### Method 2: Automated Playwright Test

1. Install dependencies and Playwright browsers:
   ```bash
   npm install
   npx playwright install chromium
   ```

2. Run the integration test:
   ```bash
   npm run test:integration
   ```

3. The test will:
   - Open the HTML file in headless Chromium
   - Wait for test completion
   - Verify no swing-related errors
   - Report results

### Method 3: Run All Tests

```bash
npm run test:all
```

This runs both:
- Unit tests (vitest): Tests AST transformation
- Integration tests (playwright): Tests browser runtime

## What the Test Verifies

The integration test specifically verifies:

1. **abcjs loads correctly** from local node_modules
2. **ABC notation renders** without errors
3. **synth.init() succeeds** when called with `options: {}`
4. **No swing property error** occurs (the bug from issue #22)

The test doesn't require actual audio playback - it only verifies that the initialization succeeds without the "Cannot read properties of undefined (reading 'swing')" error.

## Troubleshooting

### "ABCJS library not loaded"

Make sure abcjs is installed:
```bash
npm install
```

### Test timeout in Playwright

The Playwright test may timeout if there are file permission issues. Try the manual browser test instead.

### Can't open HTML file in browser

Make sure you're opening `test/integration-test.html`, not the Playwright test file.

## Notes

- The `test/lib/` directory contains cloned repositories and is excluded from git
- To set up local libraries, run:
  ```bash
  cd test/lib
  git clone --depth 1 https://github.com/cat2151/mml2abc.git
  git clone --depth 1 --branch v0.0.4 https://github.com/cat2151/chord2mml.git
  ```
