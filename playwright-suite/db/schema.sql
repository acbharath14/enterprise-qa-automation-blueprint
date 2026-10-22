-- DemoMart persistence schema (Phase 1 of the DB-validation spec).
-- Applied idempotently by db/store.mjs on boot when DATABASE_URL is set.
--
-- This is the schema from spec section 3, with three minimal reconciliations
-- forced by the shipped app's actual behavior (payload parity is a hard
-- requirement -- the API must not change shape when persistence is on):
--   1. products gains `stock` and `description`: both are first-class fields
--      of every product the API returns today (and stock drives the cart's
--      "Only N in stock" checks), so they must persist.
--   2. orders.status CHECK also allows 'confirmed': that is the status the
--      API has always set on a placed order ('placed'/'cancelled' arrive
--      with the Phase 3 cancel flow).
--   3. order_items gains `name` (price/name snapshot per line, so a receipt
--      still renders after the product is edited or deleted -- exactly what
--      the in-memory order objects do today) and `position` (cart order of
--      the lines, which the receipt preserves).

CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  rating      NUMERIC(2,1),
  image       TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  status      TEXT NOT NULL DEFAULT 'placed'
              CHECK (status IN ('placed','confirmed','cancelled')),
  subtotal_cents INTEGER NOT NULL,
  tax_cents      INTEGER NOT NULL,
  total_cents    INTEGER NOT NULL,
  customer_name  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL,
  name        TEXT NOT NULL DEFAULT '',
  qty         INTEGER NOT NULL CHECK (qty > 0),
  price_cents INTEGER NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (order_id, product_id)
);
