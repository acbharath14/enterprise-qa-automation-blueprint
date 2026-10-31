import { test, expect } from '../fixtures/test';

/**
 * Clock mocking: control time with page.clock.
 *
 * Use case: DemoMart shows order timestamps. Without mocking, asserting
 * an exact timestamp is flaky (the test runs at a different millisecond
 * than the app renders). With page.clock.install(), time freezes at a
 * fixed point — the test becomes deterministic.
 *
 * See also: datetime.spec.ts (timezone emulation via the 'tz' project).
 */
test.describe('clock mocking', () => {
  test('frozen time makes timestamps deterministic', async ({ page }) => {
    // Freeze time at a known instant before the app loads.
    await page.clock.install({ time: new Date('2026-06-15T12:00:00Z') });
    await page.goto('/');

    // The app's clock now reads the mocked time.
    const appTime = await page.evaluate(() => new Date().toISOString());
    expect(appTime).toBe('2026-06-15T12:00:00.000Z');
  });

  test('fastForward advances timers without real waiting', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-06-15T12:00:00Z') });
    await page.goto('/');

    // Simulate 1 hour passing instantly — no real 3.6M ms wait.
    await page.clock.fastForward('01:00:00');
    const appTime = await page.evaluate(() => new Date().toISOString());
    expect(appTime).toBe('2026-06-15T13:00:00.000Z');
  });

  test('clock only affects the page, not the test runner', async ({ page }) => {
    await page.clock.install({ time: new Date('2020-01-01T00:00:00Z') });
    await page.goto('/');

    // Page time is mocked…
    const pageYear = await page.evaluate(() => new Date().getFullYear());
    expect(pageYear).toBe(2020);

    // …but the Node test process still runs on real time.
    const runnerYear = new Date().getFullYear();
    expect(runnerYear).toBeGreaterThanOrEqual(2026);
  });
});
