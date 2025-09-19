import { test, expect } from '@playwright/test';

test.describe('Account Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the account dashboard
    await page.goto('/account');
  });

  test('should display dashboard layout with navigation', async ({ page }) => {
    // Check if the main dashboard layout is present
    await expect(page.locator('[data-testid="dashboard-layout"]')).toBeVisible();
    
    // Check navigation items
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Order History')).toBeVisible();
    await expect(page.locator('text=Address Book')).toBeVisible();
    await expect(page.locator('text=Subscriptions')).toBeVisible();
    await expect(page.locator('text=Payment Methods')).toBeVisible();
    await expect(page.locator('text=Preferences')).toBeVisible();
    await expect(page.locator('text=Security')).toBeVisible();
    await expect(page.locator('text=Data Export')).toBeVisible();
  });

  test('should show account overview by default', async ({ page }) => {
    // Check welcome section
    await expect(page.locator('text=Welcome back, John!')).toBeVisible();
    
    // Check quick stats
    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Active Subscriptions')).toBeVisible();
    await expect(page.locator('text=Saved Cards')).toBeVisible();
    await expect(page.locator('text=Addresses')).toBeVisible();
    
    // Check recent orders section
    await expect(page.locator('text=Recent Orders')).toBeVisible();
    await expect(page.locator('text=Quick Actions')).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Click on Profile section
    await page.locator('text=Profile').click();
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('text=Coffee Preferences')).toBeVisible();
    
    // Click on Order History section
    await page.locator('text=Order History').click();
    await expect(page.locator('text=Order History')).toBeVisible();
    await expect(page.locator('text=Search orders or products...')).toBeVisible();
    
    // Click on Address Book section
    await page.locator('text=Address Book').click();
    await expect(page.locator('text=Manage your shipping and billing addresses')).toBeVisible();
    
    // Click on Subscriptions section
    await page.locator('text=Subscriptions').click();
    await expect(page.locator('text=Active Subscription')).toBeVisible();
    
    // Click on Payment Methods section
    await page.locator('text=Payment Methods').click();
    await expect(page.locator('text=Manage your saved payment methods')).toBeVisible();
    
    // Click on Preferences section
    await page.locator('text=Preferences').click();
    await expect(page.locator('text=Email Preferences')).toBeVisible();
    
    // Click on Security section
    await page.locator('text=Security').click();
    await expect(page.locator('text=Password Settings')).toBeVisible();
    
    // Click on Data Export section
    await page.locator('text=Data Export').click();
    await expect(page.locator('text=Export Your Data')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu trigger is visible
    await expect(page.locator('[data-testid="mobile-menu-trigger"]')).toBeVisible();
    
    // Check if desktop sidebar is hidden
    await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeHidden();
    
    // Open mobile menu
    await page.locator('[data-testid="mobile-menu-trigger"]').click();
    
    // Check if navigation items are visible in mobile menu
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Profile')).toBeVisible();
  });

  test('should display claymorphism styling', async ({ page }) => {
    // Check if clay-card classes are applied
    const cards = page.locator('.clay-card');
    await expect(cards.first()).toBeVisible();
    
    // Check if clay-button classes are applied
    const buttons = page.locator('.clay-button');
    await expect(buttons.first()).toBeVisible();
    
    // Verify CSS custom properties are loaded
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => 
      getComputedStyle(el).getPropertyValue('--background')
    );
    expect(backgroundColor).toBeTruthy();
  });

  test('should handle profile editing', async ({ page }) => {
    // Navigate to profile section
    await page.locator('text=Profile').click();
    
    // Click edit profile button
    await page.locator('text=Edit Profile').click();
    
    // Check if form fields become editable
    await expect(page.locator('input[value="John"]')).toBeVisible();
    await expect(page.locator('input[value="Doe"]')).toBeVisible();
    
    // Check for save/cancel buttons
    await expect(page.locator('text=Save Changes')).toBeVisible();
    await expect(page.locator('text=Cancel')).toBeVisible();
  });

  test('should display order history with filters', async ({ page }) => {
    // Navigate to order history
    await page.locator('text=Order History').click();
    
    // Check search functionality
    await expect(page.locator('input[placeholder*="Search orders"]')).toBeVisible();
    
    // Check status filter
    await expect(page.locator('text=Filter by status')).toBeVisible();
    
    // Check order table
    await expect(page.locator('text=Order')).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Total')).toBeVisible();
    
    // Check for sample orders
    await expect(page.locator('text=HC-2024-012')).toBeVisible();
  });

  test('should manage addresses', async ({ page }) => {
    // Navigate to address book
    await page.locator('text=Address Book').click();
    
    // Check add address button
    await expect(page.locator('text=Add Address')).toBeVisible();
    
    // Check existing addresses
    await expect(page.locator('text=Shipping')).toBeVisible();
    await expect(page.locator('text=Default')).toBeVisible();
    
    // Click add address to open dialog
    await page.locator('text=Add Address').click();
    await expect(page.locator('text=Add New Address')).toBeVisible();
  });

  test('should display subscription management', async ({ page }) => {
    // Navigate to subscriptions
    await page.locator('text=Subscriptions').click();
    
    // Check subscription details
    await expect(page.locator('text=Active Subscription')).toBeVisible();
    await expect(page.locator('text=Honduras Mountain Coffee')).toBeVisible();
    await expect(page.locator('text=Monthly Delivery')).toBeVisible();
    
    // Check management actions
    await expect(page.locator('text=Pause Subscription')).toBeVisible();
    await expect(page.locator('text=Modify Subscription')).toBeVisible();
    await expect(page.locator('text=Cancel Subscription')).toBeVisible();
  });
});

test.describe('Account Dashboard Error Handling', () => {
  test('should handle network failures gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/account');
    
    // Should still display the layout even if API calls fail
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/user**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: { name: 'John Doe' } })
      });
    });
    
    await page.goto('/account');
    
    // Should show skeleton or loading state
    // This would depend on implementing skeleton components
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();
  });
});

test.describe('Account Dashboard Accessibility', () => {
  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/account');
    
    // Check navigation has proper ARIA
    await expect(page.locator('nav')).toBeVisible();
    
    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || 
                            await button.textContent();
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/account');
    
    // Tab through navigation items
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to activate navigation with Enter
    await page.keyboard.press('Enter');
    
    // Focus should be manageable throughout the interface
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});