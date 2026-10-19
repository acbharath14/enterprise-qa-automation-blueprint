import { test, expect } from '../fixtures/test';

test.describe('product info tooltips', () => {
  test('hover reveals the tooltip with the product description', async ({ catalogPage, page }) => {
    const tooltip = page.getByTestId('product-tooltip-prod-1');
    await page.getByTestId('product-info-prod-1').hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Over-ear Bluetooth headphones');
  });

  test('ESC dismisses the tooltip', async ({ catalogPage, page }) => {
    const tooltip = page.getByTestId('product-tooltip-prod-1');
    await page.getByTestId('product-info-prod-1').hover();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });

  test('keyboard focus reveals the tooltip', async ({ catalogPage, page }) => {
    const tooltip = page.getByTestId('product-tooltip-prod-1');
    await page.getByTestId('product-info-prod-1').focus();
    await expect(tooltip).toBeVisible();
  });

  test('tooltip is associated with the button via aria-describedby', async ({ catalogPage, page }) => {
    const button = page.getByTestId('product-info-prod-1');
    const tooltip = page.getByTestId('product-tooltip-prod-1');
    await expect(button).toHaveAttribute('aria-describedby', 'tooltip-prod-1');
    await expect(tooltip).toHaveAttribute('id', 'tooltip-prod-1');
  });
});
