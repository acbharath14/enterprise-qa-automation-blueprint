Feature: Category Filter Dropdown
  The catalog's category filter narrows the grid to one category;
  "All categories" restores the full first page.

  Background:
    Given I am on the DemoMart catalog page

  Scenario: Selecting 'apparel' shows only apparel products
    When I filter the catalog by category "apparel"
    Then 3 product cards are shown
    And every visible card is in the "apparel" category

  Scenario: Selecting 'All categories' restores page 1
    Given I have filtered the catalog by category "apparel"
    When I reset the category filter to "All categories"
    Then the page indicator reads "Page 1 of N"
    And 6 product cards are shown
