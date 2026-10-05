import { test as base, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
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

// Friendly Allure grouping. The reporter defaults to the Playwright project
// name (chromium, firefox, …) as the top-level suite, which reads poorly.
// These labels override both levels; the reporter's defaults are skipped when
// a test already carries parentSuite/suite labels.
const ALLURE_SUITES: Record<string, [parentSuite: string, suite: string]> = {
  'accessibility.spec.ts': ['Accessibility', 'WCAG scans'],
  'api-mocked.spec.ts': ['API', 'Mocked API'],
  'api.spec.ts': ['API', 'Metrics API'],
  'auth.spec.ts': ['Authentication', 'Sign in'],
  'authed.spec.ts': ['Authentication', 'Signed-in state'],
  'controls.spec.ts': ['UI components', 'Form controls'],
  'dashboard.spec.ts': ['UI components', 'Release dashboard'],
  'datepicker.spec.ts': ['UI components', 'Date picker'],
  'datetime.spec.ts': ['UI components', 'Date and time'],
  'dialogs.spec.ts': ['UI components', 'Dialogs'],
  'download.spec.ts': ['UI components', 'File download'],
  'dragdrop.spec.ts': ['UI components', 'Drag and drop'],
  'failure-showcase.spec.ts': ['Showcase', 'Intentional failures'],
  'forms.spec.ts': ['UI components', 'Feedback form'],
  'iframe.spec.ts': ['UI components', 'IFrame'],
  'integration.spec.ts': ['UI components', 'End-to-end flows'],
  'keyboard.spec.ts': ['Accessibility', 'Keyboard navigation'],
  'offline.spec.ts': ['UI components', 'Offline mode'],
  'performance.spec.ts': ['Performance', 'Timings and budgets'],
  'popup.spec.ts': ['UI components', 'Popup'],
  'search.spec.ts': ['UI components', 'Release search'],
  'security.spec.ts': ['Security', 'Security checks'],
  'shadowdom.spec.ts': ['UI components', 'Shadow DOM'],
  'smoke.spec.ts': ['Smoke', 'Critical paths'],
  'table.spec.ts': ['UI components', 'Releases table'],
  'theme.spec.ts': ['UI components', 'Theme'],
  'toast.spec.ts': ['UI components', 'Toast'],
  'upload.spec.ts': ['UI components', 'File upload'],
  'visual.spec.ts': ['Visual', 'Visual regression'],
  'wizard.spec.ts': ['UI components', 'Release wizard'],
};

test.beforeEach(async ({}, testInfo) => {
  const file = testInfo.titlePath[0] ?? '';
  const [parentSuite, suite] = ALLURE_SUITES[file] ?? ['Other', file];
  await allure.parentSuite(parentSuite);
  await allure.suite(suite);
});
