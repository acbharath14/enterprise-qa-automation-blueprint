import { test, expect } from '../fixtures/test';
import { pageCartHeaders } from './helpers/cart';

/**
 * UI↔API integration: the API and UI are tested in isolation elsewhere —
 * here we prove the storefront calls the backend correctly and renders
 * its response. Each test owns its cart (X-Cart-Id isolation), so the badge
 * starts at 0 and the test asserts it moves upward for its own add.
 */
test('adding to cart calls the API and renders its response', async ({ page, request }, testInfo) => {
  await page.goto('/');
  const badgeBefore = Number(await page.getByTestId('cart-badge').textContent());
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes('/api/cart/items') && res.request().method() === 'POST',
    ),
    page.getByTestId('add-to-cart-prod-2').click(),
  ]);
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  // Attach the raw response to the report as evidence.
  await testInfo.attach('api-response', {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json',
  });
  const line = body.items.find((i: { productId: string }) => i.productId === 'prod-2');
  expect(line.qty).toBeGreaterThanOrEqual(1);
  await expect(page.getByTestId('toast')).toContainText('Beacon 4K Monitor');
  const badgeAfter = Number(await page.getByTestId('cart-badge').textContent());
  expect(badgeAfter).toBeGreaterThan(badgeBefore);
  // Clean up our own isolated cart line (the page's session cart id).
  const headers = await pageCartHeaders(page);
  await request.delete('/api/cart/items/prod-2', { headers });
});
