import { test, expect } from '../fixtures/test';

/** Catalog search box: live filtering, empty-result state, and clearing. */
test.describe('catalog search', () => {
  test("searching 'aurora' returns the 3 matching products @smoke", async ({
    catalogPage,
  }) => {
    await catalogPage.search('aurora');
    const cards = catalogPage.grid.getByTestId(/^product-card-/);
    await expect(cards).toHaveCount(3);
    await expect(catalogPage.productCard('prod-1')).toBeVisible();
    await expect(catalogPage.productCard('prod-5')).toBeVisible();
    await expect(catalogPage.productCard('prod-9')).toBeVisible();
    await expect(catalogPage.noResults).toBeHidden();
  });

  test("searching 'zzz-no-match' shows the no-results state", async ({
    catalogPage,
  }) => {
    await catalogPage.search('zzz-no-match');
    await expect(catalogPage.noResults).toBeVisible();
    await expect(
      catalogPage.grid.getByTestId(/^product-card-/),
    ).toHaveCount(0);
  });

  test('clearing the search restores page 1', async ({ catalogPage }) => {
    await catalogPage.search('zzz-no-match');
    await expect(catalogPage.noResults).toBeVisible();
    await catalogPage.search('');
    await expect(catalogPage.noResults).toBeHidden();
    // The catalog is shared: other specs' fixture products may add pages,
    // so assert the "Page 1 of …" prefix rather than an exact page count.
    await expect(catalogPage.pageInfo).toHaveText(/Page 1 of \d+/);
    await expect(
      catalogPage.grid.getByTestId(/^product-card-/),
    ).toHaveCount(6);
  });
});
