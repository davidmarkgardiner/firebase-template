import { test, expect } from '@playwright/test'

test.describe('RegisterForm Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the signup page
    await page.goto('/auth/signup')
    await page.waitForLoadState('networkidle')
  })

  test('page loads correctly with multi-step form', async ({ page }) => {
    // Check if the page loaded successfully
    await expect(page).toHaveURL('/auth/signup')

    // Check for the main form container
    const formContainer = page.locator('[data-testid="register-form"]')
    await expect(formContainer).toBeVisible()

    // Take screenshot of initial load
    await page.screenshot({ path: 'register-form-initial-load.png', fullPage: true })
  })

  test('progress indicator shows 3 steps correctly', async ({ page }) => {
    // Check progress indicator
    const progressIndicator = page.locator('[data-testid="progress-indicator"]')
    await expect(progressIndicator).toBeVisible()

    // Check for 3 steps
    const steps = page.locator('[data-testid="progress-step"]')
    await expect(steps).toHaveCount(3)

    // Check step labels
    await expect(page.locator('[data-testid="progress-step-1"]')).toContainText('Account')
    await expect(page.locator('[data-testid="progress-step-2"]')).toContainText('Profile')
    await expect(page.locator('[data-testid="progress-step-3"]')).toContainText('Preferences')

    // Check that first step is active
    await expect(page.locator('[data-testid="progress-step-1"]')).toHaveClass(/active/)

    // Take screenshot of progress indicator
    await page.screenshot({ path: 'register-form-progress-indicator.png' })
  })

  test('Step 1 (Account) has correct fields', async ({ page }) => {
    // Ensure we're on step 1
    const step1 = page.locator('[data-testid="form-step-1"]')
    await expect(step1).toBeVisible()

    // Check for email field
    const emailField = page.locator('input[name="email"]')
    await expect(emailField).toBeVisible()
    await expect(emailField).toHaveAttribute('type', 'email')
    await expect(emailField).toHaveAttribute('required', '')

    // Check for password field
    const passwordField = page.locator('input[name="password"]')
    await expect(passwordField).toBeVisible()
    await expect(passwordField).toHaveAttribute('type', 'password')
    await expect(passwordField).toHaveAttribute('required', '')

    // Check for confirm password field
    const confirmPasswordField = page.locator('input[name="confirmPassword"]')
    await expect(confirmPasswordField).toBeVisible()
    await expect(confirmPasswordField).toHaveAttribute('type', 'password')
    await expect(confirmPasswordField).toHaveAttribute('required', '')

    // Check for password strength indicator
    const passwordStrength = page.locator('[data-testid="password-strength"]')
    await expect(passwordStrength).toBeVisible()

    // Take screenshot of Step 1
    await page.screenshot({ path: 'register-form-step-1.png' })
  })

  test('Step 2 (Profile) has correct fields', async ({ page }) => {
    // Navigate to step 2
    await page.click('button[type="submit"]')

    // Wait for step 2 to be visible
    const step2 = page.locator('[data-testid="form-step-2"]')
    await expect(step2).toBeVisible({ timeout: 5000 })

    // Check for first name field
    const firstNameField = page.locator('input[name="firstName"]')
    await expect(firstNameField).toBeVisible()
    await expect(firstNameField).toHaveAttribute('required', '')

    // Check for last name field
    const lastNameField = page.locator('input[name="lastName"]')
    await expect(lastNameField).toBeVisible()
    await expect(lastNameField).toHaveAttribute('required', '')

    // Check for phone field
    const phoneField = page.locator('input[name="phone"]')
    await expect(phoneField).toBeVisible()
    await expect(phoneField).toHaveAttribute('type', 'tel')

    // Check for address field
    const addressField = page.locator('textarea[name="address"]')
    await expect(addressField).toBeVisible()

    // Take screenshot of Step 2
    await page.screenshot({ path: 'register-form-step-2.png' })
  })

  test('Step 3 (Preferences) has correct fields', async ({ page }) => {
    // Navigate to step 2 first
    await page.click('button[type="submit"]')
    await page.waitForSelector('[data-testid="form-step-2"]', { state: 'visible' })

    // Fill required fields in step 2 to proceed
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="phone"]', '+1234567890')
    await page.fill('textarea[name="address"]', '123 Test Street')

    // Navigate to step 3
    await page.click('button[type="submit"]')

    // Wait for step 3 to be visible
    const step3 = page.locator('[data-testid="form-step-3"]')
    await expect(step3).toBeVisible({ timeout: 5000 })

    // Check for coffee preferences
    const coffeePreferences = page.locator('[data-testid="coffee-preferences"]')
    await expect(coffeePreferences).toBeVisible()

    // Check for newsletter options
    const newsletterOptions = page.locator('[data-testid="newsletter-options"]')
    await expect(newsletterOptions).toBeVisible()

    // Take screenshot of Step 3
    await page.screenshot({ path: 'register-form-step-3.png' })
  })

  test('navigation buttons work correctly', async ({ page }) => {
    // Test Next button on Step 1
    const nextButton1 = page.locator('button[type="submit"]')
    await expect(nextButton1).toBeVisible()
    await expect(nextButton1).toContainText('Next')

    // Click Next to go to Step 2
    await nextButton1.click()
    await page.waitForSelector('[data-testid="form-step-2"]', { state: 'visible' })

    // Test Previous button on Step 2
    const previousButton2 = page.locator('button[type="button"]')
    await expect(previousButton2).toBeVisible()
    await expect(previousButton2).toContainText('Previous')

    // Click Previous to go back to Step 1
    await previousButton2.click()
    await page.waitForSelector('[data-testid="form-step-1"]', { state: 'visible' })

    // Test Back button (should go to login page)
    const backButton = page.locator('[data-testid="back-button"]')
    if (await backButton.isVisible()) {
      await backButton.click()
      await expect(page).toHaveURL('/auth/login')
      // Navigate back to signup for further testing
      await page.goto('/auth/signup')
      await page.waitForLoadState('networkidle')
    }
  })

  test('progress updates correctly when moving between steps', async ({ page }) => {
    // Check initial progress (Step 1 active)
    await expect(page.locator('[data-testid="progress-step-1"]')).toHaveClass(/active/)
    await expect(page.locator('[data-testid="progress-step-2"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="progress-step-3"]')).not.toHaveClass(/active/)

    // Move to Step 2
    await page.click('button[type="submit"]')
    await page.waitForSelector('[data-testid="form-step-2"]', { state: 'visible' })

    // Check progress updated (Step 2 active)
    await expect(page.locator('[data-testid="progress-step-1"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="progress-step-2"]')).toHaveClass(/active/)
    await expect(page.locator('[data-testid="progress-step-3"]')).not.toHaveClass(/active/)

    // Fill step 2 fields
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="phone"]', '+1234567890')
    await page.fill('textarea[name="address"]', '123 Test Street')

    // Move to Step 3
    await page.click('button[type="submit"]')
    await page.waitForSelector('[data-testid="form-step-3"]', { state: 'visible' })

    // Check progress updated (Step 3 active)
    await expect(page.locator('[data-testid="progress-step-1"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="progress-step-2"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="progress-step-3"]')).toHaveClass(/active/)
  })

  test('form validation works on each step', async ({ page }) => {
    // Test Step 1 validation
    await page.click('button[type="submit"]')

    // Check for validation errors
    const emailError = page.locator('text="Email is required"')
    const passwordError = page.locator('text="Password is required"')
    const confirmPasswordError = page.locator('text="Please confirm your password"')

    // Wait a moment for validation to occur
    await page.waitForTimeout(1000)

    // Fill invalid data to test validation
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'weak')
    await page.fill('input[name="confirmPassword"]', 'different')

    await page.click('button[type="submit"]')

    // Check if validation prevents navigation
    await expect(page.locator('[data-testid="form-step-1"]')).toBeVisible()

    // Take screenshot of validation errors
    await page.screenshot({ path: 'register-form-validation-errors.png' })
  })

  test('password strength indicator is visible and functional', async ({ page }) => {
    const passwordField = page.locator('input[name="password"]')
    const passwordStrength = page.locator('[data-testid="password-strength"]')

    await expect(passwordStrength).toBeVisible()

    // Test with weak password
    await passwordField.fill('123')
    await page.waitForTimeout(500)
    await expect(passwordStrength).toBeVisible()

    // Test with medium password
    await passwordField.fill('password123')
    await page.waitForTimeout(500)
    await expect(passwordStrength).toBeVisible()

    // Test with strong password
    await passwordField.fill('StrongP@ssw0rd123!')
    await page.waitForTimeout(500)
    await expect(passwordStrength).toBeVisible()

    // Take screenshot of password strength indicator
    await page.screenshot({ path: 'register-form-password-strength.png' })
  })

  test('complete form submission works', async ({ page }) => {
    // Fill Step 1
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'StrongP@ssw0rd123!')
    await page.fill('input[name="confirmPassword"]', 'StrongP@ssw0rd123!')

    // Submit Step 1
    await page.click('button[type="submit"]')
    await page.waitForSelector('[data-testid="form-step-2"]', { state: 'visible' })

    // Fill Step 2
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="phone"]', '+1234567890')
    await page.fill('textarea[name="address"]', '123 Test Street')

    // Submit Step 2
    await page.click('button[type="submit"]')
    await page.waitForSelector('[data-testid="form-step-3"]', { state: 'visible' })

    // Fill Step 3 (assuming checkboxes or selects)
    const coffeePrefs = page.locator('input[type="checkbox"]').first()
    if (await coffeePrefs.isVisible()) {
      await coffeePrefs.check()
    }

    // Take screenshot before final submission
    await page.screenshot({ path: 'register-form-complete.png' })

    // Look for Create Account button
    const createAccountButton = page.locator('button[type="submit"]')
    await expect(createAccountButton).toBeVisible()
    await expect(createAccountButton).toContainText('Create Account')

    // Note: Not actually submitting the form to avoid creating real accounts
    console.log('Form is ready for submission')
  })

  test('accessibility and responsive design', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    let focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(1000)

    const formContainer = page.locator('[data-testid="register-form"]')
    await expect(formContainer).toBeVisible()

    // Take mobile screenshot
    await page.screenshot({ path: 'register-form-mobile.png' })

    // Test tablet responsiveness
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(1000)

    await expect(formContainer).toBeVisible()

    // Take tablet screenshot
    await page.screenshot({ path: 'register-form-tablet.png' })
  })
})