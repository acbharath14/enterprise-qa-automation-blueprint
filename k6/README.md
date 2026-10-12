# k6 Load Testing

API load, stress, and smoke tests for the blueprint's sample app, using [k6](https://k6.io).

## The three tests

| File | Purpose | When to run |
|---|---|---|
| `smoke-test.js` | 1 VU, 30s — verifies the API works at all | Before every heavier run; in CI |
| `load-test.js` | Ramp to 50 VUs over 5 min with SLO thresholds | Before releases; nightly |
| `stress-test.js` | Ramp to 300 VUs to find the breaking point | Capacity planning; after infra changes |

## Quickstart

```bash
# Install k6: https://k6.io/docs/get-started/installation/

# 1. Start the sample app
cd playwright-suite && node server.mjs &

# 2. Smoke test (should pass in ~30s)
k6 run k6/smoke-test.js

# 3. Load test (~5 min)
k6 run k6/load-test.js

# 4. Stress test (~9 min) — watch for the breaking point
k6 run k6/stress-test.js

# Against a different environment:
BASE_URL=https://staging.example.com k6 run k6/load-test.js
```

## Reading the results

k6 prints a summary when the run finishes. The two numbers that matter:

- **`http_req_duration p(95)`** — 95th percentile response time. The load test fails if this exceeds 800ms (the SLO).
- **`http_req_failed`** — error rate. The load test fails if this exceeds 1%.

**Smoke test** — binary: passes or fails. If it fails, don't bother with the heavier tests; something is broken.

**Load test** — validates the SLOs under expected traffic. Threshold breaches mean the app can't handle its target load. Check the per-endpoint breakdown (`http_req_duration` by URL) to find the slow endpoint.

**Stress test** — has no thresholds on purpose. Watch the output as VUs climb and note:
- At what VU count does p95 cross 800ms? → latency ceiling
- At what VU count do errors appear? → capacity ceiling
- Does the app recover when load ramps down? → resilience

## Thresholds

Aligned with the quality-gates repo (`THRESHOLDS` in `scripts/evaluate_gates.py`):

| Metric | Threshold |
|---|---|
| p95 latency | < 800ms |
| Error rate | < 1% |
| p99 latency (load test) | < 1500ms |

## CI

The smoke test runs in CI on every push (see `.github/workflows/`). Load and stress tests are too long for per-push CI — run them nightly or before releases.
