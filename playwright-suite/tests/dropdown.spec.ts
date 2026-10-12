import { test, expect } from '../fixtures/test';

/**
 * Custom dropdown menu: toggle, arrow-key navigation, ESC,
 * click-outside dismissal, and item selection.
 */
test('menu button toggles the menu', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Actions' });
  const menu = page.getByRole('menu');
  await expect(menu).toBeHidden();
  await button.click();
  await expect(menu).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(button).toHaveAttribute('aria-haspopup', 'menu');
  await button.click();
  await expect(menu).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('opening the menu focuses the first item', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Actions' }).click();
  await expect(page.getByRole('menuitem', { name: 'Edit release' })).toBeFocused();
});

test('arrow keys navigate and wrap around menu items', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Actions' }).click();
  const items = page.getByRole('menuitem');
  await expect(items.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(2)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(items.nth(2)).toBeFocused();
});

test('ESC closes the menu and returns focus to the button', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Actions' });
  await button.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(button).toBeFocused();
});

test('clicking outside closes the menu', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Actions' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page
    .getByRole('heading', { name: 'Enterprise QA Automation Blueprint' })
    .click();
  await expect(page.getByRole('menu')).toBeHidden();
});

test('selecting an item reports the action and closes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Duplicate' }).click();
  await expect(page.getByText('Action: duplicate')).toBeVisible();
  await expect(page.getByRole('menu')).toBeHidden();
});
