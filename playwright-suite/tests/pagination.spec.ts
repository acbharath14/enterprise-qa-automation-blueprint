import { test, expect } from '../fixtures/test';

/**
 * Paginated release archive: 47 items, page-size control (10/25/50),
 * prev/next, direct page-number jumps, and "Showing X–Y of Z" text.
 */
test('first page shows 10 items with correct range text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Showing 1–10 of 47')).toBeVisible();
  const items = page.locator('#archive-list li');
  await expect(items).toHaveCount(10);
  await expect(items.first()).toHaveText('Release 001');
  await expect(items.last()).toHaveText('Release 010');
});

test('next and previous buttons navigate pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('#page-next').click();
  await expect(page.getByText('Showing 11–20 of 47')).toBeVisible();
  await expect(page.locator('#archive-list li').first()).toHaveText(
    'Release 011',
  );
  await page.locator('#page-prev').click();
  await expect(page.getByText('Showing 1–10 of 47')).toBeVisible();
});

test('page-number buttons jump directly', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Page 3' }).click();
  await expect(page.getByText('Showing 21–30 of 47')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('page-size control changes items per page', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Page size').selectOption('25');
  await expect(page.getByText('Showing 1–25 of 47')).toBeVisible();
  await expect(page.locator('#archive-list li')).toHaveCount(25);
  await page.getByLabel('Page size').selectOption('50');
  await expect(page.getByText('Showing 1–47 of 47')).toBeVisible();
  await expect(page.locator('#archive-list li')).toHaveCount(47);
});

test('changing page size resets to the first page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#page-next').click();
  await expect(page.getByText('Showing 11–20 of 47')).toBeVisible();
  await page.getByLabel('Page size').selectOption('25');
  await expect(page.getByText('Showing 1–25 of 47')).toBeVisible();
});

test('prev is disabled on first page, next on last page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#page-prev')).toBeDisabled();
  // 47 items at 10 per page = 5 pages; last page holds 41–47
  await page.getByRole('button', { name: 'Page 5' }).click();
  await expect(page.getByText('Showing 41–47 of 47')).toBeVisible();
  await expect(page.locator('#archive-list li')).toHaveCount(7);
  await expect(page.locator('#page-next')).toBeDisabled();
});
