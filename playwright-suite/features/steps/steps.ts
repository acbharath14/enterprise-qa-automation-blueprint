/**
 * Step definitions for the DemoMart BDD suite (playwright-bdd).
 *
 * Covers the 5 core features: store-smoke, catalog, search, forms, api
 * (26 scenarios). UI steps drive the existing Page Objects
 * (pages/CatalogPage, CartPage, CheckoutPage, LoginPage); API steps use
 * Playwright's `request` fixture with the per-scenario X-Cart-Id isolation
 * from ./fixtures.
 *
 * Conventions:
 * - Steps are declarative ("what"); all selectors live in the Page Objects.
 * - Inline `page.getByTestId(...)` is used only where no Page Object method
 *   exists yet (cart badge, line totals, card counts) — see README for the
 *   suggested Page Object additions.
 * - No trailing commas in multiline calls (repo pins TypeScript 7.0.2,
 *   which rejects them).
 */
import { expect } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import type { BddState } from './fixtures';
import { CatalogPage } from '../../pages/CatalogPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { LoginPage } from '../../pages/LoginPage';

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/** Pin the page's session cart to the scenario's isolated cart id. Must run
 *  before the first navigation of a UI scenario (addInitScript only applies
 *  to subsequent navigations). Mirrors fixtures/test.ts cart/checkout setup. */
async function pinCartOnce(page: Page, bdd: BddState): Promise<void> {
  if (bdd.cartPinned) return;
  await page.addInitScript((cartId: string) => {
    try {
      sessionStorage.setItem('demomart-cart-id', cartId);
    } catch {
      /* ignore */
    }
  }, bdd.cartHeaders['X-Cart-Id']);
  bdd.cartPinned = true;
}

/** Mint a product through the API and remember it on the scenario state. */
async function mintProduct(
  request: APIRequestContext,
  bdd: BddState,
  tag: string,
  price = 42.5
): Promise<void> {
  const name = `BDD ${tag} ${Date.now()}`;
  const res = await request.post('/api/products', {
    data: { name, price, category: 'test', stock: 100000 }
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  bdd.productId = body.id as string;
  bdd.productName = name;
  bdd.productPrice = price;
}

function money(text: string | null): number {
  return Number((text || '').replace(/[^0-9.]/g, ''));
}

/** 'ord-<number>' -> /^ord-\d+$/ ; other patterns pass through. */
function toPattern(pattern: string): RegExp {
  return new RegExp(
    `^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('<number>', '\\d+')}$`
  );
}

const VALID_SHIPPING = {
  name: 'Payload Buyer',
  email: 'payload@example.com',
  address: '1 Payload Lane'
};
const VALID_CARD = { cardNumber: '4111111111111234', expiry: '12/30', cvc: '123' };

/* ------------------------------------------------------------------ */
/* Navigation (UI)                                                     */
/* ------------------------------------------------------------------ */

Given('I am on the DemoMart homepage', async ({ page, bdd }) => {
  await pinCartOnce(page, bdd);
  await new CatalogPage(page).goto();
});

Given('I am on the DemoMart catalog', async ({ page, bdd }) => {
  await pinCartOnce(page, bdd);
  await new CatalogPage(page).goto();
});

Given(
  'I am on the checkout page with a product in my cart',
  async ({ page, request, bdd }) => {
    await mintProduct(request, bdd, 'checkout-bg');
    await request.post('/api/cart/items', {
      headers: bdd.cartHeaders,
      data: { productId: bdd.productId, qty: 1 }
    });
    await pinCartOnce(page, bdd);
    const checkout = new CheckoutPage(page);
    await checkout.goto();
    await expect(checkout.step1).toBeVisible();
  }
);

/* ------------------------------------------------------------------ */
/* store-smoke.feature                                                 */
/* ------------------------------------------------------------------ */

Then('the product grid is visible', async ({ page }) => {
  await expect(new CatalogPage(page).grid).toBeVisible();
});

Then(/^the card for "([^"]+)" \((\S+)\) is visible$/, async ({ page }, name: string, id: string) => {
  const card = new CatalogPage(page).productCard(id);
  await expect(card).toBeVisible();
  await expect(card).toContainText(name);
});

Then('{int} product cards are shown on page 1', async ({ page }, count: number) => {
  await expect(new CatalogPage(page).grid.getByTestId(/^product-card-/)).toHaveCount(count);
});

Given('a product exists in the catalog', async ({ request, bdd }) => {
  await mintProduct(request, bdd, 'smoke');
});

When('I search for the product', async ({ page, bdd }) => {
  await new CatalogPage(page).search(bdd.productName || '');
});

When('I add it to the cart', async ({ page, bdd }) => {
  bdd.badgeBefore = money(await page.getByTestId('cart-badge').textContent());
  await new CatalogPage(page).addToCart(bdd.productId || '');
});

Then('the cart badge count increases by 1', async ({ page, bdd }) => {
  await expect
    .poll(async () => money(await page.getByTestId('cart-badge').textContent()), { timeout: 10000 })
    .toBe((bdd.badgeBefore || 0) + 1);
});

Then('a confirmation toast shows the product name', async ({ page, bdd }) => {
  const toast = new CatalogPage(page).toast;
  await expect(toast).toBeVisible();
  await expect(toast).toContainText(bdd.productName || '');
});

Given(/^a product priced at \$([\d.]+) exists in the catalog$/, async ({ request, bdd }, price: string) => {
  await mintProduct(request, bdd, 'priced', Number(price));
});

When('I open the cart', async ({ page }) => {
  await new CartPage(page).goto();
});

Then('the cart shows the product line item', async ({ page, bdd }) => {
  await expect(new CartPage(page).lineItem(bdd.productId || '')).toBeVisible();
});

Then('the line total is {string}', async ({ page, bdd }, expected: string) => {
  await expect(page.getByTestId(`cart-line-total-${bdd.productId}`)).toHaveText(expected);
});

Then('the cart subtotal equals the sum of the line totals', async ({ page }) => {
  const cart = new CartPage(page);
  const subtotal = money(await cart.subtotal.textContent());
  const lineTotals = await page
    .locator('[data-testid^="cart-line-total-"]')
    .allTextContents()
    .then((texts) => texts.map((t) => money(t)));
  const sum = lineTotals.reduce((a, b) => a + b, 0);
  expect(subtotal).toBeCloseTo(sum, 2);
});

When('I start checkout', async ({ page }) => {
  const cart = new CartPage(page);
  await cart.checkoutButton.click();
  await expect(new CheckoutPage(page).step1).toBeVisible();
});

When('I enter valid shipping details', async ({ page }) => {
  await new CheckoutPage(page).fillShipping(VALID_SHIPPING);
});

When('I enter valid payment details', async ({ page, bdd }) => {
  bdd.cardNumber = VALID_CARD.cardNumber;
  await new CheckoutPage(page).fillPayment(VALID_CARD);
});

When('I place the order', async ({ page, bdd }) => {
  const checkout = new CheckoutPage(page);
  const orderRequest = page.waitForRequest(
    (req) => req.url().includes('/api/orders') && req.method() === 'POST'
  );
  await checkout.placeOrder();
  bdd.orderPayload = (await orderRequest).postDataJSON();
});

Then('the order confirmation is shown', async ({ page }) => {
  await expect(new CheckoutPage(page).confirmation).toBeVisible();
});

Then('the order id matches the pattern {string}', async ({ page }, pattern: string) => {
  await expect(new CheckoutPage(page).orderId).toHaveText(toPattern(pattern));
});

Then('the confirmation lists the product', async ({ page, bdd }) => {
  await expect(new CheckoutPage(page).confirmation).toContainText(bdd.productName || '');
});

Then('the order total equals the sum of the line totals', async ({ page, request, bdd }) => {
  const orderId = (await new CheckoutPage(page).orderId.textContent()) || '';
  const order = await (await request.get(`/api/orders/${orderId.trim()}`)).json();
  const sum = (order.items as Array<{ price: number; qty: number }>).reduce(
    (a, i) => a + i.price * i.qty,
    0
  );
  expect(order.total).toBeCloseTo(sum, 2);
});

When(
  'I log in with username {string} and password {string}',
  async ({ page }, username: string, password: string) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
  }
);

Then('the logout button is visible', async ({ page }) => {
  await expect(new LoginPage(page).logoutButton).toBeVisible();
});

Then('the user label shows {string}', async ({ page }, label: string) => {
  await expect(new LoginPage(page).userLabel).toContainText(label);
});

/* ------------------------------------------------------------------ */
/* catalog.feature                                                     */
/* ------------------------------------------------------------------ */

When('I page through the whole catalog', async ({ page, bdd }) => {
  const catalog = new CatalogPage(page);
  const seen = new Set<string>();
  const perPage: number[] = [];
  for (let i = 0; i < 10; i++) {
    const ids = await catalog.grid
      .getByTestId(/^product-card-/)
      .evaluateAll((els) =>
        els.map((e) => (e.getAttribute('data-testid') || '').replace('product-card-', ''))
      );
    perPage.push(ids.length);
    ids.forEach((id) => seen.add(id));
    if (await catalog.nextButton.isDisabled()) break;
    await catalog.nextButton.click();
  }
  bdd.catalogIds = [...seen];
  bdd.cardsPerPage = perPage;
});

Then(
  /^all (\d+) seeded products \((\S+) through (\S+)\) are shown$/,
  async ({ bdd }, total: string, from: string, to: string) => {
    const prefix = from.replace(/\d+$/, '');
    const start = Number(from.replace(prefix, ''));
    const end = Number(to.replace(prefix, ''));
    const expected = Array.from({ length: end - start + 1 }, (_, i) => `${prefix}${start + i}`);
    expect(bdd.catalogIds || []).toHaveLength(Number(total));
    for (const id of expected) {
      expect(bdd.catalogIds || []).toContain(id);
    }
  }
);

Then('each full page shows exactly 6 product cards', async ({ bdd }) => {
  for (const count of bdd.cardsPerPage || []) {
    expect(count).toBe(6);
  }
});

Then(
  /^the (\S+) card shows (name|price|category|rating) "([^"]+)"$/,
  async ({ page }, id: string, field: string, expected: string) => {
    await expect(new CatalogPage(page).productCard(id)).toContainText(expected);
  }
);

Then(
  /^the categories "([^"]+)", "([^"]+)", "([^"]+)" and "([^"]+)" all appear$/,
  async ({ page }, c1: string, c2: string, c3: string, c4: string) => {
    const options = await new CatalogPage(page).categoryFilter.locator('option').allTextContents();
    for (const c of [c1, c2, c3, c4]) {
      expect(options.join(' ')).toContain(c);
    }
  }
);

/* ------------------------------------------------------------------ */
/* search.feature                                                      */
/* ------------------------------------------------------------------ */

When('I search for {string}', async ({ page }, q: string) => {
  await new CatalogPage(page).search(q);
});

Given('I have searched for {string}', async ({ page }, q: string) => {
  await new CatalogPage(page).search(q);
});

Then('{int} product cards are shown', async ({ page }, count: number) => {
  await expect(new CatalogPage(page).grid.getByTestId(/^product-card-/)).toHaveCount(count);
});

Then(/^the cards for (.+) are visible$/, async ({ page }, list: string) => {
  const catalog = new CatalogPage(page);
  const ids = list.split(/,| and /).map((s) => s.trim()).filter(Boolean);
  for (const id of ids) {
    await expect(catalog.productCard(id)).toBeVisible();
  }
});

Then('the no-results message is hidden', async ({ page }) => {
  await expect(new CatalogPage(page).noResults).toBeHidden();
});

Then('the no-results message is visible', async ({ page }) => {
  await expect(new CatalogPage(page).noResults).toBeVisible();
});

When('I clear the search', async ({ page }) => {
  await new CatalogPage(page).search('');
});

Then(/^the page indicator shows "([^"]+)"$/, async ({ page }, text: string) => {
  const indicator = new CatalogPage(page).pageInfo;
  if (text.endsWith('...')) {
    await expect(indicator).toContainText(text.slice(0, -3));
  } else {
    await expect(indicator).toHaveText(text);
  }
});

/* ------------------------------------------------------------------ */
/* forms.feature                                                       */
/* ------------------------------------------------------------------ */

When('I submit the shipping form with all fields empty', async ({ page }) => {
  await new CheckoutPage(page).next();
});

Then(
  /^an inline error "([^"]+)" is shown for the (\w+) field$/,
  async ({ page }, message: string, field: string) => {
    const checkout = new CheckoutPage(page);
    const locator =
      field === 'name'
        ? checkout.nameError
        : field === 'email'
          ? checkout.emailError
          : checkout.addressError;
    await expect(locator).toContainText(message);
  }
);

Then('the error summary is visible', async ({ page }) => {
  await expect(new CheckoutPage(page).errorSummary).toBeVisible();
});

When('I enter shipping details with email {string}', async ({ page }, email: string) => {
  await new CheckoutPage(page).fillShipping({ ...VALID_SHIPPING, email });
});

When('I continue to the next step', async ({ page }) => {
  await new CheckoutPage(page).next();
});

Then('the wizard stays on step 1', async ({ page }) => {
  await expect(new CheckoutPage(page).step1).toBeVisible();
});

When('I continue to the payment step', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.next();
  await expect(checkout.step2).toBeVisible();
});

When('I continue to the review step', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.next();
  await expect(checkout.step3).toBeVisible();
});

Then(/^the order request payload contains (.+) "([^"]+)"$/, async ({ bdd }, field: string, expected: string) => {
  const payload = bdd.orderPayload || {};
  const value =
    field === 'shipping method' ? payload.shippingMethod : payload[field];
  expect(String(value)).toBe(expected);
});

Then("the order request payload contains the card's last 4 digits", async ({ bdd }) => {
  const last4 = (bdd.cardNumber || '').replace(/\s/g, '').slice(-4);
  expect(bdd.orderPayload?.payment?.cardLast4).toBe(last4);
});

/* ------------------------------------------------------------------ */
/* api.feature — product catalog endpoints                             */
/* ------------------------------------------------------------------ */

When(/I request (GET|POST|PUT|PATCH|DELETE) (\S+)/, async ({ request, bdd }, method: string, path: string) => {
  const res = await (request as any)[method.toLowerCase()](path);
  bdd.lastResponse = res;
  try {
    bdd.lastJson = await res.json();
  } catch {
    bdd.lastJson = undefined;
  }
});

Then(/^the response is (\d+) with JSON content$/, async ({ bdd }, status: string) => {
  expect(bdd.lastResponse?.status()).toBe(Number(status));
  expect(bdd.lastResponse?.headers()['content-type']).toContain('application/json');
});

Then('the list contains prod-1 through prod-12', async ({ bdd }) => {
  const ids = (bdd.lastJson as Array<{ id: string }>).map((p) => p.id);
  for (let i = 1; i <= 12; i++) {
    expect(ids).toContain(`prod-${i}`);
  }
});

Then(/^each product has (.+)$/, async ({ bdd }, fields: string) => {
  const names = fields.split(/,| and /).map((s) => s.trim()).filter(Boolean);
  for (const product of bdd.lastJson as Array<Record<string, unknown>>) {
    for (const name of names) {
      expect(product).toHaveProperty(name);
    }
  }
});

Then(
  /^(\d+) products are returned and every name contains "([^"]+)"$/,
  async ({ bdd }, count: string, q: string) => {
    const products = bdd.lastJson as Array<{ name: string }>;
    expect(products).toHaveLength(Number(count));
    for (const p of products) {
      expect(p.name.toLowerCase()).toContain(q.toLowerCase());
    }
  }
);

Then(
  /^(\d+) products are returned and every category is "([^"]+)"$/,
  async ({ bdd }, count: string, category: string) => {
    const products = bdd.lastJson as Array<{ category: string }>;
    expect(products).toHaveLength(Number(count));
    for (const p of products) {
      expect(p.category).toBe(category);
    }
  }
);

Then('the products are ordered by ascending price', async ({ bdd }) => {
  const prices = (bdd.lastJson as Array<{ price: number }>).map((p) => p.price);
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});

Then('every product has a price greater than 0', async ({ bdd }) => {
  for (const p of bdd.lastJson as Array<{ price: number }>) {
    expect(p.price).toBeGreaterThan(0);
  }
});

Then('every product has a rating between 0 and 5', async ({ bdd }) => {
  for (const p of bdd.lastJson as Array<{ rating: number }>) {
    expect(p.rating).toBeGreaterThanOrEqual(0);
    expect(p.rating).toBeLessThanOrEqual(5);
  }
});

Then('every product has a non-negative integer stock', async ({ bdd }) => {
  for (const p of bdd.lastJson as Array<{ stock: number }>) {
    expect(Number.isInteger(p.stock)).toBe(true);
    expect(p.stock).toBeGreaterThanOrEqual(0);
  }
});

Then('the response is 200 and the product name is {string}', async ({ bdd }, name: string) => {
  expect(bdd.lastResponse?.status()).toBe(200);
  expect(bdd.lastJson?.name).toBe(name);
});

Then('the response is 404 with JSON content and an error field', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(404);
  expect(bdd.lastResponse?.headers()['content-type']).toContain('application/json');
  expect(bdd.lastJson).toHaveProperty('error');
});

When('I create a product named {string} priced at {float}', async ({ request, bdd }, name: string, price: number) => {
  const res = await request.post('/api/products', {
    data: { name, price, category: 'test', stock: 100 }
  });
  bdd.lastResponse = res;
  bdd.lastJson = await res.json();
  if (res.status() === 201) {
    bdd.productId = bdd.lastJson.id as string;
    bdd.productName = name;
  }
});

Then('the response is 201 and the product is returned', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(201);
  expect(bdd.lastJson).toHaveProperty('id');
});

When('I patch the product price to {float}', async ({ request, bdd }, price: number) => {
  const res = await request.patch(`/api/products/${bdd.productId}`, { data: { price } });
  bdd.lastResponse = res;
  bdd.lastJson = await res.json();
});

Then('the response is 200 and the price is {float}', async ({ bdd }, price: number) => {
  expect(bdd.lastResponse?.status()).toBe(200);
  expect(bdd.lastJson?.price).toBe(price);
});

When('I create a product with a negative price', async ({ request, bdd }) => {
  const res = await request.post('/api/products', {
    data: { name: 'BDD Bad Price', price: -5, category: 'test' }
  });
  bdd.lastResponse = res;
  try {
    bdd.lastJson = await res.json();
  } catch {
    bdd.lastJson = undefined;
  }
});

Then('the response is 400 with an error field', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(400);
  expect(bdd.lastJson).toHaveProperty('error');
});

When('I delete the product', async ({ request, bdd }) => {
  bdd.lastResponse = await request.delete(`/api/products/${bdd.productId}`);
});

Then('the response is 204', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(204);
});

Then('requesting the product afterwards returns 404', async ({ request, bdd }) => {
  const res = await request.get(`/api/products/${bdd.productId}`);
  expect(res.status()).toBe(404);
});

/* ------------------------------------------------------------------ */
/* api.feature — cart endpoints                                        */
/* ------------------------------------------------------------------ */

Given(/^a product priced at \$([\d.]+) exists$/, async ({ request, bdd }, price: string) => {
  await mintProduct(request, bdd, 'api', Number(price));
});

When('I add {int} units to my cart', async ({ request, bdd }, qty: number) => {
  bdd.lastResponse = await request.post('/api/cart/items', {
    headers: bdd.cartHeaders,
    data: { productId: bdd.productId, qty }
  });
});

Then('my cart line shows quantity {int}', async ({ request, bdd }, qty: number) => {
  const cart = await (await request.get('/api/cart', { headers: bdd.cartHeaders })).json();
  const line = (cart.items as Array<{ productId: string; qty: number }>).find(
    (i) => i.productId === bdd.productId
  );
  expect(line?.qty).toBe(qty);
});

Then(/^the line total is (\d+) x \$([\d.]+)$/, async ({ request, bdd }, qty: string, unit: string) => {
  const cart = await (await request.get('/api/cart', { headers: bdd.cartHeaders })).json();
  const line = (cart.items as Array<{ productId: string; qty: number; price: number }>).find(
    (i) => i.productId === bdd.productId
  );
  expect((line?.qty || 0) * (line?.price || 0)).toBeCloseTo(Number(qty) * Number(unit), 2);
});

When('I add an unknown product to my cart', async ({ request, bdd }) => {
  bdd.lastResponse = await request.post('/api/cart/items', {
    headers: bdd.cartHeaders,
    data: { productId: 'no-such-product', qty: 1 }
  });
});

Then('the response is 404', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(404);
});

When(/^I add (\S+) with quantity (\d+)$/, async ({ request, bdd }, productId: string, qty: string) => {
  bdd.lastResponse = await request.post('/api/cart/items', {
    headers: bdd.cartHeaders,
    data: { productId, qty: Number(qty) }
  });
});

Then('the response is 400', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(400);
});

Given('a product exists and 1 unit is in my cart', async ({ request, bdd }) => {
  await mintProduct(request, bdd, 'qty');
  await request.post('/api/cart/items', {
    headers: bdd.cartHeaders,
    data: { productId: bdd.productId, qty: 1 }
  });
});

When('I set the quantity to {int}', async ({ request, bdd }, qty: number) => {
  bdd.lastResponse = await request.patch(`/api/cart/items/${bdd.productId}`, {
    headers: bdd.cartHeaders,
    data: { qty }
  });
});

Then('the cart line shows quantity {int}', async ({ request, bdd }, qty: number) => {
  const cart = await (await request.get('/api/cart', { headers: bdd.cartHeaders })).json();
  const line = (cart.items as Array<{ productId: string; qty: number }>).find(
    (i) => i.productId === bdd.productId
  );
  expect(line?.qty).toBe(qty);
});

When('I remove the line from my cart', async ({ request, bdd }) => {
  bdd.lastResponse = await request.delete(`/api/cart/items/${bdd.productId}`, {
    headers: bdd.cartHeaders
  });
});

Then('the product is no longer in my cart', async ({ request, bdd }) => {
  const cart = await (await request.get('/api/cart', { headers: bdd.cartHeaders })).json();
  const line = (cart.items as Array<{ productId: string }>).find(
    (i) => i.productId === bdd.productId
  );
  expect(line).toBeUndefined();
});

Then('removing it again returns 404', async ({ request, bdd }) => {
  const res = await request.delete(`/api/cart/items/${bdd.productId}`, {
    headers: bdd.cartHeaders
  });
  expect(res.status()).toBe(404);
});

/* ------------------------------------------------------------------ */
/* api.feature — order endpoints                                       */
/* ------------------------------------------------------------------ */

const VALID_ORDER = {
  name: 'Ada',
  email: 'ada@example.com',
  address: '1 Main St',
  payment: { cardLast4: '4242' }
};

Given('{int} units of a product are in my cart', async ({ request, bdd }, qty: number) => {
  await mintProduct(request, bdd, 'order');
  await request.post('/api/cart/items', {
    headers: bdd.cartHeaders,
    data: { productId: bdd.productId, qty }
  });
});

Given('{int} unit of a product is in my cart', async ({ request, bdd }, qty: number) => {
  await mintProduct(request, bdd, 'order1');
  await request.post('/api/cart/items', {
    headers: bdd.cartHeaders,
    data: { productId: bdd.productId, qty }
  });
});

When('I place an order with valid buyer details', async ({ request, bdd }) => {
  const res = await request.post('/api/orders', {
    headers: bdd.cartHeaders,
    data: VALID_ORDER
  });
  bdd.lastResponse = res;
  bdd.lastJson = await res.json();
  if (res.status() === 201) {
    bdd.orderId = bdd.lastJson.id as string;
  }
});

Then('the response is 201', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(201);
});

Then('the order id matches the pattern {string}', async ({ bdd }, pattern: string) => {
  expect(bdd.lastJson?.id).toMatch(toPattern(pattern));
});

Then('the order status is {string}', async ({ bdd }, status: string) => {
  expect(bdd.lastJson?.status).toBe(status);
});

Then(
  'the order contains the product with quantity {int}',
  async ({ bdd }, qty: number) => {
    const item = (bdd.lastJson?.items as Array<{ productId: string; qty: number }>).find(
      (i) => i.productId === bdd.productId
    );
    expect(item?.qty).toBe(qty);
  }
);

Then('the order total equals the sum of the line totals', async ({ bdd }) => {
  const items = bdd.lastJson?.items as Array<{ price: number; qty: number }>;
  const sum = items.reduce((a, i) => a + i.price * i.qty, 0);
  expect(bdd.lastJson?.total).toBeCloseTo(sum, 2);
});

Then('my cart no longer contains the product', async ({ request, bdd }) => {
  const cart = await (await request.get('/api/cart', { headers: bdd.cartHeaders })).json();
  const line = (cart.items as Array<{ productId: string }>).find(
    (i) => i.productId === bdd.productId
  );
  expect(line).toBeUndefined();
});

Then('I can retrieve the order by its id', async ({ request, bdd }) => {
  const res = await request.get(`/api/orders/${bdd.orderId}`, { headers: bdd.cartHeaders });
  expect(res.status()).toBe(200);
});

Given('my cart is empty', async ({ bdd }) => {
  bdd.cartHeaders = {
    'X-Cart-Id': `bdd-empty-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  };
});

When('I place an order', async ({ request, bdd }) => {
  const res = await request.post('/api/orders', {
    headers: bdd.cartHeaders,
    data: VALID_ORDER
  });
  bdd.lastResponse = res;
  try {
    bdd.lastJson = await res.json();
  } catch {
    bdd.lastJson = undefined;
  }
});

Then('the response is 422', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(422);
});

When('I place an order with email {string}', async ({ request, bdd }, email: string) => {
  const res = await request.post('/api/orders', {
    headers: bdd.cartHeaders,
    data: { ...VALID_ORDER, email }
  });
  bdd.lastResponse = res;
  try {
    bdd.lastJson = await res.json();
  } catch {
    bdd.lastJson = undefined;
  }
});

When('I download the receipt for the order', async ({ request, bdd }) => {
  bdd.lastResponse = await request.get(`/api/orders/${bdd.orderId}/receipt`, {
    headers: bdd.cartHeaders
  });
});

Then('the response is 200 with CSV content', async ({ bdd }) => {
  expect(bdd.lastResponse?.status()).toBe(200);
  expect(bdd.lastResponse?.headers()['content-type']).toContain('text/csv');
});

Then('the download is named {string}', async ({ bdd }, name: string) => {
  const expected = name.replace('<order id>', bdd.orderId || '');
  expect(bdd.lastResponse?.headers()['content-disposition']).toContain(expected);
});

Then('the CSV has the header {string}', async ({ bdd }, header: string) => {
  const text = await bdd.lastResponse?.text();
  expect(text?.split('\n')[0]?.trim()).toBe(header);
});

Then('the CSV contains the product name', async ({ bdd }) => {
  const text = await bdd.lastResponse?.text();
  expect(text).toContain(bdd.productName || '');
});

Then('downloading the receipt for an unknown order returns 404', async ({ request, bdd }) => {
  const res = await request.get('/api/orders/no-such-order/receipt', {
    headers: bdd.cartHeaders
  });
  expect(res.status()).toBe(404);
});
