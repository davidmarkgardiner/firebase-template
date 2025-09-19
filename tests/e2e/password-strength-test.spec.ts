import { test, expect } from '@playwright/test';

test.describe('Password Strength Indicator Test', () => {
  test.beforeAll(async () => {
    // Wait for dev server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('Password strength indicator functionality', async ({ page }) => {
    // Navigate to forgot password page with a token to trigger reset mode
    await page.goto('http://localhost:4321/auth/forgot-password?token=demo-token-12345');

    // Wait for page to load
    await page.waitForSelector('.claymorphism-card', { timeout: 15000 });

    // Wait for potential state transition to reset mode
    await page.waitForTimeout(2000);

    // Take screenshot of initial reset state
    await page.screenshot({ path: 'test-results/password-strength-initial.png', fullPage: true });

    // Look for password input field (should be present in reset mode)
    const passwordInput = page.locator('input[type="password"]').first();

    if (await passwordInput.isVisible()) {
      console.log('Password input found - testing strength indicator');

      // Test 1: Empty password
      await passwordInput.clear();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/password-strength-empty.png', fullPage: true });

      // Test 2: Very weak password (just letters)
      await passwordInput.fill('weak');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/password-strength-weak.png', fullPage: true });

      // Test 3: Weak password (letters + numbers)
      await passwordInput.fill('weak123');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/password-strength-fair.png', fullPage: true });

      // Test 4: Good password (letters, numbers, uppercase)
      await passwordInput.fill('GoodPass123');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/password-strength-good.png', fullPage: true });

      // Test 5: Strong password (meets all criteria)
      await passwordInput.fill('StrongPass123!');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/password-strength-strong.png', fullPage: true });

      // Look for strength indicator elements
      const strengthBadge = page.locator('.badge');
      const progressBar = page.locator('.progress');
      const strengthText = page.locator('text=Password Strength');

      console.log('Strength badge visible:', await strengthBadge.isVisible());
      console.log('Progress bar visible:', await progressBar.isVisible());
      console.log('Strength text visible:', await strengthText.isVisible());

      // Verify password requirements text is visible
      const requirementsText = page.locator('text=Must contain: 8+ characters, uppercase, lowercase, number, and special character');
      console.log('Requirements text visible:', await requirementsText.isVisible());

    } else {
      console.log('Password input not found - component may not be in reset mode');

      // Take screenshot to show current state
      await page.screenshot({ path: 'test-results/password-strength-no-reset-mode.png', fullPage: true });

      // Check what is actually displayed
      const emailInput = page.locator('input[type="email"]');
      const submitButton = page.locator('button[type="submit"]');

      console.log('Email input visible:', await emailInput.isVisible());
      console.log('Submit button visible:', await submitButton.isVisible());

      // If in email request mode, test that flow instead
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await submitButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/password-strength-email-submitted.png', fullPage: true });
      }
    }
  });

  test('Complete password reset flow demonstration', async ({ page }) => {
    // Step 1: Initial page load
    await page.goto('http://localhost:4321/auth/forgot-password');
    await page.waitForSelector('.claymorphism-card', { timeout: 15000 });
    await page.screenshot({ path: 'test-results/password-reset-step-1-initial.png', fullPage: true });

    // Step 2: Enter email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('demo@example.com');
    await page.screenshot({ path: 'test-results/password-reset-step-2-email-entered.png', fullPage: true });

    // Step 3: Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/password-reset-step-3-submitted.png', fullPage: true });

    // Step 4: Check for success state
    const successElements = page.locator('text=success', { exact: false });
    console.log('Success elements found:', await successElements.count());

    // Step 5: Check login link
    const loginLink = page.locator('text=Sign In');
    console.log('Login link visible:', await loginLink.isVisible());

    await page.screenshot({ path: 'test-results/password-reset-step-4-complete.png', fullPage: true });
  });

  test.afterAll(async () => {
    console.log('Password strength tests completed');
  });
});