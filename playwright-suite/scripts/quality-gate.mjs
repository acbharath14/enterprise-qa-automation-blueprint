#!/usr/bin/env node
/**
 * Quality gate: renders a GO / NO-GO release signal from the shared counter.
 *
 * Usage: node scripts/quality-gate.mjs <results-dir>...
 *
 * The counting (dedup, retry resolution, identity rule) lives in
 * scripts/count-results.mjs — the same counter the notify email uses, so the
 * gate and the email can never disagree. The failure-showcase results are
 * excluded here (those two failures are intentional and must not trip the
 * gate); the email shows them as their own labeled line.
 *
 * Exit code: 0 on GO, 1 on NO-GO.
 * Writes a markdown summary to stdout and appends it to $GITHUB_STEP_SUMMARY
 * when set (so the verdict is visible on the workflow run page).
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dirs = process.argv.slice(2);
const here = dirname(fileURLToPath(import.meta.url));

function fail(msg) {
  const md = `## Release signal: NO-GO\n\n${msg}\n`;
  process.stdout.write(md);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  process.exit(1);
}

if (dirs.length === 0) fail('No results directories given.');

let summary;
try {
  const out = execFileSync(
    process.execPath,
    [join(here, 'count-results.mjs'), ...dirs, '--exclude-showcase', '--smoke-tag', '@smoke'],
    { encoding: 'utf8' }
  );
  summary = JSON.parse(out);
} catch (e) {
  fail(`Could not count results: ${e.message}`);
}

if (summary.total === 0) fail('No test results found — nothing ran, cannot signal GO.');

const go = summary.failed === 0 && summary.broken === 0;
const lines = [
  `## Release signal: ${go ? 'GO' : 'NO-GO'}`,
  '',
  '| Total | Passed | Failed | Broken | Skipped | Other |',
  '| --- | --- | --- | --- | --- | --- |',
  `| ${summary.total} | ${summary.passed} | ${summary.failed} | ${summary.broken} | ${summary.skipped} | ${summary.other} |`,
  '',
  `Smoke signal: ${summary.smokePassed}/${summary.smokeTotal} @smoke tests passed.`,
  '',
  '_Counts from scripts/count-results.mjs — the same counter behind the notify email._',
];
const md = lines.join('\n') + '\n';
process.stdout.write(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
process.exit(go ? 0 : 1);
