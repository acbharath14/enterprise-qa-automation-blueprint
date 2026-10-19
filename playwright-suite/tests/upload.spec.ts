import { test, expect } from '../fixtures/test';

test('product image upload sanitizes a hostile filename', async ({ request }) => {
  const response = await request.post('/api/products/prod-1/image', {
    multipart: {
      image: {
        name: '<script>alert(1)</script>.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake-png-bytes')
      }
    }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.filename).not.toContain('<');
  expect(body.filename).not.toContain('>');
});
