import { defineConfig } from '@playwright/test';

/**
 * Standalone config for Pact contract tests. Kept separate from the main
 * config so contract tests don't get sharded across browser projects —
 * they exercise HTTP APIs (Pact mock + real app), not browsers.
 *
 * Run with: npm run test:contract
 */
export default defineConfig({
  testDir: './contract',
  timeout: 60_000,
  reporter: process.env.CI ? [['list'], ['allure-playwright']] : [['list']],
  webServer: {
    command: 'node server.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
  },
});
