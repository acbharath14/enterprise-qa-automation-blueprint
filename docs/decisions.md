# Design decisions

Why the framework is shaped the way it is. If you're reviewing this repo,
start here.

## Page Object Model + fixtures, not raw selectors in specs

Selectors live in `ui-tests/pages/DashboardPage.ts`. Specs describe behavior
("refresh updates the snapshot message"), never CSS. The custom fixture in
`ui-tests/fixtures/test.ts` navigates and asserts the page loaded before each
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
