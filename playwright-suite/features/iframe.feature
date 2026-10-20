Feature: Payment Iframe
  The checkout embeds the cardholder field in a same-origin payment
  iframe; the storefront must drive fields inside it.

  Scenario: Fill the cardholder field inside the payment iframe
    Given I am on checkout step 2 with shipping details entered
    When I type "Test Buyer" into the cardholder field in the payment frame
    Then the cardholder field shows "Test Buyer"
    And the frame note is visible
