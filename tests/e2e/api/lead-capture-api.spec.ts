import { test, expect } from '@playwright/test';

test.describe('Lead Capture API - corporate email validation', () => {
  test('should reject free email provider for send-otp', async ({ request }) => {
    const response = await request.post('/api/lead-capture/send-otp', { data: { email: 'user@gmail.com', phone: '+15005550006', recaptchaToken: '' } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toMatch(/business email|personal email/i);
  });

  test('should accept corporate email for send-otp', async ({ request }) => {
    const response = await request.post('/api/lead-capture/send-otp', { data: { email: 'user@acme-corp.com', phone: '+15005550006', recaptchaToken: '' } });
    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBeTruthy();
  });
});
