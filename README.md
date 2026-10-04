# Enterprise QA Automation Blueprint

[![e2e](https://github.com/acbharath14/enterprise-qa-automation-blueprint/actions/workflows/e2e.yml/badge.svg)](https://github.com/acbharath14/enterprise-qa-automation-blueprint/actions/workflows/e2e.yml)

A Playwright + TypeScript UI test framework built around a simple idea: smoke tests should produce a release signal, not just a pass/fail log. The suite runs against a small local sample app (a release-health dashboard) and the results feed into CI quality gates.

## Architecture

```mermaid
flowchart LR
	App[Local Sample App] --> UI[Playwright Suite]
	UI --> Report[Test Report]
	UI --> CI[CI Pipeline]
	CI --> Gate[Release Decision]
```

## Quick Start

```bash
cd ui-tests
npm install
npx playwright install chromium
npm test
```

The sample app starts automatically through the `webServer` config in `playwright.config.ts` — no manual setup needed.

Useful scripts: `npm run test:smoke` (smoke only), `npm run test:a11y` (accessibility only), `npm run test:headed` (watch it run).

## What's Inside

- `ui-tests/pages/` — Page Object Models (all selectors live here)
- `ui-tests/fixtures/` — custom test fixtures (page ready before each test)
- `ui-tests/tests/` — smoke, dashboard, accessibility, API, API-mocked, visual, performance, and security specs
- `ui-tests/test-data/` — data files driving the data-driven specs
- `ui-tests/sample-app/` and `server.mjs` — the local app under test, including a JSON `/api/metrics` endpoint
- `ui-tests/playwright.config.ts` — Chromium/Firefox/WebKit/Mobile projects, retries on CI, trace on failure
- `.github/workflows/e2e.yml` — sharded CI, HTML + Allure reports, weekly scheduled run
- `ci/` — GitLab CI and Jenkins pipeline templates
- `docs/` — architecture notes, execution evidence, and [design decisions](docs/decisions.md)

## Test coverage

| Type | File | What it proves |
|---|---|---|
| Smoke | `tests/smoke.spec.ts` | Critical paths work |
| Dashboard | `tests/dashboard.spec.ts` | Data-driven UI assertions from JSON |
| Accessibility | `tests/accessibility.spec.ts` | axe-core, WCAG 2A/2AA |
| API | `tests/api.spec.ts` | Contract shape, value sanity, error responses |
| API mocking | `tests/api-mocked.spec.ts` | UI behavior under stubbed backends |
| Visual | `tests/visual.spec.ts` | Layout regression (dynamic regions masked) |
| Performance | `tests/performance.spec.ts` | Load budgets, zero console errors |
| Security | `tests/security.spec.ts` | Headers, JSON 404s, no input reflection |

## How CI Works

Every push/PR touching `ui-tests/` runs the suite sharded across 2 runners × 3 browsers. HTML and Allure reports are uploaded as artifacts per shard. A scheduled run every Monday keeps the badge honest.

## Roadmap

- Report publishing to GitHub Pages
- Visual regression baselines
- Data-driven suites from external fixtures

## License

MIT — see [LICENSE](LICENSE).
