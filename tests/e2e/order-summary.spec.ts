import { test, expect } from '@playwright/test';

test.describe('Order Summary Calculations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('should display order summary with default values', async ({ page }) => {
    // Check that order summary is visible
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    
    // Check basic structure
    await expect(page.locator('text=Order Summary')).toBeVisible();
    await expect(page.locator('[data-testid="subtotal"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipping-cost"]')).toBeVisible();
    await expect(page.locator('[data-testid="tax"]')).toBeVisible();
    await expect(page.locator('[data-testid="total"]')).toBeVisible();
  });

  test('should show product items in order summary', async ({ page }) => {
    // Check for product items
    const productItems = page.locator('[data-testid="order-item"]');
    await expect(productItems).toHaveCount.greaterThan(0);
    
    // Check that each item has required information
    const firstItem = productItems.first();
    await expect(firstItem.locator('[data-testid="item-name"]')).toBeVisible();
    await expect(firstItem.locator('[data-testid="item-price"]')).toBeVisible();
    await expect(firstItem.locator('[data-testid="item-quantity"]')).toBeVisible();
  });

  test('should calculate subtotal correctly', async ({ page }) => {
    // Get item prices and quantities
    const orderItems = page.locator('[data-testid="order-item"]');
    const itemCount = await orderItems.count();
    
    let expectedSubtotal = 0;
    
    for (let i = 0; i < itemCount; i++) {
      const item = orderItems.nth(i);
      const priceText = await item.locator('[data-testid="item-price"]').textContent();
      const quantityText = await item.locator('[data-testid="item-quantity"]').textContent();
      
      const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
      const quantity = parseInt(quantityText?.replace(/[^0-9]/g, '') || '1');
      
      expectedSubtotal += price * quantity;
    }
    
    // Check calculated subtotal
    const subtotalText = await page.locator('[data-testid="subtotal"]').textContent();
    const displayedSubtotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, '') || '0');
    
    expect(Math.abs(displayedSubtotal - expectedSubtotal)).toBeLessThan(0.01);
  });

  test('should update shipping cost when shipping method changes', async ({ page }) => {
    // Complete steps to reach shipping method selection
    await fillCustomerInfo(page);
    await page.click('button:has-text("Continue to Shipping")');
    await page.waitForTimeout(500);
    
    await fillShippingAddress(page);
    await page.click('button:has-text("Continue to Billing")');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Continue to Shipping Method")');
    await page.waitForTimeout(500);
    
    // Get initial shipping cost
    const initialShippingText = await page.locator('[data-testid="shipping-cost"]').textContent();
    const initialShipping = parseFloat(initialShippingText?.replace(/[^0-9.]/g, '') || '0');
    
    // Select a shipping option
    const shippingOptions = page.locator('[data-testid="shipping-option"]');
    const firstOption = shippingOptions.first();
    await firstOption.click();
    
    // Get shipping price from selected option
    const selectedShippingText = await firstOption.locator('[data-testid="shipping-price"]').textContent();
    const selectedShipping = parseFloat(selectedShippingText?.replace(/[^0-9.]/g, '') || '0');
    
    // Check that order summary updated
    await page.waitForTimeout(1000); // Wait for update
    const updatedShippingText = await page.locator('[data-testid="shipping-cost"]').textContent();
    const updatedShipping = parseFloat(updatedShippingText?.replace(/[^0-9.]/g, '') || '0');
    
    expect(Math.abs(updatedShipping - selectedShipping)).toBeLessThan(0.01);
  });

  test('should calculate tax based on shipping address', async ({ page }) => {
    // Complete customer info
    await fillCustomerInfo(page);
    await page.click('button:has-text("Continue to Shipping")');
    await page.waitForTimeout(500);
    
    // Fill shipping address with different countries to test tax calculation
    await page.fill('#shipping-firstName', 'John');
    await page.fill('#shipping-lastName', 'Doe');
    await page.fill('#shipping-address1', 'Test Street 123');
    await page.fill('#shipping-city', 'Amsterdam');
    await page.fill('#shipping-postalCode', '1012 AB');
    
    // Select Netherlands (high VAT rate)
    await page.selectOption('#shipping-country', 'NL');
    await page.waitForTimeout(1000); // Wait for tax calculation
    
    // Check that tax is calculated
    const taxText = await page.locator('[data-testid="tax"]').textContent();
    const tax = parseFloat(taxText?.replace(/[^0-9.]/g, '') || '0');
    
    expect(tax).toBeGreaterThan(0); // Netherlands should have VAT
  });

  test('should apply promo code discount correctly', async ({ page }) => {
    // Check if promo code section exists
    const promoCodeSection = page.locator('[data-testid="promo-code-section"]');
    if (await promoCodeSection.isVisible()) {
      // Get initial total
      const initialTotalText = await page.locator('[data-testid="total"]').textContent();
      const initialTotal = parseFloat(initialTotalText?.replace(/[^0-9.]/g, '') || '0');
      
      // Apply a test promo code
      await page.fill('[data-testid="promo-code-input"]', 'TEST10');
      await page.click('[data-testid="apply-promo-button"]');
      
      // Wait for discount to be applied
      await page.waitForTimeout(1000);
      
      // Check that discount appears in summary
      const discountSection = page.locator('[data-testid="discount"]');
      if (await discountSection.isVisible()) {
        await expect(discountSection).toBeVisible();
        
        // Check that total is reduced
        const newTotalText = await page.locator('[data-testid="total"]').textContent();
        const newTotal = parseFloat(newTotalText?.replace(/[^0-9.]/g, '') || '0');
        
        expect(newTotal).toBeLessThan(initialTotal);
      }
    }
  });

  test('should calculate final total correctly', async ({ page }) => {
    // Complete checkout flow to get all charges
    await fillCustomerInfo(page);
    await page.click('button:has-text("Continue to Shipping")');
    await page.waitForTimeout(500);
    
    await fillShippingAddress(page);
    await page.click('button:has-text("Continue to Billing")');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Continue to Shipping Method")');
    await page.waitForTimeout(500);
    
    // Select shipping method
    await page.locator('[data-testid="shipping-option"]').first().click();
    await page.waitForTimeout(1000);
    
    // Get all components of the total
    const subtotalText = await page.locator('[data-testid="subtotal"]').textContent();
    const shippingText = await page.locator('[data-testid="shipping-cost"]').textContent();
    const taxText = await page.locator('[data-testid="tax"]').textContent();
    const totalText = await page.locator('[data-testid="total"]').textContent();
    
    const subtotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, '') || '0');
    const shipping = parseFloat(shippingText?.replace(/[^0-9.]/g, '') || '0');
    const tax = parseFloat(taxText?.replace(/[^0-9.]/g, '') || '0');
    const total = parseFloat(totalText?.replace(/[^0-9.]/g, '') || '0');
    
    // Check for discount if present
    let discount = 0;
    const discountElement = page.locator('[data-testid="discount"]');
    if (await discountElement.isVisible()) {
      const discountText = await discountElement.textContent();
      discount = parseFloat(discountText?.replace(/[^0-9.]/g, '') || '0');
    }
    
    const expectedTotal = subtotal + shipping + tax - discount;
    
    expect(Math.abs(total - expectedTotal)).toBeLessThan(0.01);
  });

  test('should format currency correctly', async ({ page }) => {
    // Check that all prices are formatted consistently
    const priceElements = page.locator('[data-testid*="price"], [data-testid="subtotal"], [data-testid="shipping-cost"], [data-testid="tax"], [data-testid="total"]');
    const count = await priceElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = priceElements.nth(i);
      const text = await element.textContent();
      
      // Check that price has currency symbol (€ for EU)
      expect(text).toMatch(/[€$]/);
      
      // Check that price has proper decimal formatting
      expect(text).toMatch(/\d+\.\d{2}/);
    }
  });

  test('should show quantity controls for items', async ({ page }) => {
    // Check if quantity controls are present
    const quantityControls = page.locator('[data-testid="quantity-controls"]');
    if (await quantityControls.isVisible()) {
      const firstControl = quantityControls.first();
      
      // Check for decrease/increase buttons
      await expect(firstControl.locator('[data-testid="quantity-decrease"]')).toBeVisible();
      await expect(firstControl.locator('[data-testid="quantity-increase"]')).toBeVisible();
      
      // Get initial quantity and total
      const initialQuantityText = await firstControl.locator('[data-testid="quantity-value"]').textContent();
      const initialQuantity = parseInt(initialQuantityText || '1');
      const initialTotalText = await page.locator('[data-testid="total"]').textContent();
      const initialTotal = parseFloat(initialTotalText?.replace(/[^0-9.]/g, '') || '0');
      
      // Increase quantity
      await firstControl.locator('[data-testid="quantity-increase"]').click();
      await page.waitForTimeout(1000);
      
      // Check that quantity and total updated
      const newQuantityText = await firstControl.locator('[data-testid="quantity-value"]').textContent();
      const newQuantity = parseInt(newQuantityText || '1');
      const newTotalText = await page.locator('[data-testid="total"]').textContent();
      const newTotal = parseFloat(newTotalText?.replace(/[^0-9.]/g, '') || '0');
      
      expect(newQuantity).toBe(initialQuantity + 1);
      expect(newTotal).toBeGreaterThan(initialTotal);
    }
  });

  test('should show loading state during calculations', async ({ page }) => {
    // Navigate to shipping method selection
    await fillCustomerInfo(page);
    await page.click('button:has-text("Continue to Shipping")');
    await page.waitForTimeout(500);
    
    await fillShippingAddress(page);
    await page.click('button:has-text("Continue to Billing")');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Continue to Shipping Method")');
    await page.waitForTimeout(500);
    
    // Select shipping method and check for loading state
    await page.locator('[data-testid="shipping-option"]').first().click();
    
    // Check for loading indicator (if present)
    const loadingIndicator = page.locator('[data-testid="calculation-loading"]');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
      await expect(loadingIndicator).not.toBeVisible(); // Should disappear after calculation
    }
  });

  test('should persist order summary when navigating between steps', async ({ page }) => {
    // Get initial order summary values
    const initialSubtotalText = await page.locator('[data-testid="subtotal"]').textContent();
    const initialSubtotal = parseFloat(initialSubtotalText?.replace(/[^0-9.]/g, '') || '0');
    
    // Navigate through steps
    await fillCustomerInfo(page);
    await page.click('button:has-text("Continue to Shipping")');
    await page.waitForTimeout(500);
    
    // Check that subtotal persists
    const persistedSubtotalText = await page.locator('[data-testid="subtotal"]').textContent();
    const persistedSubtotal = parseFloat(persistedSubtotalText?.replace(/[^0-9.]/g, '') || '0');
    
    expect(Math.abs(persistedSubtotal - initialSubtotal)).toBeLessThan(0.01);
    
    // Navigate back and check again
    await page.click('button:has-text("Back")');
    await page.waitForTimeout(500);
    
    const backSubtotalText = await page.locator('[data-testid="subtotal"]').textContent();
    const backSubtotal = parseFloat(backSubtotalText?.replace(/[^0-9.]/g, '') || '0');
    
    expect(Math.abs(backSubtotal - initialSubtotal)).toBeLessThan(0.01);
  });
});

// Helper functions
async function fillCustomerInfo(page: any): Promise<void> {
  await page.fill('#email', 'test@example.com');
  await page.fill('#firstName', 'John');
  await page.fill('#lastName', 'Doe');
  await page.fill('#phone', '+31 6 1234 5678');
}

async function fillShippingAddress(page: any): Promise<void> {
  await page.fill('#shipping-firstName', 'John');
  await page.fill('#shipping-lastName', 'Doe');
  await page.fill('#shipping-address1', 'Test Street 123');
  await page.fill('#shipping-city', 'Amsterdam');
  await page.fill('#shipping-postalCode', '1012 AB');
  await page.selectOption('#shipping-country', 'NL');
}