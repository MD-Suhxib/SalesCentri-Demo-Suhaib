import { Page, Route } from '@playwright/test';
import mockResponses from '../fixtures/mock-responses';

/**
 * Payment Gateway Helper Functions
 * Provides utilities for mocking and testing payment flows
 */

// Stripe test card numbers for different scenarios
export const STRIPE_TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  requiresAuth: '4000002500003155',
  expiredCard: '4000000000000069',
  processingError: '4000000000000119',
};

/**
 * Mock Stripe create-session API endpoint
 */
export async function mockStripeCheckout(page: Page, sessionId?: string) {
  const mockSessionId = sessionId || `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  await page.route('**/api/stripe/create-session', async (route: Route) => {
    const request = route.request();
    let postData: any = {};
    
    try {
      postData = request.postDataJSON();
    } catch {
      // Request might not have JSON body
    }
    
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
export async function mockStripeCheckoutError(page: Page, errorMessage?: string, statusCode = 500) {
  await page.route('**/api/stripe/create-session', async (route: Route) => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({
        error: errorMessage || 'Stripe client initialization failed'
      })
    });
  });
}

/**
 * Wait for redirect to Stripe checkout page
 */
export async function waitForStripeRedirect(page: Page, timeout = 15000) {
  return page.waitForURL('**/checkout.stripe.com/**', { timeout });
}

/**
 * Mock PayPal order creation and redirect
 */
export async function mockPayPalCheckout(page: Page, orderId?: string) {
  const mockOrderId = orderId || mockResponses.paypal.createOrder.orderId;
  
  await page.route('**/api/paypal/create-order', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        orderId: mockOrderId,
        approveUrl: `https://sandbox.paypal.com/checkoutnow?token=${mockOrderId}`
      })
    });
  });
}

/**
 * Mock PayPal order capture (payment confirmation)
 */
export async function mockPayPalCapture(page: Page, orderId?: string) {
  const mockOrderId = orderId || mockResponses.paypal.createOrder.orderId;
  
  await page.route('**/api/paypal/capture-order*', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...mockResponses.paypal.captureOrder,
        orderId: mockOrderId
      })
    });
  });
}

/**
 * Mock PayPal success callback
 */
export async function mockPayPalSuccess(page: Page, params?: Record<string, string>) {
  const defaultParams = {
    orderId: 'MOCK-ORDER-12345',
    amount: '299',
    currency: 'USD',
    segment: 'Business',
    billingCycle: 'Yearly',
    planName: 'Premium'
  };
  
  const queryParams = new URLSearchParams({ ...defaultParams, ...params }).toString();
  
  await page.route('**/api/paypal/success*', async (route: Route) => {
    await route.fulfill({
      status: 302,
      headers: {
        'Location': `/payment-success?${queryParams}`
      }
    });
  });
}

/**
 * Mock PayU session creation
 */
export async function mockPayUCheckout(page: Page, sessionId?: string) {
  const mockSessionId = sessionId || mockResponses.payu.createSession.result.sessionId;
  
  await page.route('**/api/payu/create-session', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'SUCCESS',
        result: {
          sessionId: mockSessionId,
          paymentUrl: `https://test.payu.in/payment?sessionId=${mockSessionId}`
        }
      })
    });
  });
}

/**
 * Mock pricing API response
 */
export async function mockPricingAPI(page: Page, pricingData?: any) {
  await page.route('**/api/get-pricing', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(pricingData || mockResponses.pricing.success)
    });
  });
}

/**
 * Generate mock order ID
 */
export function generateMockOrderId(): string {
  return `MOCK-ORDER-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
}

/**
 * Wait for payment redirect (PayPal or PayU)
 */
export async function waitForPaymentRedirect(page: Page, gateway: 'paypal' | 'payu', timeout = 10000) {
  const urlPattern = gateway === 'paypal' 
    ? '**/sandbox.paypal.com/**' 
    : '**/test.payu.in/**';
  
  return page.waitForURL(urlPattern, { timeout });
}

/**
 * Fill billing information form
 */
export async function fillBillingForm(page: Page, data?: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  company?: string;
}) {
  const billingData = {
    firstName: data?.firstName || 'John',
    lastName: data?.lastName || 'Doe',
    email: data?.email || 'test@example.com',
    phone: data?.phone || '+1234567890',
    country: data?.country || 'United States',
    company: data?.company || 'Test Company Inc'
  };
  
  // Fill first name
  const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="First" i], [aria-label*="First Name" i]').first();
  if (await firstNameInput.isVisible()) {
    await firstNameInput.fill(billingData.firstName);
  }
  
  // Fill last name
  const lastNameInput = page.locator('input[name="lastName"], input[placeholder*="Last" i], [aria-label*="Last Name" i]').first();
  if (await lastNameInput.isVisible()) {
    await lastNameInput.fill(billingData.lastName);
  }
  
  // Fill email if visible
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  if (await emailInput.isVisible()) {
    await emailInput.fill(billingData.email);
  }
  
  // Fill phone if visible
  const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
  if (await phoneInput.isVisible()) {
    await phoneInput.fill(billingData.phone);
  }
  
  // Select country if visible
  const countrySelect = page.locator('select[name="country"], select[name="region"]').first();
  if (await countrySelect.isVisible()) {
    await countrySelect.selectOption(billingData.country);
  }
  
  // Fill company if visible
  const companyInput = page.locator('input[name="company"], input[placeholder*="Company" i]').first();
  if (await companyInput.isVisible()) {
    await companyInput.fill(billingData.company);
  }
}
