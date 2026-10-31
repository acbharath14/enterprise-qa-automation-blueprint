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
      // Wait for the SW to take control.
      await new Promise((resolve) => {
        if (reg.active) resolve(true);
        else reg.addEventListener('updatefound', () => resolve(true));
      });
      return reg.scope;
    });

    // Give the SW time to cache the app shell (install + fetch).
    await page.waitForTimeout(2000);

    // Go offline and reload — the SW serves the cached '/'.
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });

    // The cached shell loads (not the browser's offline error page).
    // Use a longer timeout — SW cache lookup can be slow on first hit.
    await expect(page.getByTestId('catalog-view')).toBeVisible({ timeout: 15000 });
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
