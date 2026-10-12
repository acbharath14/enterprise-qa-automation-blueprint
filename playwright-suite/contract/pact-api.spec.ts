import { test, expect } from '../fixtures/test';
import { PactV3, MatchersV3, Verifier } from '@pact-foundation/pact';
import path from 'node:path';

const { like } = MatchersV3;
const pactsDir = path.resolve(__dirname, 'pacts');

const pactFile = path.join(pactsDir, 'sample-app-ui-sample-app-api.json');

function newPact() {
  return new PactV3({
    consumer: 'sample-app-ui',
    provider: 'sample-app-api',
    port: 1235,
    dir: pactsDir,
  });
}

/**
 * Contract tests for the sample-app API endpoints not covered by
 * pact-metrics.spec.ts (which handles GET /api/metrics).
 *
 * Consumer tests define what the UI expects and verify against Pact's mock
 * provider; passing writes the contract to contract/pacts/.
 * Provider tests replay the recorded contract against the real sample app.
 *
 * Run with: npm run test:contract
 */

test('consumer: POST /api/feedback accepts valid feedback @contract', async () => {
  const pact = newPact();
  pact
    .given('feedback endpoint is available')
    .uponReceiving('a valid feedback submission')
    .withRequest({
      method: 'POST',
      path: '/api/feedback',
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'Test User', email: 'test@example.com', message: 'Great app!' },
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like({ ok: true, id: 'fb-123' }),
    });

  await pact.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Great app!',
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.id).toEqual(expect.any(String));
  });
});

test('consumer: POST /api/login returns a token for valid credentials @contract', async () => {
  const pact = newPact();
  pact
    .given('a user account exists')
    .uponReceiving('a login with valid demo credentials')
    .withRequest({
      method: 'POST',
      path: '/api/login',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'admin', password: 'secret' },
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like({ ok: true, token: 'demo-token' }),
    });

  await pact.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'secret' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.token).toEqual(expect.any(String));
  });
});

test('consumer: POST /api/upload echoes the sanitized filename @contract', async () => {
  const pact = newPact();
  const multipartBody =
    '--boundary\r\n' +
    'Content-Disposition: form-data; name="file"; filename="report.csv"\r\n' +
    'Content-Type: text/csv\r\n\r\n' +
    'a,b,c\r\n' +
    '--boundary--';
  pact
    .given('upload endpoint is available')
    .uponReceiving('a file upload with a filename')
    .withRequest({
      method: 'POST',
      path: '/api/upload',
      headers: { 'Content-Type': 'multipart/form-data; boundary=boundary' },
      body: multipartBody,
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like({ ok: true, filename: 'report.csv' }),
    });

  await pact.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=boundary' },
      body: multipartBody,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.filename).toBe('report.csv');
  });
});

test('consumer: GET /api/search filters releases by query @contract', async () => {
  const pact = newPact();
  pact
    .given('releases exist')
    .uponReceiving('a search for "aur"')
    .withRequest({
      method: 'GET',
      path: '/api/search',
      query: { q: 'aur' },
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like(['Aurora']),
    });

  await pact.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/search?q=aur`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toContain('Aurora');
  });
});

test('consumer: GET /api/export returns the releases CSV @contract', async () => {
  const pact = newPact();
  const csv =
    'release,coverage,status\nAurora,82,Green\nBeacon,74,Green\nCipher,61,Amber\nDynamo,93,Green\n';
  pact
    .given('releases exist')
    .uponReceiving('a request for the CSV export')
    .withRequest({ method: 'GET', path: '/api/export' })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'text/csv' },
      body: csv,
    });

  await pact.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/export`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    const text = await res.text();
    expect(text).toContain('release,coverage,status');
    expect(text).toContain('Aurora');
  });
});

test('provider: sample app honors the recorded API contracts @contract', async () => {
  const output = await new Verifier({
    provider: 'sample-app-api',
    providerBaseUrl: 'http://127.0.0.1:4173',
    pactUrls: [pactFile],
  }).verifyProvider();
  expect(output).toBeTruthy();
});
