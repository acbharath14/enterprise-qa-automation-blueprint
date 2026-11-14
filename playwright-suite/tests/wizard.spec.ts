import { test, expect } from '../fixtures/test';
import { withDbClient } from '../fixtures/db';
import { placeOrderWithRetry, resetCartLine } from './helpers/order-retry';

test.describe('checkout wizard', () => {
  test('completes the full flow', async ({ checkout, request }) => {
    const { checkoutPage, productId, headers } = checkout;
    const product = await (await request.get(`/api/products/${productId}`)).json();
    await checkoutPage.fillShipping({ name: 'Wizard Buyer', email: 'wizard@example.com', address: '1 Wizard Way' });
    await checkoutPage.next();
    await expect(checkoutPage.step2).toBeVisible();
    await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
    await checkoutPage.next();
    await expect(checkoutPage.step3).toBeVisible();
    // Each test owns its cart (X-Cart-Id isolation), so the review reliably
    // shows our product — no cross-test drain possible.
    await expect.poll(async () => {
      const summary = await checkoutPage.reviewSummary.textContent();
      if (summary && summary.includes(product.name)) return true;
      await resetCartLine(request, productId, 1, headers);
      await checkoutPage.back();
      await checkoutPage.next();
      return false;
    }, { timeout: 20000 }).toBe(true);
    await placeOrderWithRetry(checkoutPage, request, productId, 5, headers);
    await expect(checkoutPage.confirmation).toBeVisible();
    // DB cross-check: the order the wizard just placed is persisted in
    // Postgres (no-op in in-memory mode, where DATABASE_URL is unset).
    const orderId = (await checkoutPage.orderId.textContent())?.trim() ?? '';
    await withDbClient(async (db) => {
      const row = await db.queryOne<{ status: string; total_cents: number }>(
        'SELECT status, total_cents FROM orders WHERE id = $1',
        [orderId],
      );
      expect(row?.status).toBe('confirmed');
      expect(row?.total_cents).toBe(4250);
      const items = await db.query<{ product_id: string; qty: number; price_cents: number }>(
        'SELECT product_id, qty, price_cents FROM order_items WHERE order_id = $1',
        [orderId],
      );
      expect(items).toHaveLength(1);
      expect(items[0].product_id).toBe(productId);
      expect(items[0].qty).toBe(1);
      expect(items[0].price_cents).toBe(4250);
    });
  });

  test('back returns to step 1 with values preserved', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await checkoutPage.fillShipping({ name: 'Back Buyer', email: 'back@example.com', address: '2 Back Road' });
    await checkoutPage.next();
    await expect(checkoutPage.step2).toBeVisible();
    await checkoutPage.back();
    await expect(checkoutPage.step1).toBeVisible();
    await expect(checkoutPage.nameInput).toHaveValue('Back Buyer');
    await expect(checkoutPage.emailInput).toHaveValue('back@example.com');
    await expect(checkoutPage.addressInput).toHaveValue('2 Back Road');
  });
});

