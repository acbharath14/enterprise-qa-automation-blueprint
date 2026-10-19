import { test, expect } from '../fixtures/test';

/** Playwright pierces open shadow roots automatically — no special API needed. */
test('star rating exposes its value through the open shadow root', async ({ catalogPage, page }) => {
  const star = page.getByTestId('rating-prod-1').locator('span');
  await expect(star).toHaveAttribute('aria-label', 'Rated 4.5 out of 5');
});
