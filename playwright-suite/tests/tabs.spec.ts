import { test, expect } from '../fixtures/test';
import type { Page } from '@playwright/test';

test.describe('product detail tabs', () => {
  const tabCases = [
    {
      name: 'clicking a tab shows its panel and updates aria-selected',
      act: async (page: Page) => {
        await page.getByTestId('tab-reviews').click();
      },
      verify: async (page: Page) => {
        await expect(page.getByTestId('panel-reviews')).toBeVisible();
        await expect(page.getByTestId('tab-reviews')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('tab-description')).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId('panel-description')).toBeHidden();
      },
    },
    {
      name: 'ArrowRight moves to the next tab and focuses it',
      act: async (page: Page) => {
        await page.getByTestId('tab-description').focus();
        await page.keyboard.press('ArrowRight');
      },
      verify: async (page: Page) => {
        await expect(page.getByTestId('tab-reviews')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('tab-reviews')).toBeFocused();
      },
    },
    {
      name: 'Home and End jump to the first and last tabs',
      act: async (page: Page) => {
        await page.getByTestId('tab-shipping').focus();
        await page.keyboard.press('Home');
      },
      verify: async (page: Page) => {
        await expect(page.getByTestId('tab-description')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('tab-description')).toBeFocused();
        await page.keyboard.press('End');
        await expect(page.getByTestId('tab-shipping')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('tab-shipping')).toBeFocused();
      },
    },
  ];
  for (const { name, act, verify } of tabCases) {
    test(name, async ({ productPage, page }) => {
      await act(page);
      await verify(page);
    });
  }
});
