Feature: Catalog Sort
  The catalog toolbar sorts product cards by price (ascending or
  descending) or alphabetically by name.

  Background:
    Given I am on the DemoMart catalog page

  Scenario: Price ascending sorts card prices low to high
    When I sort the catalog by "price_asc"
    Then the visible card prices are in ascending order

  Scenario: Price descending sorts card prices high to low
    When I sort the catalog by "price_desc"
    Then the visible card prices are in descending order

  Scenario: Name sorts cards alphabetically
    When I sort the catalog by "name"
    Then the visible product names are in alphabetical order
