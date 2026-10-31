import { test, expect } from '../fixtures/test';

/**
 * Time mocking: control Date without the clock API.
 *
 * Playwright 1.64 doesn't have page.clock (added in later versions).
 * Instead, override the Date constructor via addInitScript before the
 * page loads. The test becomes deterministic — no flaky timestamps.
 *
 * See also: datetime.spec.ts (timezone emulation via the 'tz' project).
 */
test.describe('time mocking', () => {
  test('frozen time makes timestamps deterministic', async ({ page }) => {
    // Freeze time at a known instant before the app loads.
    await page.addInitScript(() => {
      const frozen = new Date('2026-06-15T12:00:00Z').getTime();
      const RealDate = Date;
      // @ts-ignore - override for testing
      window.Date = class extends RealDate {
        constructor(...args: any[]) {
          if (args.length === 0) super(frozen);
          else super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        static now() {
          return frozen;
        }
      };
    });
    await page.goto('/');

    const appTime = await page.evaluate(() => new Date().toISOString());
    expect(appTime).toBe('2026-06-15T12:00:00.000Z');
  });

  test('mocked time does not affect the test runner', async ({ page }) => {
    await page.addInitScript(() => {
      const frozen = new Date('2020-01-01T00:00:00Z').getTime();
      const RealDate = Date;
      // @ts-ignore - override for testing
      window.Date = class extends RealDate {
        constructor(...args: any[]) {
          if (args.length === 0) super(frozen);
          else super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        static now() {
          return frozen;
        }
      };
    });
    await page.goto('/');

    // Page time is mocked…
    const pageYear = await page.evaluate(() => new Date().getFullYear());
    expect(pageYear).toBe(2020);

    // …but the Node test process still runs on real time.
    const runnerYear = new Date().getFullYear();
    expect(runnerYear).toBeGreaterThanOrEqual(2026);
  });
});
