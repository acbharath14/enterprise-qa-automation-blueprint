import { test, expect } from '../fixtures/test';

test.describe('sign in', () => {
  test('rejects invalid credentials', async ({ loginPage }) => {
    await loginPage.login('admin', 'wrong');
    await expect(loginPage.error).toHaveText('Invalid credentials');
  });

  test('signs in with valid credentials', async ({ loginPage }) => {
    await loginPage.login('admin', 'secret');
    await expect(loginPage.logoutButton).toBeVisible();
    await expect(loginPage.userLabel).toContainText('admin');
  });
});
