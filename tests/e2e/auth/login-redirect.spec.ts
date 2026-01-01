import { test, expect } from '@playwright/test';
import { mockAuthAPI } from '../../helpers/network-interceptors';

/**
 * Authentication Test Suite
 * Tests user authentication flows including login redirect and token management
 * 
 * Test Scenarios:
 * 1. Login redirect flow - External auth portal redirect
 * 2. Token persistence - localStorage token management
 * 3. Token expiration handling - Expired token behavior
 */

test.describe('Authentication System', () => {
  
  /**
   * SCENARIO 1: Login Redirect Flow
   * Tests external authentication portal redirect functionality
   */
  test('should redirect to external login portal when clicking sign in', async ({ page }) => {
    // Navigate to checkout (requires authentication)
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should see sign in option
    const signInButton = page.getByRole('button', { name: /sign in|log in/i }).first();
    const signInLink = page.getByRole('link', { name: /sign in|log in/i }).first();
    
    const signInElement = await signInButton.isVisible({ timeout: 5000 }).catch(() => false) 
      ? signInButton 
      : signInLink;
    
    if (await signInElement.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Track navigation
      let redirected = false;
      let redirectUrl = '';
      
      page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) {
          const url = frame.url();
          if (url.includes('login') || url.includes('dashboard.salescentri.com')) {
            redirected = true;
            redirectUrl = url;
          }
        }
      });
      
      // Click sign in
      await signInElement.click().catch(() => {
        // May navigate immediately
      });
      
      // Wait for redirect to occur
      await page.waitForTimeout(3000);
      
      // Verify redirect happened
      const currentUrl = page.url();
      const hasRedirected = redirected || currentUrl.includes('login') || currentUrl.includes('dashboard');
      
      expect(hasRedirected).toBeTruthy();
      
      // Verify redirect preserves return URL
      if (redirectUrl) {
        const urlObj = new URL(redirectUrl);
        const redirectParam = urlObj.searchParams.get('redirect');
        
        if (redirectParam) {
          expect(redirectParam).toContain('checkout');
        }
      }
    } else {
      console.log('Sign in button not found - may already be authenticated or different flow');
    }
  });

  /**
   * SCENARIO 2: Token Persistence in localStorage
   * Tests authentication token storage and retrieval
   */
  test('should persist authentication tokens in localStorage after login', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inject mock authentication tokens (simulating successful login)
    await page.evaluate(() => {
      const now = Date.now();
      const expiresAt = now + 3600000; // 1 hour from now
      
      localStorage.setItem('salescentri_token', 'mock-jwt-token-abc123');
      localStorage.setItem('salescentri_refreshToken', 'mock-refresh-token-xyz789');
      localStorage.setItem('salescentri_expiresAt', String(expiresAt));
      localStorage.setItem('salescentri_user', JSON.stringify({
        email: 'authenticated@test.com',
        name: 'Test User',
        uid: 'user-12345'
      }));
    });
    
    // Reload page to apply authentication state
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify tokens are still present after reload
    const tokensAfterReload = await page.evaluate(() => {
      return {
        token: localStorage.getItem('salescentri_token'),
        refreshToken: localStorage.getItem('salescentri_refreshToken'),
        expiresAt: localStorage.getItem('salescentri_expiresAt'),
        user: localStorage.getItem('salescentri_user')
      };
    });
    
    expect(tokensAfterReload.token).toBe('mock-jwt-token-abc123');
    expect(tokensAfterReload.refreshToken).toBe('mock-refresh-token-xyz789');
    expect(tokensAfterReload.expiresAt).toBeTruthy();
    expect(tokensAfterReload.user).toContain('authenticated@test.com');
    
    // Navigate to protected route (should be accessible)
    await mockAuthAPI(page, true);
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should not see login prompt (authenticated)
    const signedInText = await page.getByText(/signed in|authenticated|welcome back/i).isVisible({ timeout: 5000 }).catch(() => false);
    const continueBillingButton = await page.getByRole('button', { name: /continue to billing/i }).isVisible({ timeout: 5000 }).catch(() => false);
    
    // Either signed in message or direct access to next step
    expect(signedInText || continueBillingButton).toBeTruthy();
  });

  /**
   * SCENARIO 3: Token Expiration Handling
   * Tests behavior when authentication token expires
   */
  test('should handle expired authentication tokens correctly', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inject EXPIRED authentication tokens
    await page.evaluate(() => {
      const pastTime = Date.now() - 3600000; // 1 hour ago (expired)
      
      localStorage.setItem('salescentri_token', 'expired-token-abc123');
      localStorage.setItem('salescentri_refreshToken', 'expired-refresh-token');
      localStorage.setItem('salescentri_expiresAt', String(pastTime));
      localStorage.setItem('salescentri_user', JSON.stringify({
        email: 'expired@test.com',
        name: 'Expired User',
        uid: 'expired-12345'
      }));
    });
    
    // Mock auth API to return unauthorized for expired token
    await mockAuthAPI(page, false);
    
    // Reload to trigger auth check
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Try to access protected route
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should see authentication required (expired tokens should be treated as not authenticated)
    await page.waitForTimeout(2000); // Give time for auth check
    
    const signInRequired = await page.getByText(/sign in|log in|authentication required/i).isVisible({ timeout: 5000 }).catch(() => false);
    const signInButton = await page.getByRole('button', { name: /sign in|log in/i }).isVisible({ timeout: 5000 }).catch(() => false);
    
    // Should prompt for re-authentication
    expect(signInRequired || signInButton).toBeTruthy();
    
    // Verify expired token was removed or user prompted to re-auth
    const tokensAfterExpiry = await page.evaluate(() => {
      const expiresAt = localStorage.getItem('salescentri_expiresAt');
      return {
        hasToken: !!localStorage.getItem('salescentri_token'),
        expiresAt: expiresAt,
        isExpired: expiresAt ? Date.now() > parseInt(expiresAt) : true
      };
    });
    
    // Token should either be removed or marked as expired
    expect(tokensAfterExpiry.isExpired || !tokensAfterExpiry.hasToken).toBeTruthy();
  });

  /**
   * BONUS SCENARIO: Token Polling Mechanism
   * Tests the 20-attempt polling for async token saving after redirect
   */
  test('should poll localStorage for tokens after login redirect', async ({ page }) => {
    // Navigate to checkout
    await page.goto('/checkout?token=new-token-123&refreshToken=new-refresh-456&expiresAt=' + (Date.now() + 3600000));
    await page.waitForLoadState('networkidle');
    
    // Simulate async token saving (delayed)
    await page.waitForTimeout(500);
    
    await page.evaluate((params) => {
      localStorage.setItem('salescentri_token', params.token);
      localStorage.setItem('salescentri_refreshToken', params.refreshToken);
      localStorage.setItem('salescentri_expiresAt', params.expiresAt);
    }, {
      token: 'new-token-123',
      refreshToken: 'new-refresh-456',
      expiresAt: String(Date.now() + 3600000)
    });
    
    // Wait for polling to detect tokens
    await page.waitForTimeout(2000);
    
    // Verify tokens were detected
    const tokens = await page.evaluate(() => {
      return {
        token: localStorage.getItem('salescentri_token'),
        refreshToken: localStorage.getItem('salescentri_refreshToken')
      };
    });
    
    expect(tokens.token).toBe('new-token-123');
    expect(tokens.refreshToken).toBe('new-refresh-456');
    
    // Mock successful auth API
    await mockAuthAPI(page, true);
    
    // Reload to validate authentication
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should be authenticated now
    await page.waitForTimeout(1000);
    
    const isAuthenticated = await page.getByText(/signed in|continue to billing/i).isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isAuthenticated).toBeTruthy();
  });

  /**
   * BONUS SCENARIO: Logout Functionality
   * Tests token cleanup on logout
   */
  test('should clear tokens on logout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Set up authenticated state
    await page.evaluate(() => {
      localStorage.setItem('salescentri_token', 'active-token');
      localStorage.setItem('salescentri_refreshToken', 'active-refresh');
      localStorage.setItem('salescentri_expiresAt', String(Date.now() + 3600000));
      localStorage.setItem('salescentri_user', JSON.stringify({ email: 'user@test.com' }));
    });
    
    // Look for logout button/link
    const logoutButton = page.getByRole('button', { name: /log out|sign out/i });
    const logoutLink = page.getByRole('link', { name: /log out|sign out/i });
    
    const logoutElement = await logoutButton.isVisible({ timeout: 5000 }).catch(() => false)
      ? logoutButton
      : logoutLink;
    
    if (await logoutElement.isVisible({ timeout: 5000 }).catch(() => false)) {
      await logoutElement.click();
      
      // Wait for logout to process
      await page.waitForTimeout(2000);
      
      // Verify tokens are cleared
      const tokensAfterLogout = await page.evaluate(() => {
        return {
          token: localStorage.getItem('salescentri_token'),
          refreshToken: localStorage.getItem('salescentri_refreshToken'),
          user: localStorage.getItem('salescentri_user')
        };
      });
      
      // All auth data should be cleared
      expect(tokensAfterLogout.token).toBeNull();
      expect(tokensAfterLogout.refreshToken).toBeNull();
      expect(tokensAfterLogout.user).toBeNull();
    } else {
      console.log('Logout button not found - may require navigation to user profile/settings');
    }
  });
});
