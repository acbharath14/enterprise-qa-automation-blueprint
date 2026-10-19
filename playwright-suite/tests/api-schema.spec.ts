import { test, expect } from '../fixtures/test';
import { validateResponse } from '../test-data/schema-validator';

/**
 * OpenAPI schema validation for the sample app's JSON API.
 *
 * api.spec.ts pins behavior (status codes, value sanity, the committed
 * snapshot) and contract/ pins the Pact consumer<->provider agreement. These
 * specs pin every JSON response against the committed OpenAPI document
 * (test-data/openapi.sample.json): field names, types, required fields,
 * value ranges. If the API drifts from its documentation, this is the spec
 * that goes red first.
 */
test.describe('API schema validation', () => {
  test('GET /api/metrics matches the OpenAPI schema', async ({ request }) => {
    const res = await request.get('/api/metrics');
    const result = validateResponse({
      method: 'GET',
      path: '/api/metrics',
      status: res.status(),
      body: await res.json(),
    });
    expect(result.errors, 'schema violations').toEqual([]);
    expect(result.valid).toBe(true);
  });

  test('POST /api/feedback 200 and 400 payloads match their schemas', async ({ request }) => {
    const ok = await request.post('/api/feedback', {
      data: { name: 'Ada', email: 'ada@example.com' },
    });
    expect(ok.status()).toBe(200);
    const okResult = validateResponse({
      method: 'POST',
      path: '/api/feedback',
      status: ok.status(),
      body: await ok.json(),
    });
    expect(okResult.errors, 'schema violations').toEqual([]);

    const bad = await request.post('/api/feedback', {
      data: { name: 'Ada', email: 'not-an-email' },
    });
    expect(bad.status()).toBe(400);
    const badResult = validateResponse({
      method: 'POST',
      path: '/api/feedback',
      status: bad.status(),
      body: await bad.json(),
    });
    expect(badResult.errors, 'schema violations').toEqual([]);
  });

  test('POST /api/login 401 payload matches the error schema', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { username: 'admin', password: 'wrong' },
    });
    expect(res.status()).toBe(401);
    const result = validateResponse({
      method: 'POST',
      path: '/api/login',
      status: res.status(),
      body: await res.json(),
    });
    expect(result.errors, 'schema violations').toEqual([]);
  });

  test('GET /api/search payload matches the array-of-strings schema', async ({ request }) => {
    const res = await request.get('/api/search', { params: { q: 'aur' } });
    const body = await res.json();
    expect(body).toEqual(['Aurora']);
    const result = validateResponse({
      method: 'GET',
      path: '/api/search',
      status: res.status(),
      body,
    });
    expect(result.errors, 'schema violations').toEqual([]);
  });

  test('unknown /api routes return the documented 404 error shape', async ({ request }) => {
    const res = await request.get('/api/does-not-exist');
    expect(res.status()).toBe(404);
    const result = validateResponse({
      method: 'GET',
      path: '/api/does-not-exist',
      status: res.status(),
      body: await res.json(),
    });
    expect(result.errors, 'schema violations').toEqual([]);
  });

  test('the validator rejects a payload that violates the schema', () => {
    // No server involved: proves the helper actually enforces the schema
    // instead of rubber-stamping whatever the API returns.
    const result = validateResponse({
      method: 'GET',
      path: '/api/metrics',
      status: 200,
      body: { coverage: 'high', apiHealth: 'Green', p95LatencyMs: 640 },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('coverage');
  });

  test('an undocumented status code fails loudly instead of passing silently', () => {
    const result = validateResponse({
      method: 'GET',
      path: '/api/metrics',
      status: 418,
      body: {},
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('418');
  });
});
