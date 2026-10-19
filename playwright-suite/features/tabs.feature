Feature: Product Detail Tabs
  The product page organizes Description, Reviews, and Shipping into
  tabs following the ARIA tab pattern: click or arrow keys switch panels,
  Home/End jump to the first/last tab.

  Background:
    Given I am on a product detail page

  Scenario: Clicking a tab shows its panel and updates aria-selected
    When I click the "Reviews" tab
    Then the reviews panel is visible
    And the "Reviews" tab reports aria-selected="true"
    And the "Description" tab reports aria-selected="false"
    And the description panel is hidden

  Scenario: ArrowRight moves to the next tab and focuses it
    When I focus the "Description" tab
    And I press ArrowRight
    Then the "Reviews" tab reports aria-selected="true"
    And the "Reviews" tab has keyboard focus

  Scenario: Home and End jump to the first and last tabs
    When I focus the "Shipping" tab
    And I press Home
    Then the "Description" tab reports aria-selected="true"
    And the "Description" tab has keyboard focus
    When I press End
    Then the "Shipping" tab reports aria-selected="true"
    And the "Shipping" tab has keyboard focus
