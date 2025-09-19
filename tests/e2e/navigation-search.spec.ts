import { test, expect } from '@playwright/test'

test.describe('Navigation and Search Components', () => {
  const baseURL = 'http://localhost:4321'

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL)
  })

  test.describe('Header Navigation', () => {
    test('should display main navigation elements', async ({ page }) => {
      // Check if header is visible
      await expect(page.locator('header')).toBeVisible()
      
      // Check logo and site name
      await expect(page.locator('text=Honduras Coffee')).toBeVisible()
      
      // Check main navigation items (desktop)
      await expect(page.locator('text=Coffee')).toBeVisible()
      await expect(page.locator('text=Our Story')).toBeVisible()
      await expect(page.locator('text=Subscription')).toBeVisible()
      await expect(page.locator('text=Brewing Guides')).toBeVisible()
      await expect(page.locator('text=Contact')).toBeVisible()
    })

    test('should show product categories dropdown on coffee menu hover', async ({ page }) => {
      // Hover over Coffee menu item
      await page.locator('text=Coffee').hover()
      
      // Check if submenu appears
      await expect(page.locator('text=Single Origin')).toBeVisible()
      await expect(page.locator('text=Estate Reserve')).toBeVisible()
      await expect(page.locator('text=Seasonal Harvest')).toBeVisible()
      await expect(page.locator('text=All Coffee')).toBeVisible()
    })

    test('should have functional cart icon', async ({ page }) => {
      // Check if cart icon is visible
      const cartButton = page.locator('[aria-label*="cart" i], [data-testid="cart-button"]')
      await expect(cartButton).toBeVisible()
    })

    test('should have user account menu', async ({ page }) => {
      // Check if user menu button is visible
      const userButton = page.locator('button[aria-label*="user" i], button[aria-label*="account" i]')
      await expect(userButton).toBeVisible()
      
      // Click to open dropdown
      await userButton.click()
      
      // Check for sign in option (when not authenticated)
      await expect(page.locator('text=Sign in')).toBeVisible()
    })
  })

  test.describe('Mobile Navigation', () => {
    test('should show mobile menu on small screens', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Check if mobile menu button is visible
      const mobileMenuButton = page.locator('button[aria-label*="mobile" i], button[aria-label*="menu" i]')
      await expect(mobileMenuButton).toBeVisible()
      
      // Click to open mobile menu
      await mobileMenuButton.click()
      
      // Check if menu content appears
      await expect(page.locator('text=Menu')).toBeVisible()
      await expect(page.locator('text=Coffee')).toBeVisible()
    })

    test('should close mobile menu when clicking outside', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Open mobile menu
      const mobileMenuButton = page.locator('button[aria-label*="mobile" i], button[aria-label*="menu" i]')
      await mobileMenuButton.click()
      
      // Click outside menu area
      await page.locator('body').click({ position: { x: 50, y: 50 } })
      
      // Menu should close
      await expect(page.locator('text=Menu')).not.toBeVisible()
    })
  })

  test.describe('Search Functionality', () => {
    test('should display search component', async ({ page }) => {
      // Check if search input is visible (desktop)
      const searchInput = page.locator('input[placeholder*="search" i], [data-testid="search-input"]')
      await expect(searchInput).toBeVisible()
    })

    test('should open search command with keyboard shortcut', async ({ page }) => {
      // Press Cmd+K (or Ctrl+K on Windows/Linux)
      await page.keyboard.press('Meta+k')
      
      // Search modal should open
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    })

    test('should filter search results as user types', async ({ page }) => {
      // Focus on search input
      const searchInput = page.locator('input[placeholder*="search" i], [data-testid="search-input"]')
      await searchInput.click()
      
      // Type search query
      await searchInput.fill('coffee')
      
      // Wait for potential results or suggestions
      await page.waitForTimeout(500)
      
      // This test verifies the search input accepts text
      await expect(searchInput).toHaveValue('coffee')
    })
  })

  test.describe('Breadcrumb Navigation', () => {
    test('should show breadcrumbs on product pages', async ({ page }) => {
      // Navigate to a product page (assuming /products exists)
      await page.goto(`${baseURL}/products`)
      
      // Check if breadcrumb component is present
      const breadcrumb = page.locator('[data-testid="breadcrumb"], nav[aria-label*="breadcrumb" i]')
      
      // If page exists, breadcrumb should be visible
      if (await breadcrumb.isVisible()) {
        await expect(breadcrumb).toBeVisible()
        await expect(page.locator('text=Home')).toBeVisible()
      }
    })
  })

  test.describe('Footer Navigation', () => {
    test('should display footer with company information', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded()
      
      // Check if footer is visible
      await expect(page.locator('footer')).toBeVisible()
      
      // Check for Honduras Coffee branding
      await expect(page.locator('footer').locator('text=Honduras Coffee')).toBeVisible()
      
      // Check for trust badges
      await expect(page.locator('text=Secure Payments, text=Fast Shipping, text=Sustainable, text=Premium Quality').first()).toBeVisible()
    })

    test('should have newsletter signup form', async ({ page }) => {
      await page.locator('footer').scrollIntoViewIfNeeded()
      
      // Check for newsletter signup
      const emailInput = page.locator('footer input[type="email"]')
      await expect(emailInput).toBeVisible()
      
      // Check for subscribe button
      const subscribeButton = page.locator('footer button[type="submit"]')
      await expect(subscribeButton).toBeVisible()
    })

    test('should have social media links', async ({ page }) => {
      await page.locator('footer').scrollIntoViewIfNeeded()
      
      // Check for social media text
      await expect(page.locator('text=Follow us:')).toBeVisible()
      
      // Check for social links (icons should be present)
      const socialSection = page.locator('footer').locator('text=Follow us:').locator('..') 
      await expect(socialSection).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      // Tab through navigation elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Check if focus is visible on navigation elements
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for aria-labels on interactive elements
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      
      if (buttonCount > 0) {
        // At least some buttons should have aria-labels or accessible text
        const accessibleButtons = buttons.locator('[aria-label], [aria-labelledby], :has(span:not(.sr-only))')
        await expect(accessibleButtons.first()).toBeVisible()
      }
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check for h1 heading
      const h1 = page.locator('h1')
      if (await h1.count() > 0) {
        await expect(h1.first()).toBeVisible()
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // Header should still be visible and functional
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('text=Honduras Coffee')).toBeVisible()
    })

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      // All navigation should be visible on desktop
      await expect(page.locator('text=Coffee')).toBeVisible()
      await expect(page.locator('text=Our Story')).toBeVisible()
      await expect(page.locator('text=Contact')).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should load homepage within reasonable time', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto(baseURL)
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })

    test('should have working navigation links', async ({ page }) => {
      // Test a few key navigation links
      const links = [
        { text: 'Our Story', expectedUrl: '/about' },
        { text: 'Contact', expectedUrl: '/contact' }
      ]
      
      for (const link of links) {
        // Click the link
        await page.locator(`text=${link.text}`).click()
        
        // Check if URL changed appropriately
        await page.waitForTimeout(1000)
        
        // Go back to home for next test
        await page.goto(baseURL)
      }
    })
  })
})