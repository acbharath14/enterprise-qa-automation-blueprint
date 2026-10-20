Feature: Store Smoke Tests
  The fast release signal for the DemoMart storefront. These scenarios
  prove the critical paths work end to end: catalog, cart, checkout,
  and demo login.

  @smoke
  Scenario: Catalog renders the seeded products
    Given I am on the DemoMart homepage
    Then the product grid is visible
    And the card for "Aurora Wireless Headphones" (prod-1) is visible
    And 6 product cards are shown on page 1

  @smoke
  Scenario: Adding a product updates the cart badge
    Given a product exists in the catalog
    And I am on the DemoMart homepage
    When I search for the product
    And I add it to the cart
    Then the cart badge count increases by 1
    And a confirmation toast shows the product name

  @smoke
  Scenario: Cart page shows the line item and correct total
    Given a product priced at $42.50 exists in the catalog
    And I am on the DemoMart homepage
    When I search for the product
    And I add it to the cart
    And I open the cart
    Then the cart shows the product line item
    And the line total is "$42.50"
    And the cart subtotal equals the sum of the line totals

  @smoke
  Scenario: Checkout wizard completes and shows an order id
    Given a product exists in the catalog
    And I am on the DemoMart homepage
    When I search for the product
    And I add it to the cart
    And I open the cart
    And I start checkout
    And I enter valid shipping details
    And I enter valid payment details
    And I place the order
    Then the order confirmation is shown
    And the displayed order id matches the pattern "ord-<number>"
    And the confirmation lists the product
    And the displayed order total equals the sum of the line totals

  @smoke
  Scenario: Demo login works
    Given I am on the DemoMart homepage
    When I log in with username "admin" and password "secret"
    Then the logout button is visible
    And the user label shows "admin"
