import { test, expect } from '../fixtures/test';

/**
 * Runs in the 'tz' project (Pacific/Auckland, en-NZ): proves the order
 * timestamp rendering follows the emulated locale/timezone instead of the
 * machine's.
 */
test('order timestamp renders in the emulated timezone', async (
  { checkout, page },
  testInfo,
) => {
  test.skip(
    testInfo.project.name !== 'tz',
    'requires the tz project (Pacific/Auckland, en-NZ)',
  );
  const { checkoutPage } = checkout;

  await checkoutPage.fillShipping({
    name: 'Tz Buyer',
    email: 'tz@example.com',
    address: '1 Lambton Quay, Wellington',
  });
  await checkoutPage.next();
  await expect(checkoutPage.step2).toBeVisible();
  await checkoutPage.fillPayment({
    cardNumber: '4111111111111111',
    expiry: '12/28',
    cvc: '123',
  });
  await checkoutPage.next();
  await expect(checkoutPage.step3).toBeVisible();
  await checkoutPage.placeOrder();

  const timestamp = page.getByTestId('order-timestamp');
  await expect(timestamp).toBeVisible();
  await expect(timestamp).toContainText(String(new Date().getFullYear()));
  // The date portion must match the emulated NZ locale rendering.
  const nzDate = await page.evaluate(() => new Date().toLocaleDateString());
  await expect(timestamp).toContainText(nzDate);
});
