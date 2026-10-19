Feature: Store API
  Direct API tests (no browser): they pin the contract of the
  DemoMart backend that the storefront consumes. The UI scenarios
  prove the journey; these prove the API itself. Each scenario
  uses an isolated cart, so parallel runs never share cart state.

  Rule: Product catalog endpoints

  Scenario: Lists the seeded products
    When I request GET /api/products
    Then the response is 200 with JSON content
    And the list contains prod-1 through prod-12
    And each product has id, name, category, price, rating, stock and description

  Scenario: Supports search, category filter and sort
    When I request GET /api/products?q=aurora
    Then 3 products are returned and every name contains "aurora"
    When I request GET /api/products?category=apparel
    Then 3 products are returned and every category is "apparel"
    When I request GET /api/products?sort=price_asc
    Then the products are ordered by ascending price

  Scenario: Product values are sane
    When I request GET /api/products
    Then every product has a price greater than 0
    And every product has a rating between 0 and 5
    And every product has a non-negative integer stock

  Scenario: Get-by-id returns the product; unknown id is a JSON 404
    When I request GET /api/products/prod-1
    Then the response is 200 and the product name is "Aurora Wireless Headphones"
    When I request GET /api/products/nope
    Then the response is 404 with JSON content and an error field

  Scenario: Product CRUD round-trips
    When I create a product named "API Test Widget" priced at 12.50
    Then the response is 201 and the product is returned
    When I patch the product price to 15
    Then the response is 200 and the price is 15
    When I create a product with a negative price
    Then the response is 400 with an error field
    When I delete the product
    Then the response is 204
    And requesting the product afterwards returns 404

  Scenario: Unknown API routes return JSON 404
    When I request GET /api/does-not-exist
    Then the response is 404 with JSON content and an error field

  Rule: Cart endpoints

  Scenario: Cart math is internally consistent
    Given a product priced at $42.50 exists
    When I add 5 units to my cart
    Then my cart line shows quantity 5
    And the line total is 5 x $42.50
    And the cart subtotal equals the sum of the line totals

  Scenario: Rejects unknown products, bad quantities and over-stock
    When I add an unknown product to my cart
    Then the response is 404
    When I add prod-1 with quantity 0
    Then the response is 400
    When I add prod-1 with quantity 99999
    Then the response is 400

  Scenario: Quantity updates and removal work
    Given a product exists and 1 unit is in my cart
    When I set the quantity to 4
    Then the cart line shows quantity 4
    When I remove the line from my cart
    Then the product is no longer in my cart
    And removing it again returns 404

  Rule: Order endpoints

  Scenario: Checkout creates an order and clears its lines
    Given 2 units of a product are in my cart
    When I place an order with valid buyer details
    Then the response is 201
    And the order id matches the pattern "ord-<number>"
    And the order status is "confirmed"
    And the order contains the product with quantity 2
    And the order total equals the sum of the line totals
    And my cart no longer contains the product
    And I can retrieve the order by its id

  Scenario: Rejects empty carts and invalid payloads
    Given my cart is empty
    When I place an order
    Then the response is 422
    Given 1 unit of a product is in my cart
    When I place an order with email "not-an-email"
    Then the response is 400

  Scenario: Receipt downloads as CSV
    Given 1 unit of a product is in my cart
    When I place an order with valid buyer details
    And I download the receipt for the order
    Then the response is 200 with CSV content
    And the download is named "receipt-<order id>.csv"
    And the CSV has the header "product,quantity,unit_price,line_total"
    And the CSV contains the product name
    And downloading the receipt for an unknown order returns 404
