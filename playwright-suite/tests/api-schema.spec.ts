import { test, expect } from '../fixtures/test';
import { validateResponse } from '../test-data/schema-validator';

/**
 * OpenAPI schema validation for the DemoMart store API.
 *
 * api.spec.ts pins behavior (status codes, value sanity) and contract/ pins
 * the Pact consumer<->provider agreement. These specs pin every JSON response
 * against the committed OpenAPI document (test-data/openapi.store.json):
 * field names, types, required fields, value ranges. If the API drifts from
 * its documentation, this is the spec that goes red first.
 */
test.describe('API schema validation', () => {
  test('GET /api/products matches the OpenAPI schema', async ({ request }) => {
    const res = await request.get('/api/products');
    expect(res.status()).toBe(200);
    const result = validateResponse({
      method: 'GET',
      path: '/api/products',
      status: res.status(),
      body: await res.json(),
    });
    expect(result.errors, 'schema violations').toEqual([]);
    expect(result.valid).toBe(true);
  });

  test('POST /api/products 201 and 400 payloads match their schemas', async ({
    request,
  }) => {
    const ok = await request.post('/api/products', {
      data: { name: 'Schema Test Widget', price: 9.99, category: 'test' },
    });
    expect(ok.status()).toBe(201);
    const okResult = validateResponse({
      method: 'POST',
      path: '/api/products',
      status: ok.status(),
      body: await ok.json(),
    });
    expect(okResult.errors, 'schema violations').toEqual([]);

    // Clean up the created product so the seeded catalog is untouched.
    const created = await ok.json();
    await request.delete(`/api/products/${created.id}`);

    const bad = await request.post('/api/products', {
      data: { name: 'Bad Widget', price: -5 },
    });
    expect(bad.status()).toBe(400);
    const badResult = validateResponse({
      method: 'POST',
      path: '/api/products',
      status: bad.status(),
      body: await bad.json(),
    });
    expect(badResult.errors, 'schema violations').toEqual([]);
  });

  test('GET /api/products/{id} 200 and 404 payloads match their schemas', async ({
    request,
  }) => {
    const ok = await request.get('/api/products/prod-1');
    expect(ok.status()).toBe(200);
    const okResult = validateResponse({
      method: 'GET',
      path: '/api/products/prod-1',
      status: ok.status(),
      body: await ok.json(),
    });
    expect(okResult.errors, 'schema violations').toEqual([]);

    const missing = await request.get('/api/products/no-such-product');
    expect(missing.status()).toBe(404);
    const missingResult = validateResponse({
      method: 'GET',
      path: '/api/products/no-such-product',
      status: missing.status(),
      body: await missing.json(),
    });
    expect(missingResult.errors, 'schema violations').toEqual([]);
  });

  test('POST /api/login 401 payload matches the error schema', async ({
    request,
  }) => {
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

  test('unknown /api routes return 404 and the validator fails loudly', async ({
    request,
  }) => {
    const res = await request.get('/api/does-not-exist');
    expect(res.status()).toBe(404);
    // The API returns a proper 404, but the path is not in the OpenAPI doc,
    // so the validator must fail loudly instead of passing silently.
    const result = validateResponse({
      method: 'GET',
      path: '/api/does-not-exist',
      status: res.status(),
      body: await res.json(),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('No operation documented');
  });

  test('the validator rejects a payload that violates the schema', () => {
    // No server involved: proves the helper actually enforces the schema
    // instead of rubber-stamping whatever the API returns.
    const result = validateResponse({
      method: 'GET',
      path: '/api/products/prod-1',
      status: 200,
      body: { id: 'prod-1', name: 'Widget', price: 'nine-ninety-nine' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('price');
  });

  test('an undocumented status code fails loudly instead of passing silently', () => {
    const result = validateResponse({
      method: 'GET',
      path: '/api/products',
      status: 418,
      body: {},
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('418');
  });
});
