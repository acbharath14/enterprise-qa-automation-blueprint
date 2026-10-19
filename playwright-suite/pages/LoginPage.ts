import { Page, Locator } from '@playwright/test';

/** Page Object for the DemoMart sign-in view. */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly error: Locator;
  readonly userLabel: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('login-username');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
    this.userLabel = page.getByTestId('user-label');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByTestId('login-button').click();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
