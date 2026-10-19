import http from 'k6/http';
import { check, sleep } from 'k6';

// Load test: ramp to 50 virtual users, hold, ramp down.
// Models expected production traffic and asserts SLO thresholds.
//
// The demo cart is shared server-side, so every VU adds its own dedicated
// product (created in setup() with ample stock) — no cross-VU interference
// on cart lines, and teardown() removes the products (which also drops
// their cart lines). Run: k6 run k6/load-test.js

const BASE = __ENV.BASE_URL || 'http://localhost:4173';

export const options = {
  stages: [
    { duration: '1m', target: 10 },  // warm up
    { duration: '3m', target: 50 },  // sustained load
    { duration: '1m', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
  },
};

const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

export function setup() {
  const res = http.post(
    `${BASE}/api/products`,
    JSON.stringify({ name: 'k6 Load Product', price: 10, category: 'test', stock: 1000000 }),
    JSON_HEADERS
  );
  if (res.status !== 201) {
    throw new Error(`setup failed: could not create load-test product (status ${res.status})`);
  }
  return { productId: res.json().id };
}

export function teardown(data) {
  http.del(`${BASE}/api/products/${data.productId}`);
}

export default function (data) {
  // Mixed workload: reads dominate, cart writes are occasional
  const products = http.get(`${BASE}/api/products?category=electronics`);
  check(products, { 'products 200': (r) => r.status === 200 });

  const search = http.get(`${BASE}/api/products?q=k6load`);
  check(search, { 'search 200': (r) => r.status === 200 });

  const byId = http.get(`${BASE}/api/products/prod-1`);
  check(byId, { 'product by id 200': (r) => r.status === 200 });

  // ~20% of iterations also add to the cart (own product: no interference)
  if (Math.random() < 0.2) {
    const cart = http.post(
      `${BASE}/api/cart/items`,
      JSON.stringify({ productId: data.productId, qty: 1 }),
      JSON_HEADERS
    );
    check(cart, { 'cart add 200': (r) => r.status === 200 });
  }

  sleep(1);
}
