import { test, expect, type Page } from '@playwright/test';

// Test data for checkout flow
const testCustomer = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+31 6 1234 5678'
};

const testShippingAddress = {
  firstName: 'John',
  lastName: 'Doe',
  company: 'Test Company',
  address1: 'Test Street 123',
  address2: 'Apt 4B',
  city: 'Amsterdam',
  postalCode: '1012 AB',
  country: 'NL',
  phone: '+31 6 1234 5678'
};

const testBillingAddress = {
  firstName: 'Jane',
  lastName: 'Smith',
  address1: 'Billing Street 456',
  city: 'Rotterdam',
  postalCode: '3011 AD',
  country: 'NL'
};

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to checkout page
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('should load checkout page with proper layout', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Checkout/);
    
    // Check main heading
    await expect(page.locator('h1:has-text("Complete Your Order")')).toBeVisible();
    
    // Check progress indicator is present
    await expect(page.locator('[data-testid="progress-indicator"]')).toBeVisible();
    
    // Check that we start on step 1
    await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 1 of 5');
    
    // Check claymorphism styling
    await expect(page.locator('.clay-card').first()).toBeVisible();
  });

  test('should show progress indicator with correct steps', async ({ page }) => {
    const steps = [
      'Customer Information',
      'Shipping Address', 
      'Billing Address',
      'Shipping Method',
      'Payment'
    ];

    for (const step of steps) {
      await expect(page.locator('text=' + step)).toBeVisible();
    }

    // Check progress bar is visible
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    
    // Check initial progress is 20% (step 1 of 5)
    const progress = page.locator('[role="progressbar"]');
    await expect(progress).toHaveAttribute('aria-valuenow', '20');
  });

  test('should display order summary sidebar', async ({ page }) => {
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    
    // Check order summary elements
    await expect(page.locator('text=Order Summary')).toBeVisible();
    await expect(page.locator('[data-testid="subtotal"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipping-cost"]')).toBeVisible();
    await expect(page.locator('[data-testid="total"]')).toBeVisible();
  });

  test.describe('Customer Information Step', () => {
    test('should show guest checkout by default', async ({ page }) => {
      // Guest checkout should be selected by default
      const guestCard = page.locator('[data-testid="guest-checkout"]');
      await expect(guestCard).toHaveClass(/ring-2 ring-\[#8B4513\]/);
      
      // Account creation card should not be selected
      const accountCard = page.locator('[data-testid="create-account"]');
      await expect(accountCard).not.toHaveClass(/ring-2 ring-\[#8B4513\]/);
    });

    test('should switch between guest and account modes', async ({ page }) => {
      // Click on create account
      await page.click('[data-testid="create-account"]');
      
      // Check that create account is now selected
      const accountCard = page.locator('[data-testid="create-account"]');
      await expect(accountCard).toHaveClass(/ring-2 ring-\[#8B4513\]/);
      
      // Click back to guest
      await page.click('[data-testid="guest-checkout"]');
      
      // Check that guest is selected again
      const guestCard = page.locator('[data-testid="guest-checkout"]');
      await expect(guestCard).toHaveClass(/ring-2 ring-\[#8B4513\]/);
    });

    test('should show login option for returning customers', async ({ page }) => {
      await expect(page.locator('text=Already have an account?')).toBeVisible();
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      // Try to continue without filling required fields
      await page.click('button:has-text("Continue to Shipping")');
      
      // Check validation errors appear
      await expect(page.locator('text=Email address is required')).toBeVisible();
      await expect(page.locator('text=First name is required')).toBeVisible();
      await expect(page.locator('text=Last name is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      // Fill invalid email
      await page.fill('#email', 'invalid-email');
      await page.click('button:has-text("Continue to Shipping")');
      
      // Check email validation error
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    });

    test('should validate name length', async ({ page }) => {
      // Fill short names
      await page.fill('#firstName', 'A');
      await page.fill('#lastName', 'B');
      await page.click('button:has-text("Continue to Shipping")');
      
      // Check name validation errors
      await expect(page.locator('text=First name must be at least 2 characters')).toBeVisible();
      await expect(page.locator('text=Last name must be at least 2 characters')).toBeVisible();
    });

    test('should validate phone number format', async ({ page }) => {
      // Fill valid required fields first
      await page.fill('#email', testCustomer.email);
      await page.fill('#firstName', testCustomer.firstName);
      await page.fill('#lastName', testCustomer.lastName);
      
      // Fill invalid phone
      await page.fill('#phone', 'invalid-phone');
      await page.click('button:has-text("Continue to Shipping")');
      
      // Check phone validation error
      await expect(page.locator('text=Please enter a valid phone number')).toBeVisible();
    });

    test('should clear validation errors when typing', async ({ page }) => {
      // Trigger validation error
      await page.click('button:has-text("Continue to Shipping")');
      await expect(page.locator('text=Email address is required')).toBeVisible();
      
      // Start typing in email field
      await page.fill('#email', 'test@');
      
      // Error should disappear
      await expect(page.locator('text=Email address is required')).not.toBeVisible();
    });

    test('should show account creation checkbox for guest mode', async ({ page }) => {
      await expect(page.locator('#createAccount')).toBeVisible();
      await expect(page.locator('text=Create an account to track orders')).toBeVisible();
    });

    test('should show account benefits when account creation is selected', async ({ page }) => {
      // Check the create account checkbox
      await page.check('#createAccount');
      
      // Account benefits should appear
      await expect(page.locator('text=Account Benefits:')).toBeVisible();
      await expect(page.locator('text=Track your orders and delivery status')).toBeVisible();
      await expect(page.locator('text=Save addresses for faster checkout')).toBeVisible();
    });

    test('should successfully complete customer info step', async ({ page }) => {
      await fillCustomerInfo(page);
      await page.click('button:has-text("Continue to Shipping")');
      
      // Should advance to step 2
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 2 of 5');
      await expect(page.locator('text=Shipping Address')).toBeVisible();
    });
  });

  test.describe('Shipping Address Step', () => {
    test.beforeEach(async ({ page }) => {
      await fillCustomerInfo(page);
      await page.click('button:has-text("Continue to Shipping")');
      await page.waitForTimeout(500); // Wait for step transition
    });

    test('should display shipping address form', async ({ page }) => {
      await expect(page.locator('text=Shipping Address')).toBeVisible();
      await expect(page.locator('#shipping-firstName')).toBeVisible();
      await expect(page.locator('#shipping-lastName')).toBeVisible();
      await expect(page.locator('#shipping-address1')).toBeVisible();
      await expect(page.locator('#shipping-city')).toBeVisible();
      await expect(page.locator('#shipping-postalCode')).toBeVisible();
      await expect(page.locator('#shipping-country')).toBeVisible();
    });

    test('should pre-fill name fields from customer info', async ({ page }) => {
      // Check that first and last name are pre-filled
      await expect(page.locator('#shipping-firstName')).toHaveValue(testCustomer.firstName);
      await expect(page.locator('#shipping-lastName')).toHaveValue(testCustomer.lastName);
    });

    test('should validate required shipping fields', async ({ page }) => {
      await page.click('button:has-text("Continue to Billing")');
      
      // Check validation errors
      await expect(page.locator('text=Address is required')).toBeVisible();
      await expect(page.locator('text=City is required')).toBeVisible();
      await expect(page.locator('text=Postal code is required')).toBeVisible();
    });

    test('should show EU countries in country dropdown', async ({ page }) => {
      await page.click('#shipping-country');
      
      // Check for common EU countries
      await expect(page.locator('option[value="NL"]')).toBeVisible();
      await expect(page.locator('option[value="DE"]')).toBeVisible();
      await expect(page.locator('option[value="FR"]')).toBeVisible();
      await expect(page.locator('option[value="BE"]')).toBeVisible();
    });

    test('should validate postal code format by country', async ({ page }) => {
      // Fill form with Dutch address but invalid postal code
      await fillShippingAddress(page, { ...testShippingAddress, postalCode: 'invalid' });
      await page.click('button:has-text("Continue to Billing")');
      
      // Should show postal code validation error
      await expect(page.locator('text=Please enter a valid postal code')).toBeVisible();
    });

    test('should allow navigation back to customer info', async ({ page }) => {
      await page.click('button:has-text("Back")');
      
      // Should return to step 1
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 1 of 5');
      await expect(page.locator('text=Contact Information')).toBeVisible();
      
      // Customer info should be preserved
      await expect(page.locator('#email')).toHaveValue(testCustomer.email);
    });

    test('should successfully complete shipping address step', async ({ page }) => {
      await fillShippingAddress(page);
      await page.click('button:has-text("Continue to Billing")');
      
      // Should advance to step 3
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 3 of 5');
      await expect(page.locator('text=Billing Address')).toBeVisible();
    });
  });

  test.describe('Billing Address Step', () => {
    test.beforeEach(async ({ page }) => {
      await fillCustomerInfo(page);
      await page.click('button:has-text("Continue to Shipping")');
      await page.waitForTimeout(500);
      await fillShippingAddress(page);
      await page.click('button:has-text("Continue to Billing")');
      await page.waitForTimeout(500);
    });

    test('should display billing address form', async ({ page }) => {
      await expect(page.locator('text=Billing Address')).toBeVisible();
      await expect(page.locator('#billing-firstName')).toBeVisible();
      await expect(page.locator('#billing-lastName')).toBeVisible();
    });

    test('should show "same as shipping" option by default', async ({ page }) => {
      await expect(page.locator('#sameBillingAddress')).toBeChecked();
      await expect(page.locator('text=Use shipping address for billing')).toBeVisible();
    });

    test('should hide billing form when same as shipping is checked', async ({ page }) => {
      // Billing form fields should be hidden when same as shipping is checked
      await expect(page.locator('#billing-address1')).not.toBeVisible();
    });

    test('should show billing form when same as shipping is unchecked', async ({ page }) => {
      await page.uncheck('#sameBillingAddress');
      
      // Billing form fields should now be visible
      await expect(page.locator('#billing-address1')).toBeVisible();
      await expect(page.locator('#billing-city')).toBeVisible();
      await expect(page.locator('#billing-postalCode')).toBeVisible();
    });

    test('should validate billing address when different from shipping', async ({ page }) => {
      await page.uncheck('#sameBillingAddress');
      await page.click('button:has-text("Continue to Shipping Method")');
      
      // Check validation errors for billing address
      await expect(page.locator('text=Address is required')).toBeVisible();
      await expect(page.locator('text=City is required')).toBeVisible();
    });

    test('should successfully complete billing address step with same address', async ({ page }) => {
      // Keep same as shipping checked and continue
      await page.click('button:has-text("Continue to Shipping Method")');
      
      // Should advance to step 4
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 4 of 5');
      await expect(page.locator('text=Shipping Method')).toBeVisible();
    });

    test('should successfully complete billing address step with different address', async ({ page }) => {
      await page.uncheck('#sameBillingAddress');
      await fillBillingAddress(page);
      await page.click('button:has-text("Continue to Shipping Method")');
      
      // Should advance to step 4
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 4 of 5');
      await expect(page.locator('text=Shipping Method')).toBeVisible();
    });
  });

  test.describe('Shipping Method Step', () => {
    test.beforeEach(async ({ page }) => {
      await completeStepsUpTo(page, 4);
    });

    test('should display shipping method options', async ({ page }) => {
      await expect(page.locator('text=Shipping Method')).toBeVisible();
      
      // Check for shipping options
      await expect(page.locator('[data-testid="shipping-option"]')).toHaveCount.greaterThan(0);
      
      // Check that shipping options have required elements
      const firstOption = page.locator('[data-testid="shipping-option"]').first();
      await expect(firstOption.locator('[data-testid="shipping-name"]')).toBeVisible();
      await expect(firstOption.locator('[data-testid="shipping-price"]')).toBeVisible();
      await expect(firstOption.locator('[data-testid="shipping-time"]')).toBeVisible();
    });

    test('should allow selecting shipping methods', async ({ page }) => {
      const shippingOptions = page.locator('[data-testid="shipping-option"]');
      const count = await shippingOptions.count();
      
      if (count > 1) {
        // Select second option if available
        await shippingOptions.nth(1).click();
        await expect(shippingOptions.nth(1)).toHaveClass(/ring-2/);
      }
    });

    test('should update order summary with shipping cost', async ({ page }) => {
      const shippingOptions = page.locator('[data-testid="shipping-option"]');
      const firstOption = shippingOptions.first();
      
      // Get shipping price from option
      const shippingPrice = await firstOption.locator('[data-testid="shipping-price"]').textContent();
      
      // Select the option
      await firstOption.click();
      
      // Check that order summary is updated
      await expect(page.locator('[data-testid="shipping-cost"]')).toContainText(shippingPrice || '');
    });

    test('should require shipping method selection', async ({ page }) => {
      // Try to continue without selecting a shipping method
      await page.click('button:has-text("Continue to Payment")');
      
      // Should show validation error
      await expect(page.locator('text=Please select a shipping method')).toBeVisible();
    });

    test('should successfully complete shipping method step', async ({ page }) => {
      // Select first shipping option
      await page.locator('[data-testid="shipping-option"]').first().click();
      await page.click('button:has-text("Continue to Payment")');
      
      // Should advance to step 5
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 5 of 5');
      await expect(page.locator('text=Payment')).toBeVisible();
    });
  });

  test.describe('Payment Step', () => {
    test.beforeEach(async ({ page }) => {
      await completeStepsUpTo(page, 5);
    });

    test('should display payment form', async ({ page }) => {
      await expect(page.locator('text=Payment')).toBeVisible();
      await expect(page.locator('#card-number')).toBeVisible();
      await expect(page.locator('#expiry')).toBeVisible();
      await expect(page.locator('#cvc')).toBeVisible();
      await expect(page.locator('#cardholder-name')).toBeVisible();
    });

    test('should show order review section', async ({ page }) => {
      await expect(page.locator('text=Order Review')).toBeVisible();
      await expect(page.locator('[data-testid="final-total"]')).toBeVisible();
    });

    test('should validate payment form fields', async ({ page }) => {
      await page.click('button:has-text("Complete Order")');
      
      // Check for payment validation errors
      await expect(page.locator('text=Card number is required')).toBeVisible();
      await expect(page.locator('text=Expiry date is required')).toBeVisible();
      await expect(page.locator('text=CVC is required')).toBeVisible();
    });

    test('should validate card number format', async ({ page }) => {
      await page.fill('#card-number', '1234');
      await page.click('button:has-text("Complete Order")');
      
      // Should show card number validation error
      await expect(page.locator('text=Please enter a valid card number')).toBeVisible();
    });

    test('should validate expiry date format', async ({ page }) => {
      await page.fill('#expiry', '13/25'); // Invalid month
      await page.click('button:has-text("Complete Order")');
      
      // Should show expiry validation error
      await expect(page.locator('text=Please enter a valid expiry date')).toBeVisible();
    });

    test('should show loading state during payment processing', async ({ page }) => {
      // Fill valid payment details (mock Stripe test card)
      await fillPaymentForm(page);
      await page.click('button:has-text("Complete Order")');
      
      // Should show processing state
      await expect(page.locator('button:has-text("Processing...")')).toBeVisible();
    });

    test('should redirect to success page on successful payment', async ({ page }) => {
      // Fill valid payment details
      await fillPaymentForm(page);
      await page.click('button:has-text("Complete Order")');
      
      // Wait for redirect to success page
      await page.waitForURL('**/checkout/success', { timeout: 10000 });
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      // Check that layout adapts to mobile
      await expect(page.locator('.container')).toBeVisible();
      
      // Progress indicator should be visible on mobile
      await expect(page.locator('[data-testid="progress-indicator"]')).toBeVisible();
      
      // Form fields should stack on mobile
      const nameFields = page.locator('.grid.md\\:grid-cols-2');
      await expect(nameFields).toHaveClass(/grid-cols-1/);
    });

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      
      // Check that layout works on tablet
      await expect(page.locator('.container')).toBeVisible();
      
      // Two-column layout should work on tablet
      const grid = page.locator('.grid.lg\\:grid-cols-3');
      await expect(grid).toBeVisible();
    });
  });

  test.describe('Navigation and Step Management', () => {
    test('should allow clicking on completed steps', async ({ page }) => {
      // Complete first two steps
      await fillCustomerInfo(page);
      await page.click('button:has-text("Continue to Shipping")');
      await fillShippingAddress(page);
      await page.click('button:has-text("Continue to Billing")');
      
      // Click on step 1 in progress indicator
      await page.click('button:has-text("Customer Information")');
      
      // Should return to step 1
      await expect(page.locator('[data-testid="current-step"]')).toContainText('Step 1 of 5');
    });

    test('should preserve form data when navigating between steps', async ({ page }) => {
      // Fill customer info
      await fillCustomerInfo(page);
      await page.click('button:has-text("Continue to Shipping")');
      
      // Go back to customer info
      await page.click('button:has-text("Back")');
      
      // Data should be preserved
      await expect(page.locator('#email')).toHaveValue(testCustomer.email);
      await expect(page.locator('#firstName')).toHaveValue(testCustomer.firstName);
    });

    test('should prevent navigation to incomplete steps', async ({ page }) => {
      // Try to click on shipping method step (step 4) without completing previous steps
      const step4Button = page.locator('button:has-text("Shipping Method")');
      await expect(step4Button).toBeDisabled();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/stripe/checkout', route => {
        route.abort('failed');
      });
      
      await completeStepsUpTo(page, 5);
      await fillPaymentForm(page);
      await page.click('button:has-text("Complete Order")');
      
      // Should show error message
      await expect(page.locator('text=Payment failed')).toBeVisible();
    });

    test('should show validation errors clearly', async ({ page }) => {
      // Try to submit form with empty fields
      await page.click('button:has-text("Continue to Shipping")');
      
      // Error messages should be clearly visible
      const errorMessages = page.locator('.text-red-600');
      await expect(errorMessages).toHaveCount.greaterThan(0);
      
      // Error styling should be applied to form fields
      const errorFields = page.locator('.border-red-500');
      await expect(errorFields).toHaveCount.greaterThan(0);
    });
  });
});

// Helper functions
async function fillCustomerInfo(page: Page): Promise<void> {
  await page.fill('#email', testCustomer.email);
  await page.fill('#firstName', testCustomer.firstName);
  await page.fill('#lastName', testCustomer.lastName);
  await page.fill('#phone', testCustomer.phone);
}

async function fillShippingAddress(page: Page, address = testShippingAddress): Promise<void> {
  await page.fill('#shipping-firstName', address.firstName);
  await page.fill('#shipping-lastName', address.lastName);
  if (address.company) {
    await page.fill('#shipping-company', address.company);
  }
  await page.fill('#shipping-address1', address.address1);
  if (address.address2) {
    await page.fill('#shipping-address2', address.address2);
  }
  await page.fill('#shipping-city', address.city);
  await page.fill('#shipping-postalCode', address.postalCode);
  await page.selectOption('#shipping-country', address.country);
  if (address.phone) {
    await page.fill('#shipping-phone', address.phone);
  }
}

async function fillBillingAddress(page: Page, address = testBillingAddress): Promise<void> {
  await page.fill('#billing-firstName', address.firstName);
  await page.fill('#billing-lastName', address.lastName);
  await page.fill('#billing-address1', address.address1);
  await page.fill('#billing-city', address.city);
  await page.fill('#billing-postalCode', address.postalCode);
  await page.selectOption('#billing-country', address.country);
}

async function fillPaymentForm(page: Page): Promise<void> {
  // Use Stripe test card number
  await page.fill('#card-number', '4242424242424242');
  await page.fill('#expiry', '12/25');
  await page.fill('#cvc', '123');
  await page.fill('#cardholder-name', 'John Doe');
}

async function completeStepsUpTo(page: Page, step: number): Promise<void> {
  if (step >= 2) {
    await fillCustomerInfo(page);
    await page.click('button:has-text("Continue to Shipping")');
    await page.waitForTimeout(500);
  }
  
  if (step >= 3) {
    await fillShippingAddress(page);
    await page.click('button:has-text("Continue to Billing")');
    await page.waitForTimeout(500);
  }
  
  if (step >= 4) {
    await page.click('button:has-text("Continue to Shipping Method")');
    await page.waitForTimeout(500);
  }
  
  if (step >= 5) {
    await page.locator('[data-testid="shipping-option"]').first().click();
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForTimeout(500);
  }
}