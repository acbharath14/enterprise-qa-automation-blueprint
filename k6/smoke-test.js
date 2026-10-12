import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: 1 virtual user, 30 seconds.
// Verifies the API works under minimal load before running heavier tests.
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

export default function () {
  const metrics = http.get(`${BASE}/api/metrics`);
  check(metrics, { 'metrics 200': (r) => r.status === 200 });

  const search = http.get(`${BASE}/api/search?q=free`);
  check(search, { 'search 200': (r) => r.status === 200 });

  // Demo credentials (same as the sample app) — the 401 path is already
  // covered by the Playwright auth specs; here we want the happy path so
  // the <1% http_req_failed threshold stays meaningful (k6 counts 4xx as
  // failed requests even when a check explicitly accepts them).
  const login = http.post(
    `${BASE}/api/login`,
    JSON.stringify({ username: 'admin', password: 'secret' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(login, { 'login 200': (r) => r.status === 200 });

  sleep(1);
}
