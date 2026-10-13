import { test, expect } from '../fixtures/test';

/**
 * FAQ accordion: single-open collapsible sections with aria-expanded
 * and full keyboard support.
 */
const headers = [
  'What is a release?',
  'How are gates evaluated?',
  'Where do reports go?',
];

test('accordion starts with all sections collapsed', async ({ page }) => {
  await page.goto('/');
  for (const name of headers) {
    await expect(page.getByRole('button', { name })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  }
});

test('clicking a header expands its panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: headers[0] }).click();
  await expect(page.getByRole('button', { name: headers[0] })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(
    page.getByText('A release is a versioned snapshot'),
  ).toBeVisible();
});

test('only one section is open at a time', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: headers[0] }).click();
  await page.getByRole('button', { name: headers[1] }).click();
  await expect(page.getByRole('button', { name: headers[0] })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page.getByRole('button', { name: headers[1] })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(
    page.getByText('A release is a versioned snapshot'),
  ).toBeHidden();
  await expect(page.getByText('Quality gates check')).toBeVisible();
});

test('clicking an open header collapses it', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('button', { name: headers[2] });
  await header.click();
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await header.click();
  await expect(header).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Reports publish to GitHub Pages')).toBeHidden();
});

test('keyboard: Enter and Space toggle sections', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('button', { name: headers[1] });
  await header.focus();
  await page.keyboard.press('Enter');
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(header).toHaveAttribute('aria-expanded', 'false');
});
