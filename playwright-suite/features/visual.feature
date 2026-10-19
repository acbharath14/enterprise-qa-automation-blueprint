Feature: Visual Regression
  The DemoMart storefront is pinned against a committed screenshot baseline
  so unintended layout changes fail the build. Dynamic regions (cart badge)
  are masked; only layout regressions fail, not data changes.

  # Desktop-Chromium-only: cross-OS font rendering makes multi-browser
  # baselines flaky without a dedicated visual service
  Scenario: Storefront matches the committed baseline
    Given a committed storefront baseline exists
    When I open the DemoMart homepage
    Then the full-page screenshot matches the baseline within tolerance
