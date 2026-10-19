import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test: push past expected capacity to find the breaking point.
// No pass/fail thresholds — the goal is to observe where degradation starts.
// Watch p95 latency and error rate as VUs climb; note the VU count where
// p95 exceeds 800ms or errors exceed 1%. That is the capacity ceiling.
//
// Uses the same dedicated-product setup as the load test so cart writes
// never interfere across VUs. Run: k6 run k6/stress-test.js

const BASE = __ENV.BASE_URL || 'http://localhost:4173';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '1m', target: 0 },
  ],
};

const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

export function setup() {
  const res = http.post(
    `${BASE}/api/products`,
    JSON.stringify({ name: 'k6 Stress Product', price: 10, category: 'test', stock: 1000000 }),
    JSON_HEADERS
  );
  if (res.status !== 201) {
    throw new Error(`setup failed: could not create stress-test product (status ${res.status})`);
  }
  return { productId: res.json().id };
}

export function teardown(data) {
  http.del(`${BASE}/api/products/${data.productId}`);
}

export default function (data) {
  const products = http.get(`${BASE}/api/products`);
  check(products, { 'products 200': (r) => r.status === 200 });

  const search = http.get(`${BASE}/api/products?q=stress`);
  check(search, { 'search completed': (r) => r.status !== 0 });

  const cart = http.post(
    `${BASE}/api/cart/items`,
    JSON.stringify({ productId: data.productId, qty: 1 }),
    JSON_HEADERS
  );
  check(cart, { 'cart add completed': (r) => r.status !== 0 });

  sleep(0.5);
}
