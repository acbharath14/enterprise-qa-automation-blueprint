import { test, expect } from '../fixtures/test';
import { readFileSync } from 'node:fs';

test('exports releases as CSV', async ({ galleryPage, page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    galleryPage.exportLink.click(),
  ]);
  expect(download.suggestedFilename()).toBe('releases.csv');
  const filePath = await download.path();
  const content = readFileSync(filePath, 'utf8');
  expect(content).toContain('release,coverage,status');
  expect(content).toContain('Aurora,82,Green');
});
