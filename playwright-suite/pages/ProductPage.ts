import { Page, Locator } from '@playwright/test';

/** Page Object for the DemoMart product detail view (tabs + accordion included). */
export class ProductPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly description: Locator;
  readonly stock: Locator;
  readonly qtyInput: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.getByTestId('detail-name');
    this.price = page.getByTestId('detail-price');
    this.description = page.getByTestId('detail-description');
    this.stock = page.getByTestId('detail-stock');
    this.qtyInput = page.getByTestId('detail-qty');
    this.addToCartButton = page.getByTestId('detail-add-to-cart');
  }

  tab(name: 'description' | 'reviews' | 'shipping'): Locator {
    return this.page.getByTestId(`tab-${name}`);
  }

  panel(name: 'description' | 'reviews' | 'shipping'): Locator {
    return this.page.getByTestId(`panel-${name}`);
  }

  accordionTrigger(name: 'shipping' | 'returns'): Locator {
    return this.page.getByTestId(`accordion-${name}-trigger`);
  }

  accordionPanel(name: 'shipping' | 'returns'): Locator {
    return this.page.getByTestId(`accordion-${name}-panel`);
  }

  async setQty(qty: number) {
    await this.qtyInput.fill(String(qty));
  }
}
