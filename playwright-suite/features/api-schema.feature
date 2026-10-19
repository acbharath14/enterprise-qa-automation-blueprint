Feature: OpenAPI Schema Validation
  Every DemoMart JSON response is pinned against the committed OpenAPI
  document (test-data/openapi.store.json): field names, types, required
  fields, value ranges. If the API drifts from its documentation, this is
  the suite that goes red first. Behavior is pinned by the API suite and
  the consumer/provider agreement by Pact; this suite pins the contract
  shape.

  Rule: Product catalog endpoints
    Scenario: GET /api/products matches the OpenAPI schema
      When I send a GET request to "/api/products"
      Then the response status is 200
      And every product in the response validates against the Product schema

    Scenario: POST /api/products 201 and 400 payloads match their schemas
      When I send a POST request to "/api/products" with a valid product payload
      Then the response status is 201
      And the created product validates against the Product schema
      When I send a POST request to "/api/products" with a negative price
      Then the response status is 400
      And the error payload validates against the Error schema

    Scenario: GET /api/products/{id} 200 and 404 payloads match their schemas
      When I send a GET request to "/api/products/prod-1"
      Then the response status is 200
      And the product validates against the Product schema
      When I send a GET request to "/api/products/no-such-product"
      Then the response status is 404
      And the error payload validates against the Error schema

  Rule: Authentication endpoint
    Scenario: POST /api/login 401 payload matches the error schema
      When I send a POST request to "/api/login" with wrong credentials
      Then the response status is 401
      And the error payload validates against the Error schema

  Rule: Validator integrity (no server involved)
    Scenario: Unknown /api routes return 404 and the validator fails loudly
      When I send a GET request to "/api/does-not-exist"
      Then the response status is 404
      And the schema validator reports "No operation documented" instead of passing silently

    Scenario: The validator rejects a payload that violates the schema
      Given a product payload with a non-numeric price
      When the validator checks it against the Product schema
      Then validation fails
      And the error mentions the "price" field

    Scenario: An undocumented status code fails loudly instead of passing silently
      Given a response with an undocumented status code
      When the validator checks it against the OpenAPI document
      Then validation fails
      And the error mentions the undocumented status code
