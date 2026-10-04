import { test, expect } from '../fixtures/test';
import AxeBuilder from '@axe-core/playwright';

test('dashboard has no serious accessibility violations @a11y', async ({ dashboardPage }) => {
  const results = await new AxeBuilder({ page: dashboardPage.page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const blocking = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  expect(
    blocking,
    `Accessibility violations found:\n${blocking.map((v) => `- [${v.impact}] ${v.id}: ${v.description}`).join('\n')}`,
  ).toEqual([]);
});
