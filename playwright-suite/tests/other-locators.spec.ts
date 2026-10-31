import { test, expect } from '../fixtures/test';

/**
 * Beyond getByRole/getByTestId: CSS, XPath, and locator combinators.
 *
 * Prefer getByRole/getByTestId — they test what the user sees and survive
 * markup refactors. Reach for these only when the preferred locators
 * can't express what you need:
 * - CSS: legacy markup without test IDs, or pseudo-class matching.
 * - XPath: text-content matching with complex predicates, or navigating
 *   to a parent/sibling when no direct locator exists.
 * - or_/and_: combining two locators (e.g. button by role OR by test ID
 *   during a migration).
 */
test.describe('other locators', () => {
  test('CSS: match by attribute when no test ID exists', async ({ page }) => {
    await page.goto('/');
    // The search input has a test ID, but this shows the CSS form:
    const search = page.locator('input[type="search"]');
    await expect(search).toBeVisible();
    await search.fill('aurora');
    await expect(search).toHaveValue('aurora');
  });

  test('XPath: find a parent from a child', async ({ page }) => {
    await page.goto('/');
    // From the sort <select>, navigate to its parent toolbar div.
    // Use sparingly — XPath is the most brittle locator.
    const toolbar = page.locator('xpath=//select[@data-testid="sort-select"]/..');
    await expect(toolbar).toHaveClass(/toolbar/);
  });

  test('or_: match either of two locators', async ({ page }) => {
    await page.goto('/');
    // During a test-ID migration, match the old or the new selector.
    const loginBtn = page
      .getByTestId('login-button')
      .or(page.getByRole('button', { name: /log in/i }));
    await expect(loginBtn).toBeVisible();
  });

  test('and_: narrow a locator with an additional condition', async ({ page }) => {
    await page.goto('/');
    // All buttons that are also inside the catalog toolbar.
    const toolbarBtn = page
      .getByRole('button')
      .and(page.getByTestId('catalog-view').getByRole('button'));
    // At least the pagination buttons match.
    expect(await toolbarBtn.count()).toBeGreaterThan(0);
  });
});
