import { test, expect } from '../fixtures/test';

test.describe('shipping method radio group', () => {
  test('group has a legend describing the choice', async ({ checkout, page }) => {
    await expect(page.getByTestId('shipping-method-group').locator('legend')).toHaveText('Shipping method');
  });

  test('standard is selected by default', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await expect(checkoutPage.shippingStandard).toBeChecked();
    await expect(checkoutPage.shippingExpress).not.toBeChecked();
  });

  test('selecting express unchecks standard', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await checkoutPage.shippingExpress.check();
    await expect(checkoutPage.shippingExpress).toBeChecked();
    await expect(checkoutPage.shippingStandard).not.toBeChecked();
  });

  test('arrow keys move selection between radios', async ({ checkout, page }) => {
    const { checkoutPage } = checkout;
    await checkoutPage.shippingStandard.focus();
    await page.keyboard.press('ArrowDown');
    await expect(checkoutPage.shippingExpress).toBeChecked();
    await expect(checkoutPage.shippingStandard).not.toBeChecked();
  });
});
