Feature: Product Catalog
  The DemoMart catalog renders the 12 seeded products as cards,
  6 per page, each card showing name, price, category and rating.

  @smoke
  Scenario: Renders the 12 seeded products, 6 per page
    Given I am on the DemoMart catalog
    When I page through the whole catalog
    Then all 12 seeded products (prod-1 through prod-12) are shown
    And each full page shows exactly 6 product cards

  Scenario: Cards show name, price, category and rating
    Given I am on the DemoMart catalog
    Then the prod-1 card shows name "Aurora Wireless Headphones"
    And the prod-1 card shows price "$129.99"
    And the prod-1 card shows category "electronics"
    And the prod-1 card shows rating "4.5"

  Scenario: All four seeded categories appear across the pages
    Given I am on the DemoMart catalog
    When I page through the whole catalog
    Then the categories "electronics", "apparel", "home" and "sports" all appear
