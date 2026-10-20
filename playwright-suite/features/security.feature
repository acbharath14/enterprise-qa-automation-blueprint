Feature: Baseline Security Headers and Output Encoding
  Baseline checks even a demo app should model: secure headers, JSON (not
  HTML) error responses, and no reflection of untrusted input.

  Scenario: HTML responses carry the nosniff header
    When I request the DemoMart homepage
    Then the response carries X-Content-Type-Options: nosniff

  Scenario: API responses carry the nosniff header
    When I send a GET request to "/api/products"
    Then the response carries X-Content-Type-Options: nosniff

  Scenario: Clickjacking defense header is present
    When I request the homepage, the payment frame, and the products API
    Then every response carries X-Frame-Options: SAMEORIGIN

  Scenario: Product names are HTML-escaped in the catalog
    Given a product exists whose name contains an image-tag XSS payload
    When I search the catalog for that product
    Then the product name renders as escaped text, never as HTML
