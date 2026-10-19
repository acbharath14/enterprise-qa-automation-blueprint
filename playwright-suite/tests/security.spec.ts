import { test, expect } from '../fixtures/test';

/**
 * Baseline security checks even a demo app should model: secure headers,
 * JSON (not HTML) error responses, and no reflection of untrusted input.
 */
test('HTML responses carry the nosniff header', async ({ request }) => {
  const res = await request.get('/');
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
});

test('API responses carry the nosniff header', async ({ request }) => {
  const res = await request.get('/api/products');
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
});

test('clickjacking defense header is present', async ({ request }) => {
  for (const url of ['/', '/payment-frame', '/api/products']) {
    const res = await request.get(url);
    expect(res.headers()['x-frame-options']).toBe('SAMEORIGIN');
  }
});

test('product names are HTML-escaped in the catalog', async ({ page, request }) => {
  // A product name carrying markup must render as text, never as HTML.
  const created = await request.post('/api/products', {
    data: { name: '<img src=x onerror=alert(1)>', price: 1, category: 'test' },
  });
  const product = await created.json();
  try {
    await page.goto('/');
    await page.getByTestId('search-input').fill('src=x');
    await expect(page.getByTestId(`product-card-${product.id}`)).toBeVisible();
    const html = await page.getByTestId(`product-name-${product.id}`).innerHTML();
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  } finally {
    await request.delete(`/api/products/${product.id}`);
  }
});
