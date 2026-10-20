Feature: Order Timestamp Localization
  Order confirmation timestamps render in the shopper's locale and
  timezone, not the server's.

  @tz
  Scenario: Order timestamp renders in the emulated timezone
    Given the browser emulates Pacific/Auckland (en-NZ)
    And I have completed a checkout with name "Tz Buyer"
    When I place the order
    Then the order confirmation shows a timestamp
    And the timestamp contains the current year
    And the date portion matches the New Zealand locale rendering
