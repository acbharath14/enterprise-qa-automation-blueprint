import { test, expect } from '../fixtures/test';

test.describe('schedule release', () => {
  test('schedules with a valid date', async ({ galleryPage }) => {
    await galleryPage.dateInput.fill('2026-12-25');
    await galleryPage.scheduleButton.click();
    await expect(galleryPage.scheduleResult).toHaveText('Scheduled for 2026-12-25.');
  });

  test('prompts when no date is picked', async ({ galleryPage }) => {
    await galleryPage.scheduleButton.click();
    await expect(galleryPage.scheduleResult).toHaveText('Pick a date first.');
  });
});
