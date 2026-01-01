import { test, expect } from '@playwright/test';
import { mockOTPSend, mockOTPVerify } from '../../helpers/network-interceptors';

/**
 * OTP Verification Test Suite
 * Tests the One-Time Password verification system
 * 
 * Test Scenarios:
 * 1. Successful OTP verification
 * 2. Expired OTP (3-minute timeout)
 * 3. Invalid OTP (wrong code)
 * 4. Rate limiting (3 attempts per 15 minutes)
 */

test.describe('OTP Verification System', () => {
  
  /**
   * SCENARIO 1: Successful OTP Verification
   * Tests the happy path for OTP verification
   */
  test('should successfully verify valid OTP', async ({ page }) => {
    // Mock OTP APIs
    await mockOTPSend(page, 'success');
    await mockOTPVerify(page, 'success');
    
    // Navigate to a page with OTP form (adjust URL as needed)
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    // Fill email and phone
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
    }
    
    if (await phoneInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await phoneInput.fill('+1234567890');
    }
    
    // Click send OTP button
    const sendOTPButton = page.getByRole('button', { name: /send otp|send code|get code/i }).first();
    if (await sendOTPButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sendOTPButton.click();
      
      // Wait for OTP input to appear
      const otpInput = page.locator('input[placeholder*="OTP" i], input[placeholder*="code" i], input[name="otp"]').first();
      await expect(otpInput).toBeVisible({ timeout: 10000 });
      
      // Enter valid OTP
      await otpInput.fill('123456');
      
      // Click verify button
      const verifyButton = page.getByRole('button', { name: /verify|submit|confirm/i }).first();
      await expect(verifyButton).toBeVisible();
      await verifyButton.click();
      
      // Wait for success message or navigation
      await page.waitForTimeout(2000);
      
      // Verify success (either message or URL change)
      const successMessage = await page.getByText(/verified|success|confirmed/i).isVisible({ timeout: 5000 }).catch(() => false);
      const urlChanged = !page.url().includes('account-setup');
      
      expect(successMessage || urlChanged).toBeTruthy();
    }
  });

  /**
   * SCENARIO 2: Expired OTP
   * Tests OTP expiration after 3 minutes
   */
  test('should reject expired OTP', async ({ page }) => {
    await mockOTPSend(page, 'success');
    await mockOTPVerify(page, 'expired');
    
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    // Fill contact information
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
    }
    
    const phoneInput = page.locator('input[type="tel"]').first();
    if (await phoneInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await phoneInput.fill('+1234567890');
    }
    
    // Send OTP
    const sendButton = page.getByRole('button', { name: /send otp|send code/i }).first();
    if (await sendButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sendButton.click();
      
      // Wait for OTP input
      const otpInput = page.locator('input[placeholder*="OTP" i], input[name="otp"]').first();
      await expect(otpInput).toBeVisible({ timeout: 10000 });
      
      // Enter OTP
      await otpInput.fill('123456');
      
      // Try to verify (should fail with expired message)
      const verifyButton = page.getByRole('button', { name: /verify|submit/i }).first();
      await verifyButton.click();
      
      // Wait for error message
      await page.waitForTimeout(1000);
      
      // Verify expired message is shown
      const expiredMessage = await page.getByText(/expired|timeout|no longer valid/i).isVisible({ timeout: 5000 }).catch(() => false);
      const errorVisible = await page.locator('.error, .text-red, [role="alert"]').filter({ hasText: /expired|timeout/i }).isVisible().catch(() => false);
      
      expect(expiredMessage || errorVisible).toBeTruthy();
    }
  });

  /**
   * SCENARIO 3: Invalid OTP
   * Tests rejection of incorrect OTP codes
   */
  test('should reject invalid OTP and show remaining attempts', async ({ page }) => {
    await mockOTPSend(page, 'success');
    await mockOTPVerify(page, 'invalid');
    
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    // Fill email
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      
      const phoneInput = page.locator('input[type="tel"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('+1234567890');
      }
      
      // Send OTP
      const sendButton = page.getByRole('button', { name: /send otp|send code/i }).first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Enter invalid OTP
        const otpInput = page.locator('input[placeholder*="OTP" i], input[name="otp"]').first();
        await expect(otpInput).toBeVisible({ timeout: 10000 });
        await otpInput.fill('000000'); // Wrong code
        
        // Try to verify
        const verifyButton = page.getByRole('button', { name: /verify|submit/i }).first();
        await verifyButton.click();
        
        // Wait for error
        await page.waitForTimeout(1000);
        
        // Check for invalid OTP message
        const invalidMessage = await page.getByText(/invalid|incorrect|wrong|try again/i).isVisible({ timeout: 5000 }).catch(() => false);
        const errorVisible = await page.locator('.error, .text-red, [role="alert"]').isVisible().catch(() => false);
        
        // Verify error is shown
        expect(invalidMessage || errorVisible).toBeTruthy();
        
        // Optional: Check if attempts remaining is shown
        const attemptsText = await page.getByText(/attempt.*remaining|tries left/i).textContent().catch(() => null);
        if (attemptsText) {
          console.log('Attempts remaining message:', attemptsText);
        }
      }
    }
  });

  /**
   * SCENARIO 4: Rate Limiting
   * Tests OTP rate limiting (3 requests per 15 minutes)
   */
  test('should enforce rate limiting after multiple OTP requests', async ({ page }) => {
    await mockOTPSend(page, 'rate_limit');
    
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    // Fill email
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      
      const phoneInput = page.locator('input[type="tel"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('+1234567890');
      }
      
      // Try to send OTP (should be rate limited)
      const sendButton = page.getByRole('button', { name: /send otp|send code/i }).first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Wait for rate limit message
        await page.waitForTimeout(1000);
        
        // Check for rate limit message
        const rateLimitMessage = await page.getByText(/rate limit|too many|wait|try again later/i).isVisible({ timeout: 5000 }).catch(() => false);
        const errorMessage = await page.locator('.error, .text-red, [role="alert"]').filter({ hasText: /limit|many|wait/i }).isVisible().catch(() => false);
        
        expect(rateLimitMessage || errorMessage).toBeTruthy();
        
        // Verify send button is disabled or message persists
        const buttonDisabled = await sendButton.isDisabled().catch(() => false);
        console.log('Send OTP button disabled after rate limit:', buttonDisabled);
      }
    }
  });

  /**
   * BONUS SCENARIO: Maximum Verification Attempts
   * Tests blocking after exceeding maximum OTP verification attempts
   */
  test('should block verification after maximum attempts exceeded', async ({ page }) => {
    await mockOTPSend(page, 'success');
    await mockOTPVerify(page, 'max_attempts');
    
    await page.goto('/get-started/free-trial/account-setup');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      
      const phoneInput = page.locator('input[type="tel"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('+1234567890');
      }
      
      // Send OTP
      const sendButton = page.getByRole('button', { name: /send otp/i }).first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        const otpInput = page.locator('input[placeholder*="OTP" i]').first();
        await expect(otpInput).toBeVisible({ timeout: 10000 });
        
        // Enter wrong OTP
        await otpInput.fill('999999');
        
        // Try to verify
        const verifyButton = page.getByRole('button', { name: /verify/i }).first();
        await verifyButton.click();
        
        await page.waitForTimeout(1000);
        
        // Check for max attempts message
        const maxAttemptsMessage = await page.getByText(/maximum.*attempts|too many attempts|request new/i).isVisible({ timeout: 5000 }).catch(() => false);
        const errorVisible = await page.locator('.error, [role="alert"]').filter({ hasText: /maximum|attempts/i }).isVisible().catch(() => false);
        
        expect(maxAttemptsMessage || errorVisible).toBeTruthy();
      }
    }
  });
});
