import { test, expect } from '@playwright/test';

test.describe('Business OCR API proxy to Print Media OCR', () => {
  test('status endpoint (missing jobId returns 400)', async ({ request }) => {
    const resp1 = await request.get('/api/print-media-ocr/status');
    expect(resp1.status()).toBe(400);

    const resp2 = await request.get('/api/business-ocr/status');
    expect(resp2.status()).toBe(400);
  });

  test('status endpoint with jobId returns 200 and job info', async ({ request }) => {
    const resp1 = await request.get('/api/print-media-ocr/status?jobId=test123');
    expect(resp1.status()).toBe(200);
    const data1 = await resp1.json();
    expect(data1).toHaveProperty('status');

    const resp2 = await request.get('/api/business-ocr/status?jobId=test123');
    expect(resp2.status()).toBe(200);
    const data2 = await resp2.json();
    expect(data2).toHaveProperty('status');
    // Confirm the response contains a deprecation header to indicate proxying
    expect(resp2.headers()['x-deprecated-endpoint']).toBe('business-ocr');
  });
});
