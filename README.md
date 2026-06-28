# Enterprise QA Automation Blueprint

## Portfolio Role
This repository is the automation architecture execution part of the portfolio story.
It shows how a layered QA framework turns UI smoke checks into a release signal that hiring managers can review quickly.

## Profile Map
- Portfolio narrative: automation architecture execution
- Skill signal: enterprise automation framework thinking
- Review focus: Playwright smoke flow, deterministic local execution, and CI handoff
- Evidence anchor: `docs/evidence.md`

## Business Value
- Demonstrates how UI automation can be tied to release signals and operational health.
- Shows deterministic local execution that can be replicated in CI.
- Provides a starting point for expanding into API and data-layer validation.

## Architecture
```mermaid
flowchart LR
	App[Local QA Sample App] --> UI[Playwright Smoke Suite]
	UI --> Report[Test Results]
	UI --> CI[GitLab or Jenkins]
	CI --> Gate[Release Decision]
```

## Day 1 Outcome
- Repository initialized with standards and structure
- Playwright UI smoke test running against a local sample app
- Interactive refresh action validated by automation
- CI templates added for GitLab and Jenkins
- First baseline commit created

## Initial Structure
- docs/ - architecture, execution plan, standards
- ui-tests/ - Playwright TypeScript smoke suite and local sample app
- ci/ - CI pipeline templates

## Quick Start
```bash
cd enterprise-qa-automation-blueprint
npm --prefix ui-tests install
npm --prefix ui-tests run test:smoke
```

## Evidence
- Smoke suite executes 2 end-to-end checks against the local app.
- Refresh interaction is validated as a user-visible state transition.
- Test output can be attached in pull requests to justify release readiness.

See: docs/evidence.md

## Demonstrable Behavior
1. Loads a locally hosted quality snapshot page.
2. Verifies key UI signals that mirror a release dashboard.
3. Confirms the refresh interaction changes the status message.

## First Commit Plan
```bash
git init
git add .
git commit -m "chore: bootstrap enterprise QA automation blueprint"
```

## Next Milestone
Implement API test layer with REST Assured and add unified report publishing.
