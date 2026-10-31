import { test, expect } from '../fixtures/test';

/**
 * Service workers: offline fallback via a cached app shell.
 *
 * DemoMart doesn't ship a service worker; this spec registers a minimal
 * one (/sw-demo.js, served from sample-app/) to demonstrate the testing
 * pattern. In a real app, the SW would be registered by the app itself.
 *
 * See also: offline.spec.ts (network-level offline via context.setOffline).
 */
test.describe('service worker offline fallback', () => {
  test('serves the cached app shell when offline', async ({ page, context }) => {
    await page.goto('/');

    // Register the demo service worker and wait for activation.
    await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.register('/sw-demo.js');
      await navigator.serviceWorker.ready;
      return reg.scope;
    });

    // Let the SW cache the app shell.
    await page.waitForTimeout(1000);

    // Go offline and reload — the SW serves the cached '/'.
    await context.setOffline(true);
    await page.reload();

    // The cached shell loads (not the browser's offline error page).
    await expect(page.getByTestId('catalog-view')).toBeVisible({ timeout: 10000 });
    await context.setOffline(false);
  });

  test('service worker is registered and active', async ({ page }) => {
    await page.goto('/');
    const state = await page.evaluate(async () => {
      await navigator.serviceWorker.register('/sw-demo.js');
      const reg = await navigator.serviceWorker.ready;
      return reg.active?.state;
    });
    expect(state).toBe('activated');
  });
});
