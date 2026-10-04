import { test, expect } from '../fixtures/test';

test.describe('delete confirmation dialog', () => {
  test('dialog names the release being deleted', async ({ galleryPage, page }) => {
    let message = '';
    page.on('dialog', (dialog) => {
      message = dialog.message();
      return dialog.dismiss();
    });
    await galleryPage.deleteButton.click();
    expect(message).toBe('Delete release Aurora?');
  });

  test('accepting deletes the release', async ({ galleryPage, page }) => {
    page.on('dialog', (dialog) => dialog.accept());
    await galleryPage.deleteButton.click();
    await expect(galleryPage.deleteResult).toHaveText('Release Aurora deleted.');
  });

  test('dismissing cancels the delete', async ({ galleryPage, page }) => {
    page.on('dialog', (dialog) => dialog.dismiss());
    await galleryPage.deleteButton.click();
    await expect(galleryPage.deleteResult).toHaveText('Delete cancelled.');
  });
});
