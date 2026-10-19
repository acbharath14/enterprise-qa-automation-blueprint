import type { APIRequestContext } from '@playwright/test';
import type { CheckoutPage } from '../../pages/CheckoutPage';

/**
 * Idempotently sets our cart line to exactly `qty` (DELETE then POST).
 *
 * Each test gets its own server-side cart (the server keys carts by the
 * X-Cart-Id header; pass the page's cart id via `headers`). Set-semantics
 * keeps every repair convergent: last writer wins, no qty growth.
 */
export async function resetCartLine(
  request: APIRequestContext,
  productId: string,
  qty = 1,
  headers: Record<string, string> = {},
): Promise<void> {
  await request.delete(`/api/cart/items/${productId}`, { headers });
  await request.post('/api/cart/items', { headers, data: { productId, qty } });
}

/**
 * Guarantees our product line is present with at least `qty`, repairing it
 * with set-semantics (see resetCartLine) if it is missing. Pass the page's
 * cart headers so the check targets the same cart the UI sees.
 */
export async function ensureCartLine(
  request: APIRequestContext,
  productId: string,
  qty = 1,
  headers: Record<string, string> = {},
): Promise<void> {
  const cart = await (await request.get('/api/cart', { headers })).json();
  const line = cart.items.find((i: { productId: string }) => i.productId === productId);
  if (!line || line.qty < qty) {
    await resetCartLine(request, productId, qty, headers);
  }
}

/**
 * Clicks "Place order" until the order-confirmation view appears.
 *
 * Each test owns its cart (X-Cart-Id isolation), so a 422 'Cart is empty' can
 * no longer come from another worker draining it — but the retry loop stays
 * as belt-and-braces against app-level hiccups. Pass the page's cart headers
 * so the pre-order snapshot and line restores target the UI's cart.
 */
export async function placeOrderWithRetry(
  checkoutPage: CheckoutPage,
  request: APIRequestContext,
  productId: string,
  attempts = 5,
  headers: Record<string, string> = {},
): Promise<void> {
  const before = await (await request.get('/api/cart', { headers })).json();
  const others = before.items.filter((i: { productId: string }) => i.productId !== productId);
  for (let attempt = 1; attempt <= attempts; attempt++) {
    // Hide any previous order error so a fresh 422 is detectable below.
    await checkoutPage.errorSummary.evaluate((el) => {
      (el as HTMLElement).hidden = true;
    });
    await checkoutPage.placeOrder();
    const outcome = await Promise.race([
      checkoutPage.confirmation
        .waitFor({ state: 'visible', timeout: 15000 })
        .then(() => 'ordered' as const),
      checkoutPage.errorSummary
        .waitFor({ state: 'visible', timeout: 15000 })
        .then(() => 'failed' as const),
    ]).catch(() => 'timeout' as const);
    if (outcome === 'ordered') {
      for (const line of others) {
        // Set-semantics restore (not an additive POST): convergent with any
        // concurrent repair by the line's owner — see resetCartLine. A 404
        // here just means that worker's test finished and its product is
        // gone — nothing to restore. Playwright does not throw on it.
        await resetCartLine(request, line.productId, line.qty, headers);
      }
      return;
    }
    // 'failed' (422 shown in the error box) or 'timeout': our line is gone —
    // re-add it and retry.
    await resetCartLine(request, productId, 1, headers);
  }
  throw new Error(`order confirmation never appeared after ${attempts} attempts`);
}
