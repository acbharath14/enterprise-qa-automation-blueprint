import { test, expect } from '../fixtures/test';

/**
 * UI↔API integration: the API and UI are tested in isolation elsewhere —
 * here we prove the UI calls the backend correctly and renders its response.
 */
test('loading live metrics calls the API and renders its response', async (
  { dashboardPage, page },
  testInfo,
) => {
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes('/api/metrics') && res.request().method() === 'GET',
    ),
    dashboardPage.loadLiveMetrics(),
  ]);
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  // Attach the raw response to the report as evidence.
  await testInfo.attach('api-response', {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json',
  });
  await expect(dashboardPage.liveMetrics).toContainText(`Coverage ${body.coverage}%`);
  await expect(dashboardPage.liveMetrics).toContainText(`API ${body.apiHealth}`);
});
