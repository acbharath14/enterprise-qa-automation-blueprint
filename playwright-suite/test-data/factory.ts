/**
 * Seedable test-data factory for data-driven suites.
 *
 * Generates realistic releases, feedback submissions, and metrics payloads
 * matching the sample app's data shapes. Every generator accepts a seed —
 * the same seed produces the same data on every run (deterministic CI),
 * while a different seed gives variety for exploratory runs.
 *
 * Usage:
 *   import { makeReleases } from '../test-data/factory';
 *   const releases = makeReleases(25, 42); // 25 releases, fixed seed
 */

export interface Release {
  name: string;
  coverage: number;
  status: 'Green' | 'Amber' | 'Red';
}

export interface Feedback {
  name: string;
  email: string;
  message: string;
}

export interface Metrics {
  coverage: number;
  apiHealth: string;
  p95LatencyMs: number;
}

/**
 * mulberry32 — a tiny seedable PRNG. Same seed => same sequence, every run,
 * on every platform. Not for crypto, just for deterministic test data.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RELEASE_NAMES = [
  'Aurora', 'Beacon', 'Cipher', 'Dynamo', 'Ember', 'Flux', 'Granite', 'Harbor',
  'Ion', 'Juniper', 'Krypton', 'Lumen', 'Mesa', 'Nimbus', 'Onyx', 'Prism',
  'Quartz', 'Ridge', 'Sable', 'Tundra', 'Umbra', 'Vega', 'Willow', 'Xenon',
  'Yonder', 'Zephyr',
];

// Weighted toward Green, mirroring a healthy dashboard.
const STATUSES: Release['status'][] = ['Green', 'Green', 'Green', 'Green', 'Amber', 'Amber', 'Red'];

const FIRST = ['Ada', 'Bharath', 'Maya', 'Leo', 'Nina', 'Omar', 'Priya', 'Ravi'];
const LAST = ['Sharma', 'Iyer', 'Chen', 'Garcia', 'Khan', 'Novak', 'Patel', 'Rao'];

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function int(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function makeRelease(
  rng: () => number = Math.random,
  overrides: Partial<Release> = {},
): Release {
  return {
    name: pick(rng, RELEASE_NAMES),
    coverage: int(rng, 40, 99),
    status: pick(rng, STATUSES),
    ...overrides,
  };
}

/** Deterministic batch: makeReleases(n, seed) is identical on every run. */
export function makeReleases(count: number, seed = 42): Release[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => makeRelease(rng));
}

export function makeFeedback(
  rng: () => number = Math.random,
  overrides: Partial<Feedback> = {},
): Feedback {
  const first = pick(rng, FIRST);
  const last = pick(rng, LAST);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    message: `Feedback message ${int(rng, 1000, 9999)}: the dashboard looks good.`,
    ...overrides,
  };
}

export function makeMetrics(
  rng: () => number = Math.random,
  overrides: Partial<Metrics> = {},
): Metrics {
  return {
    coverage: int(rng, 40, 99),
    apiHealth: pick(rng, ['Green', 'Green', 'Green', 'Amber']),
    p95LatencyMs: int(rng, 200, 1200),
    ...overrides,
  };
}
