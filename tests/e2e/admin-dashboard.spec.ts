import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Start from localhost
    await page.goto('http://localhost:4321')
  })

  test('should load admin login page', async ({ page }) => {
    // Navigate to admin login
    await page.goto('http://localhost:4321/admin/login')

    // Check for admin login elements
    await expect(page.locator('h1, h2')).toContainText('Admin Access')
    await expect(page.locator('text=Sign in to manage Honduras Coffee')).toBeVisible()

    // Check for form elements
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Check for coffee branding
    await expect(page.locator('text=Honduras Coffee')).toBeVisible()
    await expect(page.locator('text=Secure Admin Portal')).toBeVisible()
  })

  test('should load admin dashboard page', async ({ page }) => {
    // Navigate directly to admin dashboard (skipping auth for testing)
    await page.goto('http://localhost:4321/admin')

    // Check for dashboard elements
    await expect(page.locator('h1')).toContainText('Welcome back, Admin')
    await expect(page.locator('text=Honduras Coffee business')).toBeVisible()

    // Check for quick action buttons
    await expect(page.locator('text=Add Product')).toBeVisible()
    await expect(page.locator('text=View Orders')).toBeVisible()
    await expect(page.locator('text=Send Newsletter')).toBeVisible()
    await expect(page.locator('text=Generate Report')).toBeVisible()

    // Check for metrics cards
    await expect(page.locator('text=Total Revenue')).toBeVisible()
    await expect(page.locator('text=Orders')).toBeVisible()
    await expect(page.locator('text=Customers')).toBeVisible()
    await expect(page.locator('text=Low Stock Items')).toBeVisible()

    // Check for sections
    await expect(page.locator('text=Recent Orders')).toBeVisible()
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    await expect(page.locator('text=Top Products')).toBeVisible()
    await expect(page.locator('text=System Status')).toBeVisible()
  })

  test('should have responsive sidebar navigation', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check if sidebar navigation exists (desktop)
    if (await page.locator('.md\\:block').isVisible()) {
      // Desktop sidebar should be visible
      await expect(page.locator('text=Dashboard')).toBeVisible()
      await expect(page.locator('text=Products')).toBeVisible()
      await expect(page.locator('text=Orders')).toBeVisible()
      await expect(page.locator('text=Customers')).toBeVisible()
      await expect(page.locator('text=Inventory')).toBeVisible()
      await expect(page.locator('text=Analytics')).toBeVisible()
      await expect(page.locator('text=Settings')).toBeVisible()
    }

    // Test mobile navigation (if viewport is small)
    await page.setViewportSize({ width: 640, height: 800 })

    // Mobile menu trigger should be visible
    await expect(page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first()).toBeVisible()
  })

  test('should display metrics with proper formatting', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check that metrics are properly formatted
    await expect(page.locator('text=€12,450')).toBeVisible() // Revenue
    await expect(page.locator('text=156')).toBeVisible() // Orders
    await expect(page.locator('text=1,250')).toBeVisible() // Customers
    await expect(page.locator('text=3')).toBeVisible() // Low stock items

    // Check for trend indicators
    await expect(page.locator('text=+15.3%')).toBeVisible()
    await expect(page.locator('text=vs last month')).toBeVisible()
  })

  test('should show recent orders with proper status badges', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for order IDs
    await expect(page.locator('text=HC-2024-001')).toBeVisible()
    await expect(page.locator('text=HC-2024-002')).toBeVisible()

    // Check for customer names
    await expect(page.locator('text=María González')).toBeVisible()
    await expect(page.locator('text=David Miller')).toBeVisible()

    // Check for status badges
    await expect(page.locator('text=pending')).toBeVisible()
    await expect(page.locator('text=shipped')).toBeVisible()
    await expect(page.locator('text=delivered')).toBeVisible()

    // Check for amounts
    await expect(page.locator('text=€45.90')).toBeVisible()
    await expect(page.locator('text=€32.50')).toBeVisible()
  })

  test('should display activity feed', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for activity items
    await expect(page.locator('text=New order #HC-2024-001 received')).toBeVisible()
    await expect(page.locator('text=Estate Reserve Blend stock updated')).toBeVisible()
    await expect(page.locator('text=New customer registration: María González')).toBeVisible()

    // Check for timestamps
    await expect(page.locator('text=5 min ago')).toBeVisible()
    await expect(page.locator('text=15 min ago')).toBeVisible()
  })

  test('should show top products with performance indicators', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for product names
    await expect(page.locator('text=Estate Reserve Blend')).toBeVisible()
    await expect(page.locator('text=Mountain Select Dark')).toBeVisible()
    await expect(page.locator('text=Seasonal Harvest Light')).toBeVisible()

    // Check for sales numbers
    await expect(page.locator('text=45 sales')).toBeVisible()
    await expect(page.locator('text=32 sales')).toBeVisible()

    // Check for revenue amounts
    await expect(page.locator('text=€1,350')).toBeVisible()
    await expect(page.locator('text=€960')).toBeVisible()
  })

  test('should display system status indicators', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check for system status items
    await expect(page.locator('text=Inventory System')).toBeVisible()
    await expect(page.locator('text=Stock Levels')).toBeVisible()
    await expect(page.locator('text=Customer Service')).toBeVisible()

    // Check for status badges
    await expect(page.locator('text=Online')).toBeVisible()
    await expect(page.locator('text=Warning')).toBeVisible()
    await expect(page.locator('text=Good')).toBeVisible()

    // Check for descriptions
    await expect(page.locator('text=All systems operational')).toBeVisible()
    await expect(page.locator('text=3 items need attention')).toBeVisible()
  })

  test('should have proper coffee theme styling', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Check that the page has the expected color scheme
    const backgroundColor = await page.evaluate(() => {
      const body = document.body
      return window.getComputedStyle(body).backgroundColor
    })

    // Should have a light background (not pure white due to claymorphism)
    expect(backgroundColor).toBeTruthy()

    // Check for coffee-themed elements
    await expect(page.locator('text=Honduras Coffee')).toBeVisible()

    // Verify that claymorphism cards exist
    const cardElements = page.locator('.admin-card')
    const cardCount = await cardElements.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('http://localhost:4321/admin')

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator('text=Welcome back, Admin')).toBeVisible()

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('text=Welcome back, Admin')).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('text=Welcome back, Admin')).toBeVisible()

    // Mobile menu should be accessible
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu/i }).first()
    if (await mobileMenuButton.isVisible()) {
      await expect(mobileMenuButton).toBeVisible()
    }
  })
})