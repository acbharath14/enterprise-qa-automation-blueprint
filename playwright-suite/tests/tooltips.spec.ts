import { test, expect } from '../fixtures/test';

test.describe('product info tooltips', () => {
  const revealCases = [
    { name: 'hover reveals the tooltip with the product description', reveal: 'hover' as const },
    { name: 'keyboard focus reveals the tooltip', reveal: 'focus' as const },
  ];
  for (const { name, reveal } of revealCases) {
    test(name, async ({ catalogPage, page }) => {
      const tooltip = page.getByTestId('product-tooltip-prod-1');
      const trigger = page.getByTestId('product-info-prod-1');
      if (reveal === 'hover') {
        await trigger.hover();
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toContainText('Over-ear Bluetooth headphones');
      } else {
        await trigger.focus();
        await expect(tooltip).toBeVisible();
      }
    });
  }

  test('ESC dismisses the tooltip', async ({ catalogPage, page }) => {
    const tooltip = page.getByTestId('product-tooltip-prod-1');
    await page.getByTestId('product-info-prod-1').hover();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });

  test('tooltip is associated with the button via aria-describedby', async ({ catalogPage, page }) => {
    const button = page.getByTestId('product-info-prod-1');
    const tooltip = page.getByTestId('product-tooltip-prod-1');
    await expect(button).toHaveAttribute('aria-describedby', 'tooltip-prod-1');
    await expect(tooltip).toHaveAttribute('id', 'tooltip-prod-1');
  });
});
