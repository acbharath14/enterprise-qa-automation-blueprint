import { test, expect } from '@playwright/test';

test('critical release snapshot is visible @smoke', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Enterprise QA Automation Blueprint' })).toBeVisible();
  await expect(page.getByText('All critical checks are healthy.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refresh health snapshot' })).toBeVisible();
});

test('refresh action updates the snapshot message @smoke', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Refresh health snapshot' }).click();
  await expect(page.getByText('Snapshot refreshed successfully at')).toBeVisible();
});
