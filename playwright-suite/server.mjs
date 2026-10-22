import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createStore } from './db/store.mjs';

const port = Number(process.env.PORT || 4173);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(rootDir, 'sample-app', 'index.html');

const securityHeaders = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN' };

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
  });
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...securityHeaders });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  try {
    return JSON.parse((await readBody(req)) || '{}');
  } catch {
    return null;
  }
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------
// Demo store data lives behind the store interface (db/store.mjs): Postgres
// when DATABASE_URL is set, the original in-memory implementation otherwise.
// Initializing the store is the boot sequence for the Postgres path (connect,
// apply schema, seed); with DATABASE_URL unset it is instant and this server
// behaves exactly as it did before the store existed.
// ---------------------------------------------------------------------------

let store;
try {
  store = await createStore();
} catch (err) {
  console.error(`[db] ${err.message}`);
  process.exit(1);
}
// Carts are keyed by the X-Cart-Id request header (each browser context /
// test sends its own id, so parallel tests never share cart state). Requests
// without the header share the 'demo' cart, preserving the hand-driven UX.
const carts = new Map(); // cartId -> [{ productId, qty }]
function cartIdOf(req) {
  const id = req.headers['x-cart-id'];
  return typeof id === 'string' && id.length > 0 ? id : 'demo';
}
function getCart(req) {
  const id = cartIdOf(req);
  if (!carts.has(id)) carts.set(id, []);
  return carts.get(id);
}
function setCart(req, lines) {
  carts.set(cartIdOf(req), lines);
}
function productValidationError(body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }
  if (partial && Object.keys(body).length === 0) {
    return 'At least one field is required';
  }
  if (!partial) {
    for (const field of ['name', 'price', 'category']) {
      if (!(field in body)) return `Missing required field: ${field}`;
    }
  }
  if ('name' in body && (typeof body.name !== 'string' || body.name.trim() === '')) {
    return 'name must be a non-empty string';
  }
  if ('price' in body && (typeof body.price !== 'number' || !(body.price > 0))) {
    return 'price must be a number greater than 0';
  }
  if ('category' in body && (typeof body.category !== 'string' || body.category.trim() === '')) {
    return 'category must be a non-empty string';
  }
  if ('rating' in body && (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5)) {
    return 'rating must be a number between 0 and 5';
  }
  if ('stock' in body && (!Number.isInteger(body.stock) || body.stock < 0)) {
    return 'stock must be a non-negative integer';
  }
  if ('description' in body && typeof body.description !== 'string') {
    return 'description must be a string';
  }
  return null;
}

async function cartView(cart) {
  const items = [];
  for (const line of cart) {
    const p = await store.getProduct(line.productId);
    if (p) items.push({ productId: line.productId, qty: line.qty, name: p.name, price: p.price });
  }
  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  return { items, subtotal };
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];
  const method = req.method || 'GET';

  // ---- Products -----------------------------------------------------------
  if (url === '/api/products' && method === 'GET') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    let list = await store.listProducts();
    const q = params.get('q');
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    const category = params.get('category');
    if (category) list = list.filter((p) => p.category === category);
    const sort = params.get('sort');
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    json(res, 200, list);
    return;
  }
  if (url === '/api/products' && method === 'POST') {
    const body = await readJsonBody(req);
    const err = productValidationError(body);
    if (err) {
      json(res, 400, { error: err });
      return;
    }
    const product = await store.createProduct({
      name: body.name.trim(),
      category: body.category.trim(),
      price: body.price,
      rating: body.rating ?? 0,
      stock: body.stock ?? 0,
      description: body.description ?? '',
    });
    json(res, 201, product);
    return;
  }
  const productMatch = /^\/api\/products\/([^/]+)$/.exec(url);
  if (productMatch) {
    const id = decodeURIComponent(productMatch[1]);
    const current = await store.getProduct(id);
    if (method === 'GET') {
      if (!current) {
        json(res, 404, { error: 'Product not found' });
        return;
      }
      json(res, 200, current);
      return;
    }
    if (method === 'DELETE') {
      if (!current) {
        json(res, 404, { error: 'Product not found' });
        return;
      }
      await store.deleteProduct(id);
      // Drop the deleted product's lines from every cart.
      for (const [cartId, lines] of carts) {
        carts.set(
          cartId,
          lines.filter((line) => line.productId !== id),
        );
      }
      res.writeHead(204, { ...securityHeaders });
      res.end();
      return;
    }
    if (method === 'PUT' || method === 'PATCH') {
      if (!current) {
        json(res, 404, { error: 'Product not found' });
        return;
      }
      const body = await readJsonBody(req);
      const err = productValidationError(body, { partial: method === 'PATCH' });
      if (err) {
        json(res, 400, { error: err });
        return;
      }
      let saved;
      if (method === 'PUT') {
        saved = await store.saveProduct({
          id: current.id,
          name: body.name.trim(),
          category: body.category.trim(),
          price: body.price,
          rating: body.rating ?? 0,
          stock: body.stock ?? 0,
          description: body.description ?? '',
        });
      } else {
        const next = { ...current, ...body, id: current.id };
        if (body.name) next.name = body.name.trim();
        if (body.category) next.category = body.category.trim();
        saved = await store.saveProduct(next);
      }
      json(res, 200, saved);
      return;
    }
  }

  // ---- Cart (single demo cart) ---------------------------------------------
  if (url === '/api/cart' && method === 'GET') {
    json(res, 200, await cartView(getCart(req)));
    return;
  }
  if (url === '/api/cart' && method === 'DELETE') {
    setCart(req, []);
    json(res, 200, await cartView(getCart(req)));
    return;
  }
  if (url === '/api/cart/items' && method === 'POST') {
    const body = await readJsonBody(req);
    const product = body && (await store.getProduct(body.productId));
    if (!product) {
      json(res, 404, { error: 'Product not found' });
      return;
    }
    const qty = body.qty;
    if (!Number.isInteger(qty) || qty <= 0) {
      json(res, 400, { error: 'qty must be a positive integer' });
      return;
    }
    const cart = getCart(req);
    const line = cart.find((l) => l.productId === product.id);
    const newQty = (line ? line.qty : 0) + qty;
    if (newQty > product.stock) {
      json(res, 400, { error: `Only ${product.stock} in stock` });
      return;
    }
    if (line) line.qty = newQty;
    else cart.push({ productId: product.id, qty });
    json(res, 200, await cartView(cart));
    return;
  }
  const cartItemMatch = /^\/api\/cart\/items\/([^/]+)$/.exec(url);
  if (cartItemMatch) {
    const pid = decodeURIComponent(cartItemMatch[1]);
    const cart = getCart(req);
    const line = cart.find((l) => l.productId === pid);
    if (!line) {
      json(res, 404, { error: 'Item not in cart' });
      return;
    }
    if (method === 'DELETE') {
      setCart(req, cart.filter((l) => l.productId !== pid));
      json(res, 200, await cartView(getCart(req)));
      return;
    }
    if (method === 'PATCH') {
      const body = await readJsonBody(req);
      const qty = body && body.qty;
      if (!Number.isInteger(qty) || qty < 0) {
        json(res, 400, { error: 'qty must be a non-negative integer' });
        return;
      }
      const product = await store.getProduct(pid);
      if (qty > product.stock) {
        json(res, 400, { error: `Only ${product.stock} in stock` });
        return;
      }
      if (qty === 0) setCart(req, cart.filter((l) => l.productId !== pid));
      else line.qty = qty;
      json(res, 200, await cartView(getCart(req)));
      return;
    }
  }

  // ---- Orders ---------------------------------------------------------------
  if (url === '/api/orders' && method === 'POST') {
    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      json(res, 400, { error: 'Request body must be a JSON object' });
      return;
    }
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      json(res, 400, { error: 'name is required' });
      return;
    }
    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      json(res, 400, { error: 'a valid email is required' });
      return;
    }
    if (!body.address || typeof body.address !== 'string' || body.address.trim() === '') {
      json(res, 400, { error: 'address is required' });
      return;
    }
    const last4 = body.payment && body.payment.cardLast4;
    if (!last4 || typeof last4 !== 'string' || !/^\d{4}$/.test(last4)) {
      json(res, 400, { error: 'payment.cardLast4 must be 4 digits' });
      return;
    }
    const view = await cartView(getCart(req));
    if (view.items.length === 0) {
      json(res, 422, { error: 'Cart is empty' });
      return;
    }
    const order = await store.createOrder({
      customerName: body.name,
      items: view.items,
      total: view.subtotal,
    });
    setCart(req, []);
    json(res, 201, order);
    return;
  }
  const receiptMatch = /^\/api\/orders\/([^/]+)\/receipt$/.exec(url);
  if (receiptMatch && method === 'GET') {
    const order = await store.getOrder(decodeURIComponent(receiptMatch[1]));
    if (!order) {
      json(res, 404, { error: 'Order not found' });
      return;
    }
    const lines = order.items.map(
      (i) => `${i.name},${i.qty},${i.price.toFixed(2)},${(i.price * i.qty).toFixed(2)}`,
    );
    const csv =
      'product,quantity,unit_price,line_total\n' +
      lines.join('\n') +
      `\ntotal,,,${order.total.toFixed(2)}\n`;
    // ?inline=1 renders the receipt as plain text in the browser tab (for the
    // popup spec — Chromium downloads text/csv instead of rendering it);
    // otherwise it downloads as a CSV attachment (for the download spec).
    const inline = new URL(req.url, 'http://localhost').searchParams.get('inline') === '1';
    res.writeHead(200, {
      'Content-Type': inline ? 'text/plain' : 'text/csv',
      ...(inline ? {} : { 'Content-Disposition': `attachment; filename="receipt-${order.id}.csv"` }),
      ...securityHeaders,
    });
    res.end(csv);
    return;
  }
  const orderMatch = /^\/api\/orders\/([^/]+)$/.exec(url);
  if (orderMatch && method === 'GET') {
    const order = await store.getOrder(decodeURIComponent(orderMatch[1]));
    if (!order) {
      json(res, 404, { error: 'Order not found' });
      return;
    }
    json(res, 200, order);
    return;
  }

  // ---- Product image upload (admin demo) ----------------------------------------
  // Minimal multipart handling: the filename is regex-extracted from the raw
  // body and sanitized, mirroring the old sample app's upload endpoint.
  const imageMatch = /^\/api\/products\/([^/]+)\/image$/.exec(url);
  if (imageMatch && method === 'POST') {
    const product = await store.getProduct(decodeURIComponent(imageMatch[1]));
    if (!product) {
      json(res, 404, { error: 'Product not found' });
      return;
    }
    const raw = await readBody(req);
    const match = /filename="([^"]+)"/.exec(raw);
    // Strip angle brackets/quotes: a stored filename rendered as HTML
    // would otherwise be an XSS vector.
    const filename = match ? match[1].replace(/[<>\"']/g, '') : 'unknown';
    product.image = filename;
    await store.saveProduct(product);
    json(res, 200, { ok: true, filename });
    return;
  }

  // ---- Demo login (unchanged) -------------------------------------------------
  if (url === '/api/login' && method === 'POST') {
    const body = await readJsonBody(req);
    if (body && body.username === 'admin' && body.password === 'secret') {
      json(res, 200, { ok: true, token: 'demo-token' });
      return;
    }
    json(res, 401, { error: 'Invalid credentials' });
    return;
  }

  // ---- Same-origin fixture page for the iframe spec -----------------------------
  if (url === '/payment-frame') {
    const frame = [
      '<!doctype html>',
      '<html lang="en"><head><meta charset="utf-8"><title>Secure payment</title></head><body>',
      '<h1>Secure payment</h1>',
      '<p data-testid="frame-note">Demo secure payment frame (same origin).</p>',
      '<label>Cardholder name <input data-testid="frame-cardholder" name="cardholder"></label>',
      '</body></html>',
    ].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...securityHeaders });
    res.end(frame);
    return;
  }

  if (url.startsWith('/api/')) {
    json(res, 404, { error: 'Not found' });
    return;
  }
  const html = await readFile(appPath, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...securityHeaders });
  res.end(html);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sample app running at http://127.0.0.1:${port}`);
});
