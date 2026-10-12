import { test, expect } from '../fixtures/test';

/**
 * Mobile-specific checks. These run only on the `mobile` project
 * (Pixel 7 emulation: mobile viewport, touch, mobile UA) — the
 * assertions are meaningless at desktop widths, so every other
 * project skips them.
 */
test.beforeEach(async ({}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile',
    'mobile assertions require the Pixel 7 emulation project',
  );
});

test('viewport meta tag enables proper mobile scaling @mobile', async ({ dashboardPage }) => {
  const viewport = dashboardPage.page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveCount(1);
  await expect(viewport).toHaveAttribute('content', /width=device-width/);
});

test('dashboard fits the mobile viewport with no horizontal overflow @mobile', async ({
  dashboardPage,
}) => {
  const { scrollWidth, clientWidth } = await dashboardPage.page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `horizontal overflow at mobile width: scrollWidth ${scrollWidth}px > viewport ${clientWidth}px`,
  ).toBeLessThanOrEqual(clientWidth);
  await expect(dashboardPage.heading).toBeVisible();
  await expect(dashboardPage.refreshButton).toBeVisible();
});

test('touch tap triggers the refresh action @mobile', async ({ dashboardPage }) => {
  // locator.tap() requires a touch-enabled context. The Pixel 7 device
  // descriptor provides hasTouch, so this proves the app responds to
  // real touch input, not just mouse clicks.
  await dashboardPage.refreshButton.tap();
  await expect(dashboardPage.status).toContainText('Snapshot refreshed successfully at');
});

test('feedback form stays usable at mobile width @mobile', async ({ galleryPage }) => {
  await expect(galleryPage.nameInput).toBeVisible();
  await expect(galleryPage.emailInput).toBeVisible();
  await expect(galleryPage.feedbackSubmit).toBeVisible();
});
