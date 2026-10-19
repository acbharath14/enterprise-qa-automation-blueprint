import { test, expect } from '../fixtures/test';
import { pageCartHeaders } from './helpers/cart';

/**
 * Mobile-specific checks. These run on mobile projects only — the `mobile`
 * project (Pixel 7 emulation) and the opt-in `browserstack` project (real
 * device). The assertions are meaningless at desktop widths, so desktop
 * projects filter this file out via `testIgnore` in playwright.config.ts.
 */

test('viewport meta tag enables proper mobile scaling @mobile', async ({
  catalogPage,
}) => {
  const viewport = catalogPage.page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveCount(1);
  await expect(viewport).toHaveAttribute('content', /width=device-width/);
});

test('catalog fits a 375px viewport with no horizontal overflow @mobile', async ({
  catalogPage,
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const scrollWidth = await page.evaluate(
    () => document.scrollingElement?.scrollWidth ?? 0,
  );
  expect(
    scrollWidth,
    `horizontal overflow at 375px width: scrollWidth ${scrollWidth}px > 375px`,
  ).toBeLessThanOrEqual(375);
  await expect(catalogPage.heading).toBeVisible();
  await expect(catalogPage.productCard('prod-1')).toBeVisible();
});

test('touch tap on add-to-cart shows the toast @mobile', async ({
  catalogPage,
  request,
}) => {
  // locator.tap() requires a touch-enabled context. The Pixel 7 device
  // descriptor provides hasTouch, so this proves the app responds to
  // real touch input, not just mouse clicks.
  await catalogPage.page.getByTestId('add-to-cart-prod-1').tap();
  await expect(catalogPage.toast).toBeVisible();
  await expect(catalogPage.toast).toContainText('Aurora Wireless Headphones');
  // Clean up our own isolated cart line (the page's session cart id).
  const headers = await pageCartHeaders(catalogPage.page);
  await request.delete('/api/cart/items/prod-1', { headers });
});
