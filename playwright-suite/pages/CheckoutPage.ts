import { Page, Locator } from '@playwright/test';

/** Page Object for the DemoMart 3-step checkout wizard. */
export class CheckoutPage {
  readonly page: Page;
  readonly step1: Locator;
  readonly step2: Locator;
  readonly step3: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly deliveryDateInput: Locator;
  readonly shippingStandard: Locator;
  readonly shippingExpress: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvcInput: Locator;
  readonly paymentFrame: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly placeOrderButton: Locator;
  readonly errorSummary: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly addressError: Locator;
  readonly cardError: Locator;
  readonly reviewSummary: Locator;
  readonly confirmation: Locator;
  readonly orderId: Locator;
  readonly orderTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.step1 = page.getByTestId('checkout-step-1');
    this.step2 = page.getByTestId('checkout-step-2');
    this.step3 = page.getByTestId('checkout-step-3');
    this.nameInput = page.getByTestId('checkout-name');
    this.emailInput = page.getByTestId('checkout-email');
    this.addressInput = page.getByTestId('checkout-address');
    this.deliveryDateInput = page.getByTestId('checkout-delivery-date');
    this.shippingStandard = page.getByTestId('shipping-standard');
    this.shippingExpress = page.getByTestId('shipping-express');
    this.cardNumberInput = page.getByTestId('checkout-card-number');
    this.expiryInput = page.getByTestId('checkout-card-expiry');
    this.cvcInput = page.getByTestId('checkout-card-cvc');
    this.paymentFrame = page.getByTestId('payment-frame');
    this.nextButton = page.getByTestId('checkout-next');
    this.backButton = page.getByTestId('checkout-back');
    this.placeOrderButton = page.getByTestId('place-order-button');
    this.errorSummary = page.getByTestId('checkout-errors');
    this.nameError = page.getByTestId('checkout-error-name');
    this.emailError = page.getByTestId('checkout-error-email');
    this.addressError = page.getByTestId('checkout-error-address');
    this.cardError = page.getByTestId('checkout-error-card');
    this.reviewSummary = page.getByTestId('review-summary');
    this.confirmation = page.getByTestId('order-confirmation');
    this.orderId = page.getByTestId('order-id');
    this.orderTotal = page.getByTestId('order-total');
  }

  /** Lands on checkout step 1. The cart must already hold items (the fixture sets this up via the API). */
  async goto() {
    await this.page.goto('/');
    await this.page.getByTestId('nav-cart').click();
    await this.page.getByTestId('checkout-button').click();
  }

  stepLabel(n: 1 | 2 | 3): Locator {
    return this.page.getByTestId(`checkout-step-label-${n}`);
  }

  async fillShipping(options: {
    name: string;
    email: string;
    address: string;
    deliveryDate?: string;
    shipping?: 'standard' | 'express';
  }) {
    await this.nameInput.fill(options.name);
    await this.emailInput.fill(options.email);
    await this.addressInput.fill(options.address);
    if (options.deliveryDate) await this.deliveryDateInput.fill(options.deliveryDate);
    if (options.shipping === 'express') await this.shippingExpress.check();
  }

  async fillPayment(options: { cardNumber: string; expiry: string; cvc: string }) {
    await this.cardNumberInput.fill(options.cardNumber);
    await this.expiryInput.fill(options.expiry);
    await this.cvcInput.fill(options.cvc);
  }

  async next() {
    await this.nextButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
