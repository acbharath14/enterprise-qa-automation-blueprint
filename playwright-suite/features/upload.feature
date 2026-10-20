Feature: Product Image Upload
  DemoMart supports uploading a product image; hostile filenames must be
  sanitized so no markup survives into the stored filename.

  Scenario: Product image upload sanitizes a hostile filename
    When I upload an image for prod-1 with a script-tag filename
    Then the response status is 200
    And the stored filename contains no "<" or ">"
