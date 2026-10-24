import type { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

/**
 * Step-log reporter: adequate console logging for every test, with zero
 * per-test edits. For each test it prints one line per Playwright API call
 * (`pw:api`), assertion (`expect`), and explicit step (`test.step`, which
 * includes BDD Gherkin steps) — what ran, where in the file, how long it
 * took, whether it failed — so the CI job log shows what was validated
 * without opening any report. Fixture and hook steps are skipped: they are
 * setup noise, not validation. Full failure detail stays with the list
 * reporter and the HTML/Allure reports; this reporter only marks failed
 * steps.
 */
function shortPath(file: string): string {
  const marker = 'playwright-suite/';
  const idx = file.indexOf(marker);
  return idx >= 0 ? file.slice(idx + marker.length) : file;
}

class StepLogReporter implements Reporter {
  onTestBegin(test: TestCase): void {
    console.log(`[step-log] START ${test.titlePath().join(' › ')}`);
  }

  // Browser-lifecycle steps are setup noise, not validation.
  private static readonly SKIP_TITLES = new Set([
    'Launch browser',
    'Create context',
    'Create page',
    'Close page',
    'Close context',
    'Close browser',
    'Create request context'
  ]);

  onStepEnd(test: TestCase, _result: TestResult, step: TestStep): void {
    if (step.category !== 'pw:api' && step.category !== 'expect' && step.category !== 'test.step') return;
    if (StepLogReporter.SKIP_TITLES.has(step.title)) return;
    const location = step.location ? ` (${shortPath(step.location.file)}:${step.location.line})` : '';
    const status = step.error ? 'FAIL' : 'ok';
    console.log(`[step-log] [${test.title}] ${status} ${step.category} ${step.title}${location} (${step.duration}ms)`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    console.log(`[step-log] END ${result.status} ${test.titlePath().join(' › ')} (${result.duration}ms)`);
  }
}

export default StepLogReporter;
