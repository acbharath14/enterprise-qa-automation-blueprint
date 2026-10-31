import { test, expect } from '../fixtures/test';

/**
 * Mocking browser APIs: geolocation and permissions.
 *
 * These control what the browser reports to the page, without needing
 * real hardware or user prompts:
 * - context.setGeolocation: mock GPS coordinates
 * - context.grantPermissions: auto-grant permission prompts
 *
 * See also: the 'dark' project (colorScheme emulation) in playwright.config.ts.
 */
test.describe('mock browser APIs', () => {
  test('setGeolocation mocks the GPS coordinates', async ({ page, context }) => {
    // Mock a location (Herndon, VA) before the page reads it.
    await context.setGeolocation({ latitude: 38.97163, longitude: -77.3861 });
    await page.goto('/');

    const coords = await page.evaluate(
      () =>
        new Promise<{ lat: number; lon: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
              }),
            reject,
          );
        }),
    );

    expect(coords.lat).toBeCloseTo(38.97163, 4);
    expect(coords.lon).toBeCloseTo(-77.3861, 4);
  });

  test('grantPermissions auto-approves permission prompts', async ({
    page,
    context,
  }) => {
    // Grant notification permission without a user prompt.
    await context.grantPermissions(['notifications']);
    await page.goto('/');

    const permission = await page.evaluate(() =>
      navigator.permissions.query({ name: 'notifications' }).then((p) => p.state),
    );
    expect(permission).toBe('granted');
  });

  test('grantPermissions for geolocation avoids the prompt', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.006 });
    await page.goto('/');

    // With permission granted, getCurrentPosition succeeds immediately.
    const lat = await page.evaluate(
      () =>
        new Promise<number>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords.latitude),
            reject,
            { timeout: 5000 },
          );
        }),
    );
    expect(lat).toBeCloseTo(40.7128, 4);
  });
});
