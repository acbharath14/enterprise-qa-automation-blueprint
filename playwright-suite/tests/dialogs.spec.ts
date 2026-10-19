import { test, expect } from '../fixtures/test';
import { ensureCartLine } from './helpers/order-retry';

test.describe('cart remove confirmation dialog', () => {
  test('dismissing keeps the cart line', async ({ cart, page, request }) => {
    const { cartPage, productId, headers } = cart;
    page.on('dialog', (dialog) => dialog.dismiss());
    // Each test owns its cart (X-Cart-Id isolation): re-render until our
    // remove button is present, then click it.
    await expect.poll(async () => {
      await ensureCartLine(request, productId, 1, headers);
      await cartPage.goto();
      const removeButton = page.getByTestId(`cart-remove-${productId}`);
      if ((await removeButton.count()) === 0) return false;
      await removeButton.click();
      return (await cartPage.lineItem(productId).count()) > 0;
    }, { timeout: 30000 }).toBe(true);
    await expect(cartPage.lineItem(productId)).toBeVisible();
  });

  test('accepting removes the cart line', async ({ cart, page, request }) => {
    const { cartPage, productId, headers } = cart;
    page.on('dialog', (dialog) => dialog.accept());
    await expect.poll(async () => {
      await ensureCartLine(request, productId, 1, headers);
      await cartPage.goto();
      const removeButton = page.getByTestId(`cart-remove-${productId}`);
      if ((await removeButton.count()) === 0) return false;
      await removeButton.click();
      await expect(cartPage.lineItem(productId)).toHaveCount(0, { timeout: 5000 });
      return true;
    }, { timeout: 30000 }).toBe(true);
    // Delete the product as well so the line cannot be resurrected.
    await request.delete(`/api/products/${productId}`);
    await expect(cartPage.lineItem(productId)).toHaveCount(0);
  });
});
