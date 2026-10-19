import { test, expect } from '../fixtures/test';

/**
 * Empty states: a search with zero matches shows the no-results message
 * with an empty grid, and an empty cart shows the cart-empty message.
 */
test.describe('empty states', () => {
  test("searching 'zzz-no-match' shows no-results and an empty grid", async ({
    catalogPage,
  }) => {
    await expect(catalogPage.noResults).toBeHidden();
    await catalogPage.search('zzz-no-match');
    await expect(catalogPage.noResults).toBeVisible();
    await expect(
      catalogPage.grid.getByTestId(/^product-card-/),
    ).toHaveCount(0);
  });

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
