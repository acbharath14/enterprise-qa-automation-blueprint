import { test, expect } from '../fixtures/test';
import { makeReleases, makeFeedback, createRng } from '../test-data/factory';

/**
 * Proves the test-data factory contract: deterministic for a fixed seed,
 * varied across seeds, and always shaped like the app's real data.
 * No browser needed — these are pure data assertions.
 */
test('factory is deterministic for a fixed seed', async () => {
  expect(makeReleases(25, 42)).toEqual(makeReleases(25, 42));
  expect(createRng(7)()).toBe(createRng(7)());
});

test('different seeds produce different data', async () => {
  expect(makeReleases(25, 42)).not.toEqual(makeReleases(25, 7));
});

test('generated releases honor the app data contract', async () => {
  for (const r of makeReleases(100, 1)) {
    expect(r.name).toBeTruthy();
    expect(r.coverage).toBeGreaterThanOrEqual(0);
    expect(r.coverage).toBeLessThanOrEqual(100);
    expect(['Green', 'Amber', 'Red']).toContain(r.status);
  }
});

test('generated feedback is submittable', async () => {
  const fb = makeFeedback(createRng(3));
  expect(fb.name).toBeTruthy();
  expect(fb.email).toContain('@');
});
