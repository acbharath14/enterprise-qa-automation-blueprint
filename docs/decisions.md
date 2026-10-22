# Design decisions

Why the framework is shaped the way it is. If you're reviewing this repo,
start here.

## Page Object Model + fixtures, not raw selectors in specs

Selectors live in `playwright-suite/pages/CatalogPage.ts`. Specs describe behavior
("adding to cart updates the badge"), never CSS. The custom fixtures in
`playwright-suite/fixtures/test.ts` navigate and assert the page loaded before each
test, so every spec starts from a known-good state and failures point at the
app, not at test setup.

## Eight projects: browsers, devices, and environments

Chromium, Firefox, WebKit, a mobile viewport (Pixel 7), a dark colorScheme,
a locale/timezone variant (Pacific/Auckland, en-NZ), an authenticated
session (`authed`, via `storageState`), and a `setup` project that signs in
once. UI bugs are disproportionately browser-specific, and Playwright makes
cross-browser runs nearly free — CI installs all three engines with system
dependencies. The extra projects cost one line each and prove the suite is
environment-independent.

## Sharded execution (2 shards)

The suite is split with `--shard` so CI time stays flat as the suite grows.
Each shard uploads its own HTML report; the `publish-report` job combines
them behind a small index page on GitHub Pages.

## Accessibility scoped to critical/serious

`accessibility.spec.ts` uses axe-core with the WCAG 2A/2AA tag set but only
fails on `critical`/`serious` impacts. Minor violations are noise in CI and
train people to ignore the check; blocking impacts stay blocking.

## Route interception for backend control

`api-mocked.spec.ts` stubs `/api/products` with `page.route()` to verify how
the UI handles degraded and failed backends — without depending on a real
backend being in a particular state. The sample app's `/api/products`
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

`api.spec.ts` hits the store API with Playwright's `request` fixture — no
browser needed. UI specs prove the user journey; API tests pin the contract
(shape + value sanity). Both run in the same suite and the same report.

## Visual regression, masked

`visual.spec.ts` compares against the committed baseline (materialized
from base64 text by `global-setup.ts`) with dynamic regions (the cart badge)
masked — only layout regressions fail the build, not data changes.
Baselines run in the desktop-chromium project only:
cross-OS font rendering makes multi-browser baselines flaky without a
dedicated visual service, and the mobile project (also chromium-based) would
need its own viewport-specific baseline. The snapshot path omits the OS
(`snapshotPathTemplate`) so the baseline captured on a Mac asserts cleanly
on Linux CI.

## Performance budgets, not benchmarks

`performance.spec.ts` asserts budgets (page interactive, API latency, zero
console/page errors) rather than measuring speed. Budgets catch regressions
in CI; precise benchmarking belongs in a dedicated perf suite.

## Security headers on the demo server

The sample server sends `X-Content-Type-Options: nosniff`, returns JSON 404s
for unknown `/api/*` routes, and never reflects query input.
`security.spec.ts` locks that in — even demo apps should model the basics.

## Per-test cart isolation via X-Cart-Id

The store API keeps server-side carts, and spec files run in parallel
workers — a single shared cart would race (clear-then-act is not atomic).
The server keys carts by the `X-Cart-Id` header instead. The storefront mints
a per-session id in `sessionStorage`, so every browser context gets a private
cart automatically. The `cart`/`checkout` fixtures pin the page's session cart
to a known id via `addInitScript` (before first navigation) and expose it as
`headers` for direct API calls. Pure API specs generate their own id per test
(the `cartApi()` wrapper in `api.spec.ts`). Specs that mix UI steps with
direct cart API calls bridge via `pageCartHeaders(page)` in
`tests/helpers/cart.ts`.

# Design decisions — the DemoMart re-theme

## The sample app is a store, not a dashboard

The original sample app was a release-readiness dashboard — hard for a
newcomer to map onto a real application. It is now **DemoMart**, a small
e-commerce store: product catalog (search, category filter, sort), product
detail, server-side cart, checkout wizard with validation, order
confirmation, and demo login. One static HTML file plus a tiny Node API, no
build step — it stays approachable for novices while giving every spec
something relatable to validate. Each view exists because a test type needs
it, and the domain (products, carts, orders) is one every tester already
understands.

## Auth via setup project + storageState

`auth.setup.ts` signs in once through the real UI and saves
`playwright/.auth/user.json`. The `authed` project loads that file and proves
the session persists without signing in again. This is Playwright's documented
pattern: pay the login cost once per run, not once per test. The auth file is
git-ignored — sessions never get committed.

## API contract pinned with OpenAPI + AJV

`api-schema.spec.ts` validates every store endpoint against
`test-data/openapi.store.json` using the reusable `validateResponse` helper
(AJV, local `$ref` resolution, `{param}` path-template matching). Undocumented
paths, statuses, or schemas fail loudly rather than silently passing — the
spec is executable documentation of the API. Deliberately not
`toMatchSnapshot`: that resolves a separate file per project, which would mean
committing near-identical copies. One OpenAPI document, all projects.

## UI↔API integration, not just isolation

`integration.spec.ts` uses `waitForResponse` to prove the storefront calls
`POST /api/cart/items` and renders *that response's* body. API specs test the
contract; UI specs test the rendering; this test proves they talk to each
other.

## Theme as a first-class test

The app uses CSS variables with a toggle, and a dedicated `dark` project runs
the suite under `colorScheme: 'dark'`. `theme.spec.ts` flips the toggle and
asserts the tokens actually change. Theme regressions are invisible to
functional tests — this makes them visible.

## Demo auth is simulated — the pattern is what's real

The sample app's "authentication" is deliberately fake: hardcoded credentials
(`admin`/`secret`), a static token string, no expiry, no server-side session —
the client just checks `localStorage`. Do not copy this as a real auth
implementation.

What the suite genuinely demonstrates is the test-automation pattern:
`auth.setup.ts` signs in once through the real UI, saves `storageState`, and
the `authed` project reuses that session instead of logging in per test. That
pattern transfers directly to production apps with OIDC/OAuth2 providers,
httpOnly cookies, and server-side sessions.

## Production UI patterns, store-flavored

The suite covers the UI patterns a real storefront needs: an autocomplete
search (debounced, keyboard selection), a delivery date picker, a 3-step
checkout wizard with per-step validation, an auto-dismissing toast, an order
receipt CSV download (filename + content assertions), a same-origin payment
iFrame (`frameLocator`), a star-rating web component in shadow DOM, a price
range slider, product-detail tabs and accordions, and a receipt popup.

Two testing utilities ride along: `test.step` structures multi-step flows in
reports, `expect.soft` collects all form errors in one run, and
`testInfo.attach` embeds the raw API response in the report as evidence.
`video: 'retain-on-failure'` is enabled alongside traces.

The `tz` project (Pacific/Auckland, en-NZ) proves datetime rendering follows
the emulated locale instead of the machine's: `datetime.spec.ts` computes
expectations inside the page context, so they hold under any timezone. The
aria snapshot (`toMatchAriaSnapshot`) is chromium-gated because serialized
accessibility trees vary across engines.

## Responsive by construction, verified by spec

The storefront is mobile-first CSS (single-column grid, hamburger nav,
full-screen cart sheet under 768px, 44px touch targets). `mobile.spec.ts`
asserts no horizontal overflow at 375px on the Pixel 7 project — the layout
regression net for the responsive design, alongside the desktop visual
baseline.

## Visual baseline is versioned as base64 text

The screenshot baseline lives in `test-data/visual-baseline.b64.partN`, not as a
committed PNG: binary files can't be pushed through every available workflow,
so the baseline is stored as text and `global-setup.ts` decodes it into
`tests/visual.spec.ts-snapshots/` before every run. The decode always
overwrites, so a stale local PNG can never mask a regression. Regenerate with
`npx playwright test visual --project=chromium --update-snapshots` followed by
`npm run baseline:update`.

## Allure trends need preserved history

`allure generate --clean` wipes history every run, so the trend graph stays
empty. The publish job restores `history.json`/`history-trend.json` from the
live site before generating — trends then accumulate across runs.

## Failure showcase without breaking CI

`tests/failure-showcase.spec.ts` holds two deliberately wrong assertions
(a UI text mismatch and an API contract mismatch). It is skipped in every
normal run (`test.skip` unless `SHOWCASE=1`). The `publish-report` job runs
it separately (`continue-on-error: true`) and merges the results into the main
Allure report, where the failures appear under **Showcase › Intentional
failures** with full failure detail (assertion diff, screenshot, video,
trace). The build stays green; the report honestly shows the failures.

## Intuitive Allure suite names

The reporter defaults to the Playwright project name (chromium, firefox, …)
as the top-level suite, which reads poorly. `scripts/fix-allure-labels.mjs`
rewrites the `parentSuite`/`suite` labels in the result JSON after each run
(e.g. `Accessibility › WCAG scans`, `API › Store API`), before the report is
generated. A post-processing script was chosen over `allure.parentSuite()` in
a `beforeEach` because the runtime API silently drops labels for some files
when several specs run in one invocation; the script is deterministic.

## Optional Postgres persistence, memory by default

`server.mjs` originally kept all state in memory, which made DB-level
validation of UI-driven CRUD impossible. The data operations now live behind
`db/store.mjs`: in-memory by default (unchanged behavior for every existing
consumer), Postgres when `DATABASE_URL` is set. If the variable is set but
Postgres is unreachable, the server refuses to start rather than silently
falling back — a green run must mean the mode it claims. Carts deliberately
stay in-memory: they are per-test state keyed by `X-Cart-Id`, and persisting
them would add cross-test cleanup for no coverage gain.

## BDD runs from its own config

The Gherkin suite originally entered CI by flipping `testDir` in
`playwright.config.ts`, which *replaced* the spec suite instead of adding to
it — one config change turned the whole pipeline red. `playwright.bdd.config.ts`
now inherits the main config and overrides only `testDir`; BDD enablement is a
CI-job decision (dedicated jobs on GitHub and GitLab), never a shared-config
edit. Both BDD jobs are non-gating while the suite is brought to green.
