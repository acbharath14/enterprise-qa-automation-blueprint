#!/usr/bin/env node
/**
 * count-results.mjs — the single source of truth for test counts.
 *
 * Reads merged Allure result JSON (one or more directories, merged exactly
 * once upstream) and prints the summary every surface consumes: the notify
 * email, the quality gate, and the GitHub step summary.
 *
 * The identity rule is written down once, here, and enforced here:
 *   A "test" = unique (testCaseId, Playwright project).
 *   A chromium pass and a firefox fail of the same scenario are different
 *   facts and both count. Retries of the same test+project collapse to the
 *   FINAL attempt, chosen by the result's own `stop` timestamp — NOT the file
 *   mtime (cp -r between directories scrambles mtimes and can resurrect a
 *   stale retry attempt).
 *
 * Why the Project parameter matters: allure-playwright's testCaseId is
 * md5(package-name + file + suite + title) — it does NOT include the
 * Playwright project. The per-project discriminator comes from the result's
 * `parameters` entry named "Project", which allure-playwright always writes.
 *
 * Usage:
 *   node scripts/count-results.mjs <results-dir>... [options]
 *
 * Options:
 *   --exclude-showcase   Drop the failure-showcase results from totals
 *                        (detected via the parentSuite 'Showcase' label set by
 *                        fix-allure-labels.mjs, with a fullName fallback).
 *                        Their count is still reported separately so the email
 *                        can show them as their own labeled line.
 *   --json <file>        Write the summary JSON to <file>.
 *   --dotenv <file>      Write KEY=value lines (for GITHUB_OUTPUT / sourcing).
 *   --smoke-tag <tag>    Also count tests whose name includes <tag>
 *                        (e.g. @smoke) → smokeTotal / smokePassed.
 *
 * Output JSON: { total, passed, failed, skipped, broken, other,
 *                showcase: { total, failed }, smokeTotal, smokePassed }
 * `other` covers statuses outside the big four (canceled, unknown, ...);
 * it IS included in `total` so totals always reconcile with file counts.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const dirs = [];
let excludeShowcase = false;
let jsonOut = null;
let dotenvOut = null;
let smokeTag = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--exclude-showcase') excludeShowcase = true;
  else if (a === '--json') jsonOut = args[++i];
  else if (a === '--dotenv') dotenvOut = args[++i];
  else if (a === '--smoke-tag') smokeTag = args[++i];
  else if (a.startsWith('--')) {
    console.error(`count-results: unknown option ${a}`);
    process.exit(2);
  } else dirs.push(a);
}
if (dirs.length === 0) {
  console.error('count-results: no results directories given');
  process.exit(2);
}

function projectOf(r) {
  const p = (r.parameters ?? []).find((x) => x && x.name === 'Project');
  return p && p.value != null ? String(p.value) : '';
}

function isShowcase(r) {
  if ((r.labels ?? []).some((l) => l && l.name === 'parentSuite' && l.value === 'Showcase')) return true;
  const fn = String(r.fullName ?? '');
  return fn.startsWith('failure-showcase.spec.ts');
}

function identityOf(r) {
  const base = r.testCaseId || r.historyId || `${r.fullName ?? ''}|${r.name ?? ''}`;
  return `${base}${String.fromCharCode(0)}${projectOf(r)}`;
}

// Final attempt wins: largest `stop` (ms epoch, travels with the file through
// cp -r); ties break on largest `start`, then filename for determinism.
function rankOf(r, f) {
  return [Number(r.stop ?? 0), Number(r.start ?? 0), f];
}
function better(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}

const byTest = new Map(); // identity -> { r, rank, f }
let showcaseTotal = 0;
let showcaseFailed = 0;

for (const dir of dirs) {
  if (!existsSync(dir)) {
    console.error(`count-results: directory not found: ${dir}`);
    process.exit(2);
  }
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('-result.json')) continue;
    let r;
    try {
      r = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    } catch (e) {
      console.error(`count-results: skipping unreadable ${f}: ${e.message}`);
      continue;
    }
    if (excludeShowcase && isShowcase(r)) {
      showcaseTotal++;
      if (r.status === 'failed' || r.status === 'broken') showcaseFailed++;
      continue;
    }
    const key = identityOf(r);
    const rank = rankOf(r, f);
    const prev = byTest.get(key);
    if (!prev || better(rank, prev.rank)) byTest.set(key, { r, rank, f });
  }
}

const counts = { passed: 0, failed: 0, skipped: 0, broken: 0, other: 0 };
let smokeTotal = 0;
let smokePassed = 0;
const failedNames = [];
for (const { r } of byTest.values()) {
  const s = r.status;
  if (s === 'passed' || s === 'failed' || s === 'skipped' || s === 'broken') counts[s]++;
  else counts.other++;
  if (smokeTag && (r.name ?? '').includes(smokeTag)) {
    smokeTotal++;
    if (s === 'passed') smokePassed++;
  }
  if (s === 'failed' || s === 'broken') failedNames.push(r.name ?? '(unnamed)');
}

const summary = {
  total: counts.passed + counts.failed + counts.skipped + counts.broken + counts.other,
  passed: counts.passed,
  failed: counts.failed,
  skipped: counts.skipped,
  broken: counts.broken,
  other: counts.other,
  showcase: { total: showcaseTotal, failed: showcaseFailed },
  smokeTotal,
  smokePassed,
};

const json = JSON.stringify(summary, null, 2);
if (jsonOut) writeFileSync(jsonOut, json + '\n');
else console.log(json);

if (dotenvOut) {
  const lines = [
    `TOTAL=${summary.total}`,
    `PASSED=${summary.passed}`,
    `FAILED=${summary.failed}`,
    `SKIPPED=${summary.skipped}`,
    `BROKEN=${summary.broken}`,
    `OTHER=${summary.other}`,
    `SHOWCASE_TOTAL=${summary.showcase.total}`,
    `SHOWCASE_FAILED=${summary.showcase.failed}`,
    `SMOKE_TOTAL=${summary.smokeTotal}`,
    `SMOKE_PASSED=${summary.smokePassed}`,
  ];
  writeFileSync(dotenvOut, lines.join('\n') + '\n');
}
