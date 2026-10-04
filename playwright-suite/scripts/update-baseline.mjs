import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Re-encodes the visual baseline PNG back to base64 text after regenerating
 * it with: npx playwright test visual.spec.ts --project=chromium --update-snapshots
 */
const root = dirname(fileURLToPath(import.meta.url));
const png = join(root, '..', 'tests', 'visual.spec.ts-snapshots', 'dashboard-chromium-linux.png');
const b64 = join(root, '..', 'test-data', 'visual-baseline.b64');
writeFileSync(b64, readFileSync(png).toString('base64'));
console.log(`re-encoded ${png} -> ${b64}`);
