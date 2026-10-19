import { test, expect } from '../fixtures/test';
import { makeProducts, makeOrder, makeCustomer, createRng } from '../test-data/factory';

/**
 * Proves the test-data factory contract: deterministic for a fixed seed,
 * varied across seeds, and always shaped like the store's real data.
 * No browser needed — these are pure data assertions.
 */
test('factory is deterministic for a fixed seed', async () => {
  expect(makeProducts(25, 42)).toEqual(makeProducts(25, 42));
  expect(createRng(7)()).toBe(createRng(7)());
});

test('different seeds produce different data', async () => {
  expect(makeProducts(25, 42)).not.toEqual(makeProducts(25, 7));
});

test('generated products honor the store data contract', async () => {
  for (const p of makeProducts(100, 1)) {
    expect(p.name).toBeTruthy();
    expect(['electronics', 'apparel', 'home', 'sports']).toContain(p.category);
    expect(p.price).toBeGreaterThan(0);
    expect(p.rating).toBeGreaterThanOrEqual(0);
    expect(p.rating).toBeLessThanOrEqual(5);
    expect(Number.isInteger(p.stock)).toBe(true);
    expect(p.stock).toBeGreaterThanOrEqual(0);
  }
});

test('generated orders balance', async () => {
  for (const o of [makeOrder(createRng(3)), makeOrder(createRng(9))]) {
    const expected = Math.round(o.items.reduce((sum, i) => sum + i.price * i.qty, 0) * 100) / 100;
    expect(o.total).toBe(expected);
    expect(o.status).toBe('confirmed');
  }
});

test('generated customers are submittable', async () => {
  const c = makeCustomer(createRng(3));
  expect(c.name).toBeTruthy();
  expect(c.email).toContain('@');
  expect(c.address).toBeTruthy();
});
