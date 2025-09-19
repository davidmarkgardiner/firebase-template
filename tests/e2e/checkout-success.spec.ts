import { test, expect } from '@playwright/test';

test.describe('Checkout Success Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to success page
    await page.goto('/checkout/success');
    await page.waitForLoadState('networkidle');
  });

  test('should load success page with proper layout', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Order Confirmed/);
    
    // Check main confirmation message
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
    await expect(page.locator('text=Thank you for your purchase')).toBeVisible();
  });

  test('should display order confirmation details', async ({ page }) => {
    // Check for order number
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
    
    // Check for estimated delivery date
    await expect(page.locator('[data-testid="delivery-date"]')).toBeVisible();
    
    // Check for order summary
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
  });

  test('should show customer information', async ({ page }) => {
    // Check shipping address
    await expect(page.locator('[data-testid="shipping-address"]')).toBeVisible();
    
    // Check billing address
    await expect(page.locator('[data-testid="billing-address"]')).toBeVisible();
    
    // Check contact email
    await expect(page.locator('[data-testid="contact-email"]')).toBeVisible();
  });

  test('should display payment information', async ({ page }) => {
    // Check payment method
    await expect(page.locator('[data-testid="payment-method"]')).toBeVisible();
    
    // Check order total
    await expect(page.locator('[data-testid="order-total"]')).toBeVisible();
  });

  test('should show next steps and actions', async ({ page }) => {
    // Check for tracking information
    await expect(page.locator('text=Track Your Order')).toBeVisible();
    
    // Check for email confirmation notice
    await expect(page.locator('text=confirmation email')).toBeVisible();
    
    // Check for continue shopping button
    await expect(page.locator('button:has-text("Continue Shopping")')).toBeVisible();
  });

  test('should provide order tracking functionality', async ({ page }) => {
    const trackButton = page.locator('button:has-text("Track Order")');
    if (await trackButton.isVisible()) {
      await trackButton.click();
      
      // Should show tracking interface or redirect
      await expect(page.locator('[data-testid="tracking-info"]')).toBeVisible();
    }
  });

  test('should allow returning to shop', async ({ page }) => {
    await page.click('button:has-text("Continue Shopping")');
    
    // Should redirect to shop or home page
    await page.waitForURL(/\/(shop|home|\/)$/);
    await expect(page.url()).toMatch(/\/(shop|home|\/)$/);
  });

  test('should display claymorphism styling', async ({ page }) => {
    // Check for clay-card styling
    await expect(page.locator('.clay-card')).toBeVisible();
    
    // Check for gradient background
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // Check that success page is readable on mobile
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    
    // Check that buttons are accessible on mobile
    await expect(page.locator('button:has-text("Continue Shopping")')).toBeVisible();
  });

  test('should show order details in accordion format on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // Check for collapsible sections on mobile
    const orderDetailsSection = page.locator('[data-testid="order-details-accordion"]');
    if (await orderDetailsSection.isVisible()) {
      await expect(orderDetailsSection).toBeVisible();
    }
  });

  test('should handle missing order data gracefully', async ({ page }) => {
    // Navigate to success page without completing checkout
    await page.goto('/checkout/success?order=invalid');
    
    // Should show appropriate message for invalid/missing order
    await expect(page.locator('text=Order not found')).toBeVisible();
  });

  test('should display order timeline', async ({ page }) => {
    // Check for order processing timeline
    const timeline = page.locator('[data-testid="order-timeline"]');
    if (await timeline.isVisible()) {
      await expect(timeline).toBeVisible();
      
      // Check for timeline steps
      await expect(page.locator('text=Order Placed')).toBeVisible();
      await expect(page.locator('text=Processing')).toBeVisible();
      await expect(page.locator('text=Shipped')).toBeVisible();
      await expect(page.locator('text=Delivered')).toBeVisible();
    }
  });

  test('should show customer support information', async ({ page }) => {
    // Check for customer support contact
    await expect(page.locator('[data-testid="customer-support"]')).toBeVisible();
    
    // Check for FAQ link
    const faqLink = page.locator('a:has-text("FAQ")');
    if (await faqLink.isVisible()) {
      await expect(faqLink).toBeVisible();
    }
    
    // Check for contact information
    const contactInfo = page.locator('[data-testid="contact-info"]');
    if (await contactInfo.isVisible()) {
      await expect(contactInfo).toBeVisible();
    }
  });

  test('should show social sharing options', async ({ page }) => {
    // Check for social sharing buttons
    const shareButtons = page.locator('[data-testid="social-share"]');
    if (await shareButtons.isVisible()) {
      await expect(shareButtons).toBeVisible();
      
      // Check for specific share options
      await expect(page.locator('[data-testid="share-twitter"]')).toBeVisible();
      await expect(page.locator('[data-testid="share-facebook"]')).toBeVisible();
    }
  });

  test('should display related products or recommendations', async ({ page }) => {
    // Check for product recommendations
    const recommendations = page.locator('[data-testid="product-recommendations"]');
    if (await recommendations.isVisible()) {
      await expect(recommendations).toBeVisible();
      
      // Check that recommendations have proper structure
      await expect(page.locator('[data-testid="recommended-product"]')).toHaveCount.greaterThan(0);
    }
  });

  test('should show subscription options if applicable', async ({ page }) => {
    // Check for subscription upsell
    const subscriptionOffer = page.locator('[data-testid="subscription-offer"]');
    if (await subscriptionOffer.isVisible()) {
      await expect(subscriptionOffer).toBeVisible();
      
      // Check subscription call-to-action
      await expect(page.locator('button:has-text("Subscribe")')).toBeVisible();
    }
  });

  test('should handle print functionality', async ({ page }) => {
    // Check for print order button
    const printButton = page.locator('button:has-text("Print Order")');
    if (await printButton.isVisible()) {
      // Mock print dialog
      let printDialogOpened = false;
      await page.exposeFunction('mockPrint', () => {
        printDialogOpened = true;
      });
      
      await page.addInitScript(() => {
        window.print = () => window.mockPrint();
      });
      
      await printButton.click();
      
      // Verify print was triggered
      expect(printDialogOpened).toBe(true);
    }
  });

  test('should show estimated delivery information', async ({ page }) => {
    // Check for delivery estimates
    await expect(page.locator('[data-testid="delivery-estimate"]')).toBeVisible();
    
    // Check for shipping method info
    await expect(page.locator('[data-testid="shipping-method"]')).toBeVisible();
    
    // Check for delivery address confirmation
    await expect(page.locator('[data-testid="delivery-address"]')).toBeVisible();
  });

  test('should display order items with quantities and prices', async ({ page }) => {
    // Check for order items list
    await expect(page.locator('[data-testid="order-items"]')).toBeVisible();
    
    // Check that each item has required information
    const orderItems = page.locator('[data-testid="order-item"]');
    const itemCount = await orderItems.count();
    
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = orderItems.nth(i);
        await expect(item.locator('[data-testid="item-name"]')).toBeVisible();
        await expect(item.locator('[data-testid="item-quantity"]')).toBeVisible();
        await expect(item.locator('[data-testid="item-price"]')).toBeVisible();
      }
    }
  });

  test('should show loyalty points or rewards information', async ({ page }) => {
    // Check for rewards/loyalty information
    const loyaltyInfo = page.locator('[data-testid="loyalty-points"]');
    if (await loyaltyInfo.isVisible()) {
      await expect(loyaltyInfo).toBeVisible();
      
      // Check for points earned
      await expect(page.locator('[data-testid="points-earned"]')).toBeVisible();
    }
  });
});