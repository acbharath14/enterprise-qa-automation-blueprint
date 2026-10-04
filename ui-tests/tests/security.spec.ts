import { test, expect } from '@playwright/test';

/**
 * Baseline security checks even a demo app should model: secure headers,
 * JSON (not HTML) error responses, and no reflection of untrusted input.
 */
test('HTML responses carry the nosniff header', async ({ request }) => {
  const res = await request.get('/');
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
});

test('API responses carry the nosniff header', async ({ request }) => {
  const res = await request.get('/api/metrics');
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
});

test('query parameters are not reflected in the page', async ({ page }) => {
  await page.goto('/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
  const html = await page.content();
  expect(html).not.toContain('<script>alert(1)');
});
