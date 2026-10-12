import { defineConfig, devices } from '@playwright/test';

/**
 * Optional real-device project via BrowserStack Automate.
 *
 * Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY to register the
 * `browserstack` project — without them the project does not exist, so a
 * plain `npx playwright test` never tries to reach BrowserStack.
 *
 * Real-device constraints (verified against BrowserStack's Playwright
 * behavior — get these wrong and the CDP handshake returns no browser,
 * surfacing as Playwright's "Malformed endpoint" error):
 * - Real iOS works with `webkit.connect()` and flat caps
 *   (`browser: 'safari'` + `realMobile: 'true'` + `deviceName` +
 *   `osVersion`). The iPhone device descriptor below selects the WebKit
 *   client via `defaultBrowserType`, so this fits Playwright's config
 *   `connectOptions` model — specs run unchanged.
 * - Default device is BrowserStack docs' verbatim example
 *   ('iPhone 15 Pro Max', iOS 17) — device allocation is the one thing
 *   BrowserStack decides server-side, so stay on their tested path.
 * - Real Android needs Playwright's experimental `_android` API, which can't
 *   be expressed in config `connectOptions`; Android real devices are out of
 *   scope for this project.
 * - Caps use BrowserStack's flat Playwright style — NOT the Selenium/Appium
 *   `bstack:options` nesting, and NOT snake_case (`deviceName`, not `device`).
 *
 * The device reaches the sample app through the BrowserStack Local tunnel —
 * start the Local binary before running (see README "Real devices").
 */
const bsUser = process.env.BROWSERSTACK_USERNAME;
const bsKey = process.env.BROWSERSTACK_ACCESS_KEY;
const browserstackCaps = {
  'browserstack.username': bsUser,
  'browserstack.accessKey': bsKey,
  // Tunnel the local sample-app server to the device.
  'browserstack.local': 'true',
  browser: 'safari',
  realMobile: 'true',
  deviceName: process.env.BROWSERSTACK_DEVICE ?? 'iPhone 15 Pro Max',
  osVersion: process.env.BROWSERSTACK_OS_VERSION ?? '17',
  project: 'enterprise-qa-automation-blueprint',
  build: process.env.GITHUB_RUN_ID ?? `local-${new Date().toISOString().slice(0, 10)}`,
  name: 'mobile specs on real device',
};

// Mobile-only specs are meaningless at desktop widths. Desktop projects filter
// this file out here so the tests never get collected there — a per-test
// test.skip() in a beforeEach would render as a "beforeEach hook failed"
// exception on every skipped test in Allure.
const ignoreMobileSpecs = { testIgnore: /mobile\.spec\.ts/ };

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
    { name: 'chromium', ...ignoreMobileSpecs, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', ...ignoreMobileSpecs, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', ...ignoreMobileSpecs, use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'dark', ...ignoreMobileSpecs, use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
    {
      name: 'tz',
      ...ignoreMobileSpecs,
      use: { ...devices['Desktop Chrome'], locale: 'en-NZ', timezoneId: 'Pacific/Auckland' },
    },
    {
      name: 'authed',
      testMatch: /.*authed\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    },
    // Real iPhone via BrowserStack. Only registered when credentials are
    // present — see the comment at the top of this file.
    ...(bsUser && bsKey
      ? [
          {
            name: 'browserstack',
            // Real-device minutes are billed: only mobile-tagged specs run
            // here, no matter how the project is invoked.
            grep: /@mobile/,
            // Device allocation over the network is slower than a local
            // launch; give the session room to start.
            timeout: 60_000,
            use: {
              // The iPhone descriptor selects the WebKit client via
              // `defaultBrowserType`; `connectOptions` then attaches it to
              // the real device over CDP instead of launching locally.
              // Descriptor matches the caps device (iPhone 15 Pro Max).
              ...devices['iPhone 15 Pro Max'],
              // iOS resolves localhost/127.0.0.1 on the device itself — the
              // request never reaches the Local tunnel. bs-local.com resolves
              // via the tunnel to this machine instead. (BrowserStack support:
              // "Why is my localhost URL redirected to bs-local.com on
              // iOS/iPadOS devices?")
              baseURL: 'http://bs-local.com:4173',
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
