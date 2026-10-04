import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { GalleryPage } from '../pages/GalleryPage';

type Fixtures = {
  /** Dashboard page, already navigated and ready to interact with. */
  dashboardPage: DashboardPage;
  /** Component gallery, already navigated and ready to interact with. */
  galleryPage: GalleryPage;
};

export const test = base.extend<Fixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(dashboardPage.heading).toBeVisible();
    await use(dashboardPage);
  },
  galleryPage: async ({ page }, use) => {
    const galleryPage = new GalleryPage(page);
    await galleryPage.goto();
    await expect(galleryPage.feedbackHeading).toBeVisible();
    await use(galleryPage);
  },
});

export { expect };
