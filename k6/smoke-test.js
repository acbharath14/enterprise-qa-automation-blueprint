import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: 1 virtual user, 30 seconds.
// Verifies the store API works under minimal load before running heavier tests.
// Exercises the critical path: browse -> add to cart -> checkout.
// Each iteration places an order, which clears the cart, so iterations are
// self-contained and never hit stock limits.
// Run: k6 run k6/smoke-test.js
//   (set BASE_URL env var if the app isn't on localhost:4173)

const BASE = __ENV.BASE_URL || 'http://localhost:4173';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],   // <1% errors
    http_req_duration: ['p(95)<800'],  // p95 under 800ms
  },
};

const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

export default function () {
  const products = http.get(`${BASE}/api/products?q=headphones&category=electronics`);
  check(products, { 'products 200': (r) => r.status === 200 });

  // Demo credentials (same as the sample app) — the 401 path is already
  // covered by the Playwright auth specs; here we want the happy path so
  // the <1% http_req_failed threshold stays meaningful (k6 counts 4xx as
  // failed requests even when a check explicitly accepts them).
  const login = http.post(
    `${BASE}/api/login`,
    JSON.stringify({ username: 'admin', password: 'secret' }),
    JSON_HEADERS
  );
  check(login, { 'login 200': (r) => r.status === 200 });

  const cart = http.post(
    `${BASE}/api/cart/items`,
    JSON.stringify({ productId: 'prod-1', qty: 1 }),
    JSON_HEADERS
  );
  check(cart, { 'cart add 200': (r) => r.status === 200 });

  const order = http.post(
    `${BASE}/api/orders`,
    JSON.stringify({
      name: 'k6',
      email: 'k6@test.dev',
      address: '1 Test St',
      payment: { cardLast4: '4242' },
    }),
    JSON_HEADERS
  );
  check(order, { 'order 201': (r) => r.status === 201 });

  sleep(1);
}
