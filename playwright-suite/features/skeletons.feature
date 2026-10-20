Feature: Loading Skeletons
  While the products API is slow, the catalog shows placeholder
  skeletons with the grid marked busy; the real cards replace them
  once the response arrives.

  Scenario: Slow products API shows skeletons, then the product cards
    Given the products API is delayed
    When I visit the DemoMart homepage
    Then 6 catalog skeletons are shown
    And the product grid is marked busy
    When the API response arrives
    Then the product card for "prod-1" is visible
    And no skeletons remain
    And the product grid is no longer marked busy
