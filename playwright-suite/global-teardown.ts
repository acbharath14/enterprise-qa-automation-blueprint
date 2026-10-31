import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

declare const __dirname: string;

/**
 * Runs after all tests complete. Dumps run metadata for CI observability.
 *
 * Pairs with global-setup.ts (which materializes the visual baseline
 * before tests). Teardown is the mirror: clean up, summarize, report.
 */
async function globalTeardown() {
  const meta = {
    finishedAt: new Date().toISOString(),
    // CI systems (GitHub Actions, GitLab) set these; locally they're undefined.
    ci: process.env.CI === 'true',
    githubRunId: process.env.GITHUB_RUN_ID,
    gitlabPipelineId: process.env.CI_PIPELINE_ID,
  };
  const outPath = join(__dirname, 'test-results', 'run-meta.json');
  try {
    writeFileSync(outPath, JSON.stringify(meta, null, 2));
    console.log(`[global-teardown] wrote ${outPath}`);
  } catch {
    // test-results/ may not exist if the run failed early — not fatal.
    console.log('[global-teardown] skipped (no test-results dir)');
  }
}

export default globalTeardown;
