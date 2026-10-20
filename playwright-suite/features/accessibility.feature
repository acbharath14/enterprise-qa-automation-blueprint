Feature: Accessibility (WCAG) Compliance
  The DemoMart storefront must be usable by everyone. axe-core scans pin the
  WCAG 2A/2AA rules, and a committed aria snapshot pins the checkout form's
  accessible structure so regressions are caught before release.

  @a11y
  Scenario: Catalog has no serious accessibility violations
    Given I am on the DemoMart catalog page
    When an axe-core scan runs with the wcag2a and wcag2aa rule sets
    Then there are no violations of critical or serious impact

  @a11y
  Scenario: Checkout wizard has no serious accessibility violations
    Given I am on the DemoMart checkout wizard
    When an axe-core scan runs with the wcag2a and wcag2aa rule sets
    Then there are no violations of critical or serious impact

  @a11y
  Scenario: Checkout form has a stable accessibility tree
    Given I am on the DemoMart checkout form
    # Chromium-only: serialized aria snapshots vary across engines
    Then the checkout form's aria snapshot matches the committed baseline
