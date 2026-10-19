import { test, expect } from '../fixtures/test';
import { pageCartHeaders } from './helpers/cart';

/** Add-to-cart toast: appears with the product name, then auto-dismisses. */
test.describe('toast', () => {
  test('adding to cart shows a toast with the product name, then hides', async ({
    catalogPage,
    request,
  }) => {
    await catalogPage.addToCart('prod-1');
    await expect(catalogPage.toast).toBeVisible();
    await expect(catalogPage.toast).toContainText(
      'Aurora Wireless Headphones',
    );
    // Auto-dismisses after ~2.5s.
    await expect(catalogPage.toast).toBeHidden({ timeout: 10_000 });
    // Clean up our own isolated cart line (the page's session cart id).
    const headers = await pageCartHeaders(catalogPage.page);
    await request.delete('/api/cart/items/prod-1', { headers });
  });
});
