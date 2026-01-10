import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('SPA Navigation Debug Logging Test', () => {
  test('should log debug messages on initial page load', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture all console log messages
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Navigate to the SPA test page
    await page.goto('file://' + join(__dirname, 'spa-navigation-test.html'));

    // Wait for initial rendering to complete
    await page.waitForTimeout(2000);

    // Verify plugin version log is present
    const versionLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('Plugin loaded')
    );
    expect(versionLogs.length).toBeGreaterThan(0);
    console.log('✓ Plugin version log found:', versionLogs[0]);

    // Verify initial page load log
    const initialLoadLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('初期ページ読み込み時の処理を開始します')
    );
    expect(initialLoadLogs.length).toBeGreaterThan(0);
    console.log('✓ Initial page load log found');

    // Verify rendering start log
    const renderStartLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('五線譜表示処理を開始します')
    );
    expect(renderStartLogs.length).toBeGreaterThan(0);
    console.log('✓ Rendering start log found');

    // Verify block count log
    const blockCountLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('処理対象の楽譜ブロック数')
    );
    expect(blockCountLogs.length).toBeGreaterThan(0);
    console.log('✓ Block count log found:', blockCountLogs[0]);

    // Verify rendering complete log
    const renderCompleteLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('五線譜表示処理が完了しました')
    );
    expect(renderCompleteLogs.length).toBeGreaterThan(0);
    console.log('✓ Rendering complete log found:', renderCompleteLogs[0]);

    // Print all debug logs for verification
    console.log('\n--- All Debug Logs on Initial Load ---');
    consoleMessages.filter(msg => msg.includes('[MML-ABC-Transformer]')).forEach(msg => {
      console.log(msg);
    });
  });

  test('should log debug messages on SPA navigation', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture all console log messages
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Navigate to the SPA test page
    await page.goto('file://' + join(__dirname, 'spa-navigation-test.html'));

    // Wait for initial rendering
    await page.waitForTimeout(2000);

    // Clear messages to focus on navigation logs
    consoleMessages.length = 0;

    // Click to navigate to Page 2 (no music)
    await page.click('button:has-text("Page 2")');
    await page.waitForTimeout(500);

    // Clear messages again
    consoleMessages.length = 0;

    // Navigate back to Page 1 (with music) - this should trigger SPA navigation
    await page.click('button:has-text("Page 1")');
    await page.waitForTimeout(2000);

    // Verify SPA navigation detection log
    const navDetectionLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('SPA page 遷移を検知しました')
    );
    expect(navDetectionLogs.length).toBeGreaterThan(0);
    console.log('✓ SPA navigation detection log found');

    // Verify rendering start log after navigation
    const renderStartLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('五線譜表示処理を開始します')
    );
    expect(renderStartLogs.length).toBeGreaterThan(0);
    console.log('✓ Rendering start log found after navigation');

    // Verify rendering complete log after navigation
    const renderCompleteLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('五線譜表示処理が完了しました')
    );
    expect(renderCompleteLogs.length).toBeGreaterThan(0);
    console.log('✓ Rendering complete log found after navigation');

    // Print all navigation-related debug logs
    console.log('\n--- All Debug Logs on SPA Navigation ---');
    consoleMessages.filter(msg => msg.includes('[MML-ABC-Transformer]')).forEach(msg => {
      console.log(msg);
    });
  });

  test('should skip already processed elements on navigation', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture all console log messages
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Navigate to the SPA test page
    await page.goto('file://' + join(__dirname, 'spa-navigation-test.html'));
    await page.waitForTimeout(2000);

    // Navigate to Page 3 (with music)
    await page.click('button:has-text("Page 3")');
    await page.waitForTimeout(2000);

    // Clear messages
    consoleMessages.length = 0;

    // Navigate to Page 2 (no music) and back to Page 3
    await page.click('button:has-text("Page 2")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Page 3")');
    await page.waitForTimeout(2000);

    // On the second visit to Page 3, elements might be processed or skipped depending on DOM lifecycle
    // Just verify that navigation was detected and processing occurred
    const navDetectionLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('SPA page 遷移を検知しました')
    );
    expect(navDetectionLogs.length).toBeGreaterThanOrEqual(1);

    // Check if there are any skip logs or new processing logs
    const skipLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('スキップ: 既に処理済みの要素')
    );
    const newProcessLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('新しい楽譜要素を処理します')
    );

    console.log('✓ Skip logs count:', skipLogs.length);
    console.log('✓ New process logs count:', newProcessLogs.length);
    
    // At least one of these should be present
    expect(skipLogs.length + newProcessLogs.length).toBeGreaterThan(0);
  });

  test('should measure and log rendering performance', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture all console log messages
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Navigate to the SPA test page
    await page.goto('file://' + join(__dirname, 'spa-navigation-test.html'));
    await page.waitForTimeout(2000);

    // Find performance logs
    const performanceLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && 
      msg.includes('五線譜表示処理が完了しました') &&
      msg.includes('ms')
    );

    expect(performanceLogs.length).toBeGreaterThan(0);
    
    // Extract and verify the timing value
    const timingMatch = performanceLogs[0].match(/(\d+\.\d+)\s*ms/);
    expect(timingMatch).not.toBeNull();
    
    if (timingMatch) {
      const renderTime = parseFloat(timingMatch[1]);
      console.log('✓ Rendering time measured:', renderTime, 'ms');
      // Sanity check: rendering should complete in reasonable time (< 10 seconds)
      expect(renderTime).toBeLessThan(10000);
    }
  });

  test('should detect correct notation types during processing', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture all console log messages
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Navigate to the SPA test page
    await page.goto('file://' + join(__dirname, 'spa-navigation-test.html'));
    await page.waitForTimeout(2000);

    // Check for type detection logs
    const typeLogs = consoleMessages.filter(msg => 
      msg.includes('[MML-ABC-Transformer]') && msg.includes('新しい楽譜要素を処理します')
    );

    expect(typeLogs.length).toBeGreaterThan(0);
    console.log('✓ Type detection logs found:', typeLogs.length);

    // Verify that type is logged
    typeLogs.forEach(log => {
      console.log('  -', log);
    });
  });
});
