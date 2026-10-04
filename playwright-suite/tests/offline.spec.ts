import { test, expect } from '../fixtures/test';

test('shows a friendly message when the API is unreachable', async ({
  dashboardPage,
  context,
}) => {
  await context.setOffline(true);
  await dashboardPage.loadLiveMetrics();
  await expect(dashboardPage.liveMetrics).toHaveText('Could not load live metrics.');
});
