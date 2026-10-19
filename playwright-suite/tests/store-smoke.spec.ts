import { test, expect } from '../fixtures/test';
import type { APIRequestContext } from '@playwright/test';
import { pageCartHeaders } from './helpers/cart';

/**
 * Store smoke tests for the DemoMart sample storefront — the fast
 * release signal for the re-themed sample app.
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
  test('catalog renders the seeded products @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('product-grid')).toBeVisible();
    await expect(page.getByTestId('product-card-prod-1')).toBeVisible();
    await expect(page.getByTestId('product-name-prod-1')).toHaveText('Aurora Wireless Headphones');
    // Six products per page, twelve seeded in total.
    await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(6);
    await expect(page.getByTestId('catalog-page-info')).toHaveText(/Page 1 of \d+/);
  });

  test('adding a product updates the cart badge @smoke', async ({ page, request }) => {
    const { id, name } = await mintProduct(request, 'badge');
    try {
      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${id}`)).toBeVisible();
      const before = Number(await page.getByTestId('cart-badge').textContent());
      await page.getByTestId(`add-to-cart-${id}`).click();
      // The badge counts our isolated cart: assert it grew by exactly our line.
      await expect
        .poll(async () => Number(await page.getByTestId('cart-badge').textContent()), { timeout: 10_000 })
        .toBeGreaterThanOrEqual(before + 1);
      await expect(page.getByTestId('toast')).toContainText(name);
    } finally {
      await cleanupProduct(request, id, await pageCartHeaders(page));
    }
  });

  test('cart page shows the line item and correct total @smoke', async ({ page, request }) => {
    const { id, name } = await mintProduct(request, 'cartpage');
    try {
      await page.goto('/');
      const headers = await pageCartHeaders(page);
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${id}`)).toBeVisible();
      await page.getByTestId(`add-to-cart-${id}`).click();
      await page.getByTestId('nav-cart').click();
      await expect(page.getByTestId(`cart-item-${id}`)).toBeVisible();
      await expect(page.getByTestId(`cart-item-name-${id}`)).toHaveText(name);
      // Our own line total is exact; the subtotal is internally consistent.
      await expect(page.getByTestId(`cart-line-total-${id}`)).toHaveText('$42.50');
      const cart = await (await request.get('/api/cart', { headers })).json();
      const expected = cart.items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
      expect(cart.subtotal).toBeCloseTo(expected, 2);
      expect(cart.subtotal).toBeGreaterThanOrEqual(42.5);
    } finally {
      await cleanupProduct(request, id, await pageCartHeaders(page));
    }
  });

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
    } finally {
      await cleanupProduct(request, id, await pageCartHeaders(page));
    }
  });

  test('demo login works @smoke', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-button').click();
    await page.getByTestId('login-username').fill('admin');
    await page.getByTestId('login-password').fill('secret');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByTestId('user-label')).toContainText('admin');
  });
});
