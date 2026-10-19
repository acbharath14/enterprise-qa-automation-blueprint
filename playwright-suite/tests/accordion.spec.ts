import { test, expect } from '../fixtures/test';

test.describe('product detail accordion', () => {
  test('clicking a trigger expands its panel', async ({ productPage, page }) => {
    await page.getByTestId('accordion-shipping-trigger').click();
    await expect(page.getByTestId('accordion-shipping-panel')).toBeVisible();
    await expect(page.getByTestId('accordion-shipping-trigger')).toHaveAttribute('aria-expanded', 'true');
  });

  test('only one section is open at a time', async ({ productPage, page }) => {
    await page.getByTestId('accordion-shipping-trigger').click();
    await expect(page.getByTestId('accordion-shipping-panel')).toBeVisible();
    await page.getByTestId('accordion-returns-trigger').click();
    await expect(page.getByTestId('accordion-returns-panel')).toBeVisible();
    await expect(page.getByTestId('accordion-shipping-panel')).toBeHidden();
  });

  test('keyboard: Enter toggles a section', async ({ productPage, page }) => {
    const trigger = page.getByTestId('accordion-returns-trigger');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('accordion-returns-panel')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('accordion-returns-panel')).toBeHidden();
  });
});
