import { test, expect } from '../fixtures/test';

/** Catalog toolbar controls: max-price slider. */
test.describe('controls', () => {
  test('price slider updates its output and filters card prices', async ({
    catalogPage,
  }) => {
    await catalogPage.priceSlider.fill('50');
    await expect(catalogPage.priceOutput).toHaveText('$50.00');
    await expect(
      catalogPage.grid.getByTestId(/^product-card-/).first(),
    ).toBeVisible();
    const prices = await catalogPage.cardPrices();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) {
      expect(price).toBeLessThanOrEqual(50);
    }
  });
});
