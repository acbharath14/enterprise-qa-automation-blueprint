import { test, expect } from '../fixtures/test';

test.describe('visual regression', () => {
  test('dashboard matches the committed baseline', async ({ dashboardPage, page }, testInfo) => {
    // Baselines are desktop-chromium-only: the mobile project also uses the
    // chromium engine, so gating on browserName is not enough. Cross-OS font
    // rendering makes multi-browser baselines flaky without a dedicated
    // visual service.
    test.skip(
      testInfo.project.name !== 'chromium',
      'visual baselines are desktop-chromium-only',
    );
    // Dynamic regions (timestamps, live metrics) are masked — only layout
    // regressions fail the build, not data changes.
    await expect(page).toHaveScreenshot('dashboard.png', {
      mask: [dashboardPage.status, dashboardPage.liveMetrics],
      maxDiffPixelRatio: 0.02,
    });
  });
});
