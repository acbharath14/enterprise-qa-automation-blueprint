import { test, expect } from '../fixtures/test';

test.describe('product detail tabs', () => {
  test('clicking a tab shows its panel and updates aria-selected', async ({ productPage, page }) => {
    await page.getByTestId('tab-reviews').click();
    await expect(page.getByTestId('panel-reviews')).toBeVisible();
    await expect(page.getByTestId('tab-reviews')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('tab-description')).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByTestId('panel-description')).toBeHidden();
  });

  test('ArrowRight moves to the next tab and focuses it', async ({ productPage, page }) => {
    await page.getByTestId('tab-description').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('tab-reviews')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('tab-reviews')).toBeFocused();
  });

  test('Home and End jump to the first and last tabs', async ({ productPage, page }) => {
    await page.getByTestId('tab-shipping').focus();
    await page.keyboard.press('Home');
    await expect(page.getByTestId('tab-description')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('tab-description')).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.getByTestId('tab-shipping')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('tab-shipping')).toBeFocused();
  });
});
