import { test, expect } from '../fixtures/test';

/**
 * Runs in the 'tz' project (Pacific/Auckland, en-NZ): proves the timestamp
 * rendering follows the emulated locale/timezone instead of the machine's.
 */
test('timestamp renders in the emulated timezone', async ({ dashboardPage, page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'tz',
    'requires the tz project (Pacific/Auckland, en-NZ)',
  );
  const fixed = new Date('2026-01-15T14:30:45Z');
  await page.clock.install({ time: fixed });
  await dashboardPage.refreshSnapshot();
  const expected = await page.evaluate((t) => new Date(t).toLocaleTimeString(), fixed.getTime());
  await expect(dashboardPage.status).toHaveText(
    `Snapshot refreshed successfully at ${expected}`,
  );
});
