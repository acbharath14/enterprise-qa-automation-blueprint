import { test, expect } from '../fixtures/test';
import AxeBuilder from '@axe-core/playwright';

async function noSeriousViolations(page: any, view: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  const blocking = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  expect(
    blocking,
    `Accessibility violations in ${view}:\n${blocking.map((v) => `- [${v.impact}] ${v.id}: ${v.description}`).join('\n')}`,
  ).toEqual([]);
}

test('catalog has no serious accessibility violations @a11y', async ({ catalogPage }) => {
  await noSeriousViolations(catalogPage.page, 'catalog');
});

test('checkout wizard has no serious accessibility violations @a11y', async ({ checkout }) => {
  await noSeriousViolations(checkout.checkoutPage.page, 'checkout');
});

test('checkout form has a stable accessibility tree @a11y', async ({ checkout }, testInfo) => {
  // Aria snapshots pin the accessible structure; axe-core pins the rules.
  // Chromium-only: serialized snapshots vary across engines.
  test.skip(
    testInfo.project.name !== 'chromium',
    'aria snapshot is chromium-only',
  );
  await expect(checkout.checkoutPage.page.getByTestId('checkout-form')).toMatchAriaSnapshot();
});
