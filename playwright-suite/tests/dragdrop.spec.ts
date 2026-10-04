import { test, expect } from '../fixtures/test';

test('drags the first priority to the end', async ({ galleryPage }) => {
  const items = galleryPage.priorityItems;
  await expect(items.first()).toContainText('Write tests');

  await items.first().dragTo(items.last());

  await expect(items.first()).toContainText('Review PR');
  await expect(items.nth(1)).toContainText('Deploy');
  await expect(items.last()).toContainText('Write tests');
});
