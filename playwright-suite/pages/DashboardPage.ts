import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the release-health sample app dashboard.
 * All selectors live here — specs describe behavior, never CSS.
 */
export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly status: Locator;
  readonly refreshButton: Locator;
  readonly coverageMetric: Locator;
  readonly apiHealthMetric: Locator;
  readonly perfMetric: Locator;
  readonly loadMetricsButton: Locator;
  readonly liveMetrics: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Enterprise QA Automation Blueprint' });
    this.status = page.locator('#status');
    this.refreshButton = page.getByRole('button', { name: 'Refresh health snapshot' });
    this.coverageMetric = page.locator('#coverage');
    this.apiHealthMetric = page.locator('#api');
    this.perfMetric = page.locator('#perf');
    this.loadMetricsButton = page.getByRole('button', { name: 'Load live metrics' });
    this.liveMetrics = page.locator('#live-metrics');
  }

  async goto() {
    await this.page.goto('/');
  }

  async refreshSnapshot() {
    await this.refreshButton.click();
  }

  async loadLiveMetrics() {
    await this.loadMetricsButton.click();
  }
}
