# Design decisions

Why the framework is shaped the way it is. If you're reviewing this repo,
start here.

## Page Object Model + fixtures, not raw selectors in specs

Selectors live in `playwright-suite/pages/DashboardPage.ts`. Specs describe behavior
("refresh updates the snapshot message"), never CSS. The custom fixture in
`playwright-suite/fixtures/test.ts` navigates and asserts the page loaded before each
test, so every spec starts from a known-good state and failures point at the
app, not at test setup.

## Three browser projects

Chromium, Firefox, WebKit. UI bugs are disproportionately browser-specific,
and Playwright makes cross-browser runs nearly free. CI installs all three
with system dependencies.

## Sharded execution (2 shards)

The suite is split with `--shard` so CI time stays flat as the suite grows.
Each shard uploads its own HTML report; the `publish-report` job combines
them behind a small index page on GitHub Pages.

## Accessibility scoped to critical/serious

`accessibility.spec.ts` uses axe-core with the WCAG 2A/2AA tag set but only
fails on `critical`/`serious` impacts. Minor violations are noise in CI and
train people to ignore the check; blocking impacts stay blocking.

## Route interception for backend control

`api-mocked.spec.ts` stubs `/api/metrics` with `page.route()` to verify how
the UI handles degraded and failed backends — without depending on a real
backend being in a particular state. The sample app's `/api/metrics`
endpoint exists so the same spec file also covers the happy path against
the real local server.

## HTML + Allure reporters

The HTML report is the human-readable artifact (published to Pages). Allure
results are kept as raw CI artifacts for trend analysis — Allure's history
view is the right tool once the suite runs on a schedule.

## The sample app is part of the repo

A framework demo that depends on an external site is a demo that breaks.
`server.mjs` serves the app and its JSON API from the repo itself, started
automatically by Playwright's `webServer` config. Clone, `npm ci`,
`npx playwright test` — nothing else to set up.

## Weekly scheduled run

Beyond push/PR triggers, the workflow runs every Monday. Scheduled runs
catch environment rot (browser updates, dependency drift) and keep the
status badge honest: green means the suite passed recently, not once in June.

## Direct API tests alongside UI tests

`api.spec.ts` hits `/api/metrics` with Playwright's `request` fixture — no
browser needed. UI specs prove the user journey; API tests pin the contract
(shape + value sanity). Both run in the same suite and the same report.

## Visual regression, masked

`visual.spec.ts` compares against a committed baseline with dynamic
regions (timestamps, live metrics) masked — only layout regressions fail the
build, not data changes. Baselines run in the desktop-chromium project only:
cross-OS font rendering makes multi-browser baselines flaky without a
dedicated visual service, and the mobile project (also chromium-based) would
need its own viewport-specific baseline.

## Performance budgets, not benchmarks

`performance.spec.ts` asserts budgets (page interactive, API latency, zero
console/page errors) rather than measuring speed. Budgets catch regressions
in CI; precise benchmarking belongs in a dedicated perf suite.

## Security headers on the demo server

The sample server sends `X-Content-Type-Options: nosniff`, returns JSON 404s
for unknown `/api/*` routes, and never reflects query input.
`security.spec.ts` locks that in — even demo apps should model the basics.

## Data-driven from JSON

Dashboard expectations live in `test-data/metrics.json`, not in the spec.
Adding a metric means editing data, not code.
# Design decisions — gallery expansion

## The sample app is a component gallery, not a toy page

The app grew from a metrics dashboard into a gallery of common UI patterns:
forms with validation, login, sortable table, native dialogs, file upload,
tabs, and a theme toggle. One static HTML file, no build step — it stays
approachable for novices while giving every spec something real to validate.
Each section exists because a test type needs it.

## Auth via setup project + storageState

`auth.setup.ts` signs in once through the real UI and saves
`playwright/.auth/user.json`. The `authed` project loads that file and proves
the session persists without signing in again. This is Playwright's documented
pattern: pay the login cost once per run, not once per test. The auth file is
git-ignored — sessions never get committed.

## API contract pinned with a snapshot

`api.spec.ts` commits `metrics.json` via `toMatchSnapshot`. Any field added,
removed, or renamed on `/api/metrics` fails the build loudly. Cheaper than a
schema validator for a stable contract, and the diff shows exactly what changed.

## Deterministic time with page.clock

The refresh timestamp is asserted exactly, not fuzzily: `page.clock.install`
freezes time, so the test compares against the same `toLocaleTimeString()`
the app renders. No sleeps, no regexes, no flakes.

## UI↔API integration, not just isolation

`integration.spec.ts` uses `waitForResponse` to prove the dashboard calls
`GET /api/metrics` and renders *that response's* body. API specs test the
contract; UI specs test the rendering; this test proves they talk to each
other.

## Theme as a first-class test

The app uses CSS variables with a toggle, and a dedicated `dark` project runs
the suite under `colorScheme: 'dark'`. `theme.spec.ts` flips the toggle and
asserts the tokens actually change. Theme regressions are invisible to
functional tests — this makes them visible.
