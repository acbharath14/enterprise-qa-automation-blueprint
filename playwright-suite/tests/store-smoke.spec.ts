import { test, expect } from '../fixtures/test';
import { withDbClient } from '../fixtures/db';
import type { APIRequestContext } from '@playwright/test';
import { pageCartHeaders } from './helpers/cart';

/**
 * Store smoke, slimmed by the dedup (PR #50): the other smoke tests were
 * removed as redundant. Only the checkout test remains, because it carries
 * the DB cross-check — the order the UI just placed is persisted in
 * Postgres (no-op in in-memory mode, where DATABASE_URL is unset).
 *
 * Cart isolation: the server keys carts by the X-Cart-Id header and the
 * storefront mints a per-session cart id, so every test gets a private
 * cart. Tests that mix UI steps with direct cart API calls bridge via
 * pageCartHeaders(page).
 */

test.describe.configure({ mode: 'serial' });

async function mintProduct(request: APIRequestContext, tag: string): Promise<{ id: string; name: string }> {
  const name = `Smoke ${tag} ${Date.now()}`;
  const res = await request.post('/api/products', {
    data: { name, price: 42.5, category: 'test', stock: 100000 },
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  return { id: body.id as string, name };
}

async function cleanupProduct(
  request: APIRequestContext,
  id: string,
  headers: Record<string, string> = {},
) {
  await request.delete(`/api/cart/items/${id}`, { headers });
  await request.delete(`/api/products/${id}`);
}

test.describe('store smoke', () => {
  test('checkout wizard completes and shows an order id @smoke', async ({ page, request }) => {
    const { id, name } = await mintProduct(request, 'checkout');
    try {
      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${id}`)).toBeVisible();
      await page.getByTestId(`add-to-cart-${id}`).click();
      await page.getByTestId('nav-cart').click();
      await page.getByTestId('checkout-button').click();
      // Step 1: shipping.
      await page.getByTestId('checkout-name').fill('Test Buyer');
      await page.getByTestId('checkout-email').fill('buyer@example.com');
      await page.getByTestId('checkout-address').fill('123 Main St, Herndon VA');
      await page.getByTestId('checkout-next').click();
      await expect(page.getByTestId('checkout-step-2')).toBeVisible();
      // Step 2: payment.
      await page.getByTestId('checkout-card-number').fill('4111111111111111');
      await page.getByTestId('checkout-card-expiry').fill('12/30');
      await page.getByTestId('checkout-card-cvc').fill('123');
      await page.getByTestId('checkout-next').click();
      await expect(page.getByTestId('checkout-step-3')).toBeVisible();
      // Step 3: review and place the order.
      await page.getByTestId('place-order-button').click();
      await expect(page.getByTestId('order-confirmation')).toBeVisible();
      await expect(page.getByTestId('order-id')).toHaveText(/ord-\d+/);
      await expect(page.getByTestId('order-items')).toContainText(name);
      // The order total aggregates every line checked out; verify it via the API.
      const orderId = (await page.getByTestId('order-id').textContent()) || '';
      const order = await (await request.get(`/api/orders/${orderId.trim()}`)).json();
      const expected = order.items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
      expect(order.total).toBeCloseTo(expected, 2);
      expect(order.items.map((i: { name: string }) => i.name)).toContain(name);
      // DB cross-check: the order the UI just placed is persisted in
      // Postgres (no-op in in-memory mode, where DATABASE_URL is unset).
      await withDbClient(async (db) => {
        const row = await db.queryOne<{ status: string; total_cents: number }>(
          'SELECT status, total_cents FROM orders WHERE id = $1',
          [orderId.trim()],
        );
        expect(row?.status).toBe('confirmed');
        expect(row?.total_cents).toBe(Math.round(order.total * 100));
      });
    } finally {
      await cleanupProduct(request, id, await pageCartHeaders(page));
    }
  });

});
