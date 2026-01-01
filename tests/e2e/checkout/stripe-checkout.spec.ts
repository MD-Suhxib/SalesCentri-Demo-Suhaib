import { test, expect } from '@playwright/test';
import { test as authTest } from '../../fixtures/auth.fixture';
import { 
  mockPricingAPI, 
  fillBillingForm, 
  generateMockOrderId 
} from '../../helpers/payment-helpers';
import { mockAuthAPI } from '../../helpers/network-interceptors';
import pricingFixtures from '../../fixtures/pricing-data.json';

/**
 * Stripe Checkout Flow Test Suite
 * Tests the complete checkout process with Stripe integration
 * 
 * Test Scenarios:
 * 1. Stripe session creation - API mocking and redirect
 * 2. Stripe test card integration with Stripe test mode
 * 3. Stripe payment method selection in UI
 * 4. Stripe success/cancel URL handling
 * 5. Error handling for failed Stripe sessions
 * 
 * IMPORTANT: These tests use Stripe's test mode
 * Test card numbers: https://stripe.com/docs/testing#cards
 * - 4242 4242 4242 4242: Success
 * - 4000 0000 0000 9995: Declined (insufficient funds)
 * - 4000 0000 0000 0002: Declined (generic)
 */

// Enable video recording for all tests in this file
test.use({
  video: 'on', // Always record video
  trace: 'on', // Also record trace for debugging
});

// Stripe test card numbers
const STRIPE_TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  requiresAuth: '4000002500003155',
  expiredCard: '4000000000000069',
};

/**
 * Mock Stripe create-session API endpoint
 */
async function mockStripeCreateSession(page: import('@playwright/test').Page, sessionId?: string) {
  const mockSessionId = sessionId || `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  await page.route('**/api/stripe/create-session', async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();
    
    // Validate required fields
    if (!postData?.segment || !postData?.billingCycle) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Missing required fields: segment and billingCycle are required'
        })
      });
      return;
    }
    
    // Simulate successful Stripe session creation
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: `https://checkout.stripe.com/c/pay/${mockSessionId}`,
        sessionId: mockSessionId,
        id: mockSessionId
      })
    });
  });
  
  return mockSessionId;
}

/**
 * Mock Stripe session with error response
 */
async function mockStripeCreateSessionError(page: import('@playwright/test').Page, errorMessage?: string) {
  await page.route('**/api/stripe/create-session', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: errorMessage || 'Stripe client initialization failed'
      })
    });
  });
}

/**
 * Wait for redirect to Stripe checkout
 */
async function waitForStripeRedirect(page: import('@playwright/test').Page, timeout = 15000) {
  return page.waitForURL('**/checkout.stripe.com/**', { timeout });
}

test.describe('Stripe Checkout Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock pricing API for all tests
    await mockPricingAPI(page, { data: [pricingFixtures.business_yearly_premium] });
  });

  /**
   * SCENARIO 1: Stripe API Session Creation
   * Tests that the Stripe create-session API is called correctly
   */
  authTest('should create Stripe checkout session with correct parameters', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    
    await mockAuthAPI(page, true);
    
    // Track API calls to Stripe create-session
    const stripeApiCalls: any[] = [];
    
    await page.route('**/api/stripe/create-session', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();
      stripeApiCalls.push(postData);
      
      // Return mock successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/c/pay/cs_test_mock123',
          sessionId: 'cs_test_mock123',
          id: 'cs_test_mock123'
        })
      });
    });
    
    // Navigate to checkout
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Skip to billing step if auth step is shown
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    // Fill billing information
    await expect(page.getByRole('heading', { name: /billing information/i })).toBeVisible({ timeout: 10000 });
    await fillBillingForm(page, {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@stripe-test.com',
      phone: '+1-555-0199',
      country: 'United States',
      company: 'Stripe Test Corp'
    });
    
    // Continue to payment
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continuePaymentButton).toBeVisible();
    await continuePaymentButton.click();
    
    // Verify payment method step - use heading role for specificity
    await expect(page.getByRole('heading', { name: /payment method/i })).toBeVisible({ timeout: 10000 });
    
    // Select Stripe (should be default)
    const stripeRadio = page.locator('input[value="stripe"], input[type="radio"]').first();
    if (await stripeRadio.isVisible()) {
      await stripeRadio.check();
    }
    
    // Continue to review - use exact name to avoid ambiguity
    const reviewButton = page.getByRole('button', { name: 'Review & Confirm', exact: true });
    await expect(reviewButton).toBeVisible();
    await reviewButton.click();
    
    // Accept terms
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Click pay button (Stripe)
    const payButton = page.getByRole('button', { name: /pay.*stripe|complete payment/i });
    await expect(payButton).toBeVisible();
    
    // Prevent actual navigation for API verification
    await page.route('**/*', route => route.abort());
    
    await payButton.click();
    
    // Wait for API call to be made
    await page.waitForTimeout(2000);
    
    // Verify Stripe API was called with correct data
    expect(stripeApiCalls.length).toBeGreaterThan(0);
    const lastCall = stripeApiCalls[stripeApiCalls.length - 1];
    expect(lastCall.segment).toBe(testPlan.segment);
    expect(lastCall.billingCycle).toBe(testPlan.billingCycle);
  });

  /**
   * SCENARIO 2: Stripe Checkout Redirect
   * Tests successful redirect to Stripe hosted checkout page
   */
  authTest('should redirect to Stripe checkout page', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    const sessionId = await mockStripeCreateSession(page);
    
    await mockAuthAPI(page, true);
    
    // Navigate to checkout
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Complete checkout flow quickly
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page);
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continuePaymentButton).toBeVisible({ timeout: 10000 });
    await continuePaymentButton.click();
    
    // Ensure Stripe is selected (default)
    const stripeRadio = page.locator('input[value="stripe"]').first();
    if (await stripeRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
      await stripeRadio.check();
    }
    
    const reviewButton = page.getByRole('button', { name: 'Review & Confirm', exact: true });
    await expect(reviewButton).toBeVisible();
    await reviewButton.click();
    
    // Accept terms
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Click pay button
    const payButton = page.getByRole('button', { name: /pay.*stripe|complete payment/i });
    await expect(payButton).toBeEnabled();
    
    // Initiate payment
    const redirectPromise = waitForStripeRedirect(page, 15000);
    await payButton.click();
    
    // Verify redirect to Stripe
    await redirectPromise;
    expect(page.url()).toContain('checkout.stripe.com');
  });

  /**
   * SCENARIO 3: Stripe is Default Payment Method
   * Tests that Stripe is selected by default in payment step
   */
  authTest('should have Stripe as default payment method', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    
    await mockAuthAPI(page, true);
    await mockStripeCreateSession(page);
    
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    await page.waitForLoadState('networkidle');
    
    // Navigate to payment step
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page);
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await expect(continuePaymentButton).toBeVisible({ timeout: 10000 });
    await continuePaymentButton.click();
    
    // Verify payment method step - use heading role for specificity
    await expect(page.getByRole('heading', { name: /payment method/i })).toBeVisible({ timeout: 10000 });
    
    // Verify Stripe option is visible
    const stripeLabel = page.locator('label').filter({ hasText: /stripe/i }).first();
    await expect(stripeLabel).toBeVisible();
    
    // Verify Stripe radio is checked by default
    const stripeRadio = page.locator('input[value="stripe"]').first();
    if (await stripeRadio.isVisible()) {
      await expect(stripeRadio).toBeChecked();
    }
  });

  /**
   * SCENARIO 4: Stripe Payment Button Text
   * Tests that the payment button shows correct text for Stripe
   */
  authTest('should show correct button text for Stripe payment', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    
    await mockAuthAPI(page, true);
    await mockStripeCreateSession(page);
    
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    await page.waitForLoadState('networkidle');
    
    // Navigate through checkout steps
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page);
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await continuePaymentButton.click();
    
    // Ensure Stripe is selected
    const stripeRadio = page.locator('input[value="stripe"]').first();
    if (await stripeRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
      await stripeRadio.check();
    }
    
    const reviewButton = page.getByRole('button', { name: 'Review & Confirm', exact: true });
    await reviewButton.click();
    
    // Accept terms
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Verify button text contains Stripe
    const payButton = page.getByRole('button', { name: /stripe/i });
    await expect(payButton).toBeVisible();
    
    // Verify the exact text matches expected
    await expect(page.getByText(/pay via stripe checkout/i)).toBeVisible();
  });

  /**
   * SCENARIO 5: Error Handling - Stripe Session Creation Fails
   * Tests graceful error handling when Stripe API fails
   */
  authTest('should handle Stripe session creation error gracefully', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    
    await mockAuthAPI(page, true);
    await mockStripeCreateSessionError(page, 'Stripe client initialization failed');
    
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    await page.waitForLoadState('networkidle');
    
    // Navigate through checkout
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page);
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await continuePaymentButton.click();
    
    const stripeRadio = page.locator('input[value="stripe"]').first();
    if (await stripeRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
      await stripeRadio.check();
    }
    
    const reviewButton = page.getByRole('button', { name: 'Review & Confirm', exact: true });
    await reviewButton.click();
    
    // Accept terms
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Listen for alert dialogs
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });
    
    // Attempt payment
    const payButton = page.getByRole('button', { name: /stripe|complete payment/i });
    await payButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(3000);
    
    // Verify error was handled (alert shown or stayed on page)
    const stillOnCheckout = page.url().includes('/checkout');
    const hasErrorAlert = alertMessage.toLowerCase().includes('failed') || alertMessage.toLowerCase().includes('error');
    
    expect(stillOnCheckout || hasErrorAlert).toBeTruthy();
  });

  /**
   * SCENARIO 6: Stripe Payment with Different Plans
   * Tests Stripe checkout works with various plan types
   */
  authTest('should work with different plan configurations', async ({ authenticatedPage: page }) => {
    const personalPlan = pricingFixtures.personal_yearly_basic;
    
    // Mock pricing with personal plan
    await page.unroute('**/api/get-pricing');
    await mockPricingAPI(page, { data: [personalPlan] });
    
    await mockAuthAPI(page, true);
    const sessionId = await mockStripeCreateSession(page);
    
    await page.goto(`/checkout?segment=${personalPlan.segment}&cycle=${personalPlan.billingCycle}&plan=${personalPlan.planName}`);
    await page.waitForLoadState('networkidle');
    
    // Navigate through checkout
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page);
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await continuePaymentButton.click();
    
    const reviewButton = page.getByRole('button', { name: 'Review & Confirm', exact: true });
    await reviewButton.click();
    
    // Accept terms
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Verify plan details shown
    await expect(page.getByText(personalPlan.planName)).toBeVisible();
    await expect(page.getByText(`$${personalPlan.price}`)).toBeVisible();
    
    // Initiate payment
    const payButton = page.getByRole('button', { name: /stripe|complete payment/i });
    const redirectPromise = waitForStripeRedirect(page, 15000);
    await payButton.click();
    
    // Verify redirect
    await redirectPromise;
    expect(page.url()).toContain('checkout.stripe.com');
  });
});

/**
 * Stripe Test Mode Integration Tests
 * These tests interact with actual Stripe test mode (requires running app with test keys)
 * Run with: STRIPE_TEST_MODE=true npx playwright test stripe-checkout.spec.ts --project=chromium
 */
test.describe('Stripe Test Mode Integration', () => {
  
  // Skip these tests unless explicitly running in test mode
  test.skip(!process.env.STRIPE_TEST_MODE, 'Skipping Stripe integration tests - set STRIPE_TEST_MODE=true to run');

  test.beforeEach(async ({ page }) => {
    // These tests require actual Stripe test keys configured
    // They use Stripe's test card numbers
  });

  /**
   * INTEGRATION TEST: Complete Stripe Payment with Test Card
   * This test goes through actual Stripe hosted checkout with test card
   */
  authTest('should complete payment with Stripe test card', async ({ authenticatedPage: page }) => {
    const testPlan = pricingFixtures.business_yearly_premium;
    
    await mockAuthAPI(page, true);
    
    // Don't mock Stripe API - use real test mode
    await page.goto(`/checkout?segment=${testPlan.segment}&cycle=${testPlan.billingCycle}&plan=${testPlan.planName}`);
    await page.waitForLoadState('networkidle');
    
    // Complete checkout flow
    const continueBillingButton = page.getByRole('button', { name: /continue to billing/i });
    if (await continueBillingButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBillingButton.click();
    }
    
    await fillBillingForm(page, {
      firstName: 'Stripe',
      lastName: 'Test',
      email: 'stripe-test@example.com',
      phone: '+1-555-0100',
      country: 'United States',
    });
    
    const continuePaymentButton = page.getByRole('button', { name: /continue to payment/i });
    await continuePaymentButton.click();
    
    const reviewButton = page.getByRole('button', { name: 'Review & Confirm', exact: true });
    await reviewButton.click();
    
    const termsCheckbox = page.getByRole('checkbox', { name: /agree|terms/i });
    if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await termsCheckbox.check();
    }
    
    // Go to Stripe checkout
    const payButton = page.getByRole('button', { name: /stripe/i });
    await payButton.click();
    
    // Wait for Stripe checkout to load
    await page.waitForURL('**/checkout.stripe.com/**', { timeout: 30000 });
    
    // Fill Stripe test card details
    // Note: Stripe checkout iframe handling may vary
    await page.waitForTimeout(3000); // Wait for Stripe to fully load
    
    // Fill card number
    const cardInput = page.locator('input[name="cardNumber"], [data-testid="card-number"]').first();
    await cardInput.fill(STRIPE_TEST_CARDS.success);
    
    // Fill expiry (MM/YY format)
    const expiryInput = page.locator('input[name="cardExpiry"], [data-testid="card-expiry"]').first();
    await expiryInput.fill('12/30');
    
    // Fill CVC
    const cvcInput = page.locator('input[name="cardCvc"], [data-testid="card-cvc"]').first();
    await cvcInput.fill('123');
    
    // Fill name
    const nameInput = page.locator('input[name="billingName"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Stripe Test');
    }
    
    // Submit payment
    const submitButton = page.getByRole('button', { name: /pay|submit/i });
    await submitButton.click();
    
    // Wait for success redirect
    await page.waitForURL('**/payment-success**', { timeout: 60000 });
    
    // Verify success
    expect(page.url()).toContain('payment-success');
  });

  /**
   * INTEGRATION TEST: Handle Declined Card
   * Tests behavior when card is declined
   */
  authTest('should handle declined card gracefully', async ({ authenticatedPage: page }) => {
    // Similar flow but using declined card number
    // The test would verify error message is shown
    test.skip(); // Placeholder - implement when needed
  });
});
