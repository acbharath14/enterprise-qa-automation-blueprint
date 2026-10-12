import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test: push past expected capacity to find the breaking point.
// No pass/fail thresholds — the goal is to observe where degradation starts.
// Watch p95 latency and error rate as VUs climb; note the VU count where
// p95 exceeds 800ms or errors exceed 1%. That is the capacity ceiling.
// Run: k6 run k6/stress-test.js

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

export default function () {
  const metrics = http.get(`${BASE}/api/metrics`);
  check(metrics, { 'metrics 200': (r) => r.status === 200 });

  const search = http.get(`${BASE}/api/search?q=stress`);
  check(search, { 'search completed': (r) => r.status !== 0 });

  sleep(0.5);
}
