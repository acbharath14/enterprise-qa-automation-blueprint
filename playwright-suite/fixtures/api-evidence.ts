import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';

/**
 * Evidence-logging wrapper around Playwright's APIRequestContext.
 *
 * Playwright records nothing about direct API calls in the report: a passing
 * API test shows only its name and status, and a failing one shows only the
 * failed assertion, never the endpoint, status, or headers behind it. Every
 * call through this wrapper fixes that on two surfaces at once:
 *
 * - Console: one line per call (`API GET /api/products -> 200 (12ms)`), so
 *   the CI job log shows what was validated without opening any report.
 * - Report: one JSON attachment per call (method, full URL, request headers,
 *   response status, response headers), visible under the test in both the
 *   Playwright HTML report and Allure.
 *
 * The wrapper never reads response bodies (keeps attachments small and never
 * consumes a body the test still needs) and never swallows errors: a failed
 * request throws exactly as the raw context would. `requestHeaders` are the
 * headers passed with the call; `authorization` values are redacted.
 */
type ApiEvidence = {
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  status: number;
  responseHeaders: Record<string, string>;
};

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    out[name] = name.toLowerCase() === 'authorization' ? '[REDACTED]' : value;
  }
  return out;
}

export function evidenceApi(request: APIRequestContext, testInfo: TestInfo): APIRequestContext {
  let count = 0;

  const record = async (
    method: string,
    opts: Record<string, unknown>,
    res: APIResponse
  ): Promise<APIResponse> => {
    count += 1;
    const evidence: ApiEvidence = {
      method,
      url: res.url(),
      requestHeaders: redactHeaders((opts.headers as Record<string, string>) || {}),
      status: res.status(),
      responseHeaders: res.headers()
    };
    await testInfo.attach(`api-${count} ${method} ${evidence.url}`, {
      body: JSON.stringify(evidence, null, 2),
      contentType: 'application/json'
    });
    return res;
  };

  const call = (method: string) => async (url: string, opts: Record<string, unknown> = {}) => {
    const started = Date.now();
    const raw = request as unknown as Record<
      string,
      (u: string, o: Record<string, unknown>) => Promise<APIResponse>
    >;
    const res = await raw[method.toLowerCase()](url, opts);
    await record(method, opts, res);
    console.log(`API ${method} ${res.url()} -> ${res.status()} (${Date.now() - started}ms)`);
    return res;
  };

  const fetchCall = async (urlOrRequest: string | Request, opts: Record<string, unknown> = {}) => {
    const started = Date.now();
    const fetchFn = request.fetch as unknown as (
      u: string | Request,
      o: Record<string, unknown>,
    ) => Promise<APIResponse>;
    const res = await fetchFn(urlOrRequest, opts);
    const method =
      typeof urlOrRequest === 'string' ? (opts.method as string) || 'GET' : urlOrRequest.method;
    await record(method.toUpperCase(), opts, res);
    console.log(`API ${method.toUpperCase()} ${res.url()} -> ${res.status()} (${Date.now() - started}ms)`);
    return res;
  };

  const wrapped = {
    get: call('GET'),
    post: call('POST'),
    put: call('PUT'),
    patch: call('PATCH'),
    delete: call('DELETE'),
    head: call('HEAD'),
    fetch: fetchCall,
    storageState: (opts?: Parameters<APIRequestContext['storageState']>[0]) => request.storageState(opts),
    dispose: (opts?: Parameters<APIRequestContext['dispose']>[0]) => request.dispose(opts),
  };
  return wrapped as unknown as APIRequestContext;
}
