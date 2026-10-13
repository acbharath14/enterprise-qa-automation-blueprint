import { test, expect } from '../fixtures/test';

test.describe('release notes tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the Overview panel by default', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#panel-overview')).toBeVisible();
    await expect(page.locator('#panel-details')).toBeHidden();
    await expect(page.locator('#panel-activity')).toBeHidden();
  });

  test('clicking a tab shows its panel and updates aria-selected', async ({
    page,
  }) => {
    const detailsTab = page.getByRole('tab', { name: 'Details' });
    await detailsTab.click();

    await expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    await expect(page.locator('#panel-details')).toBeVisible();
    await expect(page.locator('#panel-overview')).toBeHidden();
    await expect(page.locator('#panel-activity')).toBeHidden();
  });

  test('each tab is linked to its panel via aria-controls/aria-labelledby', async ({
    page,
  }) => {
    for (const name of ['Overview', 'Details', 'Activity']) {
      const tab = page.getByRole('tab', { name });
      const tabId = await tab.getAttribute('id');
      const controlsId = await tab.getAttribute('aria-controls');
      const panel = page.locator(`#${controlsId}`);
      await expect(panel).toHaveAttribute('role', 'tabpanel');
      await expect(panel).toHaveAttribute('aria-labelledby', tabId!);
    }
  });

  test('ArrowRight moves to the next tab and wraps from last to first', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: 'Overview' }).focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.getByRole('tab', { name: 'Details' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#panel-details')).toBeVisible();

    // Wrap around: from the last tab, ArrowRight returns to the first
    await page.getByRole('tab', { name: 'Activity' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#panel-overview')).toBeVisible();
  });

  test('ArrowLeft moves to the previous tab and wraps from first to last', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: 'Overview' }).focus();
    await page.keyboard.press('ArrowLeft');

    await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#panel-activity')).toBeVisible();
  });

  test('Home and End jump to the first and last tabs', async ({ page }) => {
    const detailsTab = page.getByRole('tab', { name: 'Details' });
    await detailsTab.focus();

    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#panel-activity')).toBeVisible();

    await page.keyboard.press('Home');
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#panel-overview')).toBeVisible();
  });
});
