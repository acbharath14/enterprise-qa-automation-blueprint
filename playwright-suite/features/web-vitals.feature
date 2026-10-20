Feature: Core Web Vitals
  Google's user-perceived performance metrics, measured on the DemoMart
  storefront in Chromium (CLS and INP rely on Chromium-exclusive APIs).
  Thresholds are Google's "good" ratings. These are budgets that catch
  experience regressions, not micro-optimizations.

  # Chromium-only: layout-shift entries and event timing are Chromium APIs
  Scenario: LCP - largest contentful paint under 2.5s
    When I open the DemoMart homepage
    Then the largest contentful paint is recorded
    And it is under 2500 milliseconds

  Scenario: CLS - cumulative layout shift under 0.1
    When I open the DemoMart homepage and let it settle
    Then the cumulative layout shift (excluding input-driven shifts) is under 0.1

  Scenario: INP - interaction responds within 200ms
    Given I am on the DemoMart homepage
    When I add a product to the cart and type in the search box
    Then the slowest interaction duration is under 200 milliseconds
