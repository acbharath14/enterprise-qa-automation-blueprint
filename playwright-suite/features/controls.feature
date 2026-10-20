Feature: Catalog Toolbar Controls
  The catalog toolbar offers a max-price slider to filter by budget and
  a theme toggle for dark/light mode.

  Background:
    Given I am on the DemoMart catalog page

  Scenario: Price slider filters card prices
    When I set the max-price slider to $50
    Then the slider output reads "$50.00"
    And every visible product card is priced at $50 or less

  Scenario: Theme toggle flips aria-checked
    Given the theme toggle reports aria-checked="false"
    When I click the theme toggle
    Then the toggle reports aria-checked="true"
    When I click the theme toggle again
    Then the toggle reports aria-checked="false"
