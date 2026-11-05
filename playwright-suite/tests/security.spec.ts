import { test, expect } from '../fixtures/test';

/**
 * Baseline security checks even a demo app should model: secure headers,
 * JSON (not HTML) error responses, and no reflection of untrusted input.
 */
const nosniffCases = [
  { name: 'HTML responses carry the nosniff header', url: '/' },
  { name: 'API responses carry the nosniff header', url: '/api/products' },
];
for (const { name, url } of nosniffCases) {
  test(name, async ({ request }) => {
    const res = await request.get(url);
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });
}

// The clickjacking defense header is covered by pentest.spec.ts
// (byte-identical test; the pentest copy is canonical).

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
