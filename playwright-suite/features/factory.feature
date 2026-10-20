Feature: Test Data Factory Contract
  The seeded test-data factory (mulberry32 PRNG) must be deterministic for
  a fixed seed, varied across seeds, and always shaped like the store's
  real data — so tests get reproducible, realistic fixtures without
  depending on backend state.

  Scenario: Factory is deterministic for a fixed seed
    When I generate products twice with seed 42
    Then both runs produce identical product lists
    And the random number generator replays identically for a fixed seed

  Scenario: Different seeds produce different data
    When I generate products with seed 42 and with seed 7
    Then the two product lists differ

  Scenario: Generated products honor the store data contract
    When I generate 100 products
    Then every product has a name
    And every category is one of electronics, apparel, home, sports
    And every price is positive
    And every rating is between 0 and 5
    And every stock count is a non-negative integer

  Scenario: Generated orders balance
    When I generate orders
    Then each order total equals the sum of its line items
    And each order status is "confirmed"

  Scenario: Generated customers are submittable
    When I generate a customer
    Then the customer has a name
    And the email contains "@"
    And the customer has an address
