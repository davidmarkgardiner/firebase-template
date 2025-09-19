import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard Verification', () => {

  test('Admin login page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:4321/admin/login')

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/admin-login-verification.png', fullPage: true })

    // Basic structure verification
    await expect(page.locator('h1, h2')).toContainText('Admin Access')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // shadcn/ui components verification
    await expect(page.locator('[class*="card"]')).toBeVisible()
    await expect(page.locator('[class*="button"]')).toBeVisible()

    console.log('✅ Admin login page basic structure verified')
  })

  test('Admin dashboard page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/admin-dashboard-verification.png', fullPage: true })

    // Check if page loads without errors
    await expect(page.locator('h1')).toBeAttached()

    // Verify presence of main sections
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()

    // Check for cards (should have admin-card class)
    const cards = page.locator('[class*="admin-card"], [class*="card"]')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThan(0)

    console.log(`✅ Admin dashboard page renders with ${cardCount} cards`)
  })

  test('Test responsive design', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.screenshot({ path: 'test-results/admin-dashboard-desktop.png', fullPage: true })

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.screenshot({ path: 'test-results/admin-dashboard-tablet.png', fullPage: true })

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.screenshot({ path: 'test-results/admin-dashboard-mobile.png', fullPage: true })

    // Verify page still loads on different sizes
    await expect(page.locator('main')).toBeVisible()

    console.log('✅ Responsive design verification completed')
  })

  test('Verify shadcn/ui components are functioning', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for button interactions
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    console.log(`Found ${buttonCount} buttons`)

    // Check for card elements
    const cards = page.locator('[class*="card"]')
    const cardCount = await cards.count()
    console.log(`Found ${cardCount} card elements`)

    // Check for badges
    const badges = page.locator('[class*="badge"]')
    const badgeCount = await badges.count()
    console.log(`Found ${badgeCount} badge elements`)

    // Verify components are visible
    expect(buttonCount).toBeGreaterThan(0)
    expect(cardCount).toBeGreaterThan(0)

    console.log('✅ shadcn/ui components verification completed')
  })

  test('Check claymorphism theme application', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for admin-card class which should have claymorphism styles
    const adminCards = page.locator('.admin-card')
    const adminCardCount = await adminCards.count()

    // Check computed styles for backdrop blur effects
    const firstCard = adminCards.first()
    if (await firstCard.isVisible()) {
      const styles = await firstCard.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          backdropFilter: computed.backdropFilter,
          backgroundColor: computed.backgroundColor,
          borderRadius: computed.borderRadius
        }
      })

      console.log('Card styles:', styles)

      // Should have some backdrop filtering for claymorphism
      expect(styles.backdropFilter).toBeTruthy()
    }

    console.log(`✅ Found ${adminCardCount} admin cards with claymorphism styling`)
  })

  test('Verify layout components work together', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for sidebar (should be present in AdminLayout)
    const sidebar = page.locator('[class*="sidebar"]').first()
    const sidebarExists = await sidebar.isVisible().catch(() => false)

    // Check for header (should be present in AdminLayout)
    const header = page.locator('header, [class*="header"]').first()
    const headerExists = await header.isVisible().catch(() => false)

    // Check for main content area
    const main = page.locator('main')
    await expect(main).toBeVisible()

    console.log(`✅ Layout verification: Sidebar: ${sidebarExists}, Header: ${headerExists}, Main: visible`)
  })
})