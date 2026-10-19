import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

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
// Demo store data. Deterministic seed; the API mutates it in memory.
// ---------------------------------------------------------------------------

const seedProducts = [
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

let products = seedProducts.map((p) => ({ ...p }));
let nextProductId = 13;
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
let orders = [];
let nextOrderId = 1;

function findProduct(id) {
  return products.find((p) => p.id === id);
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

function cartView(cart) {
  const items = cart
    .filter((line) => findProduct(line.productId))
    .map((line) => {
      const p = findProduct(line.productId);
      return { productId: line.productId, qty: line.qty, name: p.name, price: p.price };
    });
  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  return { items, subtotal };
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];
  const method = req.method || 'GET';

  // ---- Products -----------------------------------------------------------
  if (url === '/api/products' && method === 'GET') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    let list = [...products];
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
    const product = {
      id: `prod-${nextProductId++}`,
      name: body.name.trim(),
      category: body.category.trim(),
      price: body.price,
      rating: body.rating ?? 0,
      stock: body.stock ?? 0,
      description: body.description ?? '',
    };
    products.push(product);
    json(res, 201, product);
    return;
  }
  const productMatch = /^\/api\/products\/([^/]+)$/.exec(url);
  if (productMatch) {
    const id = decodeURIComponent(productMatch[1]);
    const idx = products.findIndex((p) => p.id === id);
    if (method === 'GET') {
      if (idx === -1) {
        json(res, 404, { error: 'Product not found' });
        return;
      }
      json(res, 200, products[idx]);
      return;
    }
    if (method === 'DELETE') {
      if (idx === -1) {
        json(res, 404, { error: 'Product not found' });
        return;
      }
      products.splice(idx, 1);
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
      if (idx === -1) {
        json(res, 404, { error: 'Product not found' });
        return;
      }
      const body = await readJsonBody(req);
      const err = productValidationError(body, { partial: method === 'PATCH' });
      if (err) {
        json(res, 400, { error: err });
        return;
      }
      const current = products[idx];
      if (method === 'PUT') {
        products[idx] = {
          id: current.id,
          name: body.name.trim(),
          category: body.category.trim(),
          price: body.price,
          rating: body.rating ?? 0,
          stock: body.stock ?? 0,
          description: body.description ?? '',
        };
      } else {
        const next = { ...current, ...body, id: current.id };
        if (body.name) next.name = body.name.trim();
        if (body.category) next.category = body.category.trim();
        products[idx] = next;
      }
      json(res, 200, products[idx]);
      return;
    }
  }

  // ---- Cart (single demo cart) ---------------------------------------------
  if (url === '/api/cart' && method === 'GET') {
    json(res, 200, cartView(getCart(req)));
    return;
  }
  if (url === '/api/cart' && method === 'DELETE') {
    setCart(req, []);
    json(res, 200, cartView(getCart(req)));
    return;
  }
  if (url === '/api/cart/items' && method === 'POST') {
    const body = await readJsonBody(req);
    const product = body && findProduct(body.productId);
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
    json(res, 200, cartView(cart));
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
      json(res, 200, cartView(getCart(req)));
      return;
    }
    if (method === 'PATCH') {
      const body = await readJsonBody(req);
      const qty = body && body.qty;
      if (!Number.isInteger(qty) || qty < 0) {
        json(res, 400, { error: 'qty must be a non-negative integer' });
        return;
      }
      const product = findProduct(pid);
      if (qty > product.stock) {
        json(res, 400, { error: `Only ${product.stock} in stock` });
        return;
      }
      if (qty === 0) setCart(req, cart.filter((l) => l.productId !== pid));
      else line.qty = qty;
      json(res, 200, cartView(getCart(req)));
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
    const view = cartView(getCart(req));
    if (view.items.length === 0) {
      json(res, 422, { error: 'Cart is empty' });
      return;
    }
    const order = {
      id: `ord-${nextOrderId++}`,
      items: view.items,
      total: view.subtotal,
      status: 'confirmed',
    };
    orders.push(order);
    setCart(req, []);
    json(res, 201, order);
    return;
  }
  const receiptMatch = /^\/api\/orders\/([^/]+)\/receipt$/.exec(url);
  if (receiptMatch && method === 'GET') {
    const order = orders.find((o) => o.id === decodeURIComponent(receiptMatch[1]));
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
    const order = orders.find((o) => o.id === decodeURIComponent(orderMatch[1]));
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
    const product = findProduct(decodeURIComponent(imageMatch[1]));
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
