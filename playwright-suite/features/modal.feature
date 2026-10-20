Feature: Quick-View Modal
  Each catalog card offers a quick-view modal with product details.
  The modal traps keyboard focus, closes on ESC or backdrop click,
  and returns focus to the trigger that opened it.

  Background:
    Given I am on the DemoMart catalog page

  Scenario: Modal opens with dialog semantics and initial focus
    When I open the quick view for "Aurora Wireless Headphones"
    Then the modal has role "dialog" and aria-modal="true"
    And the close button has keyboard focus

  Scenario: Tab focus is trapped within the modal
    Given the quick-view modal is open
    When I press Tab on the last focusable button
    Then focus wraps to the first focusable button
    When I press Shift+Tab on the first button
    Then focus wraps back to the last button

  Scenario: ESC closes the modal and returns focus to the trigger
    When I open the quick view for "Aurora Wireless Headphones"
    And I press Escape
    Then the modal is hidden
    And the quick-view trigger has keyboard focus

  Scenario: Backdrop click closes the modal
    Given the quick-view modal is open
    When I click the modal backdrop
    Then the modal is hidden
