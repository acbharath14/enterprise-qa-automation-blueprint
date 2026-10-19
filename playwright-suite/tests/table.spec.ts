import { test, expect } from '../fixtures/test';

/** Catalog sort control: price ascending/descending and name ordering. */
test.describe('catalog sort', () => {
  test('price_asc sorts card prices ascending', async ({ catalogPage }) => {
    await catalogPage.sortBy('price_asc');
    await expect(catalogPage.productCard('prod-6')).toBeVisible();
    const prices = await catalogPage.cardPrices();
    expect(prices.length).toBeGreaterThan(0);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('price_desc sorts card prices descending', async ({ catalogPage }) => {
    await catalogPage.sortBy('price_desc');
    await expect(catalogPage.productCard('prod-2')).toBeVisible();
    const prices = await catalogPage.cardPrices();
    expect(prices.length).toBeGreaterThan(0);
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('name sorts cards alphabetically by product name', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.sortBy('name');
    await expect(catalogPage.productCard('prod-9')).toBeVisible();
    const names = await page
      .locator('[data-testid^="product-name-"]')
      .allTextContents();
    expect(names.length).toBeGreaterThan(0);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});
