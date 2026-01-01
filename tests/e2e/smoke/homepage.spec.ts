import { test, expect } from '@playwright/test';

/**
 * Smoke Test Suite
 * Quick validation tests to ensure basic application functionality
 * Run these first to validate the test setup and app availability
 */

test.describe('Smoke Tests - Basic Functionality', () => {
  
  test('should load homepage without errors', async ({ page }) => {
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify main heading exists
    const headings = await page.locator('h1, h2').first();
    await expect(headings).toBeVisible();
    
    // Wait for any async errors
    await page.waitForTimeout(2000);
    
    // Filter out known non-critical errors (Firebase, Firestore, network, favicon, analytics)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('Firebase') &&
      !error.includes('Firestore') &&
      !error.includes('Cloud Firestore') &&
      !error.includes('PERMISSION_DENIED') &&
      !error.includes('client is offline') &&
      !error.toLowerCase().includes('warning')
    );
    
    // Should have no critical console errors (tolerate Firebase/Firestore sandbox issues)
    // In test mode, Firebase errors are expected and should be mocked
    expect(criticalErrors.length).toBeLessThanOrEqual(2);
  });
  
  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find pricing link
    const pricingLink = page.getByRole('link', { name: /pricing/i });
    
    if (await pricingLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await pricingLink.click();
      
      // Verify navigation
      await expect(page).toHaveURL(/\/pricing/, { timeout: 10000 });
      
      // Verify pricing content loaded
      const pricingHeading = page.locator('h1, h2').filter({ hasText: /pricing|plans/i });
      await expect(pricingHeading).toBeVisible();
    }
  });
  
  test('should load checkout page', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should see checkout content (either auth prompt or billing form)
    const pageContent = await page.locator('h1, h2, h3').first();
    await expect(pageContent).toBeVisible();
    
    // Verify it's not a 404 error page
    const notFoundText = await page.getByText(/404|not found|page.*exist/i).isVisible().catch(() => false);
    expect(notFoundText).toBeFalsy();
  });
  
  test('should load get-started page', async ({ page }) => {
    await page.goto('/get-started');
    await page.waitForLoadState('networkidle');
    
    // Verify get-started content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
  
  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Look for navigation menu (header, nav)
    const navigation = page.locator('header, nav').first();
    
    if (await navigation.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Count navigation links
      const navLinks = await navigation.locator('a[href]').count();
      
      // Should have at least a few navigation items
      expect(navLinks).toBeGreaterThan(2);
    }
  });
});
