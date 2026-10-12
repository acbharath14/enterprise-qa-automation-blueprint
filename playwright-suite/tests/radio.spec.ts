import { test, expect } from '../fixtures/test';

/**
 * Radio group: fieldset/legend semantics, single selection,
 * and native arrow-key navigation.
 */
test('radio group has a legend describing the choice', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('How should we notify you?')).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'SMS' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'None' })).toBeVisible();
});

test('email is selected by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('radio', { name: 'Email' })).toBeChecked();
});

test('selecting a radio and submitting saves the preference', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'SMS' }).check();
  await expect(page.getByRole('radio', { name: 'SMS' })).toBeChecked();
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.getByText('Preference saved: sms.')).toBeVisible();
});

test('only one radio can be checked at a time', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'None' }).check();
  await expect(page.getByRole('radio', { name: 'None' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Email' })).not.toBeChecked();
  await expect(page.getByRole('radio', { name: 'SMS' })).not.toBeChecked();
});

test('arrow keys move selection between radios', async ({ page }) => {
  await page.goto('/');
  const sms = page.getByRole('radio', { name: 'SMS' });
  await page.getByRole('radio', { name: 'Email' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(sms).toBeChecked();
  await expect(sms).toBeFocused();
});
