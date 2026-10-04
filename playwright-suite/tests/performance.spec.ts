import { test, expect } from '../fixtures/test';

/**
 * Performance budgets (not benchmarks): assert the app stays within
 * acceptable bounds. Budgets catch regressions; precise benchmarking
 * belongs in a dedicated perf suite.
 */
test('dashboard becomes interactive within budget', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Enterprise QA Automation Blueprint' }),
  ).toBeVisible();
  expect(Date.now() - start).toBeLessThan(8000);
});

test('metrics API responds within budget', async ({ request }) => {
  const start = Date.now();
  const res = await request.get('/api/metrics');
  expect(res.ok()).toBeTruthy();
  expect(Date.now() - start).toBeLessThan(2000);
});

test('no console errors or page errors on load', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(msg.text());
  });
  page.on('pageerror', (err) => problems.push(String(err)));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(problems).toEqual([]);
});
