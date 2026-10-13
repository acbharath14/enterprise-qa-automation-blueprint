import { test, expect } from '../fixtures/test';

/**
 * Tooltips: revealed on hover and focus, associated via aria-describedby,
 * dismissible with ESC.
 */
test('hover reveals the tooltip', async ({ page }) => {
  await page.goto('/');
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeHidden();
  await page.getByRole('button', { name: 'Hover or focus me' }).hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText(
    'Releases are snapshotted every Monday at 06:00 UTC.',
  );
});

test('keyboard focus reveals the tooltip', async ({ page }) => {
  await page.goto('/');
  const tooltip = page.getByRole('tooltip');
  await page.getByRole('button', { name: 'Hover or focus me' }).focus();
  await expect(tooltip).toBeVisible();
});

test('moving focus away hides the tooltip', async ({ page }) => {
  await page.goto('/');
  const tooltip = page.getByRole('tooltip');
  const button = page.getByRole('button', { name: 'Hover or focus me' });
  await button.focus();
  await expect(tooltip).toBeVisible();
  await page.getByRole('button', { name: 'Toggle theme' }).focus();
  await expect(tooltip).toBeHidden();
});

test('ESC dismisses the tooltip', async ({ page }) => {
  await page.goto('/');
  const tooltip = page.getByRole('tooltip');
  await page.getByRole('button', { name: 'Hover or focus me' }).focus();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
});

test('tooltip is associated with the button via aria-describedby', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Hover or focus me' }),
  ).toHaveAttribute('aria-describedby', 'tooltip-text');
});
