import { test, expect } from '../fixtures/test';

/**
 * Test annotations: slow, fixme, skip, fail.
 *
 * Annotations document the triage state of a test:
 * - test.slow(): triples the timeout — for tests that are inherently
 *   slow (large file uploads, complex rendering). Not a fix for flakiness.
 * - test.fixme(): the test is broken and needs fixing — it runs but a
 *   failure doesn't fail the suite. Use with a TODO comment linking the
 *   ticket. Remove fixme once fixed; don't let them accumulate.
 * - test.skip(): skip unconditionally (or conditionally with a reason).
 * - test.fail(): expected to fail — passes if it fails, fails if it passes
 *   (useful for documenting known bugs).
 */
test.describe('test annotations', () => {
  test('slow: triples the timeout for inherently slow tests', async ({ page }) => {
    test.slow(); // 30s default → 90s timeout
    await page.goto('/');
    // Simulate a slow operation (e.g. large catalog render).
    await expect(page.getByTestId('product-grid')).toBeVisible();
  });

  test('fixme: broken test tracked for repair', async ({ page }) => {
    // TODO: https://github.com/acbharath14/enterprise-qa-automation-blueprint/issues/XX
    // The sort-select doesn't preserve state across pagination yet.
    test.fixme(true, 'sort state lost on page 2 — needs app fix');
    await page.goto('/');
    await page.getByTestId('sort-select').selectOption('price_asc');
    await page.getByTestId('catalog-next').click();
    await expect(page.getByTestId('sort-select')).toHaveValue('price_asc');
  });

  test('skip: documented reason for skipping', async ({ page }) => {
    test.skip(true, 'requires BrowserStack credentials — runs in browserstack project only');
    await page.goto('/');
    // …
  });

  test('fail: documents a known bug', async ({ page }) => {
    // The cart badge doesn't update until page reload (known issue).
    // test.fail() inverts the result: passes if the test fails.
    test.fail(true, 'cart badge requires reload — app bug');
    await page.goto('/');
    await page.getByTestId('add-to-cart-prod-1').click();
    // This assertion fails (badge shows 0 until reload) — which is expected.
    await expect(page.getByTestId('cart-badge')).toHaveText('1', { timeout: 2000 });
  });
});
