import { test, expect } from '../fixtures/test';

/** Empty states: an empty cart shows the cart-empty message. */
test.describe('empty states', () => {
  test('empty cart shows the cart-empty message', async ({ page }) => {
    // Each test gets a fresh isolated cart (X-Cart-Id), so it starts empty.
    await page.goto('/');
    await page.getByTestId('nav-cart').click();
    await expect(
      page.getByRole('heading', { name: 'Your Cart' }),
    ).toBeVisible();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });
});
