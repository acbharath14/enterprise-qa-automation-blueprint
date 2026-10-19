// Minimal ambient declarations for the Node built-ins used by the suite.
// The repo carries no @types/node; this keeps `npx tsc --noEmit` working
// without adding a dependency. Extend only with APIs actually used.

declare module 'node:fs' {
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function readFileSync(path: string, encoding: 'utf8'): string;
  export function writeFileSync(path: string, data: string | Uint8Array): void;
  export function readdirSync(path: string): string[];
  export function unlinkSync(path: string): void;
  export function appendFileSync(path: string, data: string): void;
  export function existsSync(path: string): boolean;
}

declare module 'node:fs/promises' {
  export function readFile(path: string, encoding: 'utf8'): Promise<string>;
}

declare module 'node:path' {
  export function join(...parts: string[]): string;
  export function dirname(p: string): string;
  const path: { join(...parts: string[]): string; dirname(p: string): string };
  export default path;
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

// Playwright's own types import stream primitives; satisfy the import so the
// full @playwright/test type graph resolves without @types/node.
declare module 'stream' {
  export class Readable {
    [Symbol.asyncIterator](): AsyncIterableIterator<unknown>;
  }
  export class ReadStream extends Readable {}
}

interface Buffer extends Uint8Array {}
declare const Buffer: {
  from(data: string, encoding?: string): Buffer;
  from(data: Uint8Array): Buffer;
  concat(list: Uint8Array[]): Buffer;
};

declare const process: {
  env: Record<string, string | undefined>;
  loadEnvFile(path: string): void;
};

declare const __dirname: string;
