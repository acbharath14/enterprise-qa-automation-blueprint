# Newman API Health Checks

Hourly Postman collection runs via [Newman](https://github.com/postmanlabs/newman) against the sample app API. Catches regressions between releases without waiting for the full E2E suite.

## What's here

| File | Purpose |
|---|---|
| `health-check.postman_collection.json` | 7 requests covering all sample-app API endpoints, with assertions |
| `local.postman_environment.json` | Environment with `baseUrl` (defaults to `http://localhost:4173`) |
| `health-check.yml` | GitHub Actions workflow template — copy to `.github/workflows/` via web UI |

## Collection coverage

| Request | Assertions |
|---|---|
| GET /api/metrics | 200, has `coverage` number, `apiHealth` is Green, response < 800ms |
| POST /api/login (valid) | 200, returns token (saved to collection variable) |
| POST /api/login (invalid) | 401, error message present |
| GET /api/search?q=aur | 200, returns array including "Aurora" |
| POST /api/feedback (valid) | 200, returns feedback id |
| POST /api/feedback (invalid) | 400 for bad email |
| GET /api/export | 200, Content-Type is CSV, has header row |

## Run locally

```bash
# 1. Start the sample app
cd playwright-suite && node server.mjs &

# 2. Install Newman
npm install -g newman newman-reporter-htmlextra

# 3. Run
newman run newman/health-check.postman_collection.json \
  -e newman/local.postman_environment.json \
  -r htmlextra,cli \
  --reporter-htmlextra-export reports/newman-report.html

# 4. Open reports/newman-report.html in a browser
```

## CI: hourly schedule + email alerts

The workflow in `health-check.yml`:

1. **Schedule** — runs every hour (`cron: "0 * * * *"`), plus manual trigger.
2. **Starts the sample app**, installs Newman, runs the collection.
3. **Uploads the HTML report** as a workflow artifact (always).
4. **Emails on failure** — only when assertions fail, using the `htmlextra` report as an attachment.

**Required secrets** (repo → Settings → Secrets → Actions):

| Secret | Example |
|---|---|
| `RESEND_API_KEY` | `re_...` ([resend.com](https://resend.com) API key) |
| `ALERT_TO` | `team@example.com` |
| `ALERT_FROM` | `API Health Check <alerts@example.com>` (optional; defaults to Resend onboarding address) |

Note: the default `onboarding@resend.dev` sender only delivers to the Resend account's signup email. For team alerts, verify a sending domain in Resend and set `ALERT_FROM` accordingly.

## Adapting to your API

1. Open the collection in Postman (Import → file).
2. Add/edit requests; write assertions in the **Tests** tab using `pm.test()`.
3. Export the updated collection back to this folder.
4. Update the environment file if your base URL differs.
