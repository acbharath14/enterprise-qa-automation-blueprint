Feature: Catalog Pagination
  The catalog shows 6 products per page with prev/next navigation
  and page info text.

  Scenario: Page 1 shows page info with prev disabled and next enabled
    Given I am on the DemoMart homepage
    Then the page info reads "Page 1 of N"
    And the previous button is disabled
    And the next button is enabled
    And 6 product cards are shown

  Scenario: Next goes to page 2 with different products
    Given I am on catalog page 1
    When I click the next button
    Then the page info reads "Page 2 of N"
    And the product card for "prod-7" is visible
    And the product card for "prod-1" is hidden

  Scenario: Last page disables next; prev walks back to page 1
    Given I am on the DemoMart homepage
    When I page forward to the last page
    Then the next button is disabled
    And the previous button is enabled
    When I page back to the first page
    Then the page info reads "Page 1 of N"
    And the product card for "prod-1" is visible
