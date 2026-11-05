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
