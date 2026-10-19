/**
 * Seedable test-data factory for data-driven suites.
 *
 * Generates realistic products, cart lines, and orders matching the
 * DemoMart store's data shapes. Every generator accepts a seed — the same
 * seed produces the same data on every run (deterministic CI), while a
 * different seed gives variety for exploratory runs.
 *
 * Usage:
 *   import { makeProducts } from '../test-data/factory';
 *   const products = makeProducts(25, 42); // 25 products, fixed seed
 */

export interface Product {
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  description: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  qty: number;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed';
}

/**
 * mulberry32 — a tiny seedable PRNG. Same seed => same sequence, every run,
 * on every platform. Not for crypto, just for deterministic test data.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PRODUCT_ADJECTIVES = [
  'Aurora', 'Beacon', 'Cipher', 'Dynamo', 'Ember', 'Flux', 'Granite', 'Harbor',
  'Ion', 'Juniper', 'Krypton', 'Lumen', 'Mesa', 'Nimbus', 'Onyx', 'Prism',
];

const PRODUCT_NOUNS = [
  'Headphones', 'Monitor', 'Keyboard', 'Running Shoes', 'Jacket', 'T-Shirt',
  'Pour-Over Set', 'Cutting Board', 'Desk Lamp', 'Yoga Mat', 'Water Bottle',
  'Resistance Band Set',
];

const CATEGORIES = ['electronics', 'apparel', 'home', 'sports'];

const FIRST = ['Ada', 'Bharath', 'Maya', 'Leo', 'Nina', 'Omar', 'Priya', 'Ravi'];
const LAST = ['Sharma', 'Iyer', 'Chen', 'Garcia', 'Khan', 'Novak', 'Patel', 'Rao'];

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function int(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function price(rng: () => number): number {
  return Math.round((5 + rng() * 395) * 100) / 100;
}

export function makeProduct(
  rng: () => number = Math.random,
  overrides: Partial<Product> = {},
): Product {
  return {
    name: `${pick(rng, PRODUCT_ADJECTIVES)} ${pick(rng, PRODUCT_NOUNS)}`,
    category: pick(rng, CATEGORIES),
    price: price(rng),
    rating: Math.round((3 + rng() * 2) * 10) / 10,
    stock: int(rng, 0, 100),
    description: `Demo product ${int(rng, 1000, 9999)}: quality you can trust.`,
    ...overrides,
  };
}

/** Deterministic batch: makeProducts(n, seed) is identical on every run. */
export function makeProducts(count: number, seed = 42): Product[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => makeProduct(rng));
}

export function makeCartLine(
  rng: () => number = Math.random,
  overrides: Partial<CartLine> = {},
): CartLine {
  return {
    productId: `prod-${int(rng, 1, 12)}`,
    qty: int(rng, 1, 5),
    ...overrides,
  };
}

export function makeOrder(
  rng: () => number = Math.random,
  overrides: Partial<Order> = {},
): Order {
  const first = pick(rng, FIRST);
  const last = pick(rng, LAST);
  const items: OrderItem[] = Array.from({ length: int(rng, 1, 3) }, () => {
    const p = makeProduct(rng);
    const qty = int(rng, 1, 3);
    return {
      productId: `prod-${int(rng, 1, 12)}`,
      qty,
      name: p.name,
      price: p.price,
    };
  });
  const total = Math.round(items.reduce((sum, i) => sum + i.price * i.qty, 0) * 100) / 100;
  return {
    id: `ord-${int(rng, 1, 9999)}`,
    items,
    total,
    status: 'confirmed',
    ...overrides,
  };
}

export function makeCustomer(rng: () => number = Math.random): {
  name: string;
  email: string;
  address: string;
} {
  const first = pick(rng, FIRST);
  const last = pick(rng, LAST);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    address: `${int(rng, 1, 999)} Main St, Herndon VA`,
  };
}
