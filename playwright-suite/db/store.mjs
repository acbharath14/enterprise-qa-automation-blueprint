// ---------------------------------------------------------------------------
// DemoMart data store.
//
// Two implementations behind one async interface, selected by DATABASE_URL:
//   - DATABASE_URL set   -> Postgres (db/schema.sql applied on boot, catalog
//                           seeded). Money is stored as integer cents; the
//                           API keeps returning decimal dollars -- conversion
//                           happens only inside this module.
//   - DATABASE_URL unset -> the original in-memory implementation, moved
//                           verbatim from server.mjs. Behavior is identical
//                           to before this module existed.
//
// Carts are NOT part of this store: they stay in server.mjs, keyed by
// X-Cart-Id, exactly as before (per-test ephemeral state).
//
// Interface (all methods async):
//   listProducts()            -> Product[]
//   getProduct(id)            -> Product | undefined
//   createProduct(fields)     -> Product (assigns the `prod-N` id)
//   saveProduct(product)      -> Product (full-object replace by id)
//   deleteProduct(id)         -> boolean (true if the product existed)
//   createOrder({ customerName, items, total }) -> Order
//   getOrder(id)              -> Order | undefined
//
// Product shape (API): { id, name, category, price, rating, stock,
//                        description, image? }  -- `image` key present only
//                        after an image upload, as before.
// Order shape (API):   { id, items: [{ productId, qty, name, price }],
//                        total, status: 'confirmed' }
// ---------------------------------------------------------------------------

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql');

// ---------------------------------------------------------------------------
// Demo store seed data. Deterministic; shared by both implementations.
// (Moved verbatim from server.mjs.)
// ---------------------------------------------------------------------------

export const seedProducts = [
  { id: 'prod-1', name: 'Aurora Wireless Headphones', category: 'electronics', price: 129.99, rating: 4.5, stock: 24, description: 'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.' },
  { id: 'prod-2', name: 'Beacon 4K Monitor', category: 'electronics', price: 349.0, rating: 4.7, stock: 12, description: '27-inch 4K IPS display with HDR support and height-adjustable stand.' },
  { id: 'prod-3', name: 'Cipher Mechanical Keyboard', category: 'electronics', price: 89.95, rating: 4.3, stock: 40, description: 'Hot-swappable mechanical keyboard with tactile switches and per-key RGB.' },
  { id: 'prod-4', name: 'Dynamo Running Shoes', category: 'apparel', price: 119.5, rating: 4.6, stock: 30, description: 'Lightweight road-running shoes with responsive foam cushioning.' },
  { id: 'prod-5', name: 'Aurora Denim Jacket', category: 'apparel', price: 79.0, rating: 4.2, stock: 18, description: 'Classic-fit denim jacket in washed indigo with brass buttons.' },
  { id: 'prod-6', name: 'Beacon Cotton T-Shirt', category: 'apparel', price: 24.99, rating: 4.0, stock: 100, description: 'Everyday crew-neck tee in 100% combed cotton, pre-shrunk.' },
  { id: 'prod-7', name: 'Cipher Ceramic Pour-Over Set', category: 'home', price: 45.0, rating: 4.8, stock: 15, description: 'Hand-glazed ceramic dripper, carafe, and walnut collar for slow mornings.' },
  { id: 'prod-8', name: 'Dynamo Bamboo Cutting Board', category: 'home', price: 32.5, rating: 4.4, stock: 50, description: 'Reversible bamboo cutting board with juice groove and non-slip feet.' },
  { id: 'prod-9', name: 'Aurora LED Desk Lamp', category: 'home', price: 59.99, rating: 4.1, stock: 22, description: 'Dimmable LED desk lamp with five color temperatures and USB charging port.' },
  { id: 'prod-10', name: 'Beacon Yoga Mat', category: 'sports', price: 39.95, rating: 4.6, stock: 35, description: '6mm non-slip yoga mat with alignment lines and carry strap.' },
  { id: 'prod-11', name: 'Cipher Insulated Water Bottle', category: 'sports', price: 29.0, rating: 4.7, stock: 80, description: '750ml vacuum-insulated bottle, keeps drinks cold 24 hours.' },
  { id: 'prod-12', name: 'Dynamo Resistance Band Set', category: 'sports', price: 49.99, rating: 4.3, stock: 28, description: 'Five stackable resistance bands with handles, door anchor, and carry bag.' },
];

function toCents(dollars) {
  return Math.round(dollars * 100);
}

// ---------------------------------------------------------------------------
// In-memory implementation -- the pre-existing server.mjs logic, unchanged
// apart from living behind the store interface.
// ---------------------------------------------------------------------------

function createMemoryStore() {
  let products = seedProducts.map((p) => ({ ...p }));
  let nextProductId = 13;
  let orders = [];
  let nextOrderId = 1;

  return {
    async listProducts() {
      return [...products];
    },
    async getProduct(id) {
      return products.find((p) => p.id === id);
    },
    async createProduct(fields) {
      const product = { id: `prod-${nextProductId++}`, ...fields };
      products.push(product);
      return product;
    },
    async saveProduct(product) {
      const idx = products.findIndex((p) => p.id === product.id);
      if (idx !== -1) products[idx] = product;
      return product;
    },
    async deleteProduct(id) {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      products.splice(idx, 1);
      return true;
    },
    async createOrder({ items, total }) {
      const order = { id: `ord-${nextOrderId++}`, items, total, status: 'confirmed' };
      orders.push(order);
      return order;
    },
    async getOrder(id) {
      return orders.find((o) => o.id === id);
    },
  };
}

// ---------------------------------------------------------------------------
// Postgres implementation.
//
// Id allocation mirrors the in-memory counters (`prod-13` and up, `ord-1`
// and up, never reusing a live id): the next number is derived from the
// maximum existing numeric suffix inside the same transaction that inserts,
// serialized with an advisory lock so concurrent requests to this single
// server process cannot race. (Unlike the in-memory counters, the derived
// counter survives restarts -- that is the point of persistence. If every
// row is deleted it restarts from the seed floor, like a fresh boot.)
// ---------------------------------------------------------------------------

const ID_LOCK_KEY = 424242;

function rowToProduct(row) {
  const product = {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price_cents / 100,
    rating: row.rating === null ? 0 : Number(row.rating),
    stock: row.stock,
    description: row.description,
  };
  // The in-memory products carry no `image` key until an upload sets one;
  // keep the key absent (not null) so payloads are byte-identical.
  if (row.image !== null && row.image !== undefined) product.image = row.image;
  return product;
}

async function createPostgresStore(connectionString) {
  // Dynamic import: in-memory mode never loads (or needs) the pg driver.
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString });

  // Boot sequence: connect -> apply schema (idempotent) -> seed catalog.
  // Any failure throws; server.mjs fails fast rather than silently
  // falling back to memory.
  const schemaSql = await readFile(schemaPath, 'utf8');
  await pool.query(schemaSql);
  const seedValues = [];
  const seedParams = [];
  seedProducts.forEach((p, i) => {
    const base = i * 8;
    seedValues.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`,
    );
    seedParams.push(p.id, p.name, p.category, toCents(p.price), p.rating, null, p.stock, p.description);
  });
  await pool.query(
    `INSERT INTO products (id, name, category, price_cents, rating, image, stock, description)
     VALUES ${seedValues.join(', ')}
     ON CONFLICT (id) DO NOTHING`,
    seedParams,
  );
  console.log('[db] Postgres connected: schema applied, catalog seeded.');

  async function withTransaction(fn) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async function nextId(client, table, prefix, floor) {
    await client.query('SELECT pg_advisory_xact_lock($1)', [ID_LOCK_KEY]);
    const pattern = `^${prefix}-([0-9]+)$`;
    const { rows } = await client.query(
      `SELECT COALESCE(MAX((substring(id FROM $1))::int), $2) + 1 AS next FROM ${table}`,
      [pattern, floor],
    );
    return `${prefix}-${rows[0].next}`;
  }

  return {
    async listProducts() {
      // Numeric-suffix order == insertion order for prod-N ids, matching the
      // in-memory array order (seed order, then append order).
      const { rows } = await pool.query(
        `SELECT * FROM products ORDER BY (substring(id FROM '^prod-([0-9]+)$'))::int`,
      );
      return rows.map(rowToProduct);
    },
    async getProduct(id) {
      const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      return rows.length ? rowToProduct(rows[0]) : undefined;
    },
    async createProduct(fields) {
      return withTransaction(async (client) => {
        const id = await nextId(client, 'products', 'prod', 12);
        const { rows } = await client.query(
          `INSERT INTO products (id, name, category, price_cents, rating, image, stock, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [id, fields.name, fields.category, toCents(fields.price), fields.rating, fields.image ?? null, fields.stock, fields.description],
        );
        return rowToProduct(rows[0]);
      });
    },
    async saveProduct(product) {
      const { rows } = await pool.query(
        `UPDATE products
         SET name = $2, category = $3, price_cents = $4, rating = $5, image = $6, stock = $7, description = $8
         WHERE id = $1 RETURNING *`,
        [product.id, product.name, product.category, toCents(product.price), product.rating, product.image ?? null, product.stock ?? 0, product.description ?? ''],
      );
      return rows.length ? rowToProduct(rows[0]) : product;
    },
    async deleteProduct(id) {
      const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return rowCount > 0;
    },
    async createOrder({ customerName, items, total }) {
      return withTransaction(async (client) => {
        const id = await nextId(client, 'orders', 'ord', 0);
        const totalCents = toCents(total);
        // The app charges no tax today: subtotal == total, tax 0.
        await client.query(
          `INSERT INTO orders (id, status, subtotal_cents, tax_cents, total_cents, customer_name)
           VALUES ($1, 'confirmed', $2, 0, $2, $3)`,
          [id, totalCents, customerName],
        );
        for (let position = 0; position < items.length; position++) {
          const item = items[position];
          await client.query(
            `INSERT INTO order_items (order_id, product_id, name, qty, price_cents, position)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, item.productId, item.name, item.qty, toCents(item.price), position],
          );
        }
        return { id, items, total, status: 'confirmed' };
      });
    },
    async getOrder(id) {
      const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (!rows.length) return undefined;
      const order = rows[0];
      const itemsResult = await pool.query(
        'SELECT product_id, name, qty, price_cents FROM order_items WHERE order_id = $1 ORDER BY position',
        [id],
      );
      const items = itemsResult.rows.map((r) => ({
        productId: r.product_id,
        qty: r.qty,
        name: r.name,
        price: r.price_cents / 100,
      }));
      return { id: order.id, items, total: order.total_cents / 100, status: order.status };
    },
  };
}

// ---------------------------------------------------------------------------
// Factory: DATABASE_URL selects the implementation.
// ---------------------------------------------------------------------------

export async function createStore() {
  if (process.env.DATABASE_URL) {
    try {
      return await createPostgresStore(process.env.DATABASE_URL);
    } catch (err) {
      throw new Error(
        `DATABASE_URL is set but Postgres could not be initialized (${err.message}). ` +
          'Refusing to start with the in-memory fallback.',
      );
    }
  }
  return createMemoryStore();
}
