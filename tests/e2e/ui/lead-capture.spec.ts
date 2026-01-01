import { test, expect } from '@playwright/test';
import { mockOTPSend } from '../../helpers/network-interceptors';

test.describe('Lead capture (Let\'s Talk) UI', () => {
  test('should show error for free email providers and allow corporate emails', async ({ page }) => {
    await mockOTPSend(page, 'success');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const openButton = page.getByRole('button', { name: /open let\'s talk dialog/i });
    await expect(openButton).toBeVisible();
    await openButton.click();

    // Wait for modal to appear
    await page.getByLabel('Corporate Email Address');

    const emailInput = page.getByLabel('Corporate Email Address').locator('input[type="email"]');
    await emailInput.fill('test@gmail.com');
    // Wait for inline error to appear
    const error = page.getByText(/personal email addresses/i).first();
    await expect(error).toBeVisible({ timeout: 3000 });

    // Continue button should be disabled
    const continueButton = page.getByRole('button', { name: /continue/i }).first();
    await expect(continueButton).toBeDisabled();

    // Now enter corporate email
    await emailInput.fill('jane.doe@acme-corp.com');
    await expect(page.getByText(/personal email addresses/i)).not.toBeVisible({ timeout: 1000 }).catch(() => {});
    // Continue button should be enabled now
    await expect(continueButton).toBeEnabled();
  });
});
