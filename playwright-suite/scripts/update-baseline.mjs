import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Re-encodes the visual baseline PNG back to base64 text parts after
 * regenerating it with:
 *   npx playwright test visual.spec.ts --project=chromium --update-snapshots
 *   npm run baseline:update
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const png = join(root, 'tests', 'visual.spec.ts-snapshots', 'dashboard-chromium-linux.png');
const b64 = readFileSync(png).toString('base64');
const CHUNK = 81920;
for (const old of readdirSync(join(root, 'test-data')).filter((f) =>
  f.startsWith('visual-baseline.b64.part'),
)) {
  unlinkSync(join(root, 'test-data', old));
}
let i = 0;
for (let o = 0; o < b64.length; o += CHUNK, i++) {
  writeFileSync(join(root, 'test-data', `visual-baseline.b64.part${i}`), b64.slice(o, o + CHUNK));
}
console.log(`re-encoded ${png} -> ${i} base64 parts`);
