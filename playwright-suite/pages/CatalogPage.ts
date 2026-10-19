import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the DemoMart catalog view.
 * All selectors live here — specs describe behavior, never CSS.
 */
export class CatalogPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly sortSelect: Locator;
  readonly priceSlider: Locator;
  readonly priceOutput: Locator;
  readonly grid: Locator;
  readonly noResults: Locator;
  readonly catalogError: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly pageInfo: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Catalog' });
    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('category-filter');
    this.sortSelect = page.getByTestId('sort-select');
    this.priceSlider = page.getByTestId('price-max-slider');
    this.priceOutput = page.getByTestId('price-max-output');
    this.grid = page.getByTestId('product-grid');
    this.noResults = page.getByTestId('no-results');
    this.catalogError = page.getByTestId('catalog-error');
    this.prevButton = page.getByTestId('catalog-prev');
    this.nextButton = page.getByTestId('catalog-next');
    this.pageInfo = page.getByTestId('catalog-page-info');
    this.toast = page.getByTestId('toast');
  }

  async goto() {
    await this.page.goto('/');
  }

  productCard(id: string): Locator {
    return this.page.getByTestId(`product-card-${id}`);
  }

  async search(q: string) {
    await this.searchInput.fill(q);
  }

  async filterCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async sortBy(value: 'price_asc' | 'price_desc' | 'name' | '') {
    await this.sortSelect.selectOption(value);
  }

  async openProduct(id: string) {
    await this.page.getByTestId(`view-product-${id}`).click();
  }

  async addToCart(id: string) {
    await this.page.getByTestId(`add-to-cart-${id}`).click();
  }

  async quickView(id: string) {
    await this.page.getByTestId(`quick-view-${id}`).click();
  }

  cardPrices(): Promise<number[]> {
    return this.grid.locator('[data-testid^="product-price-"]').allTextContents().then((texts) =>
      texts.map((t) => Number(t.replace(/[^0-9.]/g, ''))),
    );
  }
}
