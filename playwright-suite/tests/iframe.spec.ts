import { test, expect } from '../fixtures/test';

test('interacts with the embedded frame', async ({ galleryPage }) => {
  const frame = galleryPage.page.frameLocator('#demo-frame');
  await frame.getByRole('button', { name: 'Ping from frame' }).click();
  await expect(frame.locator('#frame-result')).toHaveText('Frame says hi!');
});
