Feature: Offline Handling
  The storefront degrades gracefully when the network drops.

  Scenario: Shows a friendly message when the API is unreachable
    Given I am on the DemoMart homepage with products loaded
    When the network goes offline
    And I search for "aurora"
    Then an error message "Could not load products" is shown
