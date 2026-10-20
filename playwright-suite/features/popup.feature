Feature: Order Receipt Popup
  After placing an order, the confirmation page offers a receipt view
  that opens in a new browser tab.

  Scenario: View receipt opens the receipt in a new tab
    Given I have placed an order for "Aurora Wireless Headphones"
    When I click "View receipt"
    Then a new tab opens at the receipt URL
    And the receipt tab shows CSV content with a "product,quantity" header
