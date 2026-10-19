Feature: Checkout Wizard
  The multi-step checkout guides the buyer through shipping, payment,
  and review before placing the order.

  Scenario: Step 1 is marked current and empty submit stays on step 1
    Given I am on the checkout wizard
    Then step 1 is marked as the current step
    When I continue without entering shipping details
    Then step 1 is still visible
    And step 2 is hidden

  Scenario: Completes the full flow
    Given I have a product in my cart
    And I am on the checkout wizard
    When I enter shipping details for "Wizard Buyer"
    And I continue to step 2
    And I enter payment details
    And I continue to step 3
    Then the review shows my product
    When I place the order
    Then the order confirmation is visible

  Scenario: Back returns to step 1 with values preserved
    Given I am on the checkout wizard
    When I enter shipping details:
      | name    | Back Buyer          |
      | email   | back@example.com    |
      | address | 2 Back Road         |
    And I continue to step 2
    And I go back to step 1
    Then step 1 is visible
    And the name field still shows "Back Buyer"
    And the email field still shows "back@example.com"
    And the address field still shows "2 Back Road"
