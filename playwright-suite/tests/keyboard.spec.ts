import { test, expect } from '../fixtures/test';

/** What axe-core cannot check: the app must be fully operable by keyboard. */
test.describe('keyboard navigation', () => {
  test('tab order follows the header nav then the catalog toolbar', async ({
    catalogPage,
    page,
  }) => {
    // On mobile (<=768px) the hamburger toggle is visible and first in DOM
    // order, while nav-catalog hides inside the collapsed nav. On desktop
    // the toggle is display:none and nav-catalog is visible.
    const navToggleVisible = await page.getByTestId('nav-toggle').isVisible();
    const expectedOrder = [
      ...(navToggleVisible ? ['nav-toggle'] : []),
      'store-logo',
      ...(navToggleVisible ? [] : ['nav-catalog']),
      'nav-cart',
      'theme-toggle',
      'login-button',
      'search-input',
      'category-filter',
      'sort-select',
      'price-max-slider',
    ];
    for (const testid of expectedOrder) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(
        () => (document.activeElement as HTMLElement | null)?.dataset?.testid,
      );
      expect(focused, `expected focus on ${testid}`).toBe(testid);
    }
  });

  test('enter on nav-cart opens the cart view', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cart').focus();
    await expect(page.getByTestId('nav-cart')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('heading', { name: 'Your Cart' }),
    ).toBeVisible();
  });
});
