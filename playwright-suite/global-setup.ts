import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

declare const __dirname: string;

/**
 * Materializes the committed visual baseline before any test runs.
 *
 * The baseline PNG is versioned as base64 text (test-data/visual-baseline.b64)
 * because binary files can't be committed through every workflow; decoding it
 * here keeps `npm test` working on a fresh clone with no manual steps.
 * The decode always overwrites, so a stale local PNG can never mask a
 * regression.
 */
export default async function globalSetup() {
  const b64 = readFileSync(join(__dirname, 'test-data', 'visual-baseline.b64'), 'utf8').trim();
  const dir = join(__dirname, 'tests', 'visual.spec.ts-snapshots');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'dashboard-chromium-linux.png'), Buffer.from(b64, 'base64'));
  console.log('visual baseline materialized from test-data/visual-baseline.b64');
}
