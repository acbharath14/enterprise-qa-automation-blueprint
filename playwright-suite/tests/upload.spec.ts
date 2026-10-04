import { test, expect } from '../fixtures/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

test('uploads a file and shows the returned filename', async ({ galleryPage, page }, testInfo) => {
  mkdirSync(testInfo.outputDir, { recursive: true });
  const filePath = join(testInfo.outputDir, 'evidence.txt');
  writeFileSync(filePath, 'release evidence');

  await galleryPage.uploadInput.setInputFiles(filePath);
  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/upload')),
    galleryPage.uploadSubmit.click(),
  ]);
  expect(response.ok()).toBeTruthy();
  await expect(galleryPage.uploadResult).toContainText('Uploaded: evidence.txt');
});

test('prompts when no file is chosen', async ({ galleryPage }) => {
  await galleryPage.uploadSubmit.click();
  await expect(galleryPage.uploadResult).toHaveText('Choose a file first.');
});
