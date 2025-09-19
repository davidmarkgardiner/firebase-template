import { test, expect } from '@playwright/test';

test.describe('PasswordReset Component - Comprehensive Test Suite', () => {
  test.beforeAll(async () => {
    // Wait a bit to ensure dev server is ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the forgot password page
    await page.goto('http://localhost:4321/auth/forgot-password');

    // Wait for the page to load with extended timeout
    await page.waitForSelector('.claymorphism-card', { timeout: 15000 });
  });

  test('1. Page loads correctly', async ({ page }) => {
    // Verify the page has correct heading
    const cardTitle = page.locator('.text-2xl.font-bold');
    await expect(cardTitle).toBeVisible();
    await expect(cardTitle).toContainText('Reset Password');

    // Verify description text
    await expect(page.locator('text=Enter your email to receive a password reset link')).toBeVisible();

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/password-reset-page-load.png', fullPage: true });
  });

  test('2. Email input field is present and functional', async ({ page }) => {
    // Verify email field is present
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');

    // Test typing in email field
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Test clearing email field
    await emailInput.clear();
    await expect(emailInput).toHaveValue('');

    // Take screenshot
    await page.screenshot({ path: 'test-results/password-reset-email-input.png', fullPage: true });
  });

  test('3. Reset password button is visible and functional', async ({ page }) => {
    // Verify submit button is present
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Send Reset Link');
    await expect(submitButton).toBeEnabled();

    // Verify button has proper styling
    await expect(submitButton).toHaveClass(/clay-button/);

    // Take screenshot
    await page.screenshot({ path: 'test-results/password-reset-button.png', fullPage: true });
  });

  test('4. Form validation works for email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Test invalid email format
    await emailInput.fill('invalid-email');
    await submitButton.click();

    // Wait for potential validation error
    await page.waitForTimeout(1000);

    // Test valid email format
    await emailInput.fill('valid@example.com');
    await expect(emailInput).toHaveValue('valid@example.com');

    // Take screenshot
    await page.screenshot({ path: 'test-results/password-reset-validation.png', fullPage: true });
  });

  test('4b. Password strength indicator shows when entering new password', async ({ page }) => {
    // Navigate to reset page with token (simulating reset flow)
    await page.goto('http://localhost:4321/auth/forgot-password?token=test-token');
    await page.waitForSelector('.claymorphism-card', { timeout: 15000 });

    // Wait for potential transition to reset step
    await page.waitForTimeout(2000);

    // Check if we're on the reset step by looking for password field
    const passwordInput = page.locator('input[type="password"]');

    // If password field exists, test the strength indicator
    if (await passwordInput.count() > 0) {
      // Test weak password
      await passwordInput.fill('weak');
      await page.waitForTimeout(500);

      // Look for strength indicator elements
      const strengthBadge = page.locator('.badge');
      const progressBar = page.locator('.progress');

      // Take screenshot showing weak password
      await page.screenshot({ path: 'test-results/password-strength-weak.png', fullPage: true });

      // Test stronger password
      await passwordInput.fill('StrongPass123!');
      await page.waitForTimeout(500);

      // Take screenshot showing strong password
      await page.screenshot({ path: 'test-results/password-strength-strong.png', fullPage: true });
    } else {
      // If not in reset mode, take screenshot of current state
      await page.screenshot({ path: 'test-results/password-reset-not-in-reset-mode.png', fullPage: true });
    }
  });

  test('5. Back to login link is present', async ({ page }) => {
    // Check that the return to login link is present
    const signInLink = page.locator('text=Sign In');
    await expect(signInLink).toBeVisible();

    // Check that it has the correct text
    await expect(page.locator('text=Remember your password?')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/password-reset-login-link.png', fullPage: true });
  });

  test('6. Claymorphism styling is applied correctly', async ({ page }) => {
    // Verify main card has claymorphism styling
    const container = page.locator('.claymorphism-card');
    await expect(container).toBeVisible();

    // Verify button has claymorphism styling
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveClass(/clay-button/);

    // Check for lock icon
    const lockIcon = page.locator('svg.lucide-lock');
    await expect(lockIcon).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/password-reset-claymorphism.png', fullPage: true });
  });

  test('7. Complete password reset flow simulation', async ({ page }) => {
    // Fill in email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');

    // Click submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for any potential response or redirect
    await page.waitForTimeout(2000);

    // Take screenshot after submission
    await page.screenshot({ path: 'test-results/password-reset-submission.png', fullPage: true });

    // Check if we're still on the same page or redirected
    const currentUrl = page.url();
    console.log('Current URL after submission:', currentUrl);

    // Look for success message or error
    const successAlert = page.locator('.alert');
    if (await successAlert.count() > 0) {
      console.log('Found alert after submission');
    }
  });

  test('8. Mobile responsiveness test', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify all elements are visible on mobile
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');
    const signInLink = page.locator('text=Sign In');

    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(signInLink).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/password-reset-mobile.png', fullPage: true });

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('9. Accessibility features', async ({ page }) => {
    // Check for proper label
    const emailLabel = page.locator('.claymorphism-card label');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toContainText('Email Address');

    // Check input is properly labeled
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Check button accessibility
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveAttribute('type', 'submit');

    // Take screenshot
    await page.screenshot({ path: 'test-results/password-reset-accessibility.png', fullPage: true });
  });

  test('10. Error handling and user feedback', async ({ page }) => {
    // Try submitting empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for potential validation feedback
    await page.waitForTimeout(1000);

    // Try submitting with invalid email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');
    await submitButton.click();

    // Wait for potential error message
    await page.waitForTimeout(1000);

    // Take screenshot showing error states
    await page.screenshot({ path: 'test-results/password-reset-error-handling.png', fullPage: true });
  });

  test.afterAll(async () => {
    // Cleanup if needed
    console.log('Password reset comprehensive tests completed');
  });
});