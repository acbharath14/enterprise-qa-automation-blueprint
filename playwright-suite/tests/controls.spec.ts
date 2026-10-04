import { test, expect } from '../fixtures/test';

test.describe('controls', () => {
  test('switch toggles aria-checked', async ({ galleryPage }) => {
    await expect(galleryPage.notifySwitch).toHaveAttribute('aria-checked', 'false');
    await galleryPage.notifySwitch.click();
    await expect(galleryPage.notifySwitch).toHaveAttribute('aria-checked', 'true');
    await galleryPage.notifySwitch.click();
    await expect(galleryPage.notifySwitch).toHaveAttribute('aria-checked', 'false');
  });

  test('slider updates its output', async ({ galleryPage }) => {
    await galleryPage.volumeSlider.fill('75');
    await expect(galleryPage.volumeValue).toHaveText('75');
  });
});
