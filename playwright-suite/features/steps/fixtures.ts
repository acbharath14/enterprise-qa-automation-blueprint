import { test as base } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import type { APIResponse } from '@playwright/test';

/**
 * Shared mutable state carried between the steps of a single scenario.
 * Each scenario gets a fresh `bdd` fixture (and therefore a fresh,
 * isolated cart id), mirroring the repo's per-test X-Cart-Id isolation.
 */
export type BddState = {
  /** Isolated cart for this scenario; sent as the X-Cart-Id header. */
  cartHeaders: Record<string, string>;
  /** True once the page's session cart has been pinned (one-shot per scenario). */
  cartPinned: boolean;
  /** Product minted by a Given step (id + display name + price). */
  productId?: string;
  productName?: string;
  productPrice?: number;
  /** Catalog paging state collected by "I page through the whole catalog". */
  catalogIds?: string[];
  cardsPerPage?: number[];
  /** Last API response + parsed JSON body (for `request` steps). */
  lastResponse?: APIResponse;
  lastJson?: any;
  /** Order created by an API "place an order" step. */
  orderId?: string;
  /** Browser-observed order request payload (forms.feature). */
  orderPayload?: any;
  /** Card number typed into the payment form (for last-4 assertions). */
  cardNumber?: string;
  /** Cart badge count captured before adding to cart (smoke badge step). */
  badgeBefore?: number;
};

export const test = base.extend<{ bdd: BddState }>({
  bdd: async ({}, use) => {
    const cartId = `bdd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await use({ cartHeaders: { 'X-Cart-Id': cartId }, cartPinned: false });
  },
});

export const { Given, When, Then } = createBdd(test);
