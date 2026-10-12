import http from 'k6/http';
import { check, sleep } from 'k6';

// Load test: ramp to 50 virtual users, hold, ramp down.
// Models expected production traffic and asserts SLO thresholds.
// Run: k6 run k6/load-test.js

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

export default function () {
  // Mixed workload: reads dominate, writes are occasional
  const metrics = http.get(`${BASE}/api/metrics`);
  check(metrics, { 'metrics 200': (r) => r.status === 200 });

  const search = http.get(`${BASE}/api/search?q=loadtest`);
  check(search, { 'search 200': (r) => r.status === 200 });

  // ~20% of iterations also submit feedback
  if (Math.random() < 0.2) {
    const fb = http.post(
      `${BASE}/api/feedback`,
      JSON.stringify({ name: 'k6', email: 'k6@test.dev' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(fb, { 'feedback 200': (r) => r.status === 200 });
  }

  sleep(1);
}
