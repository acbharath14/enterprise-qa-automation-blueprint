import { test, expect } from '../fixtures/test';

/** Multi-step wizard: per-step validation, back/next navigation, review. */
test.describe('release wizard', () => {
  test('requires a name before advancing', async ({ galleryPage }) => {
    await galleryPage.wizNext1.click();
    await expect(galleryPage.wizNameError).toHaveText('Give the release a name.');
  });

  test('completes the full flow', async ({ galleryPage }) => {
    await test.step('enter the release name', async () => {
      await galleryPage.wizName.fill('Echo');
      await galleryPage.wizNext1.click();
    });

    await test.step('pick the environment', async () => {
      await galleryPage.wizEnv.selectOption('production');
      await galleryPage.wizNext2.click();
    });

    await test.step('review and submit', async () => {
      await expect(galleryPage.wizReview).toContainText('Echo');
      await expect(galleryPage.wizReview).toContainText('production');
      await galleryPage.wizSubmit.click();
    });

    await expect(galleryPage.wizDone).toHaveText('Release "Echo" created.');
  });

  test('back button returns to the previous step', async ({ galleryPage }) => {
    await galleryPage.wizName.fill('Foxtrot');
    await galleryPage.wizNext1.click();
    await galleryPage.wizBack2.click();
    await expect(galleryPage.wizName).toHaveValue('Foxtrot');
  });
});
