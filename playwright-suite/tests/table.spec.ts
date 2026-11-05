import { test, expect } from '../fixtures/test';

/** Catalog sort control: price ascending/descending and name ordering. */
test.describe('catalog sort', () => {
  const sortCases = [
    { name: 'price_asc', sortBy: 'price_asc' as const, visibleCard: 'prod-6', kind: 'price' as const, descending: false },
    { name: 'price_desc', sortBy: 'price_desc' as const, visibleCard: 'prod-2', kind: 'price' as const, descending: true },
    { name: 'name', sortBy: 'name' as const, visibleCard: 'prod-9', kind: 'name' as const, descending: false },
  ];
  for (const { name, sortBy, visibleCard, kind, descending } of sortCases) {
    test(`${name} sorts the catalog cards`, async ({ catalogPage, page }) => {
      await catalogPage.sortBy(sortBy);
      await expect(catalogPage.productCard(visibleCard)).toBeVisible();
      if (kind === 'price') {
        const prices = await catalogPage.cardPrices();
        expect(prices.length).toBeGreaterThan(0);
        const sorted = [...prices].sort((a, b) => (descending ? b - a : a - b));
        expect(prices).toEqual(sorted);
      } else {
        const names = await page
          .getByTestId(/^product-name-/)
          .allTextContents();
        expect(names.length).toBeGreaterThan(0);
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sorted);
      }
    });
  }
});
