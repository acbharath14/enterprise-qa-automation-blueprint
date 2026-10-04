import { test, expect } from '../fixtures/test';

/**
 * Backend-control tests: the UI is exercised against stubbed API responses
 * via route interception, so frontend behavior is verified without depending
 * on a real backend state.
 */

test('mocked degraded metrics render in the UI', async ({ dashboardPage, page }) => {
  await page.route('/api/metrics', (route) =>
    route.fulfill({
      json: { coverage: 41, apiHealth: 'Degraded', p95LatencyMs: 2100 },
    }),
  );

  await dashboardPage.loadLiveMetrics();
  await expect(dashboardPage.liveMetrics).toContainText('Coverage 41%');
  await expect(dashboardPage.liveMetrics).toContainText('API Degraded');
});

test('mocked API failure shows an error state', async ({ dashboardPage, page }) => {
  await page.route('/api/metrics', (route) => route.fulfill({ status: 500 }));

  await dashboardPage.loadLiveMetrics();
  await expect(dashboardPage.liveMetrics).toHaveText('Could not load live metrics.');
});
