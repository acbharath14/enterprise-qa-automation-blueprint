import { test, expect } from '@playwright/test';

test('home page is reachable @smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Example Domain/i);
});
