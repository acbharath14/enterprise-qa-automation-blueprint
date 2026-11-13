import { test as base, expect } from './test';
import { Client, type QueryResultRow } from 'pg';

/**
 * Database fixture for DB validation (fixtures/db.ts).
 *
 * One `pg` client per test, connected with the same DATABASE_URL the
 * sample-app server uses — so the tests read exactly the database the
 * app just wrote to. Money is stored as integer cents; assertions compare
 * cents, never floats.
 *
 * Two ways to use it:
 * - The `db` fixture, for DB-only specs (tests/db-validation.spec.ts):
 *   it skips the test when DATABASE_URL is unset, mirroring the server
 *   switch, so the default in-memory mode never goes red.
 * - `withDbClient(fn)`, for assertion blocks inside existing flow specs
 *   (store-smoke, wizard, forms, api, catalog): it runs `fn` with a
 *   client when DATABASE_URL is set and returns null otherwise, so the
 *   flow test still runs — and passes — in in-memory mode.
 *
 * House rule (fixtures/test.ts): never assert on global row counts of
 * shared tables. The seeded catalog is shared across parallel workers
 * and read-only in tests; assert on rows your own test created, located
 * by the id the UI or API returned — never by "latest row".
 */
export class DbClient {
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /** All rows matching the query, in the order the query returns them. */
  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const result = await this.client.query<T>(sql, params);
    return result.rows;
  }

  /** The first matching row, or undefined when nothing matches. */
  async queryOne<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T | undefined> {
    const rows = await this.query<T>(sql, params);
    return rows[0];
  }

  /**
   * The first matching row, polling until it appears (≤5s). DB writes in
   * this app are synchronous — the API awaits the store before responding
   * — so this usually returns on the first attempt; the poll keeps the
   * tests honest if that ever changes.
   */
  async waitForRow<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    timeoutMs = 5000,
  ): Promise<T> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const row = await this.queryOne<T>(sql, params);
      if (row) return row;
      if (Date.now() >= deadline) {
        throw new Error(`No row matched within ${timeoutMs}ms: ${sql}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  /** Deletes test-created products whose id starts with `prefix`. */
  async cleanupByPrefix(prefix: string): Promise<void> {
    await this.query('DELETE FROM products WHERE id LIKE $1', [`${prefix}%`]);
  }
}

/** Runs `fn` with a DB client when DATABASE_URL is set; null otherwise. */
export async function withDbClient<T>(
  fn: (db: DbClient) => Promise<T>,
): Promise<T | null> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  const client = new Client({ connectionString });
  await client.connect();
  try {
    return await fn(new DbClient(client));
  } finally {
    await client.end();
  }
}

type DbFixtures = {
  /** Live Postgres client. Skips the test when DATABASE_URL is unset. */
  db: DbClient;
};

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      base.skip(
        true,
        'DATABASE_URL is not set — DB validation needs Postgres (npm run db:up)',
      );
    }
    const client = new Client({ connectionString });
    await client.connect();
    try {
      await use(new DbClient(client));
    } finally {
      await client.end();
    }
  },
});

export { expect };
