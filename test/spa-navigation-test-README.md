# SPA Navigation Manual Test

This HTML file tests the fix for Issue #63: "Quartz4でほかのpageを開いたあと、当該の（abcjsを使っている）pageを開くと、コンテナは表示されるが中身の五線譜の表示がされない。ブラウザでリロード操作すると表示される"

## Problem

In Quartz v4's SPA (Single Page Application) mode, when navigating from another page to a page with music notation, the notation containers would appear but the staff notation (SVG) inside wouldn't render. A browser reload would make it appear.

## Solution

The plugin now listens for Quartz's `nav` event and re-initializes the music notation rendering on every page navigation. It also uses `window.addCleanup()` to prevent memory leaks and a `WeakSet` to track processed elements for idempotent initialization.

## Manual Testing

1. Open `spa-navigation-test.html` in a web browser
2. Follow the test instructions on the page:
   - Click "Page 2 (Music)" - music notation should render
   - Click "Page 1 (No Music)" - page changes to simple content
   - Click "Page 2 (Music)" again - **THIS IS THE TEST**: music notation should render even after navigation
   - Click "Page 3 (More Music)" - another music page should render correctly

## Expected Behavior

- Music notation should render on every navigation to a music page
- No duplicate event listeners should be created
- The notation should be clickable to play audio
- Theme changes should work correctly

## Debugging

Open the browser's Developer Tools Console to see debug messages:
- "initializeMusicNotation called" - Shows when initialization runs
- "SPA navigation detected" - Shows when nav event is triggered
- "Found N notation blocks to process" - Shows block discovery
- "Skipping already processed element" - Shows idempotent behavior

## Implementation Details

The fix involves:

1. **Wrapped initialization logic** in `initializeMusicNotation()` function
2. **Event listener** for Quartz's `nav` custom event
3. **Cleanup function** registered with `window.addCleanup()` (if available)
4. **Idempotent initialization** using `WeakSet` to track processed elements
5. **Cached modules** (mml2abc, chord2mml, AudioContext) persist across navigations for performance

## Notes

- The `nav` event is simulated in this test file using `CustomEvent`
- In a real Quartz environment, the event is dispatched by Quartz's SPA router
- The test uses inline JavaScript to avoid CDN blocking in automated tests
