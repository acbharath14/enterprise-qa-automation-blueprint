import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

type Fixtures = {
  /** Dashboard page, already navigated and ready to interact with. */
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(dashboardPage.heading).toBeVisible();
    await use(dashboardPage);
  },
});

export { expect };
