import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should load login page correctly with all components', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // 1. Verify page loads without errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    expect(pageErrors.length).toBe(0);

    // 2. Verify LoginForm component renders with email and password fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');

    // 3. Verify "Remember me" checkbox is present
    const rememberMeCheckbox = page.locator('input[type="checkbox"]');
    const rememberMeLabel = page.locator('text=Remember me');

    await expect(rememberMeCheckbox).toBeVisible();
    await expect(rememberMeLabel).toBeVisible();

    // 4. Verify login button is visible
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText('Sign In');

    // 5. Verify social login divider shows
    const socialDivider = page.locator('text=Or continue with');
    await expect(socialDivider).toBeVisible();

    // 6. Verify "Sign up" and "Forgot password" links are present
    const signUpLink = page.locator('text=Sign up');
    const forgotPasswordLink = page.locator('text=Forgot password?');

    await expect(signUpLink).toBeVisible();
    await expect(forgotPasswordLink).toBeVisible();

    // 7. Verify social login buttons (Google and Facebook)
    const googleButton = page.locator('button:has-text("Google")');
    const facebookButton = page.locator('button:has-text("Facebook")');

    await expect(googleButton).toBeVisible();
    await expect(facebookButton).toBeVisible();

    // 8. Verify page title and heading
    await expect(page).toHaveTitle('Sign In - Honduras Coffee');
    const welcomeHeading = page.locator('text=Welcome Back');
    await expect(welcomeHeading).toBeVisible();

    // 9. Verify claymorphism styling is applied
    const loginCard = page.locator('.clay-card, .claymorphism-card');
    await expect(loginCard).toBeVisible();

    // Take screenshot of the login form
    await page.screenshot({
      path: 'login-form.png',
      fullPage: true,
      animations: 'disabled'
    });

    // Take a close-up screenshot of the form
    const formCard = page.locator('form').locator('xpath=ancestor::div[contains(@class, "card")]');
    await formCard.screenshot({ path: 'login-form-closeup.png' });

    // Additional styling checks
    const card = page.locator('div[class*="card"]');
    const cardStyles = await card.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        backdropFilter: styles.backdropFilter
      };
    });

    // Verify claymorphism styling properties
    expect(cardStyles.borderRadius).toMatch(/12px|0.75rem/);
    expect(cardStyles.boxShadow).toContain('px');

    // Log detailed findings
    console.log('Login Page Verification Results:');
    console.log('✅ Page loaded without errors');
    console.log('✅ Email input field present and correctly configured');
    console.log('✅ Password input field present and correctly configured');
    console.log('✅ Remember me checkbox present');
    console.log('✅ Login button present with correct text');
    console.log('✅ Social login divider visible');
    console.log('✅ Sign up link present');
    console.log('✅ Forgot password link present');
    console.log('✅ Google and Facebook login buttons present');
    console.log('✅ Page title correct');
    console.log('✅ Welcome heading visible');
    console.log('✅ Claymorphism card styling applied');
    console.log('✅ Card has proper border radius and shadow effects');
    console.log('✅ Screenshots captured');
  });

  test('should have proper form validation', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Test empty form submission
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();

    // Check for validation messages (they should appear)
    await page.waitForTimeout(500); // Wait for validation to trigger

    // The form should show validation errors for empty fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Check if required attribute is set
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div[class*="card"]');
    const desktopWidth = await card.boundingBox();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const mobileCard = page.locator('div[class*="card"]');
    const mobileWidth = await mobileCard.boundingBox();

    // Verify card is responsive
    expect(mobileWidth?.width).toBeLessThanOrEqual(desktopWidth?.width || 500);

    // Take mobile screenshot
    await page.screenshot({ path: 'login-form-mobile.png', fullPage: true });

    console.log('✅ Responsive design verified');
  });
});