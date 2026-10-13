import { test, expect } from '../fixtures/test';

/**
 * Empty states: filtering a list to zero matches shows a friendly
 * empty-state message instead of a blank area.
 */
test('filtering to zero matches shows the empty state', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('No team members found.')).toBeHidden();
  await page.getByLabel('Filter by name').fill('zzz');
  await expect(page.getByText('No team members found.')).toBeVisible();
  await expect(page.getByText('Try a different search term.')).toBeVisible();
});

test('clearing the filter restores the list', async ({ page }) => {
  await page.goto('/');
  const filter = page.getByLabel('Filter by name');
  await filter.fill('zzz');
  await expect(page.getByText('No team members found.')).toBeVisible();
  await filter.fill('');
  await expect(page.getByText('No team members found.')).toBeHidden();
  await expect(page.getByText('Alice Chen')).toBeVisible();
  await expect(page.getByText('Bob Martinez')).toBeVisible();
  await expect(page.getByText('Carol Johnson')).toBeVisible();
});

test('partial matches filter without showing the empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Filter by name').fill('alice');
  await expect(page.getByText('Alice Chen')).toBeVisible();
  await expect(page.getByText('Bob Martinez')).toBeHidden();
  await expect(page.getByText('No team members found.')).toBeHidden();
});
