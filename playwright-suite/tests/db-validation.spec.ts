import { test, expect } from '../fixtures/db';
import { placeOrderWithRetry } from './helpers/order-retry';
import type { APIRequestContext } from '@playwright/test';

/**
 * Database validation: proves UI and API writes actually landed in Postgres.
 *
 * Each test is tagged `@db` and runs only when DATABASE_URL is set — the
 * file skips wholesale in the default in-memory mode, so a local run
 * without Postgres stays green. Run it with:
 *   npm run db:up
 *   DATABASE_URL=postgres://demomart:demomart@localhost:5432/demomart npm test -- tests/db-validation.spec.ts
 *
 * Self-isolation rules (the seeded catalog is shared across parallel
 * workers and read-only in tests):
 * - Orders are located by the unique id the UI or API returned — never by
 *   "latest row".
 * - Products a test creates are deleted via SQL in a finally block, even
 *   when the test fails — try/finally, not a shared afterEach list, because
 *   the suite runs fully parallel and a shared list would race.
 * - Nothing asserts on global row counts of shared tables.
 *
 * Money is stored as integer cents; assertions compare cents, never floats.
 * (pg returns NUMERIC as a string and SUM/COUNT as bigint strings, so
 * aggregates are compared with Number(...).)
 */

test.skip(
  !process.env.DATABASE_URL,
  'DB validation needs Postgres: npm run db:up, then DATABASE_URL=postgres://demomart:demomart@localhost:5432/demomart',
);

const toCents = (dollars: number): number => Math.round(dollars * 100);

type OrderRow = {
  id: string;
  status: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  customer_name: string;
};

type OrderItemRow = {
  order_id: string;
  product_id: string;
  name: string;
  qty: number;
  price_cents: number;
  position: number;
};

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  stock: number;
  description: string;
};

/** Creates a product via the API and returns its id. */
async function createProduct(
  api: APIRequestContext,
  fields: { name: string; price: number; category?: string; stock?: number },
): Promise<string> {
  const res = await api.post('/api/products', {
    data: { category: 'test', stock: 10, ...fields },
  });
  expect(res.status()).toBe(201);
  return (await res.json()).id as string;
}

/** Places an order for the given cart lines via the API on an isolated cart. */
async function placeOrderViaApi(
  api: APIRequestContext,
  lines: { productId: string; qty: number }[],
  tag: string,
): Promise<{ id: string; total: number; status: string }> {
  const headers = { 'X-Cart-Id': `db-${tag}-${Date.now()}` };
  for (const line of lines) {
    const added = await api.post('/api/cart/items', { headers, data: line });
    expect(added.status()).toBe(200);
  }
  const res = await api.post('/api/orders', {
    headers,
    data: {
      name: 'DB Buyer',
      email: 'db@example.com',
      address: '1 DB Lane',
      payment: { cardLast4: '4242' },
    },
  });
  expect(res.status()).toBe(201);
  const order = (await res.json()) as { id: string; total: number; status: string };
  return { id: order.id, total: order.total, status: order.status };
}

test.describe('database validation', () => {
  test('checkout writes the order and its lines to Postgres @db', async ({
    checkout,
    request,
    db,
  }) => {
    const { checkoutPage, productId, headers } = checkout;
    // A second line, so the order has exactly two items to assert on.
    await request.post('/api/cart/items', { headers, data: { productId: 'prod-2', qty: 1 } });
    let orderId = '';
    try {
      await checkoutPage.fillShipping({
        name: 'DB Buyer',
        email: 'db@example.com',
        address: '1 DB Lane',
      });
      await checkoutPage.next();
      await expect(checkoutPage.step2).toBeVisible();
      await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
      await checkoutPage.next();
      await expect(checkoutPage.step3).toBeVisible();
      await placeOrderWithRetry(checkoutPage, request, productId, 5, headers);
      await expect(checkoutPage.confirmation).toBeVisible();
      orderId = (await checkoutPage.orderId.textContent())?.trim() ?? '';
      expect(orderId).toMatch(/^ord-\d+$/);

      const row = await db.waitForRow<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);
      expect(row.status).toBe('confirmed');
      expect(row.total_cents).toBe(row.subtotal_cents + row.tax_cents);
      expect(row.tax_cents).toBe(0);

      const items = await db.query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1 ORDER BY position',
        [orderId],
      );
      expect(items).toHaveLength(2);
      expect(items.map((i) => i.product_id).sort()).toEqual([productId, 'prod-2'].sort());
      const fixtureLine = items.find((i) => i.product_id === productId);
      expect(fixtureLine?.qty).toBe(1);
      expect(fixtureLine?.price_cents).toBe(toCents(42.5));
      const prod2Line = items.find((i) => i.product_id === 'prod-2');
      expect(prod2Line?.qty).toBe(1);
      expect(prod2Line?.price_cents).toBe(toCents(349));
    } finally {
      if (orderId) await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
    }
  });

  test('an API-created product exists in the DB and renders the same values @db', async ({
    api,
    page,
    db,
  }) => {
    const name = `DB Validation Widget ${Date.now()}`;
    const productId = await createProduct(api, { name, price: 19.99, stock: 7 });
    try {
      const row = await db.queryOne<ProductRow>(
        'SELECT id, name, category, price_cents, stock, description FROM products WHERE id = $1',
        [productId],
      );
      expect(row?.name).toBe(name);
      expect(row?.category).toBe('test');
      expect(row?.price_cents).toBe(toCents(19.99));
      expect(row?.stock).toBe(7);

      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${productId}`)).toBeVisible();
      await expect(page.getByTestId(`product-name-${productId}`)).toHaveText(name);
      await expect(page.getByTestId(`product-price-${productId}`)).toHaveText('$19.99');
    } finally {
      await db.query('DELETE FROM products WHERE id = $1', [productId]);
    }
  });

  test('the catalog mirrors the products table, and a SQL-deleted row stops rendering @db', async ({
    catalogPage,
    page,
    db,
  }) => {
    // Every seeded row renders as a card (mirrors catalog.spec.ts, which
    // owns the pagination walk — this test re-checks it against the DB).
    const seen = new Set<string>();
    for (;;) {
      const cards = catalogPage.grid.getByTestId(/^product-card-/);
      await expect(cards.first()).toBeVisible();
      const ids = await cards.evaluateAll((els) =>
        els.map((el) => (el.getAttribute('data-testid') ?? '').replace('product-card-', '')),
      );
      ids.forEach((id) => seen.add(id));
      if (await catalogPage.nextButton.isDisabled()) break;
      await catalogPage.nextButton.click();
    }
    const dbRows = await db.query<{ id: string }>(
      "SELECT id FROM products WHERE id LIKE 'prod-%' ORDER BY id",
    );
    for (const row of dbRows.filter((r) => /^prod-(1[0-2]|[1-9])$/.test(r.id))) {
      expect(seen, `seeded product ${row.id} renders`).toContain(row.id);
    }
    // Spot-check one row end to end: the card shows what the DB holds.
    // (The walk above left the catalog on the last page; prod-1 is on page 1.)
    await page.goto('/');
    const prod1 = await db.queryOne<ProductRow>(
      'SELECT id, name, category, price_cents, stock, description FROM products WHERE id = $1',
      ['prod-1'],
    );
    await expect(page.getByTestId('product-name-prod-1')).toHaveText(prod1?.name ?? '');
    await expect(page.getByTestId('product-price-prod-1')).toHaveText(
      `$${((prod1?.price_cents ?? 0) / 100).toFixed(2)}`,
    );

    // Delete half: a test-owned row (never a seeded one — the seeded
    // catalog is shared across parallel workers), removed directly in SQL.
    const name = `DB Mirror Widget ${Date.now()}`;
    const testId = `dbtest-mirror-${Date.now()}`;
    await db.query(
      `INSERT INTO products (id, name, category, price_cents, rating, image, stock, description)
       VALUES ($1, $2, 'test', $3, 4.0, NULL, 3, 'db-validation mirror row')`,
      [testId, name, toCents(12.34)],
    );
    try {
      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${testId}`)).toBeVisible();

      await db.query('DELETE FROM products WHERE id = $1', [testId]);
      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${testId}`)).toHaveCount(0);
    } finally {
      await db.cleanupByPrefix('dbtest-');
    }
  });

  test('cancelling an order in the UI persists the status, totals and items @db', async ({
    checkout,
    request,
    db,
  }) => {
    const { checkoutPage, productId, headers } = checkout;
    let orderId = '';
    try {
      await checkoutPage.fillShipping({
        name: 'DB Buyer',
        email: 'db@example.com',
        address: '1 DB Lane',
      });
      await checkoutPage.next();
      await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
      await checkoutPage.next();
      await placeOrderWithRetry(checkoutPage, request, productId, 5, headers);
      await expect(checkoutPage.confirmation).toBeVisible();
      orderId = (await checkoutPage.orderId.textContent())?.trim() ?? '';
      expect(orderId).toMatch(/^ord-\d+$/);

      const before = await db.waitForRow<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);
      const itemsBefore = await db.query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1 ORDER BY position',
        [orderId],
      );

      await checkoutPage.cancelOrder();
      await expect(checkoutPage.orderStatus).toHaveText('Cancelled');
      await expect(checkoutPage.cancelOrderButton).toBeDisabled();

      const after = await db.queryOne<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);
      expect(after?.status).toBe('cancelled');
      expect(after?.total_cents).toBe(before.total_cents);
      expect(after?.subtotal_cents).toBe(before.subtotal_cents);
      expect(after?.tax_cents).toBe(before.tax_cents);
      const itemsAfter = await db.query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1 ORDER BY position',
        [orderId],
      );
      expect(itemsAfter).toEqual(itemsBefore);

      const viaApi = await (await request.get(`/api/orders/${orderId}`)).json();
      expect(viaApi.status).toBe('cancelled');
    } finally {
      if (orderId) await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
    }
  });

  test('an API price change lands in the DB and the catalog shows the new price @db', async ({
    api,
    page,
    db,
  }) => {
    const name = `DB Price Widget ${Date.now()}`;
    const productId = await createProduct(api, { name, price: 20 });
    try {
      const patched = await api.patch(`/api/products/${productId}`, { data: { price: 25.5 } });
      expect(patched.status()).toBe(200);

      const row = await db.queryOne<{ price_cents: number }>(
        'SELECT price_cents FROM products WHERE id = $1',
        [productId],
      );
      expect(row?.price_cents).toBe(toCents(25.5));

      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-price-${productId}`)).toHaveText('$25.50');
    } finally {
      await db.query('DELETE FROM products WHERE id = $1', [productId]);
    }
  });

  test('deleting an order in the UI removes its row and its items @db', async ({
    checkout,
    request,
    db,
  }) => {
    const { checkoutPage, productId, headers } = checkout;
    let orderId = '';
    try {
      await checkoutPage.fillShipping({
        name: 'DB Buyer',
        email: 'db@example.com',
        address: '1 DB Lane',
      });
      await checkoutPage.next();
      await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
      await checkoutPage.next();
      await placeOrderWithRetry(checkoutPage, request, productId, 5, headers);
      await expect(checkoutPage.confirmation).toBeVisible();
      orderId = (await checkoutPage.orderId.textContent())?.trim() ?? '';
      expect(orderId).toMatch(/^ord-\d+$/);
      await db.waitForRow<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);

      await checkoutPage.deleteOrder();
      await expect(checkoutPage.orderDeletedMessage).toBeVisible();
      await expect(checkoutPage.cancelOrderButton).toBeDisabled();
      await expect(checkoutPage.deleteOrderButton).toBeDisabled();

      // Cascade proven, not assumed: the order row AND its items are gone.
      const row = await db.queryOne<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);
      expect(row).toBeUndefined();
      const items = await db.query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1',
        [orderId],
      );
      expect(items).toHaveLength(0);
      expect((await request.get(`/api/orders/${orderId}`)).status()).toBe(404);
      orderId = '';
    } finally {
      if (orderId) await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
    }
  });

  test('deleting a product keeps existing orders readable with their price snapshot @db', async ({
    api,
    page,
    db,
  }) => {
    const name = `DB Snapshot Widget ${Date.now()}`;
    const productId = await createProduct(api, { name, price: 33.33 });
    let orderId = '';
    try {
      const order = await placeOrderViaApi(api, [{ productId, qty: 1 }], 'snapshot');
      orderId = order.id;
      const before = await (await api.get(`/api/orders/${orderId}`)).json();
      expect(before.items[0].name).toBe(name);
      expect(before.items[0].price).toBeCloseTo(33.33, 2);

      const deleted = await api.delete(`/api/products/${productId}`);
      expect(deleted.status()).toBe(204);
      const row = await db.queryOne<ProductRow>(
        'SELECT id, name, category, price_cents, stock, description FROM products WHERE id = $1',
        [productId],
      );
      expect(row).toBeUndefined();

      await page.goto('/');
      await page.getByTestId('search-input').fill(name);
      await expect(page.getByTestId(`product-card-${productId}`)).toHaveCount(0);

      const after = await (await api.get(`/api/orders/${orderId}`)).json();
      expect(after.items[0].name).toBe(name);
      expect(after.items[0].price).toBeCloseTo(33.33, 2);
      const itemRow = await db.queryOne<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1',
        [orderId],
      );
      expect(itemRow?.name).toBe(name);
      expect(itemRow?.price_cents).toBe(toCents(33.33));
    } finally {
      if (orderId) await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
      await db.query('DELETE FROM products WHERE id = $1', [productId]);
    }
  });

  test('stored order totals are internally consistent, not just API-consistent @db', async ({
    api,
    db,
  }) => {
    const pidA = await createProduct(api, { name: `DB Totals A ${Date.now()}`, price: 10 });
    const pidB = await createProduct(api, { name: `DB Totals B ${Date.now()}`, price: 5.5 });
    let orderId = '';
    try {
      const order = await placeOrderViaApi(
        api,
        [
          { productId: pidA, qty: 2 },
          { productId: pidB, qty: 3 },
        ],
        'totals',
      );
      orderId = order.id;
      expect(order.total).toBeCloseTo(36.5, 2);

      const row = await db.waitForRow<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);
      expect(row.total_cents).toBe(row.subtotal_cents + row.tax_cents);
      const { sum_cents } = (await db.queryOne<{ sum_cents: string }>(
        'SELECT COALESCE(SUM(qty * price_cents), 0) AS sum_cents FROM order_items WHERE order_id = $1',
        [orderId],
      )) ?? { sum_cents: '0' };
      expect(Number(sum_cents)).toBe(row.total_cents - row.tax_cents);
    } finally {
      if (orderId) await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
      await db.query('DELETE FROM products WHERE id = $1', [pidA]);
      await db.query('DELETE FROM products WHERE id = $1', [pidB]);
    }
  });
});
