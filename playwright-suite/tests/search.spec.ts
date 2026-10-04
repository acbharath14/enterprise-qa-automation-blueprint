import { test, expect } from '../fixtures/test';

/** Autocomplete combobox: debounced search, keyboard selection, ARIA states. */
test.describe('release search', () => {
  test('shows matching options as you type', async ({ galleryPage }) => {
    await galleryPage.searchInput.fill('a');
    const options = galleryPage.searchResults.getByRole('option');
    await expect(options).toHaveCount(3); // Aurora, Beacon, Dynamo
    await expect(galleryPage.searchInput).toHaveAttribute('aria-expanded', 'true');
  });

  test('selects an option with the keyboard', async ({ galleryPage, page }) => {
    await galleryPage.searchInput.fill('ciph');
    await expect(galleryPage.searchResults.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(galleryPage.searchSelection).toHaveText('Selected: Cipher');
    await expect(galleryPage.searchResults).toBeHidden();
  });

  test('clears results when the query is empty', async ({ galleryPage }) => {
    await galleryPage.searchInput.fill('a');
    await expect(galleryPage.searchResults.getByRole('option').first()).toBeVisible();
    await galleryPage.searchInput.fill('');
    await expect(galleryPage.searchResults).toBeHidden();
  });
});
