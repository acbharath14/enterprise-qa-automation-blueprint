import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '../fixtures/test';

declare const __dirname: string;

type MetricExpectation = {
  name: string;
  key: 'coverageMetric' | 'apiHealthMetric' | 'perfMetric';
  text: string;
};

/** Expectations live in test-data/metrics.json — adding a metric edits data, not code. */
const metrics: MetricExpectation[] = JSON.parse(
  readFileSync(join(__dirname, '..', 'test-data', 'metrics.json'), 'utf8'),
);

for (const { name, key, text } of metrics) {
  test(`release snapshot shows the ${name} metric`, async ({ dashboardPage }) => {
    await expect(dashboardPage[key]).toHaveText(text);
  });
}

test('live metrics load from the real API', async ({ dashboardPage }) => {
  await dashboardPage.loadLiveMetrics();
  await expect(dashboardPage.liveMetrics).toContainText('Coverage 82%');
  await expect(dashboardPage.liveMetrics).toContainText('API Green');
});
