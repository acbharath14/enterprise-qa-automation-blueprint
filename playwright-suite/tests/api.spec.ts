import { test, expect } from '@playwright/test';

/**
 * Direct API tests (no browser): pin the contract of the backend the UI
 * consumes. UI specs prove the journey; these prove the API itself.
 */
test.describe('metrics API', () => {
  test('returns the metrics payload as JSON', async ({ request }) => {
    const res = await request.get('/api/metrics');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('application/json');
    const body = await res.json();
    expect(body).toEqual(
      expect.objectContaining({
        coverage: expect.any(Number),
        apiHealth: expect.any(String),
        p95LatencyMs: expect.any(Number),
      }),
    );
  });

  test('payload values are sane', async ({ request }) => {
    const body = await (await request.get('/api/metrics')).json();
    expect(body.coverage).toBeGreaterThanOrEqual(0);
    expect(body.coverage).toBeLessThanOrEqual(100);
    expect(body.p95LatencyMs).toBeGreaterThan(0);
    expect(typeof body.apiHealth).toBe('string');
  });

  test('unknown API routes return JSON 404', async ({ request }) => {
    const res = await request.get('/api/does-not-exist');
    expect(res.status()).toBe(404);
    expect(res.headers()['content-type']).toContain('application/json');
    expect((await res.json()).error).toBeDefined();
  });

  test('metrics payload matches the committed snapshot', async ({ request }) => {
    const body = await (await request.get('/api/metrics')).json();
    expect(JSON.stringify(body, null, 2)).toMatchSnapshot('metrics.json');
  });
});