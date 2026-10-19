import { test, expect } from '../fixtures/test';

/**
 * Catalog pagination: 6 products per page, prev/next button states,
 * and page info text.
 *
 * The product catalog is shared server-side: concurrently-running specs may
 * have fixture-minted products live, so these tests assert the "Page N of …"
 * shape and button states rather than an exact page count.
 */
test.describe('catalog pagination', () => {
  test('page 1 shows page info with prev disabled and next enabled', async ({
    catalogPage,
  }) => {
    await expect(catalogPage.pageInfo).toHaveText(/Page 1 of \d+/);
    await expect(catalogPage.prevButton).toBeDisabled();
    await expect(catalogPage.nextButton).toBeEnabled();
    await expect(
      catalogPage.grid.getByTestId(/^product-card-/),
    ).toHaveCount(6);
  });

  test('next goes to page 2 with different products', async ({
    catalogPage,
  }) => {
    await catalogPage.nextButton.click();
    await expect(catalogPage.pageInfo).toHaveText(/Page 2 of \d+/);
    await expect(catalogPage.productCard('prod-7')).toBeVisible();
    await expect(catalogPage.productCard('prod-1')).toBeHidden();
  });

  test('last page disables next; prev walks back to page 1', async ({
    catalogPage,
  }) => {
    for (let i = 0; i < 10; i++) {
      if (await catalogPage.nextButton.isDisabled()) break;
      await catalogPage.nextButton.click();
    }
    await expect(catalogPage.nextButton).toBeDisabled();
    await expect(catalogPage.prevButton).toBeEnabled();

    for (let i = 0; i < 10; i++) {
      if (await catalogPage.prevButton.isDisabled()) break;
      await catalogPage.prevButton.click();
    }
    await expect(catalogPage.pageInfo).toHaveText(/Page 1 of \d+/);
    await expect(catalogPage.productCard('prod-1')).toBeVisible();
    await expect(catalogPage.prevButton).toBeDisabled();
    await expect(catalogPage.nextButton).toBeEnabled();
  });
});
