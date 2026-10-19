Feature: Delivery Date Picker
  The checkout shipping step offers a delivery date picker; the chosen
  date carries through to the order review step.

  Scenario: Delivery date carries to the review step
    Given I have a product in my cart
    And I am on the checkout shipping step
    When I fill shipping details with delivery date "2026-10-25"
    Then the delivery date input holds "2026-10-25"
    When I continue to payment and fill valid card details
    And I continue to the review step
    Then the order summary shows "2026-10-25"
