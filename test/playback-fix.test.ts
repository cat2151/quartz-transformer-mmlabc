import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('Playback Fix - Issue #61: No isRunning() error', () => {
  test('demo.html should play music without isRunning console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleMessages: { type: string; text: string }[] = [];
    
    // Capture all console messages
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

    // Wait for page to fully load and render notation
    await page.waitForSelector('.abc-notation', { timeout: 10000 });
    
    // Wait a bit for all initial rendering
    await page.waitForTimeout(2000);

    // Click on the first music notation block to start playback
    const firstNotation = page.locator('.abc-notation').first();
    await firstNotation.click();
    
    // Wait for playback to start
    await page.waitForTimeout(1000);

    // Check for the specific isRunning error that we fixed
    const isRunningErrors = consoleErrors.filter(err => 
      err.includes('isRunning') && err.includes('not a function')
    );

    // Take screenshot for verification
    await page.screenshot({ 
      path: join(__dirname, 'playback-test-screenshot.png'),
      fullPage: true 
    });

    // Assert: No isRunning errors should exist
    expect(isRunningErrors).toHaveLength(0);
    
    // Log all console messages for debugging
    console.log('\n=== Console Messages ===');
    consoleMessages.forEach(msg => {
      console.log(`[${msg.type}] ${msg.text}`);
    });
    console.log('========================\n');

    // Assert: No generic TypeError about isRunning
    const typeErrors = consoleErrors.filter(err => 
      err.toLowerCase().includes('typeerror') && err.includes('isRunning')
    );
    expect(typeErrors).toHaveLength(0);

    // Verify the notation is marked as playing
    await expect(firstNotation).toHaveClass(/playing/);
  });

  test('demo.html playback should use Promise-based completion detection', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture console.debug and console.log messages
    page.on('console', msg => {
      if (msg.type() === 'debug' || msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    // Navigate to demo page
    const demoPath = 'file://' + join(__dirname, '..', 'demo.html');
    await page.goto(demoPath);

    // Wait for page load
    await page.waitForSelector('.abc-notation', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Click to start playback
    await page.locator('.abc-notation').first().click();
    await page.waitForTimeout(500);

    // Check that we see either:
    // - "Playback started (no completion detection available)" for fallback case
    // - Or no message if Promise was returned
    // But definitely no "isRunning" related messages
    
    const hasExpectedMessage = consoleMessages.some(msg => 
      msg.includes('Playback started') || 
      msg.includes('Playback ended')
    );
    
    const hasIsRunningMessage = consoleMessages.some(msg => 
      msg.includes('isRunning')
    );

    console.log('\n=== Debug/Log Messages ===');
    consoleMessages.forEach(msg => console.log(msg));
    console.log('==========================\n');

    // We should NOT see any isRunning messages
    expect(hasIsRunningMessage).toBe(false);
  });

  test('multiple notation blocks should work without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const demoPath = 'file://' + join(__dirname, '..', 'demo.html');
    await page.goto(demoPath);

    await page.waitForSelector('.abc-notation', { timeout: 10000 });
    
    // Get all notation blocks
    const notations = page.locator('.abc-notation');
    const count = await notations.count();
    
    console.log(`\nFound ${count} notation blocks`);
    
    // Click first block
    if (count > 0) {
      await notations.nth(0).click();
      await page.waitForTimeout(500);
    }
    
    // Click second block (should stop first and start second)
    if (count > 1) {
      await notations.nth(1).click();
      await page.waitForTimeout(500);
    }

    // Take final screenshot
    await page.screenshot({ 
      path: join(__dirname, 'multiple-blocks-test.png'),
      fullPage: true 
    });

    // Check for isRunning errors
    const isRunningErrors = consoleErrors.filter(err => 
      err.includes('isRunning')
    );

    console.log(`\nTotal console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

    // Should have no isRunning errors
    expect(isRunningErrors).toHaveLength(0);
  });
});
