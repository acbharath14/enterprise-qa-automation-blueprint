import { test, expect } from '../fixtures/test';

/**
 * Performance budgets (not benchmarks): assert the app stays within
 * acceptable bounds. Budgets catch regressions; precise benchmarking
 * belongs in a dedicated perf suite.
 */
test('storefront becomes interactive within budget', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
  expect(Date.now() - start).toBeLessThan(8000);
});

test('products API responds within budget', async ({ request }) => {
  const start = Date.now();
  const res = await request.get('/api/products');
  expect(res.ok()).toBeTruthy();
  expect(Date.now() - start).toBeLessThan(2000);
});

test('no console errors or page errors on load', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(msg.text());
  });
  page.on('pageerror', (err) => problems.push(String(err)));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(problems).toEqual([]);
});

test('no console errors or page errors during checkout', async ({ checkout, page }) => {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(msg.text());
  });
  page.on('pageerror', (err) => problems.push(String(err)));
  const { checkoutPage } = checkout;
  await checkoutPage.fillShipping({ name: 'Ada', email: 'ada@example.com', address: '1 Main St' });
  await checkoutPage.next();
  await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
  await checkoutPage.next();
  await expect(checkoutPage.step3).toBeVisible();
  expect(problems).toEqual([]);
});
