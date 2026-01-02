import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Integration Test for Issue #22 Fix', () => {
  test('should verify synth.init() includes options parameter', async ({ page }) => {
    // Navigate to the test page using a relative path
    await page.goto('file://' + path.join(__dirname, 'integration-test.html'));

    // Wait for test to complete (look for pass or fail class)
    await page.waitForSelector('#test-results.pass, #test-results.fail', { timeout: 10000 });

    // Check if test passed
    const isPassed = await page.locator('#test-results.pass').count() > 0;
    const isFailed = await page.locator('#test-results.fail').count() > 0;

    // Get the test result message
    const resultText = await page.locator('#test-results').textContent();

    // Take a screenshot for debugging
    await page.screenshot({ path: path.join(__dirname, 'test-result.png') });

    // Assert that the test passed
    expect(isPassed).toBe(true);
    expect(isFailed).toBe(false);
    
    // Verify the result message contains expected text
    expect(resultText).toContain('synth.init()');
    
    // Most importantly, verify it doesn't contain the swing error
    expect(resultText?.toLowerCase()).not.toContain('cannot read properties of undefined');
    
    console.log('Test Result:', resultText);
  });

  test('should verify no console errors related to swing property', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the test page
    await page.goto('file://' + path.join(__dirname, 'integration-test.html'));

    // Wait for test to complete
    await page.waitForSelector('#test-results.pass, #test-results.fail', { timeout: 10000 });

    // Check that there are no swing-related errors
    const swingErrors = consoleErrors.filter(err => 
      err.includes('swing') && err.includes('undefined')
    );

    expect(swingErrors).toHaveLength(0);
    
    if (consoleErrors.length > 0) {
      console.log('Console errors (non-swing related):', consoleErrors);
    }
  });
});
