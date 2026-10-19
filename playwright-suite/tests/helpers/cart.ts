import type { Page } from '@playwright/test';

/**
 * Bridge between the storefront UI and direct API calls.
 *
 * The server keys carts by the X-Cart-Id header. The storefront generates a
 * per-session cart id (stored in sessionStorage, so every browser context —
 * i.e. every test — gets its own isolated server-side cart). APIRequestContext
 * calls (`request.*`) do not share the page's sessionStorage, so any spec
 * that mixes UI steps with direct cart/order API calls must read the page's
 * cart id and send it as a header — otherwise the API calls land on a
 * different cart than the one the UI sees.
 *
 * Call after navigating (the id is minted when index.html's script runs).
 */
export async function pageCartId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    try {
      return sessionStorage.getItem('demomart-cart-id');
    } catch {
      return null;
    }
  });
}

/** Headers addressing the page's cart from APIRequestContext calls. */
export async function pageCartHeaders(page: Page): Promise<Record<string, string>> {
  const id = await pageCartId(page);
  return id ? { 'X-Cart-Id': id } : {};
}
