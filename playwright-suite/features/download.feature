Feature: Order Receipt Download
  After a DemoMart order is placed, the shopper can download a CSV receipt
  of the confirmed order.

  Scenario: Downloads the order receipt as CSV
    Given my cart contains the "Aurora Wireless Headphones"
    And I have completed checkout with valid details
    When I click the download receipt button
    Then a file named like "receipt-ord-<n>.csv" is downloaded
    And the CSV contains the header "product,quantity,unit_price,line_total"
