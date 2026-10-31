import { test, expect } from '../fixtures/test';

/**
 * Actionability: why you never need manual waits before actions.
 *
 * Playwright auto-waits for each action to become "actionable":
 * visible, enabled, stable (not animating), receiving events, etc.
 * The click below waits for the button to become enabled — no
 * waitForTimeout, no polling loop, no flakiness.
 *
 * What Playwright checks before click/fill/etc:
 * - Attached to DOM, visible (non-empty bounding box, not hidden)
 * - Stable (not moving due to animation)
 * - Receives events (not obscured by another element)
 * - Enabled (not disabled)
 */
test.describe('actionability (auto-waiting)', () => {
  test('click waits for a disabled button to become enabled', async ({ page }) => {
    await page.goto('/');

    // Add an item to the cart. The checkout button is disabled until
    // the cart has items — Playwright waits for it to become enabled
    // automatically, no manual wait needed.
    await page.getByTestId('add-to-cart-prod-1').click();

    const cartButton = page.getByTestId('nav-cart');
    await cartButton.click();

    // On the cart page, the checkout button enables once the cart loads.
    const checkoutBtn = page.getByTestId('checkout-button');
    await expect(checkoutBtn).toBeEnabled({ timeout: 10000 });
    await checkoutBtn.click();

    await expect(page.getByTestId('checkout-view')).toBeVisible();
  });

  test('fill waits for an input to become editable', async ({ page }) => {
    await page.goto('/');
    const search = page.getByTestId('search-input');
    // Even if the input is momentarily obscured by a loading overlay,
    // fill() waits until it's actionable.
    await search.fill('aurora');
    await expect(search).toHaveValue('aurora');
  });
});
