import { test, expect } from '../fixtures/test';

/**
 * Store smoke tests for the DemoMart sample storefront — the fast
 * release signal for the re-themed sample app. The cart is a single
 * server-side demo cart, so each test resets it first via the API.
 */

test.describe('store smoke', () => {
  test('catalog renders the seeded products @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('product-grid')).toBeVisible();
    await expect(page.getByTestId('product-card-prod-1')).toBeVisible();
    await expect(page.getByTestId('product-name-prod-1')).toHaveText('Aurora Wireless Headphones');
    await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(12);
  });

  test('adding a product updates the cart badge @smoke', async ({ page, request }) => {
    await request.delete('/api/cart');
    await page.goto('/');
    await page.getByTestId('add-to-cart-prod-1').click();
    await expect(page.getByTestId('cart-badge')).toHaveText('1');
    await expect(page.getByTestId('toast')).toContainText('Aurora Wireless Headphones');
  });

  test('cart page shows the line item and correct total @smoke', async ({ page, request }) => {
    await request.delete('/api/cart');
    await page.goto('/');
    await page.getByTestId('add-to-cart-prod-1').click(); // 129.99
    await page.getByTestId('add-to-cart-prod-6').click(); // 24.99
    await page.getByTestId('nav-cart').click();
    await expect(page.getByTestId('cart-item-prod-1')).toBeVisible();
    await expect(page.getByTestId('cart-item-name-prod-1')).toHaveText('Aurora Wireless Headphones');
    await expect(page.getByTestId('cart-subtotal')).toHaveText('$154.98');
    await expect(page.getByTestId('cart-total')).toHaveText('$154.98');
  });

  test('checkout completes and shows an order id @smoke', async ({ page, request }) => {
    await request.delete('/api/cart');
    await page.goto('/');
    await page.getByTestId('add-to-cart-prod-1').click();
    await page.getByTestId('nav-cart').click();
    await page.getByTestId('checkout-button').click();
    await page.getByTestId('checkout-name').fill('Test Buyer');
    await page.getByTestId('checkout-email').fill('buyer@example.com');
    await page.getByTestId('checkout-address').fill('123 Main St, Herndon VA');
    await page.getByTestId('checkout-card-number').fill('4111111111111111');
    await page.getByTestId('checkout-card-expiry').fill('12/30');
    await page.getByTestId('checkout-card-cvc').fill('123');
    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('order-id')).toHaveText(/ord-\d+/);
    await expect(page.getByTestId('order-total')).toHaveText('$129.99');
    await expect(page.getByTestId('order-items')).toContainText('Aurora Wireless Headphones');
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
