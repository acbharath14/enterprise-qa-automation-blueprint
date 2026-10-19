import { test, expect } from '../fixtures/test';

/**
 * Loading skeletons: while the products API is slow, the catalog shows
 * placeholder skeletons with the grid marked busy; the real cards replace
 * them once the response arrives.
 *
 * The route holds the API response at a gate (then delays 800ms) so the
 * skeleton state is asserted deterministically: under parallel-worker load
 * the 800ms skeleton window can otherwise close before the first assertion
 * runs, after page.goto() resolves.
 */
test.describe('catalog skeletons', () => {
  test('slow products API shows skeletons, then the product cards', async ({
    page,
  }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route('**/api/products*', async (route) => {
      await gate;
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Catalog' }),
    ).toBeVisible();

    const skeletons = page.getByTestId('catalog-skeleton');
    await expect(skeletons).toHaveCount(6);
    await expect(page.getByTestId('product-grid')).toHaveAttribute(
      'aria-busy',
      'true',
    );

    release();
    await expect(page.getByTestId('product-card-prod-1')).toBeVisible();
    await expect(skeletons).toHaveCount(0);
    await expect(page.getByTestId('product-grid')).toHaveAttribute(
      'aria-busy',
      'false',
    );
  });
});
