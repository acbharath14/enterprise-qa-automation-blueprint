Feature: Keyboard Navigation
  What automated accessibility scans cannot check: the app must be
  fully operable by keyboard alone.

  Scenario: Tab order follows the header nav then the catalog toolbar
    Given I am on the DemoMart homepage
    When I press Tab repeatedly
    Then focus moves through the header controls in order:
      | store-logo      |
      | nav-cart        |
      | theme-toggle    |
      | login-button    |
      | search-input    |
      | category-filter |
      | sort-select     |
      | price-max-slider|
    # On mobile viewports the hamburger toggle comes first and the
    # catalog nav link is hidden inside the collapsed menu.

  Scenario: Enter on the cart button opens the cart view
    Given I am on the DemoMart homepage
    When I focus the cart button and press Enter
    Then the "Your Cart" heading is visible
