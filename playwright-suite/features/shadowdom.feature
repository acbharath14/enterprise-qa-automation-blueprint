Feature: Shadow DOM Components
  Web components with open shadow roots expose their content to
  assistive technology and automation without special handling.

  Scenario: Star rating exposes its value through the open shadow root
    Given I am on the DemoMart homepage
    Then the star rating for "prod-1" announces "Rated 4.5 out of 5"
