Feature: Theme Toggle
  The storefront supports light and dark color schemes, remembers
  the user's preference, and declares support to the browser.

  Scenario: Toggles between light and dark
    Given I am on the DemoMart homepage
    Then the page background is the light theme color
    And the theme toggle is unchecked
    When I click the theme toggle
    Then the theme toggle is checked
    And the page background is the dark theme color
    When I click the theme toggle again
    Then the theme toggle is unchecked
    And the page background is the light theme color

  Scenario: Theme preference persists across reloads
    Given I am on the DemoMart homepage
    When I switch to the dark theme
    And I reload the page
    Then the page background is still the dark theme color
    And the theme toggle is still checked

  Scenario: Declares support for both color schemes
    Given I am on the DemoMart homepage
    Then the color-scheme meta tag declares "dark light"
