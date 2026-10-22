import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import baseConfig from './playwright.config';

// BDD suite config — deliberately separate from playwright.config.ts.
// The main config always runs ./tests; this one runs the Gherkin suite
// (features/ -> .features-gen/) and inherits everything else (projects,
// webServer, reporters, globalSetup) from the main config, so the two
// suites can never drift apart in setup. Enabling/disabling BDD in CI is
// a CI-job decision, never a testDir flip in the shared config.
const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['features/steps/fixtures.ts', 'features/steps/steps.ts'],
  importTestFrom: 'features/steps/fixtures.ts',
});

export default defineConfig({
  ...baseConfig,
  testDir,
});
