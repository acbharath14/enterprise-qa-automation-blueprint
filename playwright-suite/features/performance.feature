Feature: Performance Budgets
  Budgets, not benchmarks: the DemoMart storefront must stay within
  acceptable bounds so regressions are caught early. Precise benchmarking
  belongs in a dedicated perf suite.

  Scenario: Storefront becomes interactive within budget
    When I open the DemoMart homepage
    Then the catalog heading is visible within 8 seconds

  Scenario: Products API responds within budget
    When I send a GET request to "/api/products"
    Then the response is successful within 2 seconds

  Scenario: No console errors or page errors on load
    When I open the DemoMart homepage and wait for network idle
    Then there are no console errors and no page errors

  Scenario: No console errors or page errors during checkout
    Given I am filling the checkout wizard with valid details
    When I complete the shipping and payment steps
    Then there are no console errors and no page errors
