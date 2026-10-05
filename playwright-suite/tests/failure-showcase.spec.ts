/**
 * Intentional failures — the failure showcase.
 *
 * Skipped in every normal run; only executes when SHOWCASE=1, which the
 * `failure_showcase` workflow dispatch sets. Its purpose is portfolio:
 * the published Allure report shows what a real failure looks like —
 * assertion diff, screenshot, video, and trace — without ever breaking CI.
 */
import { test, expect } from '../fixtures/test';

test.skip(
  process.env.SHOWCASE !== '1',
  'Failure showcase: run only via the failure_showcase workflow dispatch.',
);

test('dashboard coverage reads 99% (intentionally wrong)', async ({ dashboardPage }) => {
  // The app really reports 82% — this mismatch demonstrates a failing
  // text assertion with Playwright's diff output.
  await expect(dashboardPage.coverageMetric).toHaveText('Coverage: 99%');
});

test('metrics API exposes a status field (intentionally wrong)', async ({ request }) => {
  // The contract has no `status` field — this demonstrates a failing
  // API assertion alongside the UI one above.
  const body = await (await request.get('/api/metrics')).json();
  expect(body.status).toBe('ok');
});
