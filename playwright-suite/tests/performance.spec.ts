import { test, expect } from '../fixtures/test';

/**
 * Performance budgets (not benchmarks): assert the app stays within
 * acceptable bounds. Budgets catch regressions; precise benchmarking
 * belongs in a dedicated perf suite.
 */
test('products API responds within budget', async ({ request }) => {
  const start = Date.now();
  const res = await request.get('/api/products');
  await expect(res).toBeOK();
  expect(Date.now() - start).toBeLessThan(2000);
});

const consoleErrorCases = [
  { name: 'no console errors or page errors on load', scenario: 'load' as const },
  { name: 'no console errors or page errors during checkout', scenario: 'checkout' as const },
];
for (const { name, scenario } of consoleErrorCases) {
  test(name, async ({ page, checkout }) => {
    const problems: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') problems.push(msg.text());
    });
    page.on('pageerror', (err) => problems.push(String(err)));
    if (scenario === 'checkout') {
      const { checkoutPage } = checkout;
      await checkoutPage.fillShipping({ name: 'Ada', email: 'ada@example.com', address: '1 Main St' });
      await checkoutPage.next();
      await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
      await checkoutPage.next();
      await expect(checkoutPage.step3).toBeVisible();
    } else {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }
    expect(problems).toEqual([]);
  });
}
