import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

declare const __dirname: string;

/**
 * Materializes the committed visual baseline before any test runs.
 *
 * The baseline PNG is versioned as base64 text (test-data/visual-baseline.b64.partN)
 * because binary files can't be committed through every workflow; decoding it
 * here keeps `npm test` working on a fresh clone with no manual steps.
 * The decode always overwrites, so a stale local PNG can never mask a
 * regression.
 *
 * When no baseline parts are committed (e.g. right after the sample app was
 * re-themed), this is a no-op and visual.spec.ts skips itself — capture a
 * fresh baseline on a machine with browsers via:
 *   npx playwright test visual --project=chromium --update-snapshots
 *   npm run baseline:update
 */
export default async function globalSetup() {
  const dataDir = join(__dirname, 'test-data');
  const parts = readdirSync(dataDir)
    .filter((f) => f.startsWith('visual-baseline.b64.part'))
    .sort();
  if (parts.length === 0) {
    console.log('visual baseline: no committed parts — visual.spec.ts will skip');
    return;
  }
  const b64 = parts.map((p) => readFileSync(join(dataDir, p), 'utf8')).join('').trim();
  const dir = join(__dirname, 'tests', 'visual.spec.ts-snapshots');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'storefront-chromium-linux.png'), Buffer.from(b64, 'base64'));
  console.log(`visual baseline materialized from ${parts.length} base64 parts`);
}
