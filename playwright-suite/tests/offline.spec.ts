import { test, expect } from '../fixtures/test';
import { CatalogPage } from '../pages/CatalogPage';

test('shows a friendly message when the API is unreachable', async ({ page, context }) => {
  const catalog = new CatalogPage(page);
  await page.goto('/');
  await expect(catalog.productCard('prod-1')).toBeVisible();
  await context.setOffline(true);
  // Searching re-fetches the catalog; the fetch throws while offline.
  await catalog.search('aurora');
  await expect(catalog.catalogError).toContainText('Could not load products');
  await context.setOffline(false);
});
