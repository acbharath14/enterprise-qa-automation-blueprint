Feature: Product Detail Accordion
  The product page groups shipping, returns, and other info into
  collapsible sections. Only one section opens at a time, and the
  accordion is fully keyboard operable.

  Background:
    Given I am on a product detail page

  Scenario: Clicking a trigger expands its panel
    When I click the "Shipping" accordion trigger
    Then the shipping panel is visible
    And the trigger reports aria-expanded="true"

  Scenario: Only one section is open at a time
    When I expand the "Shipping" section
    And I expand the "Returns" section
    Then the returns panel is visible
    And the shipping panel is hidden

  Scenario: Keyboard Enter toggles a section
    When I focus the "Returns" accordion trigger
    And I press Enter
    Then the returns panel is visible
    When I press Enter again
    Then the returns panel is hidden
