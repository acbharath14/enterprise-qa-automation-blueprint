# Architecture Overview

## Layered Quality Model
1. UI Layer: Playwright smoke and regression journeys.
2. API Layer: REST contract and integration validation (`api.spec.ts`, `integration.spec.ts`).
3. Data Layer: DB consistency and reconciliation checks (out of scope for the demo app).
4. Orchestration Layer: CI quality gates and report publishing.

## Design Principles
1. Product-driven, tool-agnostic strategy.
2. Fast feedback with smoke-first execution.
3. Deterministic test data and repeatable environments.
4. Evidence-first reporting for audit and release gates.
