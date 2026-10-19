import { test, expect } from '../fixtures/test';

test('fills the cardholder field inside the payment iframe', async ({ checkout, page }) => {
  const { checkoutPage } = checkout;
  await checkoutPage.fillShipping({ name: 'Frame Buyer', email: 'frame@example.com', address: '1 Frame Lane' });
  await checkoutPage.next();
  await expect(checkoutPage.step2).toBeVisible();
  const frame = page.frameLocator('[data-testid="payment-frame"]');
  await frame.getByTestId('frame-cardholder').fill('Test Buyer');
  await expect(frame.getByTestId('frame-cardholder')).toHaveValue('Test Buyer');
  await expect(frame.getByTestId('frame-note')).toBeVisible();
});
