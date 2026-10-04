import { test as setup, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

/** Logs in once via the UI; the 'authed' project reuses this saved session. */
setup('authenticate', async ({ page }) => {
  mkdirSync(dirname(authFile), { recursive: true });
  const login = new LoginPage(page);
  await login.goto();
  await login.login('admin', 'secret');
  await expect(login.welcome).toHaveText('Welcome, admin!');
  await page.context().storageState({ path: authFile });
});
