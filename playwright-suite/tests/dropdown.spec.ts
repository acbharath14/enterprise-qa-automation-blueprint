import { test, expect } from '../fixtures/test';

/**
 * Category filter dropdown: selecting a category narrows the catalog to
 * that category; 'All categories' restores the full page.
 */
test.describe('category filter', () => {
  test("selecting 'apparel' shows only apparel products", async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.filterCategory('apparel');
    const cards = catalogPage.grid.getByTestId(/^product-card-/);
    await expect(cards).toHaveCount(3);
    const categories = await page
      .locator('[data-testid^="product-category-"]')
      .allTextContents();
    expect(categories).toHaveLength(3);
    for (const category of categories) {
      expect(category).toBe('apparel');
    }
  });

  test("selecting 'All categories' restores page 1", async ({
    catalogPage,
  }) => {
    await catalogPage.filterCategory('apparel');
    await expect(catalogPage.grid.getByTestId(/^product-card-/)).toHaveCount(
      3,
    );
    await catalogPage.filterCategory('');
    await expect(catalogPage.pageInfo).toHaveText(/Page 1 of \d+/);
    await expect(
      catalogPage.grid.getByTestId(/^product-card-/),
    ).toHaveCount(6);
  });
});
