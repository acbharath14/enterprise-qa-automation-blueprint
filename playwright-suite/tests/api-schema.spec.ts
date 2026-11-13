import { test, expect } from '../fixtures/test';
import { validateResponse, loadApiSpec } from '../test-data/schema-validator';
import type { APIRequestContext } from '@playwright/test';

/** Places one order via the API on an isolated cart and returns its id. */
async function placeOrder(
  api: APIRequestContext,
  tag: string,
): Promise<{ orderId: string; productId: string }> {
  const headers = { 'X-Cart-Id': `schema-${tag}-${Date.now()}` };
  const created = await api.post('/api/products', {
    data: { name: `Schema ${tag} Widget`, price: 9.99, category: 'test', stock: 5 },
  });
  expect(created.status()).toBe(201);
  const productId = (await created.json()).id as string;
  await api.post('/api/cart/items', { headers, data: { productId, qty: 1 } });
  const order = await (
    await api.post('/api/orders', {
      headers,
      data: { name: 'Ada', email: 'ada@example.com', address: '1 Main St', payment: { cardLast4: '4242' } },
    })
  ).json();
  return { orderId: order.id as string, productId };
}

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
  test('GET /api/products matches the OpenAPI schema', async ({ api }) => {
    const res = await api.get('/api/products');
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

  test('POST /api/products 201 and 400 payloads match their schemas', async ({ api }) => {
    const ok = await api.post('/api/products', {
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
    await api.delete(`/api/products/${created.id}`);

    const bad = await api.post('/api/products', {
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

  test('GET /api/products/{id} 200 and 404 payloads match their schemas', async ({ api }) => {
    const ok = await api.get('/api/products/prod-1');
    expect(ok.status()).toBe(200);
    const okResult = validateResponse({
      method: 'GET',
      path: '/api/products/prod-1',
      status: ok.status(),
      body: await ok.json(),
    });
    expect(okResult.errors, 'schema violations').toEqual([]);

    const missing = await api.get('/api/products/no-such-product');
    expect(missing.status()).toBe(404);
    const missingResult = validateResponse({
      method: 'GET',
      path: '/api/products/no-such-product',
      status: missing.status(),
      body: await missing.json(),
    });
    expect(missingResult.errors, 'schema violations').toEqual([]);
  });

  test('POST /api/orders/{id}/cancel 200 and 404 payloads match their schemas', async ({ api }) => {
    const { orderId, productId } = await placeOrder(api, 'cancel');
    try {
      const cancelled = await api.post(`/api/orders/${orderId}/cancel`);
      expect(cancelled.status()).toBe(200);
      const cancelledBody = await cancelled.json();
      const cancelledResult = validateResponse({
        method: 'POST',
        path: `/api/orders/${orderId}/cancel`,
        status: cancelled.status(),
        body: cancelledBody,
      });
      expect(cancelledResult.errors, 'schema violations').toEqual([]);
      expect(cancelledBody.status).toBe('cancelled');

      const missing = await api.post('/api/orders/no-such-order/cancel');
      expect(missing.status()).toBe(404);
      const missingResult = validateResponse({
        method: 'POST',
        path: '/api/orders/no-such-order/cancel',
        status: missing.status(),
        body: await missing.json(),
      });
      expect(missingResult.errors, 'schema violations').toEqual([]);
    } finally {
      await api.delete(`/api/orders/${orderId}`);
      await api.delete(`/api/products/${productId}`);
    }
  });

  test('DELETE /api/orders/{id} is documented and removes the order', async ({ api }) => {
    // A 204 carries no JSON body, so validateResponse cannot check it the
    // way it checks the other endpoints: instead, assert the operation and
    // its 204 response are documented, then assert the behavior matches.
    const { doc } = loadApiSpec();
    const deleteOp = doc.paths['/api/orders/{id}']?.delete;
    expect(deleteOp, 'DELETE /api/orders/{id} is documented').toBeDefined();
    expect(deleteOp?.responses?.['204'], '204 response is documented').toBeDefined();

    const { orderId, productId } = await placeOrder(api, 'delete');
    try {
      const deleted = await api.delete(`/api/orders/${orderId}`);
      expect(deleted.status()).toBe(204);
      expect((await api.get(`/api/orders/${orderId}`)).status()).toBe(404);

      const missing = await api.delete('/api/orders/no-such-order');
      expect(missing.status()).toBe(404);
    } finally {
      await api.delete(`/api/products/${productId}`);
    }
  });

  test('POST /api/login 401 payload matches the error schema', async ({ api }) => {
    const res = await api.post('/api/login', {
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

  test('unknown /api routes return 404 and the validator fails loudly', async ({ api }) => {
    const res = await api.get('/api/does-not-exist');
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
