import { test, expect } from '../fixtures/test';

test('critical release snapshot is visible @smoke', async ({ dashboardPage }) => {
  await expect(dashboardPage.status).toHaveText('All critical checks are healthy.');
  await expect(dashboardPage.refreshButton).toBeVisible();
});

test('refresh action updates the snapshot message @smoke', async ({ dashboardPage }) => {
  await dashboardPage.refreshSnapshot();
  await expect(dashboardPage.status).toContainText('Snapshot refreshed successfully at');
});
