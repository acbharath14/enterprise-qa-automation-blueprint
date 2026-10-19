import { test, expect } from '../fixtures/test';
import { placeOrderWithRetry } from './helpers/order-retry';

test.describe('checkout form validation', () => {
  test('shows inline errors for empty submit', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await test.step('submit with empty fields', async () => {
      await checkoutPage.next();
    });
    await test.step('inline errors name every missing field', async () => {
      await expect.soft(checkoutPage.nameError).toHaveText('Full name is required.');
      await expect.soft(checkoutPage.emailError).toHaveText('Enter a valid email address.');
      await expect.soft(checkoutPage.addressError).toHaveText('Shipping address is required.');
      await expect.soft(checkoutPage.errorSummary).toBeVisible();
    });
  });

  test('rejects an invalid email', async ({ checkout }) => {
    const { checkoutPage } = checkout;
    await test.step('fill everything except a valid email', async () => {
      await checkoutPage.fillShipping({ name: 'Email Buyer', email: 'not-an-email', address: '1 Email Lane' });
      await checkoutPage.next();
    });
    await test.step('email error shows and the wizard stays on step 1', async () => {
      await expect(checkoutPage.emailError).toHaveText('Enter a valid email address.');
      await expect(checkoutPage.step1).toBeVisible();
    });
  });

  test('places the order with the right payload', async ({ checkout, page, request }) => {
    const { checkoutPage, productId, headers } = checkout;
    await test.step('fill valid shipping details', async () => {
      await checkoutPage.fillShipping({ name: 'Payload Buyer', email: 'payload@example.com', address: '1 Payload Lane' });
      await checkoutPage.next();
      await expect(checkoutPage.step2).toBeVisible();
    });
    await test.step('fill valid payment details', async () => {
      await checkoutPage.fillPayment({ cardNumber: '4111 1111 1111 1234', expiry: '12/30', cvc: '123' });
      await checkoutPage.next();
      await expect(checkoutPage.step3).toBeVisible();
    });
    await test.step('place the order and assert the request payload', async () => {
      const orderRequest = page.waitForRequest(
        (req) => req.url().includes('/api/orders') && req.method() === 'POST'
      );
      await placeOrderWithRetry(checkoutPage, request, productId, 5, headers);
      const sent = await orderRequest;
      expect(sent.postDataJSON()).toMatchObject({
        name: 'Payload Buyer',
        email: 'payload@example.com',
        address: '1 Payload Lane',
        shippingMethod: 'standard',
        payment: { cardLast4: '1234' }
      });
    });
  });
});
