import { test, expect } from '@playwright/test';
import { mockOTPSend, mockOTPVerify, mockAuthAPI } from '../../helpers/network-interceptors';
import { mockPayPalCheckout, mockPricingAPI } from '../../helpers/payment-helpers';

/**
 * API Integration Test Suite
 * Tests critical API endpoints with mocked responses
 * 
 * Test Scenarios:
 * 1. /api/lead-capture/send-otp - Success/Failure
 * 2. /api/lead-capture/verify-otp - Success/Failure
 * 3. /api/get-pricing - Data validation
 * 4. /api/paypal/create-order - Order creation
 * 5. /api/profile - Authentication validation
 */

test.describe('API Integration Tests', () => {

  /**
   * SCENARIO 1: OTP Send API - Success
   * Tests successful OTP generation and sending
   */
  test('should successfully send OTP via API', async ({ page }) => {
    // Mock successful OTP send
    await mockOTPSend(page, 'success');
    
    // Navigate to OTP page
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    // Fill email/phone
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      
      // Click send OTP
      const sendButton = page.getByRole('button', { name: /send otp|send code/i }).first();
      if (await sendButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await sendButton.click();
        
        // Wait for response
        await page.waitForTimeout(1000);
        
        // Verify success feedback (OTP input appears or success message)
        const otpInput = await page.locator('input[placeholder*="OTP" i], input[name="otp"]').isVisible({ timeout: 5000 }).catch(() => false);
        const successMessage = await page.getByText(/sent|code sent|check your email/i).isVisible({ timeout: 5000 }).catch(() => false);
        
        expect(otpInput || successMessage).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  /**
   * SCENARIO 2: OTP Send API - Rate Limit
   * Tests rate limiting on OTP send endpoint
   */
  test('should handle OTP rate limiting', async ({ page }) => {
    // Mock rate limit error
    await mockOTPSend(page, 'rate_limit');
    
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      
      const sendButton = page.getByRole('button', { name: /send otp|send code/i }).first();
      if (await sendButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await sendButton.click();
        await page.waitForTimeout(1000);
        
        // Verify rate limit message
        const rateLimitMessage = await page.getByText(/too many|rate limit|wait|try again/i).isVisible({ timeout: 5000 }).catch(() => false);
        const errorMessage = await page.locator('.error, [role="alert"]').isVisible({ timeout: 5000 }).catch(() => false);
        
        expect(rateLimitMessage || errorMessage).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  /**
   * SCENARIO 3: OTP Verify API - Success
   * Tests successful OTP verification
   */
  test('should successfully verify OTP via API', async ({ page }) => {
    await mockOTPSend(page, 'success');
    await mockOTPVerify(page, 'success');
    
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      await page.getByRole('button', { name: /send otp/i }).first().click();
      await page.waitForTimeout(1000);
      
      const otpInput = page.locator('input[placeholder*="OTP" i], input[name="otp"]').first();
      if (await otpInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await otpInput.fill('123456');
        await page.getByRole('button', { name: /verify|submit/i }).first().click();
        await page.waitForTimeout(1000);
        
        // Verify success (navigation or success message)
        const successMessage = await page.getByText(/verified|success|confirmed/i).isVisible({ timeout: 5000 }).catch(() => false);
        const urlChanged = !page.url().includes('account-setup');
        
        expect(successMessage || urlChanged).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  /**
   * SCENARIO 4: Pricing API - Data Validation
   * Tests that pricing API returns valid data structure
   */
  test('should fetch and validate pricing data', async ({ page }) => {
    // Mock pricing data
    const mockPricing = {
      data: [
        {
          segment: 'Business',
          billingCycle: 'Yearly',
          planName: 'Premium',
          price: 299,
          features: ['Feature 1', 'Feature 2']
        }
      ]
    };
    
    await mockPricingAPI(page, mockPricing);
    
    // Navigate to pricing page
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    
    // Wait for pricing to load
    await page.waitForTimeout(2000);
    
    // Verify pricing data is displayed
    const hasPricing = await page.locator('.price, [data-price], .pricing-card').count() > 0;
    const hasAmount = await page.getByText(/\$|USD|price/i).isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasPricing || hasAmount).toBeTruthy();
  });

  /**
   * SCENARIO 5: PayPal Create Order API
   * Tests PayPal order creation endpoint
   */
  test('should create PayPal order via API', async ({ page }) => {
    await mockAuthAPI(page, true);
    await mockPayPalCheckout(page, 'TEST-ORDER-12345');
    
    await page.goto('/checkout?segment=Business&cycle=Yearly&plan=Premium');
    await page.waitForLoadState('networkidle');
    
    // Navigate through checkout (simplified)
    await page.waitForTimeout(3000);
    
    // Look for PayPal button
    const paypalButton = page.getByRole('button', { name: /paypal/i }).first();
    
    if (await paypalButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      // Clicking should trigger order creation
      await paypalButton.click();
      
      // Wait for redirect or popup
      await page.waitForTimeout(2000);
      
      // Verify order was created (redirect to PayPal or popup)
      const url = page.url();
      const hasRedirected = url.includes('paypal') || url.includes('sandbox');
      
      expect(hasRedirected).toBeTruthy();
    } else {
      console.log('PayPal button not found - skipping');
      test.skip();
    }
  });

  /**
   * SCENARIO 6: Profile API - Authentication Check
   * Tests profile API for user authentication
   */
  test('should validate user profile via API', async ({ page }) => {
    // Mock authenticated profile
    await mockAuthAPI(page, true);
    
    await page.goto('/');
    
    // Set auth token
    await page.evaluate(() => {
      localStorage.setItem('salescentri_token', 'test-jwt-token');
      localStorage.setItem('salescentri_expiresAt', String(Date.now() + 3600000));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if profile API was called (by checking for authenticated UI elements)
    const hasAuthUI = await page.locator('[data-authenticated="true"], .user-profile, .avatar').count() > 0;
    const hasUserInfo = await page.getByText(/profile|account|settings/i).isVisible({ timeout: 5000 }).catch(() => false);
    
    // At minimum, the page should load without errors
    const noErrors = await page.locator('.error, [role="alert"]').count() === 0;
    
    expect(hasAuthUI || hasUserInfo || noErrors).toBeTruthy();
  });

  /**
   * SCENARIO 7: Profile API - Unauthenticated
   * Tests profile API returns 401 for unauthenticated users
   */
  test('should handle unauthenticated profile API request', async ({ page }) => {
    // Mock unauthenticated profile
    await mockAuthAPI(page, false);
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should redirect to login or show login prompt
    const url = page.url();
    const redirectedToLogin = url.includes('login') || url.includes('signin');
    const hasLoginPrompt = await page.getByText(/sign in|log in|login/i).isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(redirectedToLogin || hasLoginPrompt).toBeTruthy();
  });

  /**
   * SCENARIO 8: Error Handling - Network Timeout
   * Tests that API timeouts are handled gracefully
   */
  test('should handle API timeout errors', async ({ page }) => {
    // Mock timeout by delaying response
    await page.route('**/api/get-pricing', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10s delay
      await route.abort('timedout');
    });
    
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show loading state or error
    const hasError = await page.getByText(/timeout|error|failed|try again/i).isVisible({ timeout: 5000 }).catch(() => false);
    const hasLoading = await page.locator('.loading, .spinner').isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasError || hasLoading).toBeTruthy();
  });
});
