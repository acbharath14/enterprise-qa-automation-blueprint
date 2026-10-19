Feature: Persisted Session
  The signed-in session survives page loads via saved browser storage,
  so the user does not need to sign in again.

  Scenario: Session persists without signing in again
    Given I have a saved signed-in session
    When I visit the DemoMart homepage
    Then the user label shows "Signed in as admin"
