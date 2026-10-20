Feature: Mobile Experience
  Mobile-specific checks for the DemoMart storefront. These run on
  touch-enabled viewports only; the assertions are meaningless at
  desktop widths.

  @mobile
  Scenario: Viewport meta tag enables proper mobile scaling
    Given I am on the DemoMart homepage on a mobile device
    Then a viewport meta tag exists
    And its content includes "width=device-width"

  @mobile
  Scenario: Catalog fits a 375px viewport with no horizontal overflow
    Given I am on the DemoMart homepage on a 375px-wide viewport
    Then there is no horizontal overflow
    And the catalog heading is visible
    And the product card for "prod-1" is visible

  @mobile
  Scenario: Touch tap on add-to-cart shows the toast
    Given I am on the DemoMart homepage on a touch-enabled device
    When I tap the add-to-cart button for "Aurora Wireless Headphones"
    Then a toast is visible
    And the toast contains "Aurora Wireless Headphones"
