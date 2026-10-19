Feature: Shipping Method Radio Group
  The checkout shipping step offers Standard and Express methods as an
  accessible radio group with fieldset/legend semantics and arrow-key
  navigation.

  Background:
    Given I am on the checkout shipping step

  Scenario: Group has a legend describing the choice
    Then the shipping method group has a legend reading "Shipping method"

  Scenario: Standard is selected by default
    Then the "Standard" option is checked
    And the "Express" option is not checked

  Scenario: Selecting Express unchecks Standard
    When I select the "Express" shipping method
    Then the "Express" option is checked
    And the "Standard" option is not checked

  Scenario: Arrow keys move selection between radios
    When I focus the "Standard" option
    And I press ArrowDown
    Then the "Express" option is checked
    And the "Standard" option is not checked
