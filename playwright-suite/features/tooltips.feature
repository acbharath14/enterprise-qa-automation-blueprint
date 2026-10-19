Feature: Product Info Tooltips
  Each catalog card has an info button that reveals the product
  description in a tooltip on hover or keyboard focus. The tooltip
  dismisses on ESC and is linked via aria-describedby.

  Background:
    Given I am on the DemoMart catalog page

  Scenario: Hover reveals the tooltip with the product description
    When I hover the info button for "Aurora Wireless Headphones"
    Then the tooltip is visible
    And the tooltip contains "Over-ear Bluetooth headphones"

  Scenario: ESC dismisses the tooltip
    Given the tooltip for "Aurora Wireless Headphones" is visible
    When I press Escape
    Then the tooltip is hidden

  Scenario: Keyboard focus reveals the tooltip
    When I focus the info button for "Aurora Wireless Headphones"
    Then the tooltip is visible

  Scenario: Tooltip is associated with the button via aria-describedby
    Then the info button references the tooltip id in aria-describedby
    And the tooltip carries that id
