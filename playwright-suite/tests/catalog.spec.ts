import { test, expect } from '../fixtures/test';
import type { CatalogPage } from '../pages/CatalogPage';

/**
 * DemoMart catalog: the 12 seeded products render as cards, 6 per page,
 * each card showing name, price, category and rating.
 *
 * The product catalog is shared server-side: concurrently-running specs may
 * have fixture-minted products live, so these tests page through the catalog
 * and assert on the seeded set rather than global counts.
 */

/** Pages through the whole catalog, collecting every rendered card id. */
async function collectCardIds(catalogPage: CatalogPage): Promise<Set<string>> {
  const seen = new Set<string>();
  let pageNum = 1;
  for (;;) {
    await expect(catalogPage.pageInfo).toContainText(`Page ${pageNum} of`);
    const cards = catalogPage.grid.getByTestId(/^product-card-/);
    await expect(cards.first()).toBeVisible();
    const ids = await cards.evaluateAll((els) =>
      els.map((el) =>
        (el.getAttribute('data-testid') ?? '').replace('product-card-', ''),
      ),
    );
    const done = await catalogPage.nextButton.isDisabled();
    if (!done) expect(ids).toHaveLength(6);
    ids.forEach((id) => seen.add(id));
    if (done) break;
    await catalogPage.nextButton.click();
    pageNum += 1;
  }
  return seen;
}

test.describe('catalog', () => {
  test('renders the 12 seeded products, 6 per page @smoke', async ({
    catalogPage,
  }) => {
    const seen = await collectCardIds(catalogPage);
    for (let n = 1; n <= 12; n++) {
      expect(seen, `seeded product prod-${n} renders`).toContain(`prod-${n}`);
    }
  });

  test('cards show name, price, category and rating', async ({
    catalogPage,
    page,
  }) => {
    await expect(
      page.getByTestId('product-name-prod-1'),
    ).toHaveText('Aurora Wireless Headphones');
    await expect(page.getByTestId('product-price-prod-1')).toHaveText(
      '$129.99',
    );
    await expect(page.getByTestId('product-category-prod-1')).toHaveText(
      'electronics',
    );
    await expect(page.getByTestId('rating-prod-1')).toHaveAttribute(
      'value',
      '4.5',
    );
  });

  test('all four seeded categories appear across the pages', async ({
    catalogPage,
    page,
  }) => {
    // Page forward from page 1, gathering the category of every card.
    const categories = new Set<string>();
    for (;;) {
      const labels = await page
        .locator('[data-testid^="product-category-"]')
        .allTextContents();
      labels.forEach((label) => categories.add(label));
      if (await catalogPage.nextButton.isDisabled()) break;
      await catalogPage.nextButton.click();
    }
    for (const category of ['electronics', 'apparel', 'home', 'sports']) {
      expect(categories, `category ${category} appears`).toContain(category);
    }
  });
});
