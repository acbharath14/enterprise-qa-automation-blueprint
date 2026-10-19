import { test as base, expect, APIRequestContext } from '@playwright/test';
import { allure } from 'allure-playwright';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';

/**
 * Mints a uniquely-named product for the test and returns its id.
 *
 * Cart isolation: the server keys carts by the X-Cart-Id header, so every
 * test gets a private cart. Fixtures pin the page's session cart to a known
 * id via addInitScript (before first navigation) and expose it as `headers`
 * for direct API calls — UI steps and API calls then address the same cart.
 * Stock is generous on purpose so cart repairs never 400 on the stock cap.
 */
async function mintTestProduct(request: APIRequestContext, tag: string): Promise<string> {
  const res = await request.post('/api/products', {
    data: { name: `Fixture ${tag} ${Date.now()}`, price: 42.5, category: 'test', stock: 100000 },
  });
  expect(res.status()).toBe(201);
  return ((await res.json()).id as string);
}

async function cleanupTestProduct(
  request: APIRequestContext,
  productId: string,
  headers: Record<string, string> = {},
) {
  await request.delete(`/api/cart/items/${productId}`, { headers });
  await request.delete(`/api/products/${productId}`);
}

type Fixtures = {
  /** DemoMart catalog, already loaded and ready to interact with. */
  catalogPage: CatalogPage;
  /** DemoMart product detail for prod-1, already opened. */
  productPage: ProductPage;
  /** DemoMart cart with one line of the fixture's own product, already opened. */
  cart: { cartPage: CartPage; productId: string; headers: Record<string, string> };
  /** DemoMart checkout wizard (step 1) with the fixture's own product in the cart. */
  checkout: { checkoutPage: CheckoutPage; productId: string; headers: Record<string, string> };
  /** DemoMart login view, already opened. */
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  catalogPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await expect(catalogPage.heading).toBeVisible();
    await use(catalogPage);
  },
  productPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await catalogPage.openProduct('prod-1');
    const productPage = new ProductPage(page);
    await expect(productPage.name).toBeVisible();
    await use(productPage);
  },
  cart: async ({ page, request }, use, testInfo) => {
    const cartId = `fixture-${testInfo.workerIndex}-${Date.now()}`;
    const headers = { 'X-Cart-Id': cartId };
    const productId = await mintTestProduct(request, 'cart');
    // Pin the page's session cart to our known id *before* first navigation,
    // so UI steps and our direct API calls address the same isolated cart.
    await page.addInitScript((id: string) => {
      try {
        sessionStorage.setItem('demomart-cart-id', id);
      } catch {
        /* ignore */
      }
    }, cartId);
    await request.post('/api/cart/items', { headers, data: { productId, qty: 1 } });
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(cartPage.heading).toBeVisible();
    await expect(cartPage.page.getByTestId(`cart-item-${productId}`)).toBeVisible();
    await use({ cartPage, productId, headers });
    await cleanupTestProduct(request, productId, headers);
  },
  checkout: async ({ page, request }, use, testInfo) => {
    const cartId = `fixture-${testInfo.workerIndex}-${Date.now()}`;
    const headers = { 'X-Cart-Id': cartId };
    const productId = await mintTestProduct(request, 'checkout');
    await page.addInitScript((id: string) => {
      try {
        sessionStorage.setItem('demomart-cart-id', id);
      } catch {
        /* ignore */
      }
    }, cartId);
    await request.post('/api/cart/items', { headers, data: { productId, qty: 1 } });
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await expect(checkoutPage.step1).toBeVisible({ timeout: 5000 });
    await use({ checkoutPage, productId, headers });
    await cleanupTestProduct(request, productId, headers);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});

export { expect };

// Friendly Allure grouping. The reporter defaults to the Playwright project
// name (chromium, firefox, …) as the top-level suite, which reads poorly.
// These labels override both levels; the reporter's defaults are skipped when
// a test already carries parentSuite/suite labels.
const ALLURE_SUITES: Record<string, [parentSuite: string, suite: string]> = {
  'accessibility.spec.ts': ['Accessibility', 'WCAG scans'],
  'accordion.spec.ts': ['UI components', 'Accordion'],
  'api-mocked.spec.ts': ['API', 'Mocked API'],
  'api.spec.ts': ['API', 'Store API'],
  'auth.setup.ts': ['Authentication', 'Setup'],
  'auth.spec.ts': ['Authentication', 'Sign in'],
  'authed.spec.ts': ['Authentication', 'Signed-in state'],
  'catalog.spec.ts': ['Store', 'Catalog'],
  'controls.spec.ts': ['UI components', 'Form controls'],
  'datepicker.spec.ts': ['UI components', 'Date picker'],
  'datetime.spec.ts': ['UI components', 'Date and time'],
  'dialogs.spec.ts': ['UI components', 'Dialogs'],
  'download.spec.ts': ['UI components', 'File download'],
  'dropdown.spec.ts': ['UI components', 'Category filter'],
  'empty-states.spec.ts': ['UI components', 'Empty states'],
  'factory.spec.ts': ['Test data', 'Factory'],
  'failure-showcase.spec.ts': ['Showcase', 'Intentional failures'],
  'forms.spec.ts': ['UI components', 'Checkout form'],
  'iframe.spec.ts': ['UI components', 'IFrame'],
  'integration.spec.ts': ['Store', 'End-to-end flows'],
  'keyboard.spec.ts': ['Accessibility', 'Keyboard navigation'],
  'mobile.spec.ts': ['Mobile', 'Responsive and touch'],
  'modal.spec.ts': ['UI components', 'Quick-view modal'],
  'offline.spec.ts': ['UI components', 'Offline mode'],
  'pact-store.spec.ts': ['API', 'Contract tests'],
  'pagination.spec.ts': ['UI components', 'Pagination'],
  'pentest.spec.ts': ['Security', 'Penetration tests'],
  'performance.spec.ts': ['Performance', 'Timings and budgets'],
  'popup.spec.ts': ['UI components', 'Popup'],
  'radio.spec.ts': ['UI components', 'Radio groups'],
  'search.spec.ts': ['UI components', 'Product search'],
  'security.spec.ts': ['Security', 'Security checks'],
  'shadowdom.spec.ts': ['UI components', 'Shadow DOM'],
  'skeletons.spec.ts': ['UI components', 'Loading skeletons'],
  'store-smoke.spec.ts': ['Store', 'Smoke'],
  'table.spec.ts': ['UI components', 'Sort control'],
  'tabs.spec.ts': ['UI components', 'Tabs'],
  'theme.spec.ts': ['UI components', 'Theme'],
  'toast.spec.ts': ['UI components', 'Toast'],
  'tooltips.spec.ts': ['UI components', 'Tooltips'],
  'upload.spec.ts': ['UI components', 'File upload'],
  'visual.spec.ts': ['Visual', 'Visual regression'],
  'web-vitals.spec.ts': ['Performance', 'Web vitals'],
  'wizard.spec.ts': ['UI components', 'Checkout wizard'],
};

test.beforeEach(async ({}, testInfo) => {
  const file = testInfo.titlePath[0] ?? '';
  const [parentSuite, suite] = ALLURE_SUITES[file] ?? ['Other', file];
  await allure.parentSuite(parentSuite);
  await allure.suite(suite);
});
