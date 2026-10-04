import { test, expect } from '@playwright/test';

/**
 * Runs in the 'authed' project, which loads the storageState saved by
 * auth.setup.ts — proves the session persists without signing in again.
 * Skipped everywhere else: without the saved session there is nothing to reuse.
 */
test('session persists without signing in again', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'authed',
    'requires the storageState from auth.setup.ts',
  );
  await page.goto('/');
  await expect(page.locator('#login-welcome')).toHaveText('Welcome, admin!');
});
