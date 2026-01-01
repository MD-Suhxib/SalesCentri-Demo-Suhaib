import { test as base, Page } from '@playwright/test';

/**
 * Authentication Fixture
 * Provides pre-authenticated page context for tests requiring user login
 */

export type AuthFixture = {
  authenticatedPage: Page;
};

/**
 * Extends base Playwright test with authenticated page fixture
 * Usage: import { test } from './fixtures/auth.fixture';
 */
export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    // Mock the external authentication API endpoint BEFORE navigation
    await page.route('**/app.demandintellect.com/app/api/profile.php', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 12345,
            email: 'test@salescentri.com',
            organization_id: 1,
            role: 'admin',
            job_title: 'Test User',
            last_login_at: new Date().toISOString(),
            auth_provider: 'email',
            created_at: new Date().toISOString(),
          },
          organization: {
            id: 1,
            name: 'Test Organization',
            website: 'https://test.com',
            industry: 'Technology',
            created_at: new Date().toISOString(),
          },
        }),
      });
    });
    
    // Navigate to home page first
    await page.goto('/');
    
    // Inject mock authentication tokens into localStorage
    await page.evaluate(() => {
      const now = Date.now();
      const expiresAt = now + 3600000; // 1 hour from now
      
      localStorage.setItem('salescentri_token', 'test-jwt-token-mock-authenticated');
      localStorage.setItem('salescentri_refreshToken', 'test-refresh-token-mock');
      localStorage.setItem('salescentri_expiresAt', String(expiresAt));
      
      // Mock user profile data
      localStorage.setItem('salescentri_user', JSON.stringify({
        email: 'test@salescentri.com',
        name: 'Test User',
        uid: 'test-user-id-12345'
      }));
    });
    
    // Reload page to apply authentication state
    await page.reload();
    
    // Wait for page to be fully loaded (use domcontentloaded to avoid Firebase network issues)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow auth state to settle and validate
    
    // Use the authenticated page in the test
    await use(page);
    
    // Cleanup: Clear auth state after test
    await page.evaluate(() => {
      localStorage.removeItem('salescentri_token');
      localStorage.removeItem('salescentri_refreshToken');
      localStorage.removeItem('salescentri_expiresAt');
      localStorage.removeItem('salescentri_user');
    });
  },
});

export { expect } from '@playwright/test';
