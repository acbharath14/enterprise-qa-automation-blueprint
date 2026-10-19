Feature: Intentional Failure Showcase
  Portfolio-only scenarios: deliberately wrong assertions that demonstrate
  what a real failure looks like in the published Allure report (assertion
  diff, screenshot, video, trace). Skipped in every normal run; executed
  only via the failure_showcase workflow dispatch, so CI never breaks.

  @showcase
  Scenario: Product price reads $9999.99 (intentionally wrong)
    Given I am on the DemoMart homepage
    # prod-1 really costs $129.99 — the mismatch demonstrates a failing
    # text assertion with Playwright's diff output
    Then the price of prod-1 reads "$9999.99"

  @showcase
  Scenario: Products API exposes a discount field (intentionally wrong)
    # Products carry no `discount` field — demonstrates a failing API
    # assertion alongside the UI one above
    When I send a GET request to "/api/products"
    Then the first product has a "discount" of 10
