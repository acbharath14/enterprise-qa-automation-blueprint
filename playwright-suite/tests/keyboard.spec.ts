import { test, expect } from '../fixtures/test';

/** What axe-core cannot check: the app must be fully operable by keyboard. */
test.describe('keyboard navigation', () => {
  test('tab reaches the refresh button and enter activates it', async ({ dashboardPage, page }) => {
    for (let i = 0; i < 12; i++) {
      if (await dashboardPage.refreshButton.evaluate((el) => el === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(dashboardPage.refreshButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(dashboardPage.status).toContainText('Snapshot refreshed successfully at');
  });

  test('tabs are keyboard operable', async ({ galleryPage, page }) => {
    await galleryPage.detailsTab.focus();
    await expect(galleryPage.detailsTab).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(galleryPage.detailsPanel).toBeVisible();
    await expect(galleryPage.detailsTab).toHaveAttribute('aria-selected', 'true');
  });
});
