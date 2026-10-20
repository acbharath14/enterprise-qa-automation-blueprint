Feature: Checkout Form Validation
  The checkout wizard validates shipping details inline before
  allowing the buyer to continue, and submits the exact order
  payload the backend expects.

  Background:
    Given I am on the checkout page with a product in my cart

  Scenario: Shows inline errors for empty submit
    When I submit the shipping form with all fields empty
    Then an inline error "Full name is required." is shown for the name field
    And an inline error "Enter a valid email address." is shown for the email field
    And an inline error "Shipping address is required." is shown for the address field
    And the error summary is visible

  Scenario: Rejects an invalid email
    When I enter shipping details with email "not-an-email"
    And I continue to the next step
    Then an inline error "Enter a valid email address." is shown for the email field
    And the wizard stays on step 1

  Scenario: Places the order with the right payload
    When I enter valid shipping details
    And I continue to the payment step
    And I enter valid payment details
    And I continue to the review step
    And I place the order
    Then the order request payload contains name "Payload Buyer"
    And the order request payload contains email "payload@example.com"
    And the order request payload contains address "1 Payload Lane"
    And the order request payload contains shipping method "standard"
    And the order request payload contains the card's last 4 digits
