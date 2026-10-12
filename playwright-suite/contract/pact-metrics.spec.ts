import { test, expect } from '../fixtures/test';
import { PactV3, MatchersV3, Verifier } from '@pact-foundation/pact';
import path from 'node:path';

const { like } = MatchersV3;
const pactsDir = path.resolve(__dirname, 'pacts');

/**
 * Contract tests for GET /api/metrics, using Pact.
 *
 * Consumer test: defines what the release-dashboard UI expects from the
 * metrics endpoint and verifies that expectation against Pact's mock
 * provider. Passing writes the contract to contract/pacts/.
 *
 * Provider test: replays the recorded contract against the real sample app
 * and fails if the app no longer honors it.
 *
 * Run with: npm run test:contract
 */
test('consumer: GET /api/metrics returns the dashboard metrics @contract', async () => {
  const provider = new PactV3({
    consumer: 'release-dashboard-ui',
    provider: 'sample-app-api',
    port: 1234,
    dir: pactsDir,
  });

  provider
    .given('metrics are available')
    .uponReceiving('a request for dashboard metrics')
    .withRequest({ method: 'GET', path: '/api/metrics' })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like({
        coverage: 82,
        apiHealth: 'Green',
        p95LatencyMs: 640,
      }),
    });

  await provider.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/metrics`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.coverage).toEqual(expect.any(Number));
    expect(body.apiHealth).toEqual(expect.any(String));
    expect(body.p95LatencyMs).toEqual(expect.any(Number));
  });
});

test('provider: sample app honors the recorded /api/metrics contract @contract', async () => {
  const output = await new Verifier({
    provider: 'sample-app-api',
    providerBaseUrl: 'http://127.0.0.1:4173',
    pactUrls: [path.join(pactsDir, 'release-dashboard-ui-sample-app-api.json')],
  }).verifyProvider();
  expect(output).toBeTruthy();
});
