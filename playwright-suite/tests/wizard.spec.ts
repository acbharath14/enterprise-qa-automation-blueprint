import { test, expect } from '../fixtures/test';

test.describe('checkout wizard', () => {
  test('back returns to step 1 with values preserved', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await checkoutPage.fillShipping({ name: 'Back Buyer', email: 'back@example.com', address: '2 Back Road' });
    await checkoutPage.next();
    await expect(checkoutPage.step2).toBeVisible();
    await checkoutPage.back();
    await expect(checkoutPage.step1).toBeVisible();
    await expect(checkoutPage.nameInput).toHaveValue('Back Buyer');
    await expect(checkoutPage.emailInput).toHaveValue('back@example.com');
    await expect(checkoutPage.addressInput).toHaveValue('2 Back Road');
  });
});
