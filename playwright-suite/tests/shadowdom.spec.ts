import { test, expect } from '../fixtures/test';

/** Playwright pierces open shadow DOM automatically — no special API needed. */
test('clicks the counter inside shadow DOM', async ({ galleryPage }) => {
  await expect(galleryPage.counterButton).toContainText('Count: 0');
  await galleryPage.counterButton.click();
  await galleryPage.counterButton.click();
  await expect(galleryPage.counterButton).toContainText('Count: 2');
});
