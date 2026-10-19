/**
 * Intentional failures — the failure showcase.
 *
 * Skipped in every normal run; only executes when SHOWCASE=1, which the
 * `failure_showcase` workflow dispatch sets. Its purpose is portfolio:
 * the published Allure report shows what a real failure looks like —
 * assertion diff, screenshot, video, and trace — without ever breaking CI.
 */
import { test, expect } from '../fixtures/test';

test.skip(process.env.SHOWCASE !== '1', 'Failure showcase: run only via the failure_showcase workflow dispatch.');

test('product price reads $9999.99 (intentionally wrong)', async ({ page }) => {
  await page.goto('/');
  // prod-1 really costs $129.99 — this mismatch demonstrates a failing
  // text assertion with Playwright's diff output.
  await expect(page.getByTestId('product-price-prod-1')).toHaveText('$9999.99');
});

test('products API exposes a discount field (intentionally wrong)', async ({ request }) => {
  // Products carry no `discount` field — this demonstrates a failing
  // API assertion alongside the UI one above.
  const body = await (await request.get('/api/products')).json();
  expect(body[0].discount).toBe(10);
});
