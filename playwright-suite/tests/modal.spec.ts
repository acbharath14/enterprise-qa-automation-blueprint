import { test, expect } from '../fixtures/test';
import type { Page } from '@playwright/test';

/**
 * Quick-view modal: focus trap, ESC-to-close, backdrop dismissal,
 * and focus return to the trigger.
 */
async function openQuickView(page: Page) {
  await page.getByTestId('quick-view-prod-1').click();
  await expect(page.getByTestId('quick-view-modal')).toBeVisible();
}

test.describe('quick-view modal', () => {
  test('opens with dialog role and moves focus to the close button', async ({ catalogPage, page }) => {
    await openQuickView(page);
    const modal = page.getByTestId('quick-view-modal');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(page.getByTestId('quick-view-close')).toBeFocused();
  });

  test('traps Tab focus within the modal', async ({ catalogPage, page }) => {
    await openQuickView(page);
    const add = page.getByTestId('quick-view-add');
    const close = page.getByTestId('quick-view-close');
    await expect(close).toBeFocused();
    // Tab on the last button wraps to the first
    await page.keyboard.press('Tab');
    await expect(add).toBeFocused();
    // Shift+Tab on the first wraps to the last
    await page.keyboard.press('Shift+Tab');
    await expect(close).toBeFocused();
    // And forward again
    await page.keyboard.press('Tab');
    await expect(add).toBeFocused();
  });

  test('ESC closes the modal and returns focus to the trigger', async ({ catalogPage, page }) => {
    const trigger = page.getByTestId('quick-view-prod-1');
    await trigger.click();
    await expect(page.getByTestId('quick-view-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('quick-view-modal')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('backdrop click closes the modal', async ({ catalogPage, page }) => {
    await openQuickView(page);
    // Click the backdrop itself (top-left corner, away from the centered modal)
    await page.getByTestId('quick-view-backdrop').click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('quick-view-modal')).toBeHidden();
  });
});
