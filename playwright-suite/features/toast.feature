Feature: Add-to-Cart Toast
  A confirmation toast appears with the product name when an item
  is added to the cart, then dismisses itself automatically.

  Scenario: Adding to cart shows a toast with the product name, then hides
    Given I am on the DemoMart homepage
    When I add "Aurora Wireless Headphones" to the cart
    Then a toast is visible
    And the toast contains "Aurora Wireless Headphones"
    When I wait for the toast timeout
    Then the toast is hidden
