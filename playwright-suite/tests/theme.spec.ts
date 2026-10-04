import { test, expect } from '../fixtures/test';

test.describe('theme', () => {
  test('toggles between dark and light', async ({ galleryPage, page }) => {
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(15, 23, 42)');
    await galleryPage.themeToggle.click();
    await expect(body).toHaveCSS('background-color', 'rgb(241, 245, 249)');
    await galleryPage.themeToggle.click();
    await expect(body).toHaveCSS('background-color', 'rgb(15, 23, 42)');
  });

  test('declares support for both color schemes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
      'content',
      'dark light',
    );
  });
});
