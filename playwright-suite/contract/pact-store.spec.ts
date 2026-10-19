import { test, expect } from '../fixtures/test';
import { PactV3, MatchersV3, Verifier } from '@pact-foundation/pact';
import path from 'node:path';

const { like, eachLike } = MatchersV3;
const pactsDir = path.resolve(__dirname, 'pacts');

function newPact() {
  return new PactV3({
    consumer: 'demomart-ui',
    provider: 'demomart-api',
    port: 1234,
    dir: pactsDir,
  });
}

/**
 * Contract tests for the DemoMart store API, using Pact.
 *
 * Consumer tests define what the storefront expects and verify against
 * Pact's mock provider. Passing writes the contract to contract/pacts/.
 *
 * The provider test replays the recorded contract against the real
 * DemoMart server; state handlers put the shared demo cart in the shape
 * each interaction needs.
 *
 * Run with: npm run test:contract
 */

test('consumer: GET /api/products returns the product list @contract', async () => {
  const provider = newPact();
  provider
    .given('products are available')
    .uponReceiving('a request for the product list')
    .withRequest({ method: 'GET', path: '/api/products' })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: eachLike({
        id: 'prod-1',
        name: 'Aurora Wireless Headphones',
        category: 'electronics',
        price: 129.99,
        rating: 4.5,
        stock: 24,
        description: like('Over-ear Bluetooth headphones.'),
      }),
    });

  await provider.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/products`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0]).toEqual(
      expect.objectContaining({ id: expect.any(String), price: expect.any(Number) }),
    );
  });
});

test('consumer: POST /api/cart/items adds a line to the cart @contract', async () => {
  const provider = newPact();
  provider
    .given('product prod-1 exists')
    .uponReceiving('a request to add prod-1 to the cart')
    .withRequest({
      method: 'POST',
      path: '/api/cart/items',
      headers: { 'Content-Type': 'application/json' },
      body: { productId: 'prod-1', qty: 2 },
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like({
        items: eachLike({
          productId: 'prod-1',
          qty: 2,
          name: 'Aurora Wireless Headphones',
          price: 129.99,
        }),
        subtotal: 259.98,
      }),
    });

  await provider.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod-1', qty: 2 }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.subtotal).toEqual(expect.any(Number));
  });
});

test('consumer: POST /api/orders checks out the cart @contract', async () => {
  const provider = newPact();
  provider
    .given('the cart holds 2x prod-1')
    .uponReceiving('a checkout request')
    .withRequest({
      method: 'POST',
      path: '/api/orders',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Ada',
        email: 'ada@example.com',
        address: '1 Main St',
        payment: { cardLast4: '4242' },
      },
    })
    .willRespondWith({
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: like({
        id: 'ord-1',
        items: eachLike({
          productId: 'prod-1',
          qty: 2,
          name: 'Aurora Wireless Headphones',
          price: 129.99,
        }),
        total: 259.98,
        status: 'confirmed',
      }),
    });

  await provider.executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ada',
        email: 'ada@example.com',
        address: '1 Main St',
        payment: { cardLast4: '4242' },
      }),
    });
    expect(res.status).toBe(201);
    expect((await res.json()).id).toEqual(expect.any(String));
  });
});

test('provider: DemoMart honors the recorded store contracts @contract', async () => {
  const base = 'http://127.0.0.1:4173';
  const output = await new Verifier({
    provider: 'demomart-api',
    providerBaseUrl: base,
    pactUrls: [path.join(pactsDir, 'demomart-ui-demomart-api.json')],
    stateHandlers: {
      'products are available': async () => {},
      'product prod-1 exists': async () => {},
      'the cart holds 2x prod-1': async () => {
        await fetch(`${base}/api/cart`, { method: 'DELETE' });
        await fetch(`${base}/api/cart/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: 'prod-1', qty: 2 }),
        });
      },
    },
  }).verifyProvider();
  expect(output).toBeTruthy();
});
