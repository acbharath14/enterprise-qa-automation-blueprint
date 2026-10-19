import { test, expect } from '../fixtures/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { placeOrderWithRetry, ensureCartLine } from './helpers/order-retry';
import { pageCartHeaders } from './helpers/cart';

test('view receipt opens the receipt in a new tab', async ({ page, request }) => {
  await page.goto('/');
  const headers = await pageCartHeaders(page);
  await request.post('/api/cart/items', { headers, data: { productId: 'prod-1', qty: 1 } });
  await page.getByTestId('nav-cart').click();
  // Each test owns its cart (X-Cart-Id isolation): no cross-test drain, but
  // keep the repair loop as belt-and-braces for app-level hiccups.
  for (let attempt = 1; ; attempt++) {
    await ensureCartLine(request, 'prod-1', 1, headers);
    await page.getByTestId('checkout-button').click();
    try {
      await expect(page.getByTestId('checkout-step-1')).toBeVisible({ timeout: 5000 });
      break;
    } catch {
      if (attempt >= 3) throw new Error('checkout never opened after 3 attempts');
    }
  }
  await page.getByTestId('checkout-name').fill('Receipt Buyer');
  await page.getByTestId('checkout-email').fill('receipt@example.com');
  await page.getByTestId('checkout-address').fill('1 Receipt Lane');
  await page.getByTestId('checkout-next').click();
  await page.getByTestId('checkout-card-number').fill('4111111111111111');
  await page.getByTestId('checkout-card-expiry').fill('12/30');
  await page.getByTestId('checkout-card-cvc').fill('123');
  await page.getByTestId('checkout-next').click();
  const checkoutPage = new CheckoutPage(page);
  await placeOrderWithRetry(checkoutPage, request, 'prod-1', 5, headers);
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByTestId('view-receipt-button').click()
  ]);
  await expect(popup).toHaveURL(/\/receipt/);
  await expect(popup.locator('body')).toContainText('product,quantity');
  await popup.close();
  await request.delete('/api/cart/items/prod-1', { headers });
});
