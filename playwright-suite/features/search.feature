Feature: Catalog Search
  The catalog search box filters products live, shows an
  empty-result state when nothing matches, and restores the
  catalog when cleared.

  @smoke
  Scenario: Searching 'aurora' returns the 3 matching products
    Given I am on the DemoMart catalog
    When I search for "aurora"
    Then 3 product cards are shown
    And the cards for prod-1, prod-5 and prod-9 are visible
    And the no-results message is hidden

  Scenario: Searching 'zzz-no-match' shows the no-results state
    Given I am on the DemoMart catalog
    When I search for "zzz-no-match"
    Then the no-results message is visible
    And 0 product cards are shown

  Scenario: Clearing the search restores page 1
    Given I am on the DemoMart catalog
    And I have searched for "zzz-no-match"
    When I clear the search
    Then the no-results message is hidden
    And the page indicator shows "Page 1 of ..."
    And 6 product cards are shown
