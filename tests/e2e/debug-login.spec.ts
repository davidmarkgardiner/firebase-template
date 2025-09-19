import { test, expect } from '@playwright/test';

test.describe('Debug Login Page', () => {
  test('debug what elements are actually on the page', async ({ page }) => {
    // Update base URL to use port 4322
    await page.goto('http://localhost:4322/auth/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot to see what's actually there
    await page.screenshot({ path: 'debug-login-page.png', fullPage: true });

    // Log the page title
    const title = await page.title();
    console.log('Page title:', title);

    // Log the page content
    const bodyContent = await page.locator('body').textContent();
    console.log('Body content length:', bodyContent?.length);

    // Check for any form elements
    const allInputs = await page.locator('input').all();
    console.log('Number of input elements:', allInputs.length);

    // Check for any buttons
    const allButtons = await page.locator('button').all();
    console.log('Number of button elements:', allButtons.length);

    // Check for any cards or forms
    const allCards = await page.locator('[class*="card"]').all();
    console.log('Number of card elements:', allCards.length);

    const allForms = await page.locator('form').all();
    console.log('Number of form elements:', allForms.length);

    // Log all text content on the page
    const allText = await page.locator('*').allTextContents();
    console.log('Text elements found:', allText.filter(text => text.trim().length > 0));

    // Save page HTML for inspection
    const html = await page.content();
    require('fs').writeFileSync('debug-login-page.html', html);

    console.log('Debug files saved: debug-login-page.png, debug-login-page.html');
  });
});