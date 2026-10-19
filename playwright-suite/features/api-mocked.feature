Feature: Storefront Resilience to Backend Conditions
  The DemoMart UI is exercised against stubbed API responses (route
  interception), proving frontend behavior under backend conditions that are
  hard to reproduce against a live server — without depending on real
  backend state.

  Scenario: Mocked product list renders in the catalog
    Given the products API is stubbed to return a single mocked product
    When I open the DemoMart homepage
    Then the mocked product card is visible
    And the product name reads "Mock Widget"

  Scenario: Mocked API failure shows a friendly error state
    Given the products API is stubbed to return HTTP 500
    When I open the DemoMart homepage
    Then a friendly "Could not load products" error is shown
    And the product grid is empty

  Scenario: Slow API shows skeletons while loading
    Given the products API is stubbed to respond after a delay
    When I open the DemoMart homepage
    Then catalog loading skeletons are visible while waiting
    And the real product catalog renders once the response arrives
