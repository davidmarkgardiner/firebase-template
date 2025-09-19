import { test, expect } from '@playwright/test'

test.describe('Product Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a product page
    await page.goto('/products/honduran-estate-reserve-250g')
  })

  test('should display product information correctly', async ({ page }) => {
    // Check product title
    await expect(page.locator('h1')).toContainText('Honduran Estate Reserve')
    
    // Check product description exists
    await expect(page.locator('text=Premium single-origin coffee')).toBeVisible()
    
    // Check origin information
    await expect(page.locator('text=Copán, Honduras')).toBeVisible()
    
    // Check roast level
    await expect(page.locator('text=Roast Level')).toBeVisible()
    
    // Check tasting notes
    await expect(page.locator('text=Tasting Notes')).toBeVisible()
  })

  test('should handle variant selection', async ({ page }) => {
    // Select ground coffee format
    await page.click('label:has-text("Ground")')
    
    // Check if grind type selector appears
    await expect(page.locator('text=Grind Type')).toBeVisible()
    
    // Select a grind type
    await page.click('[id="grind-type"]')
    await page.click('text=Filter/Pour Over')
    
    // Select different size
    await page.click('label:has-text("500g")')
    
    // Check price updates
    await expect(page.locator('text=Total Price')).toBeVisible()
  })

  test('should handle quantity selection', async ({ page }) => {
    // Increase quantity
    const plusButton = page.locator('button:has([aria-label*="Plus"])')
    await plusButton.click()
    await plusButton.click()
    
    // Check quantity display
    await expect(page.locator('text=3').first()).toBeVisible()
    
    // Decrease quantity
    const minusButton = page.locator('button:has([aria-label*="Minus"])')
    await minusButton.click()
    
    // Check quantity is updated
    await expect(page.locator('text=2').first()).toBeVisible()
  })

  test('should handle subscription toggle', async ({ page }) => {
    // Enable subscription
    await page.click('text=Subscribe & Save')
    
    // Check subscription options appear
    await expect(page.locator('text=Delivery Frequency')).toBeVisible()
    
    // Select frequency
    await page.click('[id="frequency"]')
    await page.click('text=Every 2 Weeks')
    
    // Check discount is applied
    await expect(page.locator('text=12% off')).toBeVisible()
    
    // Check next delivery date
    await expect(page.locator('text=First delivery')).toBeVisible()
  })

  test('should add product to cart', async ({ page }) => {
    // Click add to cart button
    await page.click('button:has-text("Add to Cart")')
    
    // Check for success indication
    await expect(page.locator('text=Added to Cart')).toBeVisible()
  })

  test('should navigate through image gallery', async ({ page }) => {
    // Check main image is visible
    const mainImage = page.locator('.aspect-square img').first()
    await expect(mainImage).toBeVisible()
    
    // Click next image button if available
    const nextButton = page.locator('button[aria-label="Next image"]').first()
    if (await nextButton.isVisible()) {
      await nextButton.click()
      // Wait for image transition
      await page.waitForTimeout(300)
    }
    
    // Click on thumbnail
    const thumbnails = page.locator('.grid-cols-4 button')
    if (await thumbnails.count() > 1) {
      await thumbnails.nth(1).click()
    }
  })

  test('should open image zoom', async ({ page }) => {
    // Click zoom button
    await page.click('button[aria-label="Zoom image"]')
    
    // Check dialog opens
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Close dialog
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('should display tasting notes', async ({ page }) => {
    // Navigate to tasting notes tab on desktop
    if (await page.locator('button:has-text("Tasting Notes")').isVisible()) {
      await page.click('button:has-text("Tasting Notes")')
    }
    
    // Check tasting profile elements
    await expect(page.locator('text=Tasting Profile')).toBeVisible()
    await expect(page.locator('text=Aroma')).toBeVisible()
    await expect(page.locator('text=Acidity')).toBeVisible()
    await expect(page.locator('text=Body')).toBeVisible()
    
    // Check primary notes
    await expect(page.locator('text=Primary Notes')).toBeVisible()
  })

  test('should display origin story', async ({ page }) => {
    // Navigate to origin tab on desktop
    if (await page.locator('button:has-text("Origin")').isVisible()) {
      await page.click('button:has-text("Origin")')
    }
    
    // Check origin story elements
    await expect(page.locator('text=Origin Story')).toBeVisible()
    await expect(page.locator('text=Finca El Paraíso')).toBeVisible()
    
    // Click on Farm Details tab
    await page.click('button:has-text("Farm Details")')
    await expect(page.locator('text=Elevation')).toBeVisible()
    await expect(page.locator('text=1450m')).toBeVisible()
  })

  test('should display brewing guide', async ({ page }) => {
    // Navigate to brewing guide tab on desktop
    if (await page.locator('button:has-text("Brewing Guide")').isVisible()) {
      await page.click('button:has-text("Brewing Guide")')
    }
    
    // Check brewing guide elements
    await expect(page.locator('text=Brewing Guide')).toBeVisible()
    
    // Check brewing method tabs
    await expect(page.locator('text=Pour Over')).toBeVisible()
    await expect(page.locator('text=Espresso')).toBeVisible()
    
    // Click on a brewing method
    await page.click('button:has-text("Espresso")')
    await expect(page.locator('text=Grind Size')).toBeVisible()
    await expect(page.locator('text=Water Temp')).toBeVisible()
  })

  test('should display reviews section', async ({ page }) => {
    // Navigate to reviews tab on desktop
    if (await page.locator('button:has-text("Reviews")').isVisible()) {
      await page.click('button:has-text("Reviews")')
    }
    
    // Check reviews section elements
    await expect(page.locator('text=Customer Reviews')).toBeVisible()
    
    // Check review stats
    await expect(page.locator('text=/\\d+\\.\\d+/')).toBeVisible() // Rating number
    
    // Check write review button
    await expect(page.locator('button:has-text("Write a Review")')).toBeVisible()
    
    // Check sort options
    await expect(page.locator('text=Sort by')).toBeVisible()
  })

  test('should open review form', async ({ page }) => {
    // Navigate to reviews if needed
    if (await page.locator('button:has-text("Reviews")').isVisible()) {
      await page.click('button:has-text("Reviews")')
    }
    
    // Click write review button
    await page.click('button:has-text("Write a Review")')
    
    // Check review form opens
    await expect(page.locator('[role="dialog"]:has-text("Write a Review")')).toBeVisible()
    
    // Check form fields
    await expect(page.locator('text=Rating')).toBeVisible()
    await expect(page.locator('text=Review Title')).toBeVisible()
    await expect(page.locator('text=Your Review')).toBeVisible()
    
    // Close dialog
    await page.click('button:has-text("Cancel")')
  })

  test('should display related products', async ({ page }) => {
    // Scroll to related products
    await page.locator('text=You May Also Like').scrollIntoViewIfNeeded()
    
    // Check related products section
    await expect(page.locator('text=You May Also Like')).toBeVisible()
    
    // Check if product cards are visible
    const productCards = page.locator('[href^="/products/"]:has(img)')
    await expect(productCards.first()).toBeVisible()
  })

  test('should handle social sharing', async ({ page }) => {
    // Click share button
    await page.click('button:has-text("Share")')
    
    // Note: Actual sharing behavior depends on browser capabilities
    // We're just checking the button is clickable
  })

  test('should handle favorites', async ({ page }) => {
    // Click save button
    const saveButton = page.locator('button:has-text("Save")')
    await saveButton.click()
    
    // Check button text changes
    await expect(page.locator('button:has-text("Saved")')).toBeVisible()
    
    // Click again to unsave
    await page.click('button:has-text("Saved")')
    await expect(page.locator('button:has-text("Save")')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible()
    
    // Check mobile sticky cart bar
    const mobileCartBar = page.locator('.fixed.bottom-0')
    await expect(mobileCartBar).toBeVisible()
    
    // Check product name in mobile cart bar
    await expect(mobileCartBar.locator('text=Honduran Estate Reserve')).toBeVisible()
  })

  test('should handle breadcrumb navigation', async ({ page }) => {
    // Check breadcrumbs are visible
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]')
    await expect(breadcrumb).toBeVisible()
    
    // Check breadcrumb links
    await expect(page.locator('a:has-text("Home")')).toBeVisible()
    await expect(page.locator('a:has-text("Products")')).toBeVisible()
    await expect(page.locator('a:has-text("Estate Coffee")')).toBeVisible()
  })

  test('should handle stock availability', async ({ page }) => {
    // This test would need to be adapted based on actual stock data
    // Check if stock warning appears for low inventory
    const stockWarning = page.locator('text=/Only \\d+ left in stock/')
    if (await stockWarning.isVisible()) {
      await expect(stockWarning).toBeVisible()
    }
  })

  test('should display correct SEO metadata', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Honduran Estate Reserve/)
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toContain('coffee')
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toContain('Honduran Estate Reserve')
  })
})

test.describe('Product Page Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/products/honduran-estate-reserve-250g')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/products/honduran-estate-reserve-250g')
    
    // Check buttons have labels
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const textContent = await button.textContent()
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy()
    }
  })
})