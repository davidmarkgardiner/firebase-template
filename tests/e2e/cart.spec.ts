import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('cart button should be visible in header', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]')
    await expect(cartButton).toBeVisible()
  })

  test('cart drawer should open when clicking cart button', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()

    const cartDrawer = page.locator('[data-testid="cart-drawer"]')
    await expect(cartDrawer).toBeVisible()
  })

  test('empty cart should show empty state', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()

    const emptyCartMessage = page.locator('text=Your cart is empty')
    await expect(emptyCartMessage).toBeVisible()

    const startShoppingButton = page.locator('text=Start Shopping')
    await expect(startShoppingButton).toBeVisible()
  })

  test('add to cart should update cart count', async ({ page }) => {
    // Mock adding product to cart
    await page.evaluate(() => {
      const cart = window.useCartStore?.getState()
      if (cart) {
        cart.addItem({
          product: {
            id: '1',
            name: 'Test Coffee',
            description: 'A test coffee',
            price_cents: 2000,
            image_url: null,
            featured: false,
            is_new: false,
            is_limited: false,
            origin: 'Test Origin',
            altitude: 1500,
            process: 'Washed',
            tasting_notes: [],
            tags: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          variant: {
            id: '1',
            product_id: '1',
            weight: 340,
            grind_type: 'Whole Bean',
            price_cents: 2000,
            stock_count: 10,
            max_stock: 20,
            allow_backorder: false,
            sku: 'TEST-001',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          quantity: 1
        })
      }
    })

    // Check if cart badge shows count
    const cartBadge = page.locator('[data-testid="cart-badge"]')
    await expect(cartBadge).toHaveText('1')
  })

  test('cart drawer should show items when cart is not empty', async ({ page }) => {
    // Add item to cart
    await page.evaluate(() => {
      const cart = window.useCartStore?.getState()
      if (cart) {
        cart.addItem({
          product: {
            id: '1',
            name: 'Test Coffee',
            description: 'A test coffee',
            price_cents: 2000,
            image_url: null,
            featured: false,
            is_new: false,
            is_limited: false,
            origin: 'Test Origin',
            altitude: 1500,
            process: 'Washed',
            tasting_notes: [],
            tags: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          variant: {
            id: '1',
            product_id: '1',
            weight: 340,
            grind_type: 'Whole Bean',
            price_cents: 2000,
            stock_count: 10,
            max_stock: 20,
            allow_backorder: false,
            sku: 'TEST-001',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          quantity: 1
        })
      }
    })

    // Open cart drawer
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()

    // Check cart shows items
    const cartItem = page.locator('[data-testid="cart-item"]')
    await expect(cartItem).toBeVisible()

    const checkoutButton = page.locator('text=Proceed to Checkout')
    await expect(checkoutButton).toBeVisible()
  })

  test('should be able to remove items from cart', async ({ page }) => {
    // Add item to cart first
    await page.evaluate(() => {
      const cart = window.useCartStore?.getState()
      if (cart) {
        cart.addItem({
          product: {
            id: '1',
            name: 'Test Coffee',
            description: 'A test coffee',
            price_cents: 2000,
            image_url: null,
            featured: false,
            is_new: false,
            is_limited: false,
            origin: 'Test Origin',
            altitude: 1500,
            process: 'Washed',
            tasting_notes: [],
            tags: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          variant: {
            id: '1',
            product_id: '1',
            weight: 340,
            grind_type: 'Whole Bean',
            price_cents: 2000,
            stock_count: 10,
            max_stock: 20,
            allow_backorder: false,
            sku: 'TEST-001',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          quantity: 1
        })
      }
    })

    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()

    // Remove item
    const removeButton = page.locator('[data-testid="remove-item"]')
    await removeButton.click()

    // Verify cart is empty
    const emptyCartMessage = page.locator('text=Your cart is empty')
    await expect(emptyCartMessage).toBeVisible()
  })
})