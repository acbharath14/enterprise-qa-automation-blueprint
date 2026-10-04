# Evidence

Sample run of the smoke suite (the fast release signal) on a fresh clone:

```bash
npm --prefix playwright-suite run test:smoke -- --project=chromium
```

```text
Running 3 tests using 1 worker
  ✓  1 [chromium] › tests/smoke.spec.ts:3:5 › critical release snapshot is visible @smoke
  ✓  2 [chromium] › tests/smoke.spec.ts:8:5 › refresh action updates the snapshot message @smoke
  ✓  3 [chromium] › tests/smoke.spec.ts:13:5 › refresh shows the exact frozen time @smoke

  3 passed
```

Full suite (all 8 projects): 280 passed, 17 skipped, 0 failed — verified
locally and in CI (`e2e` workflow, both shards green).
