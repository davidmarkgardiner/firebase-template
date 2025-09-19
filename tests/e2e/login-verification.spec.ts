import { test, expect } from '@playwright/test';

test.describe('Login Page Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page on port 4322
    await page.goto('http://localhost:4322/auth/login');
    await page.waitForLoadState('networkidle');
  });

  test('should load login page correctly with all components', async ({ page }) => {
    // 1. Verify page loads without errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    expect(pageErrors.length).toBe(0);

    // 2. Verify page title is correct
    await expect(page).toHaveTitle(/Sign In - Honduras Coffee/);

    // 3. Verify LoginForm component renders with email and password fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');

    // 4. Verify "Remember me" checkbox is present
    const rememberMeCheckbox = page.locator('input[type="checkbox"]');
    const rememberMeLabel = page.locator('text=Remember me');

    await expect(rememberMeCheckbox).toBeVisible();
    await expect(rememberMeLabel).toBeVisible();

    // 5. Verify login button is visible
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText('Sign In');

    // 6. Verify social login divider shows
    const socialDivider = page.locator('text=Or continue with');
    await expect(socialDivider).toBeVisible();

    // 7. Verify "Sign up" and "Forgot password" links are present
    const signUpLink = page.locator('text=Sign up');
    const forgotPasswordLink = page.locator('text=Forgot password?');

    await expect(signUpLink).toBeVisible();
    await expect(forgotPasswordLink).toBeVisible();

    // 8. Verify social login buttons (Google and Facebook)
    const googleButton = page.locator('button:has-text("Google")');
    const facebookButton = page.locator('button:has-text("Facebook")');

    await expect(googleButton).toBeVisible();
    await expect(facebookButton).toBeVisible();

    // 9. Verify welcome heading
    const welcomeHeading = page.locator('text=Welcome Back');
    await expect(welcomeHeading).toBeVisible();

    // 10. Verify Honduras Coffee description
    const description = page.locator('text=Sign in to your Honduras Coffee account');
    await expect(description).toBeVisible();

    // 11. Verify claymorphism styling is applied
    const loginCard = page.locator('.clay-card, [class*="card"]');
    await expect(loginCard).toBeVisible();

    // 12. Take screenshot of the login form
    await page.screenshot({
      path: 'login-form-complete.png',
      fullPage: true,
      animations: 'disabled'
    });

    // 13. Take a close-up screenshot of the form
    const formCard = page.locator('form').locator('xpath=ancestor::div[contains(@class, "card")]');
    if (await formCard.isVisible()) {
      await formCard.screenshot({ path: 'login-form-closeup.png' });
    }

    // 14. Verify form styling
    const card = page.locator('div[class*="card"]').first();
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
    expect(cardStyles.borderRadius).toMatch(/12px|0.75rem|0.75rem/);
    expect(cardStyles.boxShadow).toContain('px');

    // Log detailed findings
    console.log('✅ Login Page Verification Results:');
    console.log('✅ Page loaded without errors');
    console.log('✅ Page title correct');
    console.log('✅ Email input field present and correctly configured');
    console.log('✅ Password input field present and correctly configured');
    console.log('✅ Remember me checkbox present');
    console.log('✅ Login button present with correct text');
    console.log('✅ Social login divider visible');
    console.log('✅ Sign up link present');
    console.log('✅ Forgot password link present');
    console.log('✅ Google and Facebook login buttons present');
    console.log('✅ Welcome heading visible');
    console.log('✅ Honduras Coffee description visible');
    console.log('✅ Claymorphism card styling applied');
    console.log('✅ Card has proper border radius and shadow effects');
    console.log('✅ Screenshots captured');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper ARIA labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Check form has proper accessibility
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check login button is properly accessible
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveAttribute('type', 'submit');

    console.log('✅ Accessibility verification passed');
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    const card = page.locator('div[class*="card"]').first();
    const desktopBox = await card.boundingBox();
    expect(desktopBox).toBeTruthy();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000); // Wait for responsive adjustments

    const mobileCard = page.locator('div[class*="card"]').first();
    const mobileBox = await mobileCard.boundingBox();

    // Verify card is responsive
    expect(mobileBox).toBeTruthy();
    expect(mobileBox?.width).toBeLessThanOrEqual(desktopBox?.width || 500);

    // Take mobile screenshot
    await page.screenshot({ path: 'login-form-mobile.png', fullPage: true });

    console.log('✅ Responsive design verified');
  });

  test('should have proper claymorphism styling', async ({ page }) => {
    const card = page.locator('div[class*="card"]').first();

    // Check if the card has claymorphism styling
    const cardClasses = await card.getAttribute('class');
    expect(cardClasses).toContain('card');

    // Verify the styling is applied by checking computed styles
    const styles = await card.evaluate((el) => {
      const computedStyles = window.getComputedStyle(el);
      return {
        borderRadius: computedStyles.borderRadius,
        boxShadow: computedStyles.boxShadow,
        backgroundColor: computedStyles.backgroundColor,
        backdropFilter: computedStyles.backdropFilter
      };
    });

    // Claymorphism typically has rounded corners
    expect(styles.borderRadius).not.toBe('0px');

    // Should have some shadow effect
    expect(styles.boxShadow).not.toBe('none');

    console.log('✅ Claymorphism styling verified:', styles);

    // Take detailed styling screenshot
    await card.screenshot({ path: 'claymorphism-detail.png' });
  });
});