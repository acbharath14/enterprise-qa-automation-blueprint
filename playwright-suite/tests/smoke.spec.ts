import { test, expect } from '../fixtures/test';

test('critical release snapshot is visible @smoke', async ({ dashboardPage }) => {
  await expect(dashboardPage.status).toHaveText('All critical checks are healthy.');
  await expect(dashboardPage.refreshButton).toBeVisible();
});

test('refresh action updates the snapshot message @smoke', async ({ dashboardPage }) => {
  await dashboardPage.refreshSnapshot();
  await expect(dashboardPage.status).toContainText('Snapshot refreshed successfully at');
});

test('refresh shows the exact frozen time @smoke', async ({ dashboardPage, page }) => {
  const fixed = new Date('2026-01-15T14:30:45');
  await page.clock.install({ time: fixed });
  await dashboardPage.refreshSnapshot();
  await expect(dashboardPage.status).toHaveText(
    `Snapshot refreshed successfully at ${fixed.toLocaleTimeString()}`,
  );
});
