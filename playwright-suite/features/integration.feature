Feature: UI to API Integration
  The storefront calls the backend correctly and renders its response —
  proving the UI and API agree, not just that each works in isolation.

  Scenario: Adding to cart calls the API and renders its response
    Given I am on the DemoMart homepage
    When I add the "Beacon 4K Monitor" to the cart
    Then the cart API is called with a POST to "/api/cart/items"
    And the API response contains the product with quantity at least 1
    And a toast shows "Beacon 4K Monitor"
    And the cart badge count increases
