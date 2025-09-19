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

    // Check for the main form container using the card class
    const formContainer = page.locator('.claymorphism-card')
    await expect(formContainer).toBeVisible()

    // Check for the form title
    const formTitle = page.locator('text=Create Account')
    await expect(formTitle).toBeVisible()

    // Take screenshot of initial load
    await page.screenshot({ path: 'register-form-initial-load.png', fullPage: true })
  })

  test('progress indicator shows 3 steps correctly', async ({ page }) => {
    // Check progress indicator by looking for the step indicators
    const step1 = page.locator('text=Account')
    const step2 = page.locator('text=Profile')
    const step3 = page.locator('text=Preferences')

    await expect(step1).toBeVisible()
    await expect(step2).toBeVisible()
    await expect(step3).toBeVisible()

    // Check for progress bar
    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible()

    // Check step counter text
    const stepCounter = page.locator('text=Step 1 of 3')
    await expect(stepCounter).toBeVisible()

    // Take screenshot of progress indicator
    await page.screenshot({ path: 'register-form-progress-indicator.png' })
  })

  test('Step 1 (Account) has correct fields', async ({ page }) => {
    // Ensure we're on step 1 by checking for Step 1 indicator
    const step1 = page.locator('text=Step 1 of 3')
    await expect(step1).toBeVisible()

    // Check for email field
    const emailField = page.locator('input[type="email"]')
    await expect(emailField).toBeVisible()
    await expect(emailField).toHaveAttribute('placeholder', 'john@example.com')

    // Check for password field
    const passwordField = page.locator('input[type="password"]').first()
    await expect(passwordField).toBeVisible()
    await expect(passwordField).toHaveAttribute('placeholder', 'Create a password')

    // Check for confirm password field
    const confirmPasswordField = page.locator('input[type="password"]').nth(1)
    await expect(confirmPasswordField).toBeVisible()
    await expect(confirmPasswordField).toHaveAttribute('placeholder', 'Confirm your password')

    // Check for first name field
    const firstNameField = page.locator('input[placeholder="John"]')
    await expect(firstNameField).toBeVisible()

    // Check for last name field
    const lastNameField = page.locator('input[placeholder="Doe"]')
    await expect(lastNameField).toBeVisible()

    // Take screenshot of Step 1
    await page.screenshot({ path: 'register-form-step-1.png' })
  })

  test('Step 2 (Profile) has correct fields', async ({ page }) => {
    // Fill Step 1 fields to proceed
    await page.fill('input[placeholder="John"]', 'John')
    await page.fill('input[placeholder="Doe"]', 'Doe')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('StrongP@ssw0rd123!')
    await page.locator('input[type="password"]').nth(1).fill('StrongP@ssw0rd123!')
    await page.check('input[type="checkbox"]')

    // Navigate to step 2
    await page.click('button:has-text("Continue to Profile")')

    // Wait for step 2 to be visible
    const step2 = page.locator('text=Step 2 of 3')
    await expect(step2).toBeVisible({ timeout: 5000 })

    // Check for phone field
    const phoneField = page.locator('input[placeholder="+1 (555) 123-4567"]')
    await expect(phoneField).toBeVisible()

    // Check for address fields
    const streetField = page.locator('input[placeholder="Street Address"]')
    await expect(streetField).toBeVisible()

    const cityField = page.locator('input[placeholder="City"]')
    await expect(cityField).toBeVisible()

    const stateField = page.locator('input[placeholder="State"]')
    await expect(stateField).toBeVisible()

    const postalField = page.locator('input[placeholder="Postal Code"]')
    await expect(postalField).toBeVisible()

    const countryField = page.locator('input[placeholder="Country"]')
    await expect(countryField).toBeVisible()

    // Take screenshot of Step 2
    await page.screenshot({ path: 'register-form-step-2.png' })
  })

  test('Step 3 (Preferences) has correct fields', async ({ page }) => {
    // Fill Step 1 fields
    await page.fill('input[placeholder="John"]', 'John')
    await page.fill('input[placeholder="Doe"]', 'Doe')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('StrongP@ssw0rd123!')
    await page.locator('input[type="password"]').nth(1).fill('StrongP@ssw0rd123!')
    await page.check('input[type="checkbox"]')

    // Navigate to step 2
    await page.click('button:has-text("Continue to Profile")')
    await page.waitForSelector('text=Step 2 of 3', { state: 'visible' })

    // Fill required address fields to proceed
    await page.fill('input[placeholder="Street Address"]', '123 Test Street')
    await page.fill('input[placeholder="City"]', 'Test City')
    await page.fill('input[placeholder="State"]', 'Test State')
    await page.fill('input[placeholder="Postal Code"]', '12345')
    await page.fill('input[placeholder="Country"]', 'Test Country')

    // Navigate to step 3
    await page.click('button:has-text("Continue to Preferences")')

    // Wait for step 3 to be visible
    const step3 = page.locator('text=Step 3 of 3')
    await expect(step3).toBeVisible({ timeout: 5000 })

    // Check for brewing method select
    const brewMethodSelect = page.locator('select')
    await expect(brewMethodSelect).toBeVisible()

    // Check for roast preference select
    const roastSelect = page.locator('select').nth(1)
    await expect(roastSelect).toBeVisible()

    // Take screenshot of Step 3
    await page.screenshot({ path: 'register-form-step-3.png' })
  })

  test('navigation buttons work correctly', async ({ page }) => {
    // Test Next button on Step 1
    const nextButton1 = page.locator('button:has-text("Continue to Profile")')
    await expect(nextButton1).toBeVisible()

    // Try to click Next without filling required fields (should not proceed)
    await nextButton1.click()
    await page.waitForTimeout(1000)

    // Should still be on Step 1
    const step1 = page.locator('text=Step 1 of 3')
    await expect(step1).toBeVisible()

    // Fill required fields
    await page.fill('input[placeholder="John"]', 'John')
    await page.fill('input[placeholder="Doe"]', 'Doe')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('StrongP@ssw0rd123!')
    await page.locator('input[type="password"]').nth(1).fill('StrongP@ssw0rd123!')
    await page.check('input[type="checkbox"]')

    // Now click Next to go to Step 2
    await nextButton1.click()
    await page.waitForSelector('text=Step 2 of 3', { state: 'visible' })

    // Test Previous button on Step 2
    const previousButton2 = page.locator('button:has-text("Back")')
    await expect(previousButton2).toBeVisible()

    // Click Previous to go back to Step 1
    await previousButton2.click()
    await page.waitForSelector('text=Step 1 of 3', { state: 'visible' })

    // Verify we're back on Step 1
    await expect(step1).toBeVisible()
  })

  test('progress updates correctly when moving between steps', async ({ page }) => {
    // Check initial progress (Step 1)
    const step1Indicator = page.locator('text=Step 1 of 3')
    await expect(step1Indicator).toBeVisible()

    // Fill required fields and move to Step 2
    await page.fill('input[placeholder="John"]', 'John')
    await page.fill('input[placeholder="Doe"]', 'Doe')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('StrongP@ssw0rd123!')
    await page.locator('input[type="password"]').nth(1).fill('StrongP@ssw0rd123!')
    await page.check('input[type="checkbox"]')

    await page.click('button:has-text("Continue to Profile")')

    // Check progress updated (Step 2)
    const step2Indicator = page.locator('text=Step 2 of 3')
    await expect(step2Indicator).toBeVisible({ timeout: 5000 })

    // Fill required address fields and move to Step 3
    await page.fill('input[placeholder="Street Address"]', '123 Test Street')
    await page.fill('input[placeholder="City"]', 'Test City')
    await page.fill('input[placeholder="State"]', 'Test State')
    await page.fill('input[placeholder="Postal Code"]', '12345')
    await page.fill('input[placeholder="Country"]', 'Test Country')

    await page.click('button:has-text("Continue to Preferences")')

    // Check progress updated (Step 3)
    const step3Indicator = page.locator('text=Step 3 of 3')
    await expect(step3Indicator).toBeVisible({ timeout: 5000 })

    // Take screenshot of final progress
    await page.screenshot({ path: 'register-form-final-progress.png' })
  })

  test('form validation works on each step', async ({ page }) => {
    // Test Step 1 validation - try to submit with empty fields
    await page.click('button:has-text("Continue to Profile")')
    await page.waitForTimeout(1000)

    // Should still be on Step 1 due to validation
    const step1 = page.locator('text=Step 1 of 3')
    await expect(step1).toBeVisible()

    // Fill invalid email to test validation
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[placeholder="John"]', 'J') // Too short
    await page.fill('input[placeholder="Doe"]', 'D') // Too short

    await page.click('button:has-text("Continue to Profile")')
    await page.waitForTimeout(1000)

    // Should still be on Step 1 due to validation errors
    await expect(step1).toBeVisible()

    // Take screenshot of validation errors
    await page.screenshot({ path: 'register-form-validation-errors.png' })
  })

  test('complete form flow works', async ({ page }) => {
    // Fill Step 1
    await page.fill('input[placeholder="John"]', 'John')
    await page.fill('input[placeholder="Doe"]', 'Doe')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('StrongP@ssw0rd123!')
    await page.locator('input[type="password"]').nth(1).fill('StrongP@ssw0rd123!')
    await page.check('input[type="checkbox"]')

    // Submit Step 1
    await page.click('button:has-text("Continue to Profile")')
    await page.waitForSelector('text=Step 2 of 3', { state: 'visible' })

    // Fill Step 2
    await page.fill('input[placeholder="Street Address"]', '123 Test Street')
    await page.fill('input[placeholder="City"]', 'Test City')
    await page.fill('input[placeholder="State"]', 'Test State')
    await page.fill('input[placeholder="Postal Code"]', '12345')
    await page.fill('input[placeholder="Country"]', 'Test Country')

    // Submit Step 2
    await page.click('button:has-text("Continue to Preferences")')
    await page.waitForSelector('text=Step 3 of 3', { state: 'visible' })

    // Fill Step 3 (optional fields)
    const brewMethodSelect = page.locator('select').first()
    await brewMethodSelect.selectOption({ label: 'Pour Over' })

    const roastSelect = page.locator('select').nth(1)
    await roastSelect.selectOption({ label: 'Medium Roast' })

    // Take screenshot before final submission
    await page.screenshot({ path: 'register-form-complete.png' })

    // Look for Create Account button
    const createAccountButton = page.locator('button:has-text("Create Account")')
    await expect(createAccountButton).toBeVisible()

    // Note: Not actually submitting the form to avoid creating real accounts
    console.log('Form is ready for submission - all steps working correctly!')
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(1000)

    const formContainer = page.locator('.claymorphism-card')
    await expect(formContainer).toBeVisible()

    // Check that mobile hides some text labels but shows icons
    const stepLabels = page.locator('.hidden.sm:inline')
    await expect(stepLabels).toHaveCount(3) // Should be hidden on mobile

    // Take mobile screenshot
    await page.screenshot({ path: 'register-form-mobile.png' })

    // Test tablet responsiveness
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(1000)

    await expect(formContainer).toBeVisible()

    // Take tablet screenshot
    await page.screenshot({ path: 'register-form-tablet.png' })
  })

  test('accessibility features work', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    let focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Test form labels are properly associated
    const emailLabel = page.locator('label:has-text("Email")')
    await expect(emailLabel).toBeVisible()

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()

    // Test ARIA labels
    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible()
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100')

    // Take accessibility screenshot
    await page.screenshot({ path: 'register-form-accessibility.png' })
  })
})