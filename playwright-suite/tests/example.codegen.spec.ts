import { test, expect } from '../fixtures/test';

/**
 * Codegen example: what `npx playwright codegen` records vs. a cleaned-up spec.
 *
 * To record: `npx playwright codegen http://127.0.0.1:4173` — click through
 * the flow in the browser; codegen writes the actions to a file.
 *
 * Raw codegen output is a starting point, not a finished test. It uses
 * brittle auto-generated selectors (CSS chains, nth-child), has no
 * assertions, and no test structure. Clean it up before committing:
 *  1. Replace CSS/XPath chains with getByRole/getByTestId.
 *  2. Add expect() assertions for the behavior being verified.
 *  3. Wrap in test.describe with a plain-words title.
 *  4. Remove redundant navigations and waits codegen inserts.
 *
 * Below: the same login flow, first as raw codegen output (commented),
 * then cleaned up.
 */
test.describe('codegen: login flow (recorded, then cleaned up)', () => {
  // Raw codegen output looked like this (do NOT commit this form):
  //
  //   await page.goto('http://127.0.0.1:4173/');
  //   await page.getByTestId('login-button').click();
  //   await page.locator('input[type="text"]').fill('admin');
  //   await page.locator('input[type="password"]').fill('secret');
  //   await page.getByTestId('login-submit').click();
  //
  // Problems: input[type="text"] matches every text input on the page, and
  // there is no assertion — the test passes even if login silently fails.

  test('admin can log in with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-button').click();
    await page.getByTestId('login-username').fill('admin');
    await page.getByTestId('login-password').fill('secret');
    await page.getByTestId('login-submit').click();
    // Assert the outcome, not just the clicks:
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test('login rejects wrong password', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-button').click();
    await page.getByTestId('login-username').fill('admin');
    await page.getByTestId('login-password').fill('wrong');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });
});
