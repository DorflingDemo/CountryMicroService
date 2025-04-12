Feature: Retrieve Country and Currency Data
  As an application developer
  I want to retrieve a list of countries, their ISO codes, and currencies via an API
  So that my application can use consistent and standardized information

  Background:
    Given the Country/Currency service is running

  Scenario: Successfully retrieve the list of all countries and their currencies
    When I send a GET request to "/countries"
    Then the response status code should be 200
    And the response content type should be "application/json"
    And the response body should be a JSON array
    And each item in the JSON array should have a "countryName" string field
    And each item in the JSON array should have an "isoAlpha2Code" string field matching the format "[A-Z]{2}"
    And each item in the JSON array should have a "currencies" array field
    And each currency code within the "currencies" array should be a string matching the format "[A-Z]{3}"

  Scenario: Verify specific known country data exists
    When I send a GET request to "/countries"
    Then the response status code should be 200
    And the response list should contain an entry with "isoAlpha2Code" "US" and "currencies" including "USD"
    And the response list should contain an entry with "isoAlpha2Code" "CA" and "currencies" including "CAD"
    And the response list should contain an entry with "isoAlpha2Code" "GB" and "currencies" including "GBP"
    # Add more specific checks as needed based on the expected data source

  # Optional: Add scenarios for error handling if specific error responses are defined
  # e.g., Scenario: Requesting an invalid endpoint
  #   When I send a GET request to "/invalid_endpoint"
  #   Then the response status code should be 404
