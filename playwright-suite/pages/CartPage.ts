import { Page, Locator } from '@playwright/test';

/** Page Object for the DemoMart cart view. */
export class CartPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyMessage: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly clearButton: Locator;
  readonly checkoutButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Your Cart' });
    this.emptyMessage = page.getByTestId('cart-empty');
    this.subtotal = page.getByTestId('cart-subtotal');
    this.total = page.getByTestId('cart-total');
    this.clearButton = page.getByTestId('clear-cart-button');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.continueButton = page.getByTestId('continue-shopping-button');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByTestId('nav-cart').click();
  }

  lineItem(productId: string): Locator {
    return this.page.getByTestId(`cart-item-${productId}`);
  }

  qtyOf(productId: string): Locator {
    return this.page.getByTestId(`cart-qty-${productId}`);
  }

  async increaseQty(productId: string) {
    await this.page.getByTestId(`cart-inc-${productId}`).click();
  }

  async decreaseQty(productId: string) {
    await this.page.getByTestId(`cart-dec-${productId}`).click();
  }

  async remove(productId: string) {
    await this.page.getByTestId(`cart-remove-${productId}`).click();
  }
}
