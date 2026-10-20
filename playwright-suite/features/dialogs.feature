Feature: Cart Remove Confirmation Dialog
  Removing a line from the cart asks for confirmation in a native
  dialog. Dismissing keeps the line; accepting removes it.

  Background:
    Given my cart contains one line item

  Scenario: Dismissing the dialog keeps the cart line
    When I click remove on the cart line
    And I dismiss the confirmation dialog
    Then the cart line is still visible

  Scenario: Accepting the dialog removes the cart line
    When I click remove on the cart line
    And I accept the confirmation dialog
    Then the cart line is gone
