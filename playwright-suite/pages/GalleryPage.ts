import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the component-gallery sections of the sample app.
 * Selectors live here — specs describe behavior, never CSS.
 */
export class GalleryPage {
  readonly page: Page;
  // Feedback form
  readonly feedbackHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly ratingSelect: Locator;
  readonly messageInput: Locator;
  readonly subscribeCheckbox: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly feedbackSuccess: Locator;
  readonly feedbackSubmit: Locator;
  // Releases table + modal
  readonly coverageHeader: Locator;
  readonly releaseRows: Locator;
  readonly deleteButton: Locator;
  readonly deleteResult: Locator;
  // Upload
  readonly uploadInput: Locator;
  readonly uploadResult: Locator;
  readonly uploadSubmit: Locator;
  // Tabs
  readonly detailsTab: Locator;
  readonly detailsPanel: Locator;
  // Theme
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.feedbackHeading = page.getByRole('heading', { name: 'Feedback Form' });
    this.nameInput = page.getByLabel('Name', { exact: true });
    this.emailInput = page.getByLabel('Email', { exact: true });
    this.ratingSelect = page.getByLabel('Rating');
    this.messageInput = page.getByLabel('Message');
    this.subscribeCheckbox = page.getByLabel('Email me about this release');
    this.nameError = page.locator('#fb-name-error');
    this.emailError = page.locator('#fb-email-error');
    this.feedbackSuccess = page.locator('#fb-success');
    this.feedbackSubmit = page.getByRole('button', { name: 'Send feedback' });
    this.coverageHeader = page.getByRole('button', { name: 'Coverage' });
    this.releaseRows = page.locator('#releases-body tr');
    this.deleteButton = page.getByRole('button', { name: 'Delete release' });
    this.deleteResult = page.locator('#delete-result');
    this.uploadInput = page.locator('#upload-input');
    this.uploadResult = page.locator('#upload-result');
    this.uploadSubmit = page.getByRole('button', { name: 'Upload' });
    this.detailsTab = page.getByRole('tab', { name: 'Details' });
    this.detailsPanel = page.locator('#panel-details');
    this.themeToggle = page.getByRole('button', { name: 'Toggle theme' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async submitFeedback(fields: {
    name: string;
    email: string;
    rating?: string;
    message?: string;
    subscribe?: boolean;
  }) {
    await this.nameInput.fill(fields.name);
    await this.emailInput.fill(fields.email);
    if (fields.rating) await this.ratingSelect.selectOption(fields.rating);
    if (fields.message) await this.messageInput.fill(fields.message);
    if (fields.subscribe) await this.subscribeCheckbox.check();
    await this.feedbackSubmit.click();
  }

  /** Text of the coverage cell in the n-th table row (0-based). */
  async coverageCellText(row: number) {
    return this.releaseRows.nth(row).locator('td').nth(1).innerText();
  }
}
