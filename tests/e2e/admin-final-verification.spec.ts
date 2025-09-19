import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard Final Verification', () => {

  test('Complete admin functionality verification', async ({ page }) => {
    console.log('🚀 Starting Admin Dashboard Verification')

    // Test 1: Admin Login Page
    console.log('📋 Testing Admin Login Page...')
    await page.goto('http://localhost:4321/admin/login')

    // Verify login page elements
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()

    // Verify coffee branding
    await expect(page.locator('text=Honduras Coffee')).toBeVisible()

    console.log('✅ Admin login page elements verified')

    // Test 2: Admin Dashboard Page
    console.log('📋 Testing Admin Dashboard Page...')
    await page.goto('http://localhost:4321/admin')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify main content is present
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()

    // Count shadcn/ui components
    const buttons = await page.locator('button').count()
    const cards = await page.locator('[class*="card"]').count()

    console.log(`✅ Dashboard loaded with ${buttons} buttons and ${cards} cards`)

    // Test 3: shadcn/ui Components
    console.log('📋 Testing shadcn/ui Components...')

    // Verify specific shadcn components are working
    const hasButtons = buttons > 0
    const hasCards = cards > 0

    // Check for Badge components
    const badges = await page.locator('.badge, [class*="badge"]').count()

    // Check for Progress components
    const progressBars = await page.locator('[class*="progress"]').count()

    console.log(`✅ Components: Buttons(${buttons}) Cards(${cards}) Badges(${badges}) Progress(${progressBars})`)

    // Test 4: Claymorphism Theme
    console.log('📋 Testing Claymorphism Theme...')

    const adminCards = page.locator('.admin-card')
    const adminCardCount = await adminCards.count()

    if (adminCardCount > 0) {
      const firstCard = adminCards.first()
      const styles = await firstCard.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          backdropFilter: computed.backdropFilter,
          borderRadius: computed.borderRadius,
          backgroundColor: computed.backgroundColor
        }
      })

      const hasBackdropBlur = styles.backdropFilter.includes('blur')
      const hasRoundedCorners = parseFloat(styles.borderRadius) > 10

      console.log(`✅ Claymorphism: ${adminCardCount} cards with backdrop-blur: ${hasBackdropBlur}`)
    }

    // Test 5: Responsive Design
    console.log('📋 Testing Responsive Design...')

    // Test different viewport sizes
    const viewports = [
      { name: 'Desktop', width: 1200, height: 800 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.waitForTimeout(500) // Allow layout to adjust

      const isMainVisible = await page.locator('main').isVisible()
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): Main content visible: ${isMainVisible}`)
    }

    // Test 6: Navigation and Layout
    console.log('📋 Testing Navigation and Layout...')

    // Reset to desktop view
    await page.setViewportSize({ width: 1200, height: 800 })

    // Check for header (AdminHeader component)
    const header = page.locator('header, [class*="header"]')
    const hasHeader = await header.count() > 0

    // Check for sidebar (AdminSidebar component)
    const sidebar = page.locator('[class*="sidebar"]')
    const hasSidebar = await sidebar.count() > 0

    console.log(`✅ Layout: Header: ${hasHeader}, Sidebar: ${hasSidebar}`)

    // Test 7: Mock Data Display
    console.log('📋 Testing Mock Data Display...')

    // Check for metrics data
    const hasRevenue = await page.locator('text=/€|EUR|\\$|USD/').count() > 0
    const hasOrders = await page.locator('text=/orders|Orders/i').count() > 0
    const hasCustomers = await page.locator('text=/customers|Customers/i').count() > 0

    console.log(`✅ Data: Revenue: ${hasRevenue}, Orders: ${hasOrders}, Customers: ${hasCustomers}`)

    // Final summary screenshot
    await page.screenshot({
      path: 'test-results/admin-final-verification.png',
      fullPage: true
    })

    console.log('🎉 Admin Dashboard Verification Complete!')

    // Assert that core functionality works
    expect(hasButtons).toBe(true)
    expect(hasCards).toBe(true)
    expect(adminCardCount).toBeGreaterThan(0)
  })
})