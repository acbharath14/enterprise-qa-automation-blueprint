import { test, expect } from '../fixtures/test';
import { CatalogPage } from '../pages/CatalogPage';

/**
 * Backend-control tests: the storefront is exercised against stubbed API
 * responses via route interception, so frontend behavior is verified
 * without depending on a real backend state. The catalog fixture navigates
 * on setup, so these tests register their routes before navigating.
 */

test('mocked product list renders in the catalog', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await page.route('/api/products*', (route) =>
    route.fulfill({
      json: [
        {
          id: 'mock-1',
          name: 'Mock Widget',
          category: 'test',
          price: 9.99,
          rating: 5,
          stock: 10,
          description: 'A mocked product.',
        },
      ],
    }),
  );
  await page.goto('/');
  await expect(catalog.productCard('mock-1')).toBeVisible();
  await expect(page.getByTestId('product-name-mock-1')).toHaveText('Mock Widget');
});

test('mocked API failure shows a friendly error state', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await page.route('/api/products*', (route) => route.fulfill({ status: 500 }));
  await page.goto('/');
  await expect(catalog.catalogError).toContainText('Could not load products');
  await expect(catalog.grid).toBeEmpty();
});

test('slow API shows skeletons while loading', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await page.route('/api/products*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto('/');
  // Skeletons render before the delayed response arrives.
  await expect(page.getByTestId('catalog-skeleton').first()).toBeVisible();
  await expect(catalog.productCard('prod-1')).toBeVisible({ timeout: 10_000 });
});
