import { test, expect, mintTestProduct, cleanupTestProduct, newCartId } from '../fixtures/test';
import { withDbClient } from '../fixtures/db';
import type { APIRequestContext } from '@playwright/test';

/**
 * Per-test cart isolation for direct API tests: the server keys carts by the
 * X-Cart-Id header. Each test gets a private cart id, so parallel workers
 * (and the UI specs' session carts) never share cart state. Use `capi`
 * instead of `request` for every /api/cart* and /api/orders* call.
 */
function cartApi(request: APIRequestContext, testInfo: { workerIndex: number }) {
  const headers = { 'X-Cart-Id': newCartId('api', testInfo.workerIndex) };
  const withHeaders = (opts: Record<string, unknown> = {}) => ({
    ...opts,
    headers: { ...((opts.headers as Record<string, string>) || {}), ...headers },
  });
  return {
    headers,
    get: (url: string, opts?: Record<string, unknown>) => request.get(url, withHeaders(opts)),
    post: (url: string, opts?: Record<string, unknown>) => request.post(url, withHeaders(opts)),
    patch: (url: string, opts?: Record<string, unknown>) => request.patch(url, withHeaders(opts)),
    delete: (url: string, opts?: Record<string, unknown>) => request.delete(url, withHeaders(opts)),
  };
}


/**
 * Direct API tests (no browser): pin the contract of the DemoMart backend
 * the storefront consumes. UI specs prove the journey; these prove the API
 * itself. Every test addresses its own isolated cart through the capi()
 * wrapper (X-Cart-Id header) — no shared cart, nothing to reset.
 */
test.describe('products API', () => {
  test('lists the seeded products', async ({ api }) => {
    const res = await api.get('/api/products');
    await expect(res).toBeOK();
    expect(res.headers()['content-type']).toContain('application/json');
    const body = await res.json();
    const ids = body.map((p: { id: string }) => p.id);
    for (let i = 1; i <= 12; i++) expect(ids).toContain(`prod-${i}`);
    expect(body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        category: expect.any(String),
        price: expect.any(Number),
        rating: expect.any(Number),
        stock: expect.any(Number),
        description: expect.any(String),
      }),
    );
  });

  test('supports search, category filter and sort', async ({ api }) => {
    const q = await (await api.get('/api/products?q=aurora')).json();
    expect(q.length).toBe(3);
    expect(q.every((p: { name: string }) => p.name.toLowerCase().includes('aurora'))).toBe(true);

    const cat = await (await api.get('/api/products?category=apparel')).json();
    expect(cat.length).toBe(3);
    expect(cat.every((p: { category: string }) => p.category === 'apparel')).toBe(true);

    const sorted = await (await api.get('/api/products?sort=price_asc')).json();
    const prices = sorted.map((p: { price: number }) => p.price);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  test('product values are sane', async ({ api }) => {
    const body = await (await api.get('/api/products')).json();
    for (const p of body) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.rating).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(Number.isInteger(p.stock)).toBe(true);
      expect(p.stock).toBeGreaterThanOrEqual(0);
    }
  });

  test('get-by-id returns the product; unknown id is a JSON 404', async ({ api }) => {
    const res = await api.get('/api/products/prod-1');
    await expect(res).toBeOK();
    expect((await res.json()).name).toBe('Aurora Wireless Headphones');

    const missing = await api.get('/api/products/nope');
    expect(missing.status()).toBe(404);
    expect(missing.headers()['content-type']).toContain('application/json');
    expect((await missing.json()).error).toBeDefined();
  });

  test('product CRUD round-trips', async ({ api }) => {
    const created = await api.post('/api/products', {
      data: { name: 'API Test Widget', price: 12.5, category: 'test', stock: 5 },
    });
    expect(created.status()).toBe(201);
    const product = await created.json();
    const id = product.id as string;
    try {
      expect(product).toMatchObject({ name: 'API Test Widget', price: 12.5 });
      // Cross-check: the created row exists in Postgres (no-op in
      // in-memory mode, where DATABASE_URL is unset).
      await withDbClient(async (db) => {
        const row = await db.queryOne<{ name: string; price_cents: number }>(
          'SELECT name, price_cents FROM products WHERE id = $1',
          [id],
        );
        expect(row?.name).toBe('API Test Widget');
        expect(row?.price_cents).toBe(1250);
      });

      const patched = await api.patch(`/api/products/${id}`, { data: { price: 15 } });
      expect(patched.status()).toBe(200);
      expect((await patched.json()).price).toBe(15);
      await withDbClient(async (db) => {
        const row = await db.queryOne<{ price_cents: number }>(
          'SELECT price_cents FROM products WHERE id = $1',
          [id],
        );
        expect(row?.price_cents).toBe(1500);
      });

      const badCreate = await api.post('/api/products', { data: { price: -3 } });
      expect(badCreate.status()).toBe(400);
      expect((await badCreate.json()).error).toBeDefined();
    } finally {
      const deleted = await api.delete(`/api/products/${id}`);
      expect(deleted.status()).toBe(204);
      expect((await api.get(`/api/products/${id}`)).status()).toBe(404);
      await withDbClient(async (db) => {
        const row = await db.queryOne<{ id: string }>(
          'SELECT id FROM products WHERE id = $1',
          [id],
        );
        expect(row).toBeUndefined();
      });
    }
  });

  test('unknown API routes return JSON 404', async ({ api }) => {
    const res = await api.get('/api/does-not-exist');
    expect(res.status()).toBe(404);
    expect(res.headers()['content-type']).toContain('application/json');
    expect((await res.json()).error).toBeDefined();
  });
});

/**
 * Each test mints its own uniquely-named product and addresses its own
 * isolated cart via the capi() wrapper (X-Cart-Id header), so parallel
 * workers never interfere. Tests assert only on their own lines and check
 * money math by internal consistency (subtotal === sum of line totals).
 */
function lineTotal(line: { price: number; qty: number }): number {
  return Math.round(line.price * line.qty * 100) / 100;
}

test.describe('cart API', () => {
  test('cart math is internally consistent', async ({ api }, testInfo) => {
    const capi = cartApi(api, testInfo);
    const pid = await mintTestProduct(api, 'math');
    try {
      await capi.post('/api/cart/items', { data: { productId: pid, qty: 5 } });
      const cart = await (await capi.get('/api/cart')).json();
      const line = cart.items.find((i: { productId: string }) => i.productId === pid);
      expect(line, 'own cart line present').toBeDefined();
      expect(line.qty).toBe(5);
      expect(lineTotal(line)).toBeCloseTo(5 * 42.5, 2);
      // The subtotal aggregates every line present, whoever added it.
      const expected = cart.items.reduce((sum: number, i: { price: number; qty: number }) => sum + i.price * i.qty, 0);
      expect(cart.subtotal).toBeCloseTo(expected, 2);
    } finally {
      await cleanupTestProduct(api, pid, capi.headers);
    }
  });

  test('rejects unknown products, bad quantities and over-stock', async ({ api }, testInfo) => {
    const capi = cartApi(api, testInfo);
    expect(
      (await capi.post('/api/cart/items', { data: { productId: 'nope', qty: 1 } })).status(),
    ).toBe(404);
    expect(
      (await capi.post('/api/cart/items', { data: { productId: 'prod-1', qty: 0 } })).status(),
    ).toBe(400);
    expect(
      (await capi.post('/api/cart/items', { data: { productId: 'prod-1', qty: 99999 } })).status(),
    ).toBe(400);
  });

  test('quantity updates and removal work', async ({ api }, testInfo) => {
    const capi = cartApi(api, testInfo);
    const pid = await mintTestProduct(api, 'qty');
    try {
      await capi.post('/api/cart/items', { data: { productId: pid, qty: 1 } });
      const updated = await capi.patch(`/api/cart/items/${pid}`, { data: { qty: 4 } });
      const line = (await updated.json()).items.find((i: { productId: string }) => i.productId === pid);
      expect(line.qty).toBe(4);
      await capi.delete(`/api/cart/items/${pid}`);
      const cart = await (await capi.get('/api/cart')).json();
      expect(cart.items.find((i: { productId: string }) => i.productId === pid)).toBeUndefined();
      expect((await capi.delete(`/api/cart/items/${pid}`)).status()).toBe(404);
    } finally {
      await api.delete(`/api/products/${pid}`);
    }
  });
});

test.describe('orders API', () => {
  test('checkout creates an order and clears its lines', async ({ api }, testInfo) => {
    const capi = cartApi(api, testInfo);
    const pid = await mintTestProduct(api, 'order');
    try {
      await capi.post('/api/cart/items', { data: { productId: pid, qty: 2 } });
      const res = await capi.post('/api/orders', {
        data: {
          name: 'Ada',
          email: 'ada@example.com',
          address: '1 Main St',
          shippingMethod: 'express',
          deliveryDate: '2026-10-25',
          payment: { cardLast4: '4242' },
        },
      });
      expect(res.status()).toBe(201);
      const order = await res.json();
      expect(order.id).toMatch(/^ord-\d+$/);
      expect(order.status).toBe('confirmed');
      const line = order.items.find((i: { productId: string }) => i.productId === pid);
      expect(line.qty).toBe(2);
      // The total aggregates every line in the order, whoever added it.
      const expected = order.items.reduce(
        (sum: number, i: { price: number; qty: number }) => sum + i.price * i.qty,
        0,
      );
      expect(order.total).toBeCloseTo(expected, 2);
      // Our lines are gone from the cart after ordering.
      const cart = await (await capi.get('/api/cart')).json();
      expect(cart.items.find((i: { productId: string }) => i.productId === pid)).toBeUndefined();
      expect((await (await capi.get(`/api/orders/${order.id}`)).json()).id).toBe(order.id);
    } finally {
      await api.delete(`/api/products/${pid}`);
    }
  });

  test('rejects empty carts and invalid payloads', async ({ api }, testInfo) => {
    const capi = cartApi(api, testInfo);
    // Needs a truly empty cart: clear and act immediately.
    await capi.delete('/api/cart');
    const empty = await capi.post('/api/orders', {
      data: { name: 'Ada', email: 'ada@example.com', address: '1 Main St', payment: { cardLast4: '4242' } },
    });
    expect(empty.status()).toBe(422);

    const pid = await mintTestProduct(api, 'badorder');
    try {
      await capi.post('/api/cart/items', { data: { productId: pid, qty: 1 } });
      const badEmail = await capi.post('/api/orders', {
        data: { name: 'Ada', email: 'not-an-email', address: '1 Main St', payment: { cardLast4: '4242' } },
      });
      expect(badEmail.status()).toBe(400);
    } finally {
      await cleanupTestProduct(api, pid, capi.headers);
    }
  });

  test('receipt downloads as CSV', async ({ api }, testInfo) => {
    const capi = cartApi(api, testInfo);
    const pid = await mintTestProduct(api, 'receipt');
    try {
      await capi.post('/api/cart/items', { data: { productId: pid, qty: 1 } });
      const order = await (
        await capi.post('/api/orders', {
          data: { name: 'Ada', email: 'ada@example.com', address: '1 Main St', payment: { cardLast4: '4242' } },
        })
      ).json();
      const res = await capi.get(`/api/orders/${order.id}/receipt`);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('text/csv');
      expect(res.headers()['content-disposition']).toContain(`receipt-${order.id}.csv`);
      const csv = await res.text();
      expect(csv).toContain('product,quantity,unit_price,line_total');
      expect(csv).toContain('Fixture receipt');
      expect((await capi.get('/api/orders/nope/receipt')).status()).toBe(404);
    } finally {
      await api.delete(`/api/products/${pid}`);
    }
  });
});
