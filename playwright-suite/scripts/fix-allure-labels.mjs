// Rewrites parentSuite/suite labels in Allure results to friendly names.
//
// Why a script instead of allure.parentSuite() in a beforeEach:
// the allure-playwright runtime API is unreliable when several spec files run
// in one invocation — labels silently go missing for some files. Rewriting the
// result JSON after the run is deterministic.
//
// Usage: node scripts/fix-allure-labels.mjs [results-dir]
// Defaults to ./allure-results. Safe to run on a directory with no results.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// parentSuite = test area, suite = spec focus. Keys are spec file names.
const SUITES = {
  'accessibility.spec.ts': ['Accessibility', 'WCAG scans'],
  'api-mocked.spec.ts': ['API', 'Mocked API'],
  'api.spec.ts': ['API', 'Metrics API'],
  'auth.spec.ts': ['Authentication', 'Sign in'],
  'authed.spec.ts': ['Authentication', 'Signed-in state'],
  'controls.spec.ts': ['UI components', 'Form controls'],
  'dashboard.spec.ts': ['UI components', 'Release dashboard'],
  'datepicker.spec.ts': ['UI components', 'Date picker'],
  'datetime.spec.ts': ['UI components', 'Date and time'],
  'dialogs.spec.ts': ['UI components', 'Dialogs'],
  'download.spec.ts': ['UI components', 'File download'],
  'dragdrop.spec.ts': ['UI components', 'Drag and drop'],
  'failure-showcase.spec.ts': ['Showcase', 'Intentional failures'],
  'forms.spec.ts': ['UI components', 'Feedback form'],
  'iframe.spec.ts': ['UI components', 'IFrame'],
  'integration.spec.ts': ['UI components', 'End-to-end flows'],
  'keyboard.spec.ts': ['Accessibility', 'Keyboard navigation'],
  'offline.spec.ts': ['UI components', 'Offline mode'],
  'performance.spec.ts': ['Performance', 'Timings and budgets'],
  'popup.spec.ts': ['UI components', 'Popup'],
  'search.spec.ts': ['UI components', 'Release search'],
  'security.spec.ts': ['Security', 'Security checks'],
  'shadowdom.spec.ts': ['UI components', 'Shadow DOM'],
  'smoke.spec.ts': ['Smoke', 'Critical paths'],
  'table.spec.ts': ['UI components', 'Releases table'],
  'theme.spec.ts': ['UI components', 'Theme'],
  'toast.spec.ts': ['UI components', 'Toast'],
  'upload.spec.ts': ['UI components', 'File upload'],
  'visual.spec.ts': ['Visual', 'Visual regression'],
  'wizard.spec.ts': ['UI components', 'Release wizard'],
};

const dir = process.argv[2] ?? 'allure-results';
if (!existsSync(dir)) {
  console.log(`fix-allure-labels: ${dir} does not exist, nothing to do`);
  process.exit(0);
}

let fixed = 0;
for (const f of readdirSync(dir)) {
  if (!f.endsWith('-result.json')) continue;
  const p = join(dir, f);
  const result = JSON.parse(readFileSync(p, 'utf8'));
  // fullName looks like "smoke.spec.ts › describe › test name"
  const file = String(result.fullName ?? '').split(' › ')[0];
  const [parentSuite, suite] = SUITES[file] ?? ['Other', file || 'unknown'];
  let changed = false;
  for (const label of result.labels ?? []) {
    if (label.name === 'parentSuite' && label.value !== parentSuite) {
      label.value = parentSuite;
      changed = true;
    } else if (label.name === 'suite' && label.value !== suite) {
      label.value = suite;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(p, JSON.stringify(result));
    fixed++;
  }
}
console.log(`fix-allure-labels: rewrote suite labels in ${fixed} result(s) under ${dir}`);
