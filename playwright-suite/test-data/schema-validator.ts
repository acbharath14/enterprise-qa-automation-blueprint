import Ajv, { type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

declare const __dirname: string;

/**
 * OpenAPI response-schema validation for API tests.
 *
 * Where this sits next to the other API checks in this repo:
 * - tests/api.spec.ts pins behavior: status codes, value sanity, the
 *   committed metrics snapshot.
 * - contract/ (Pact) pins the consumer<->provider agreement for the
 *   dashboard UI's endpoints.
 * - This helper pins every JSON response against the published OpenAPI
 *   document (test-data/openapi.store.json): field names, types, required
 *   fields, ranges, formats. A response can satisfy a Pact contract yet drift
 *   from the documented API — schema validation is what catches that drift.
 *
 * To adapt it to a real service: replace openapi.store.json with the
 * service's OpenAPI document (exported from the gateway or codegen) and
 * point loadApiSpec() at it. The path-template matching ({id}) and local
 * $ref resolution already handle typical microservice documents.
 */

type JsonSchema = Record<string, unknown>;

type Operation = {
  responses?: Record<string, { content?: Record<string, { schema?: JsonSchema }> }>;
};

export type OpenApiDocument = {
  openapi: string;
  paths: Record<string, Record<string, Operation>>;
  components?: { schemas?: Record<string, JsonSchema> };
};

export type ValidateOptions = {
  method: string;
  path: string;
  status: number;
  body: unknown;
};

export type ValidationResult = { valid: boolean; errors: string[] };

let cached: { doc: OpenApiDocument; ajv: Ajv } | undefined;

/** Load (once) the committed OpenAPI document and a format-aware AJV instance. */
export function loadApiSpec(): { doc: OpenApiDocument; ajv: Ajv } {
  if (!cached) {
    const doc = JSON.parse(
      readFileSync(join(__dirname, 'openapi.store.json'), 'utf8'),
    ) as OpenApiDocument;
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    cached = { doc, ajv };
  }
  return cached;
}

/** Resolve local `#/…` refs (e.g. `#/components/schemas/Error`), recursively. */
function resolveRefs(schema: JsonSchema, doc: OpenApiDocument): JsonSchema {
  if (Array.isArray(schema)) {
    return schema.map((s) => resolveRefs(s as JsonSchema, doc)) as unknown as JsonSchema;
  }
  if (schema === null || typeof schema !== 'object') {
    return schema;
  }
  const ref = (schema as { $ref?: unknown }).$ref;
  if (typeof ref === 'string') {
    if (!ref.startsWith('#/')) {
      throw new Error(`Only local refs are supported, got: ${ref}`);
    }
    const target = ref
      .slice(2)
      .split('/')
      .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], doc);
    if (target === undefined) {
      throw new Error(`Unresolvable $ref: ${ref}`);
    }
    return resolveRefs(target as JsonSchema, doc);
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    out[key] = resolveRefs(value as JsonSchema, doc);
  }
  return out;
}

/**
 * A `{param}` placeholder segment in an OpenAPI path template.
 * (Kept as a named helper: TS 7.0.2 — the version this repo pins —
 * mis-parses the inline `'{') && … endsWith('}')` form inside an arrow body.)
 */
function isTemplateSegment(part: string): boolean {
  return part.startsWith('{') && part.endsWith('}');
}

/**
 * Match a concrete request path against the document's paths, supporting
 * `{param}` templates (e.g. `/api/{unknown}` matches `/api/does-not-exist`).
 */
function findPathItem(
  doc: OpenApiDocument,
  path: string,
): Record<string, Operation> | undefined {
  if (doc.paths[path]) {
    return doc.paths[path];
  }
  const actual = path.split('/');
  for (const [template, item] of Object.entries(doc.paths)) {
    const parts = template.split('/');
    if (parts.length !== actual.length) {
      continue;
    }
    const matches = parts.every((part, i) => isTemplateSegment(part) || part === actual[i]);
    if (matches) {
      return item;
    }
  }
  return undefined;
}

function formatError(error: ErrorObject): string {
  const where = error.instancePath || '(root)';
  return `${where} ${error.message ?? 'is invalid'}`;
}

/**
 * Validate a response body against the OpenAPI document.
 *
 * Fails loudly (valid: false) when the method/path or the status code is not
 * documented — an undocumented response passing silently would defeat the
 * purpose of schema validation.
 */
export function validateResponse(options: ValidateOptions): ValidationResult {
  const { doc, ajv } = loadApiSpec();
  const label = `${options.method.toUpperCase()} ${options.path} → ${options.status}`;
  const pathItem = findPathItem(doc, options.path);
  const operation = pathItem?.[options.method.toLowerCase()];
  if (!operation) {
    return { valid: false, errors: [`No operation documented for ${options.method.toUpperCase()} ${options.path}`] };
  }
  const response = operation.responses?.[String(options.status)] ?? operation.responses?.['default'];
  if (!response) {
    return { valid: false, errors: [`No response documented for ${label}`] };
  }
  const schema = response.content?.['application/json']?.schema;
  if (!schema) {
    return { valid: false, errors: [`No JSON schema documented for ${label}`] };
  }
  const validate = ajv.compile(resolveRefs(schema, doc));
  const valid = validate(options.body) as boolean;
  return { valid, errors: (validate.errors ?? []).map(formatError) };
}
