import { test, expect } from '../fixtures/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

declare const __dirname: string;

test.describe('visual regression', () => {
  test('storefront matches the committed baseline', async ({ page }, testInfo) => {
    // Baselines are desktop-chromium-only: the mobile project also uses the
    // chromium engine, so gating on browserName is not enough. Cross-OS font
    // rendering makes multi-browser baselines flaky without a dedicated
    // visual service.
    test.skip(
      testInfo.project.name !== 'chromium',
      'visual baselines are desktop-chromium-only',
    );
    // No baseline is committed right after the re-theme (the old one showed
    // the dead dashboard). Capture one on a machine with browsers via:
    //   npx playwright test visual --project=chromium --update-snapshots
    //   npm run baseline:update
    test.skip(
      !existsSync(join(__dirname, 'visual.spec.ts-snapshots', 'storefront-chromium.png')),
      'no committed baseline for the storefront yet',
    );
    // Dynamic regions are masked — only layout regressions fail the build,
    // not data changes. Full-page so the whole storefront is covered.
    await page.goto('/');
    await expect(page.getByTestId('product-grid')).toBeVisible();
    await expect(page).toHaveScreenshot('storefront.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [page.getByTestId('cart-badge')],
      maxDiffPixelRatio: 0.02,
    });
  });
});
