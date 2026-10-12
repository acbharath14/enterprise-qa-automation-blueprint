#!/usr/bin/env node
/**
 * Quality gate: reads Allure result JSON files and renders a GO / NO-GO
 * release signal.
 *
 * Usage: node scripts/quality-gate.mjs <results-dir>
 *
 * The results dir should contain the merged allure-results from the test
 * shards (NOT the failure-showcase results — those two failures are
 * intentional and must not trip the gate).
 *
 * Exit code: 0 on GO, 1 on NO-GO.
 * Writes a markdown summary to stdout and appends it to $GITHUB_STEP_SUMMARY
 * when set (so the verdict is visible on the workflow run page).
 */
import { readdirSync, readFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'allure-results';

function fail(msg) {
  const md = `## Release signal: NO-GO\n\n${msg}\n`;
  process.stdout.write(md);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  process.exit(1);
}

if (!existsSync(dir)) fail(`Results directory not found: ${dir}`);

const counts = { passed: 0, failed: 0, skipped: 0, broken: 0 };
let smokeTotal = 0;
let smokePassed = 0;
const failures = [];

for (const f of readdirSync(dir)) {
  if (!f.endsWith('-result.json')) continue;
  const r = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  if (counts[r.status] === undefined) continue;
  counts[r.status]++;
  if ((r.name ?? '').includes('@smoke')) {
    smokeTotal++;
    if (r.status === 'passed') smokePassed++;
  }
  if (r.status === 'failed' || r.status === 'broken') failures.push(r.name ?? f);
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
if (total === 0) fail(`No test results found in ${dir} — nothing ran, cannot signal GO.`);

const go = counts.failed === 0 && counts.broken === 0;
const lines = [
  `## Release signal: ${go ? 'GO' : 'NO-GO'}`,
  '',
  '| Total | Passed | Failed | Broken | Skipped |',
  '| --- | --- | --- | --- | --- |',
  `| ${total} | ${counts.passed} | ${counts.failed} | ${counts.broken} | ${counts.skipped} |`,
  '',
  `Smoke signal: ${smokePassed}/${smokeTotal} @smoke tests passed.`,
];
if (!go) {
  lines.push('', '### Failing tests', '');
  for (const n of failures.slice(0, 20)) lines.push(`- ${n}`);
  if (failures.length > 20) lines.push(`- …and ${failures.length - 20} more`);
}
const md = lines.join('\n') + '\n';
process.stdout.write(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
process.exit(go ? 0 : 1);
