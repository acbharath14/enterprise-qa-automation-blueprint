import { test, expect } from '../fixtures/test';

test('docs link opens in a new tab', async ({ galleryPage, page }) => {
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    galleryPage.docsLink.click(),
  ]);
  await popup.waitForLoadState();
  expect(popup.url()).toContain('127.0.0.1:4173');
  await expect(
    popup.getByRole('heading', { name: 'Enterprise QA Automation Blueprint' }),
  ).toBeVisible();
  await popup.close();
});
