import { test, expect } from '../fixtures/test';

test.describe('delivery date picker', () => {
  test('sets a delivery date and carries it to the review step', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await checkoutPage.fillShipping({
      name: 'Date Buyer',
      email: 'date@example.com',
      address: '1 Date Lane',
      deliveryDate: '2026-10-25'
    });
    await expect(checkoutPage.deliveryDateInput).toHaveValue('2026-10-25');
    await checkoutPage.next();
    await expect(checkoutPage.step2).toBeVisible();
    await checkoutPage.fillPayment({ cardNumber: '4111111111111111', expiry: '12/30', cvc: '123' });
    await checkoutPage.next();
    await expect(checkoutPage.step3).toBeVisible();
    await expect(checkoutPage.reviewSummary).toContainText('2026-10-25');
  });
});
