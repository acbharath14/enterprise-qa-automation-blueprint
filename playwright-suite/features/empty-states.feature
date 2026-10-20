Feature: Empty States
  The storefront shows helpful empty states instead of blank screens
  when there is nothing to display.

  Scenario: Search with no matches shows the no-results message
    Given I am on the DemoMart homepage
    When I search for "zzz-no-match"
    Then the no-results message is visible
    And the product grid is empty

  Scenario: Empty cart shows the cart-empty message
    Given my cart is empty
    When I open the cart
    Then the "Your Cart" heading is visible
    And the cart-empty message is visible
