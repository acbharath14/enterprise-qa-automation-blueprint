import { test, expect } from '../fixtures/test';

test.describe('theme', () => {
  test('toggles between light and dark', async ({ catalogPage, page }) => {
    const body = page.locator('body');
    const toggle = page.getByTestId('theme-toggle');
    // Default is light.
    await expect(body).toHaveCSS('background-color', 'rgb(246, 247, 249)');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(body).toHaveCSS('background-color', 'rgb(15, 23, 42)');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(body).toHaveCSS('background-color', 'rgb(246, 247, 249)');
  });

  test('theme preference persists across reloads', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)');
    await page.reload();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)');
    await expect(page.getByTestId('theme-toggle')).toHaveAttribute('aria-checked', 'true');
  });

  test('declares support for both color schemes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
      'content',
      'dark light',
    );
  });
});
