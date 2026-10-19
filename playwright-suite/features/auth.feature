Feature: Sign In
  Authentication for the DemoMart storefront using the demo credentials.

  Scenario: Rejects invalid credentials
    Given I am on the sign-in page
    When I sign in with username "admin" and password "wrong"
    Then an error message "Invalid credentials" is shown

  Scenario: Signs in with valid credentials
    Given I am on the sign-in page
    When I sign in with username "admin" and password "secret"
    Then the logout button is visible
    And the user label shows "admin"
