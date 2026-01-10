import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('Playback Fix - Issue #61', () => {
  test('demo.html should NOT have isRunning() TypeError', async ({ page }) => {
    const consoleErrors = [];
    const consoleMessages = [];
    
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push({ type: msg.type(), text });
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    // Navigate to demo page
    const demoPath = 'file://' + join(__dirname, '..', 'demo.html');
    await page.goto(demoPath);

    // Wait for notation to render
    await page.waitForSelector('.abc-notation', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Click first notation to attempt playback
    await page.locator('.abc-notation').first().click();
    await page.waitForTimeout(2000);

    // Screenshot for documentation
    await page.screenshot({ 
      path: join(__dirname, 'playback-test.png'),
      fullPage: true 
    });

    console.log('\n=== All Console Messages ===');
    consoleMessages.forEach(msg => {
      console.log(`[${msg.type}] ${msg.text}`);
    });
    console.log('============================\n');

    // **PRIMARY ASSERTION**: Check for the specific isRunning error that was the bug
    const isRunningErrors = consoleErrors.filter(err => 
      err.includes('isRunning') && (err.includes('not a function') || err.includes('TypeError'))
    );

    console.log(`\nTotal console errors: ${consoleErrors.length}`);
    console.log(`isRunning errors: ${isRunningErrors.length}\n`);

    if (isRunningErrors.length > 0) {
      console.log('❌ Found isRunning errors:');
      isRunningErrors.forEach(err => console.log('  -', err));
    } else {
      console.log('✅ NO isRunning() TypeError found! Fix confirmed!');
    }

    // Main assertion: NO isRunning errors
    expect(isRunningErrors).toHaveLength(0);

    // Also verify no TypeError mentioning isRunning in any form
    const anyIsRunningTypeError = consoleErrors.filter(err => 
      err.toLowerCase().includes('typeerror') && err.includes('isRunning')
    );
    expect(anyIsRunningTypeError).toHaveLength(0);
  });

  test('rendering should work without JavaScript errors', async ({ page }) => {
    const jsErrors = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    const demoPath = 'file://' + join(__dirname, '..', 'demo.html');
    await page.goto(demoPath);

    await page.waitForSelector('.abc-notation', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Check that notation blocks were rendered
    const notationCount = await page.locator('.abc-notation').count();
    console.log(`\nRendered ${notationCount} notation blocks`);

    // Filter for isRunning related errors
    const isRunningJsErrors = jsErrors.filter(err => 
      err.includes('isRunning')
    );

    console.log(`JavaScript errors: ${jsErrors.length}`);
    console.log(`isRunning related JS errors: ${isRunningJsErrors.length}\n`);

    // Should have some notation blocks
    expect(notationCount).toBeGreaterThan(0);

    // Should have NO isRunning errors
    expect(isRunningJsErrors).toHaveLength(0);
  });
});
