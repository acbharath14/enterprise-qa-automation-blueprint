import { test, expect } from '../fixtures/test';

test('toast appears and auto-dismisses', async ({ galleryPage }) => {
  await galleryPage.notifyButton.click();
  await expect(galleryPage.toast).toHaveText('Team notified!');
  await expect(galleryPage.toast).toBeVisible();
  // Auto-dismisses after ~2.5s.
  await expect(galleryPage.toast).toBeHidden({ timeout: 10_000 });
});
