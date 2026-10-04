import { test, expect } from '../fixtures/test';

/** Data-driven: every release-health metric must render its expected value. */
const metrics = [
  { name: 'coverage', locator: 'coverageMetric', text: 'Coverage: 82%' },
  { name: 'api health', locator: 'apiHealthMetric', text: 'API Health: Green' },
  { name: 'p95 latency', locator: 'perfMetric', text: 'P95 Latency: 640 ms' },
] as const;

for (const { name, locator, text } of metrics) {
  test(`release snapshot shows the ${name} metric`, async ({ dashboardPage }) => {
    await expect(dashboardPage[locator]).toHaveText(text);
  });
}

test('live metrics load from the real API', async ({ dashboardPage }) => {
  await dashboardPage.loadLiveMetrics();
  await expect(dashboardPage.liveMetrics).toContainText('Coverage 82%');
  await expect(dashboardPage.liveMetrics).toContainText('API Green');
});
