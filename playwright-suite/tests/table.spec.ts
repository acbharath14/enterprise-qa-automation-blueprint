import { test, expect } from '../fixtures/test';

test.describe('releases table', () => {
  test('lists four releases', async ({ galleryPage }) => {
    await expect(galleryPage.releaseRows).toHaveCount(4);
  });

  test('sorts by coverage ascending', async ({ galleryPage }) => {
    await galleryPage.coverageHeader.click();
    await expect(galleryPage.releaseRows.first().locator('td').nth(1)).toHaveText('61%');
    await expect(galleryPage.releaseRows.last().locator('td').nth(1)).toHaveText('93%');
  });

  test('sorts by coverage descending on second click', async ({ galleryPage }) => {
    await galleryPage.coverageHeader.click();
    await galleryPage.coverageHeader.click();
    await expect(galleryPage.releaseRows.first().locator('td').nth(1)).toHaveText('93%');
    await expect(galleryPage.releaseRows.last().locator('td').nth(1)).toHaveText('61%');
  });
});
