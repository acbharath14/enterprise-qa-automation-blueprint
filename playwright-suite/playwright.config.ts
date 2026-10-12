import { defineConfig, devices } from '@playwright/test';

/**
 * Optional real-device project via BrowserStack Automate.
 *
 * Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY to register the
 * `browserstack` project — without them the project does not exist, so a
 * plain `npx playwright test` never tries to reach BrowserStack.
 *
 * Specs run unchanged; only the browser launch changes: instead of a local
 * browser, Playwright connects over CDP to a real mobile device. Because the
 * device lives in BrowserStack's cloud, it reaches the sample app through
 * the BrowserStack Local tunnel — start the Local binary before running
 * (see README "Real devices").
 */
const bsUser = process.env.BROWSERSTACK_USERNAME;
const bsKey = process.env.BROWSERSTACK_ACCESS_KEY;
const browserstackCaps = {
  'browserstack.username': bsUser,
  'browserstack.accessKey': bsKey,
  // Tunnel the local sample-app server to the device.
  'browserstack.local': 'true',
  device: process.env.BROWSERSTACK_DEVICE ?? 'Samsung Galaxy S23',
  os_version: process.env.BROWSERSTACK_OS_VERSION ?? '13.0',
  real_mobile: true,
  project: 'enterprise-qa-automation-blueprint',
  build: process.env.GITHUB_RUN_ID ?? `local-${new Date().toISOString().slice(0, 10)}`,
  name: 'mobile specs on real device',
};

export default defineConfig({
  testDir: './tests',
  // Materializes the committed visual baseline (stored as base64 text) before tests run.
  globalSetup: './global-setup.ts',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['allure-playwright']]
    : [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'node server.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Authenticates once via the UI; the 'authed' project reuses the session.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
    {
      name: 'tz',
      use: { ...devices['Desktop Chrome'], locale: 'en-NZ', timezoneId: 'Pacific/Auckland' },
    },
    {
      name: 'authed',
      testMatch: /.*authed\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    },
    // Real mobile device via BrowserStack. Only registered when credentials
    // are present — see the comment at the top of this file.
    ...(bsUser && bsKey
      ? [
          {
            name: 'browserstack',
            // Real-device minutes are billed: only mobile-tagged specs run
            // here, no matter how the project is invoked.
            grep: /@mobile/,
            use: {
              connectOptions: {
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                  JSON.stringify(browserstackCaps),
                )}`,
              },
            },
          },
        ]
      : []),
  ],
});
