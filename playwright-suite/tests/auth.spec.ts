import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('sign in', () => {
  test('rejects invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('admin', 'wrong');
    await expect(login.error).toHaveText('Invalid credentials.');
    await expect(login.welcome).toBeEmpty();
  });

  test('signs in with valid credentials and stores a token', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('admin', 'secret');
    await expect(login.welcome).toHaveText('Welcome, admin!');
    const token = await page.evaluate(() => localStorage.getItem('qa-demo-token'));
    expect(token).toBe('demo-token');
  });
});
