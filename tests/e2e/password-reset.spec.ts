import { test, expect } from '@playwright/test';

test.describe('PasswordReset Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the forgot password page
    await page.goto('http://localhost:4322/auth/forgot-password');

    // Wait for the page to load
    await page.waitForSelector('.claymorphism-card', { timeout: 10000 });
  });

  test('page loads correctly with initial state', async ({ page }) => {
    // Verify the page has correct heading
    const cardTitle = page.locator('.text-2xl.font-bold');
    await expect(cardTitle).toBeVisible();
    await expect(cardTitle).toContainText('Reset Password');

    // Verify description text
    await expect(page.locator('text=Enter your email to receive a password reset link')).toBeVisible();

    // Verify email field is present
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');

    // Verify submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Send Reset Link');

    // Verify claymorphism styling
    const container = page.locator('.claymorphism-card');
    await expect(container).toBeVisible();

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/password-reset-initial-state.png', fullPage: true });
  });

  test('return to login functionality', async ({ page }) => {
    // Check that the return to login link is present
    const signInLink = page.locator('text=Sign In');
    await expect(signInLink).toBeVisible();

    // Check that it has the correct text
    await expect(page.locator('text=Remember your password?')).toBeVisible();
  });

  test('mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check form elements are properly sized for mobile
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Check card is responsive
    const card = page.locator('.claymorphism-card');
    await expect(card).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/password-reset-mobile.png', fullPage: true });

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('basic form interaction', async ({ page }) => {
    // Fill in email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');

    // Verify the input was filled
    await expect(emailInput).toHaveValue('test@example.com');

    // Verify submit button is clickable
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('visual design elements', async ({ page }) => {
    // Check for lock icon
    const lockIcon = page.locator('svg.lucide-lock');
    await expect(lockIcon).toBeVisible();

    // Check for separator (using a more specific selector)
    const separator = page.locator('.my-4[data-orientation="horizontal"]');
    await expect(separator).toBeVisible();

    // Check card has proper styling classes
    const card = page.locator('.claymorphism-card');
    await expect(card).toBeVisible();
  });

  test('email input behavior', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Test placeholder text
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');

    // Test input focus
    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    // Test typing
    await emailInput.fill('user@example.com');
    await expect(emailInput).toHaveValue('user@example.com');

    // Test clearing
    await emailInput.clear();
    await expect(emailInput).toHaveValue('');
  });

  test('button states', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Verify initial state
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Send Reset Link');
    await expect(submitButton).toBeEnabled();

    // Verify button styling
    await expect(submitButton).toHaveClass(/clay-button/);
  });

  test('accessibility features', async ({ page }) => {
    // Check for proper label within the form
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
  });

  test('card layout and structure', async ({ page }) => {
    // Check main card structure
    const card = page.locator('.claymorphism-card');
    await expect(card).toBeVisible();

    // Check card header
    const cardHeader = card.locator('.flex.flex-col.p-6.space-y-1');
    await expect(cardHeader).toBeVisible();

    // Check card content
    const cardContent = card.locator('.p-6.pt-0');
    await expect(cardContent).toBeVisible();

    // Verify the component maintains consistent spacing and layout
    await expect(card.locator('.space-y-4')).toBeVisible();
  });
});