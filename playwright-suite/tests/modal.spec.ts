import { test, expect } from '../fixtures/test';

/**
 * Custom modal dialog: focus trap, ESC-to-close, backdrop dismissal,
 * and focus return to the trigger.
 */
test('modal opens with dialog role and moves focus inside', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(page.getByRole('button', { name: 'Archive' })).toBeFocused();
});

test('modal traps focus with Tab', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const archive = page.getByRole('button', { name: 'Archive' });
  const cancel = page.getByRole('button', { name: 'Cancel' });
  await expect(archive).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancel).toBeFocused();
  // Tab on the last button wraps to the first
  await page.keyboard.press('Tab');
  await expect(archive).toBeFocused();
  // Shift+Tab on the first wraps to the last
  await page.keyboard.press('Shift+Tab');
  await expect(cancel).toBeFocused();
});

test('ESC closes the modal and returns focus to the trigger', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open dialog' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('backdrop click closes the modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  // Click the backdrop itself (top-left corner, away from the centered dialog)
  await page.locator('#modal-backdrop').click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('confirming archives and reports the result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('button', { name: 'Archive' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByText('Release archived.')).toBeVisible();
});

test('cancel closes without archiving', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByText('Release archived.')).toBeHidden();
});
