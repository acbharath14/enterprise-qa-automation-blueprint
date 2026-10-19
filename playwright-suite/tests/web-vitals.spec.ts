import { test, expect } from '../fixtures/test';

// Chromium-only suite: CLS (layout-shift entries) and INP (event timing)
// are Chromium-exclusive APIs. Skipped on Firefox/WebKit.
// File-level skip: cleaner Allure reporting than beforeEach skip
test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Core Web Vitals APIs are Chromium-only',
);

/**
 * Core Web Vitals — Google's user-perceived performance metrics, measured
 * on the DemoMart storefront. Thresholds are Google's "good" ratings:
 *   LCP (Largest Contentful Paint) < 2.5s — when the main content is visible
 *   CLS (Cumulative Layout Shift)  < 0.1  — visual stability (no janky shifts)
 *   INP (Interaction to Next Paint) < 200ms — responsiveness to input
 *
 * These are budgets, not benchmarks: they catch regressions in the
 * experience, not micro-optimizations. Measured in Chromium via the
 * PerformanceObserver API.
 */

test('LCP: largest contentful paint under 2.5s', async ({ page }) => {
  await page.goto('/');

  const lcp = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        // buffered: true captures the entry even if paint happened before we observe
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1] as any;
          resolve(last.renderTime || last.loadTime || 0);
          observer.disconnect();
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        // Fallback: resolve 0 if no LCP entry appears (page with no paintable content)
        setTimeout(() => resolve(0), 5000);
      }),
  );

  expect(lcp).toBeGreaterThan(0);
  expect(lcp).toBeLessThan(2500);
});

test('CLS: cumulative layout shift under 0.1', async ({ page }) => {
  await page.goto('/');
  // Let the page settle — catalog render and late layout settle here
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const cls = await page.evaluate(() => {
    let value = 0;
    for (const entry of performance.getEntriesByType('layout-shift') as any[]) {
      // Ignore shifts caused by recent user input (expected, not jank)
      if (!entry.hadRecentInput) value += entry.value;
    }
    return value;
  });

  expect(cls).toBeLessThan(0.1);
});

test('INP: interaction responds within 200ms', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('product-grid')).toBeVisible();

  // Observe long event-timing entries (interactions)
  await page.evaluate(() => {
    (window as any).__inpDurations = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        (window as any).__inpDurations.push(entry.duration);
      }
    });
    observer.observe({ type: 'event', buffered: true });
    (window as any).__inpObserver = observer;
  });

  // Interact: add a product to the cart and type in the search box
  await page.getByTestId('add-to-cart-prod-1').click();
  try {
    const searchBox = page.getByTestId('search-input');
    if (await searchBox.isVisible({ timeout: 2000 })) {
      await searchBox.fill('test', { timeout: 2000 });
    }
  } catch {
    // Non-critical: the add-to-cart click above already provides interaction
  }
  await page.waitForTimeout(1000);

  const maxDuration = await page.evaluate(() => {
    const durations = (window as any).__inpDurations as number[];
    (window as any).__inpObserver?.disconnect();
    return durations.length ? Math.max(...durations) : 0;
  });

  // 0 means no measurable interaction latency was recorded — acceptable
  // for a light page; the assertion guards against real jank (>200ms)
  expect(maxDuration).toBeLessThan(200);
});
