import { test, expect } from '@playwright/test';
import { test as authTest } from '../../fixtures/auth.fixture';
import { mockPayPalCheckout, mockPricingAPI, fillBillingForm, generateMockOrderId, waitForPaymentRedirect } from '../../helpers/payment-helpers';
import { mockAuthAPI } from '../../helpers/network-interceptors';
import pricingFixtures from '../../fixtures/pricing-data.json';

/**
 * Checkout Flow Test Suite
 * Tests the complete 4-step checkout process with PayPal integration
 * 
 * Test Scenarios:
 * 1. Happy path - Authenticated user completes checkout
 * 2. Unauthenticated redirect - User redirected to login
 * 3. Billing validation - Form validation errors
 * 4. Payment method selection - PayPal selection
 * 5. PayPal redirect - Successful payment gateway redirect
 */

test.describe('Checkout Flow - Complete User Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock pricing API for all tests
    await mockPricingAPI(page, { data: [pricingFixtures.business_yearly_premium] });
  });

  /**
   * SCENARIO 1: Happy Path - Authenticated User Completes Checkout
   * Tests the complete checkout flow for an authenticated user
   */
  authTest('should complete full checkout flow with authenticated user', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    const orderId = generateMockOrderId();
    
    // Mock authentication API for auth validation
    await mockAuthAPI(page, true);
    
    // Mock PayPal order creation
    await mockPayPalCheckout(page, orderId);
    
    // Step 1: Navigate to checkout with plan selection
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    
    // Wait for page to load and auth to be validated
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for auth check to complete
    
    // Verify authentication step is bypassed (should see "You are signed in" or go directly to billing)
    const isSignedInVisible = await page.getByText(/signed in|authenticated/i).isVisible().catch(() => false);
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    
    if (isSignedInVisible || await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Authentication step shown, click continue if button is visible
      if (await continueBillingButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await continueBillingButton.click();
      }
    }
    
    // Step 2: Fill billing information
    // Use heading role for more specificity to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /billing information/i })).toBeVisible({ timeout: 10000 });

    
    await fillBillingForm(page, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+1-555-0123',
      country: 'United States',
      company: 'Test Corp'
    });
    
    // Click continue to payment
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continuePaymentButton).toBeVisible();
    await continuePaymentButton.click();
    
    // Step 3: Select payment method (PayPal)
    await expect(page.getByText(/payment method|select payment/i)).toBeVisible({ timeout: 10000 });
    
    // Verify PayPal option is available
    const paypalOption = page.locator('input[value="paypal"], input[type="radio"][id*="paypal"]').first();
    await expect(paypalOption).toBeVisible();
    
    // Select PayPal if not already selected
    if (!(await paypalOption.isChecked())) {
      await paypalOption.check();
    }
    
    // Click review & confirm
    const reviewButton = page.getByRole('button', { name: /review.*confirm|continue/i });
    await expect(reviewButton).toBeVisible();
    await reviewButton.click();
    
    // Step 4: Review and confirm order
    await expect(page.getByText(/review.*confirm|order summary/i)).toBeVisible({ timeout: 10000 });
    
    // Verify order details
    await expect(page.getByText(testPlan.planName)).toBeVisible();
    await expect(page.getByText(`$${testPlan.price}`)).toBeVisible();
    
    // Accept terms & conditions
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms|privacy/i });
    await expect(termsCheckbox).toBeVisible();
    await termsCheckbox.check();
    
    // Click Pay with PayPal
    const payButton = page.getByRole('button', { name: /pay with paypal|complete payment/i });
    await expect(payButton).toBeEnabled();
    
    // Initiate payment (should redirect to PayPal sandbox)
    const redirectPromise = waitForPaymentRedirect(page, 'paypal', 15000);
    await payButton.click();
    
    // Verify redirect to PayPal
    await redirectPromise;
    expect(page.url()).toContain('paypal.com');
  });

  /**
   * SCENARIO 2: Unauthenticated Redirect
   * Tests that unauthenticated users are redirected to login
   */
  test('should redirect unauthenticated user to login page', async ({ page }) => {
    // Navigate to checkout without authentication
    await page.goto('/checkout?segment=Business&cycle=Yearly&plan=Premium');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Should see authentication required message or login form
    const authRequired = await page.getByText(/sign in|log in|authentication required/i).isVisible({ timeout: 5000 }).catch(() => false);
    const loginForm = await page.locator('form').filter({ hasText: /sign in|log in/i }).isVisible().catch(() => false);
    
    expect(authRequired || loginForm).toBeTruthy();
    
    // Click sign in button
    const signInButton = page.getByRole('button', { name: /sign in|log in/i }).first();
    
    if (await signInButton.isVisible()) {
      // Intercept external login redirect
      let redirectUrl = '';
      page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) {
          redirectUrl = frame.url();
        }
      });
      
      await signInButton.click({ timeout: 5000 }).catch(() => {
        // Button might trigger redirect immediately
      });
      
      // Wait a bit for redirect to initiate
      await page.waitForTimeout(2000);
      
      // Verify redirect to login portal or URL change
      const currentUrl = page.url();
      const hasRedirected = currentUrl.includes('login') || currentUrl.includes('dashboard.salescentri.com');
      
      expect(hasRedirected || redirectUrl.includes('login')).toBeTruthy();
    }
  });

  /**
   * SCENARIO 3: Billing Validation Errors
   * Tests form validation for required billing fields
   */
  authTest('should show validation errors for incomplete billing form', async ({ authenticatedPage: page }) => {
    await mockAuthAPI(page, true);
    await page.goto('/checkout?segment=Business&cycle=Yearly&plan=Premium');
    await page.waitForLoadState('networkidle');
    
    // Skip to billing step
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    // Wait for billing form
    await expect(page.getByText(/billing information/i)).toBeVisible({ timeout: 10000 });
    
    // Try to submit empty form
    const continueButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continueButton).toBeVisible();
    await continueButton.click();
    
    // Should still be on billing page or show validation errors
    // Note: This depends on implementation - some forms validate on blur, some on submit
    await page.waitForTimeout(1000);
    
    const stillOnBillingPage = await page.getByText(/billing information/i).isVisible().catch(() => false);
    const hasValidationError = await page.locator('.error, [aria-invalid="true"], .text-red').count() > 0;
    
    // At least one validation should be present
    expect(stillOnBillingPage || hasValidationError).toBeTruthy();
  });

  /**
   * SCENARIO 4: Payment Method Selection
   * Tests payment method selection functionality
   */
  authTest('should allow payment method selection', async ({ authenticatedPage: page }) => {
    await mockAuthAPI(page, true);
    await page.goto('/checkout?segment=Business&cycle=Yearly&plan=Premium');
    await page.waitForLoadState('networkidle');
    
    // Navigate to payment method step
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    // Fill minimal billing info
    await fillBillingForm(page);
    
    // Continue to payment
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continuePaymentButton).toBeVisible({ timeout: 10000 });
    await continuePaymentButton.click();
    
    // Verify payment method page
    await expect(page.getByText(/payment method|select payment/i)).toBeVisible({ timeout: 10000 });
    
    // Verify PayPal option exists
    const paypalRadio = page.locator('input[value="paypal"], input[id*="paypal"]').first();
    await expect(paypalRadio).toBeVisible();
    
    // Select PayPal
    await paypalRadio.check();
    
    // Verify it's selected
    await expect(paypalRadio).toBeChecked();
    
    // Verify continue button is enabled
    const reviewButton = page.getByRole('button', { name: /review|continue/i });
    await expect(reviewButton).toBeEnabled();
  });

  /**
   * SCENARIO 5: PayPal Redirect Verification
   * Tests successful PayPal gateway redirect
   */
  authTest('should redirect to PayPal sandbox for payment', async ({ authenticatedPage: page }) => {
    const orderId = generateMockOrderId();
    await mockAuthAPI(page, true);
    await mockPayPalCheckout(page, orderId);
    
    await page.goto('/checkout?segment=Business&cycle=Yearly&plan=Premium');
    await page.waitForLoadState('networkidle');
    
    // Fast-forward through steps
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page);
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continuePaymentButton).toBeVisible({ timeout: 10000 });
    await continuePaymentButton.click();
    
    const paypalRadio = page.locator('input[value="paypal"]').first();
    if (await paypalRadio.isVisible({ timeout: 5000 }).catch(() => false)) {
      await paypalRadio.check();
    }
    
    const reviewButton = page.getByRole('button', { name: /review|continue/i });
    await expect(reviewButton).toBeVisible();
    await reviewButton.click();
    
    // Accept terms
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Initiate PayPal payment
    const payButton = page.getByRole('button', { name: /pay with paypal/i });
    await expect(payButton).toBeVisible();
    
    const redirectPromise = waitForPaymentRedirect(page, 'paypal', 15000);
    await payButton.click();
    
    // Verify redirect
    await redirectPromise;
    const finalUrl = page.url();
    
    expect(finalUrl).toContain('paypal.com');
    expect(finalUrl).toContain('sandbox'); // Ensure it's sandbox, not production
  });
});
