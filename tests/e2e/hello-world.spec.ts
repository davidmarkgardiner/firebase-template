import { test, expect } from '@playwright/test'

test.describe('Hello World Integration Test', () => {
  test('should display hello world page with all integrations', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.locator('h1')).toContainText('Hello World!')

    // Check integration status cards
    await expect(page.locator('text=Supabase Integration')).toBeVisible()
    await expect(page.locator('text=Stripe Integration')).toBeVisible()

    // Check tech stack display
    await expect(page.locator('text=Tech Stack')).toBeVisible()
    await expect(page.locator('text=Astro')).toBeVisible()
    await expect(page.locator('text=React')).toBeVisible()
    await expect(page.locator('text=TypeScript')).toBeVisible()

    // Check buttons
    await expect(page.locator('button:has-text("Test Integration")')).toBeVisible()
    await expect(page.locator('button:has-text("Refresh Status")')).toBeVisible()

    // Check features section
    await expect(page.locator('text=Coffee Shop')).toBeVisible()
    await expect(page.locator('text=Yoga Studio')).toBeVisible()
  })

  test('should handle test integration button click', async ({ page }) => {
    await page.goto('/')

    // Set up dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Hello World! All integrations are working!')
      await dialog.accept()
    })

    // Click test integration button
    await page.click('button:has-text("Test Integration")')
  })

  test('should refresh integration status', async ({ page }) => {
    await page.goto('/')

    // Wait for initial load
    await page.waitForTimeout(1000)

    // Click refresh button
    await page.click('button:has-text("Refresh Status")')

    // Status should still be visible (checking it doesn't break)
    await expect(page.locator('text=Supabase Integration')).toBeVisible()
  })
})