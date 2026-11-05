import { test, expect } from '../fixtures/test';

test.describe('shipping method radio group', () => {
  test('group has a legend describing the choice', async ({ checkout, page }) => {
    await expect(page.getByTestId('shipping-method-group').locator('legend')).toHaveText('Shipping method');
  });

  const selectionCases = [
    { name: 'standard is selected by default', action: 'none' as const, selected: 'standard' as const },
    { name: 'selecting express unchecks standard', action: 'click' as const, selected: 'express' as const },
    { name: 'arrow keys move selection between radios', action: 'arrow' as const, selected: 'express' as const },
  ];
  for (const { name, action, selected } of selectionCases) {
    test(name, async ({ checkout, page }) => {
      const { checkoutPage } = checkout;
      if (action === 'click') await checkoutPage.shippingExpress.check();
      if (action === 'arrow') {
        await checkoutPage.shippingStandard.focus();
        await page.keyboard.press('ArrowDown');
      }
      const expected = selected === 'express' ? checkoutPage.shippingExpress : checkoutPage.shippingStandard;
      const other = selected === 'express' ? checkoutPage.shippingStandard : checkoutPage.shippingExpress;
      await expect(expected).toBeChecked();
      await expect(other).not.toBeChecked();
    });
  }
});
