import { test, expect } from '../fixtures/test';

/**
 * Loading skeletons: async content shows placeholder skeletons first,
 * then the real content replaces them.
 */
test('loading shows skeleton placeholders', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Load activity' }).click();
  await expect(page.locator('#feed-content .skeleton')).toHaveCount(3);
});

test('skeletons are replaced by the loaded content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Load activity' }).click();
  await expect(page.locator('#feed-content .skeleton')).toHaveCount(3);
  await expect(page.getByText('Deploy finished (2m ago)')).toBeVisible({
    timeout: 5000,
  });
  await expect(page.locator('#feed-content .skeleton')).toHaveCount(0);
  await expect(page.getByText('Tests passed (15m ago)')).toBeVisible();
  await expect(page.getByText('Release cut (1h ago)')).toBeVisible();
});

test('feed shows a prompt before loading', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('Click "Load activity" to fetch the latest events.'),
  ).toBeVisible();
  await expect(page.locator('#feed-content .skeleton')).toHaveCount(0);
});
