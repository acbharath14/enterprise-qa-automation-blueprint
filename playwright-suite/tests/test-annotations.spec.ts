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
    // test.fail() marks a test as "expected to fail" — if it fails, the
    // suite stays green; if it passes, the suite fails (unexpected pass).
    // Use for documenting known bugs without breaking CI.
    //
    // Example (not run — the bug is illustrative):
    //   test.fail(true, 'cart badge requires reload — app bug');
    //   await page.getByTestId('add-to-cart-prod-1').click();
    //   await expect(page.getByTestId('cart-badge')).toHaveText('1');
    //
    // This test demonstrates the annotation without failing:
    test.fail(false, 'example only — condition is false so this runs normally');
    await page.goto('/');
    await expect(page.getByTestId('catalog-view')).toBeVisible();
  });
});
