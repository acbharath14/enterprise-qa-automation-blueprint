// Generated from: features/api-schema.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('OpenAPI Schema Validation', () => {

  test.describe('Product catalog endpoints', () => {

    test('GET /api/products matches the OpenAPI schema', async ({ When, Then, And, bdd, request }) => { 
      await When('I send a GET request to "/api/products"', null, { bdd, request }); 
      await Then('the response status is 200', null, { bdd }); 
      await And('every product in the response validates against the Product schema', null, { bdd }); 
    });

    test('POST /api/products 201 and 400 payloads match their schemas', async ({ When, Then, And, bdd, request }) => { 
      await When('I send a POST request to "/api/products" with a valid product payload', null, { bdd, request }); 
      await Then('the response status is 201', null, { bdd }); 
      await And('the created product validates against the Product schema', null, { bdd }); 
      await When('I send a POST request to "/api/products" with a negative price', null, { bdd, request }); 
      await Then('the response status is 400', null, { bdd }); 
      await And('the error payload validates against the Error schema', null, { bdd }); 
    });

    test('GET /api/products/{id} 200 and 404 payloads match their schemas', async ({ When, Then, And, bdd, request }) => { 
      await When('I send a GET request to "/api/products/prod-1"', null, { bdd, request }); 
      await Then('the response status is 200', null, { bdd }); 
      await And('the product validates against the Product schema', null, { bdd }); 
      await When('I send a GET request to "/api/products/no-such-product"', null, { bdd, request }); 
      await Then('the response status is 404', null, { bdd }); 
      await And('the error payload validates against the Error schema', null, { bdd }); 
    });

  });

  test.describe('Authentication endpoint', () => {

    test('POST /api/login 401 payload matches the error schema', async ({ When, Then, And, bdd, request }) => { 
      await When('I send a POST request to "/api/login" with wrong credentials', null, { bdd, request }); 
      await Then('the response status is 401', null, { bdd }); 
      await And('the error payload validates against the Error schema', null, { bdd }); 
    });

  });

  test.describe('Validator integrity (no server involved)', () => {

    test('Unknown /api routes return 404 and the validator fails loudly', async ({ When, Then, And, bdd, request }) => { 
      await When('I send a GET request to "/api/does-not-exist"', null, { bdd, request }); 
      await Then('the response status is 404', null, { bdd }); 
      await And('the schema validator reports "No operation documented" instead of passing silently', null, { bdd }); 
    });

    test('The validator rejects a payload that violates the schema', async ({ Given, When, Then, And, bdd }) => { 
      await Given('a product payload with a non-numeric price', null, { bdd }); 
      await When('the validator checks it against the Product schema', null, { bdd }); 
      await Then('validation fails', null, { bdd }); 
      await And('the error mentions the "price" field', null, { bdd }); 
    });

    test('An undocumented status code fails loudly instead of passing silently', async ({ Given, When, Then, And, bdd }) => { 
      await Given('a response with an undocumented status code', null, { bdd }); 
      await When('the validator checks it against the OpenAPI document', null, { bdd }); 
      await Then('validation fails', null, { bdd }); 
      await And('the error mentions the undocumented status code', null, { bdd }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/api-schema.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/products\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/products\"","children":[{"start":25,"value":"/api/products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the response status is 200","stepMatchArguments":[{"group":{"start":23,"value":"200"},"parameterTypeName":"int"}]},{"pwStepLine":11,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And every product in the response validates against the Product schema","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":15,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/products\" with a valid product payload","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/products\"","children":[{"start":26,"value":"/api/products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the response status is 201","stepMatchArguments":[{"group":{"start":23,"value":"201"},"parameterTypeName":"int"}]},{"pwStepLine":17,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And the created product validates against the Product schema","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/products\" with a negative price","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/products\"","children":[{"start":26,"value":"/api/products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the response status is 400","stepMatchArguments":[{"group":{"start":23,"value":"400"},"parameterTypeName":"int"}]},{"pwStepLine":20,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the error payload validates against the Error schema","stepMatchArguments":[]}]},
  {"pwTestLine":23,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":24,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/products/prod-1\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/products/prod-1\"","children":[{"start":25,"value":"/api/products/prod-1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the response status is 200","stepMatchArguments":[{"group":{"start":23,"value":"200"},"parameterTypeName":"int"}]},{"pwStepLine":26,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And the product validates against the Product schema","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/products/no-such-product\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/products/no-such-product\"","children":[{"start":25,"value":"/api/products/no-such-product","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then the response status is 404","stepMatchArguments":[{"group":{"start":23,"value":"404"},"parameterTypeName":"int"}]},{"pwStepLine":29,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And the error payload validates against the Error schema","stepMatchArguments":[]}]},
  {"pwTestLine":36,"pickleLine":32,"tags":[],"steps":[{"pwStepLine":37,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/login\" with wrong credentials","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/login\"","children":[{"start":26,"value":"/api/login","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Then the response status is 401","stepMatchArguments":[{"group":{"start":23,"value":"401"},"parameterTypeName":"int"}]},{"pwStepLine":39,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"And the error payload validates against the Error schema","stepMatchArguments":[]}]},
  {"pwTestLine":46,"pickleLine":38,"tags":[],"steps":[{"pwStepLine":47,"gherkinStepLine":39,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/does-not-exist\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/does-not-exist\"","children":[{"start":25,"value":"/api/does-not-exist","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":48,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"Then the response status is 404","stepMatchArguments":[{"group":{"start":23,"value":"404"},"parameterTypeName":"int"}]},{"pwStepLine":49,"gherkinStepLine":41,"keywordType":"Outcome","textWithKeyword":"And the schema validator reports \"No operation documented\" instead of passing silently","stepMatchArguments":[{"group":{"start":29,"value":"\"No operation documented\"","children":[{"start":30,"value":"No operation documented","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":52,"pickleLine":43,"tags":[],"steps":[{"pwStepLine":53,"gherkinStepLine":44,"keywordType":"Context","textWithKeyword":"Given a product payload with a non-numeric price","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":45,"keywordType":"Action","textWithKeyword":"When the validator checks it against the Product schema","stepMatchArguments":[]},{"pwStepLine":55,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"Then validation fails","stepMatchArguments":[]},{"pwStepLine":56,"gherkinStepLine":47,"keywordType":"Outcome","textWithKeyword":"And the error mentions the \"price\" field","stepMatchArguments":[{"group":{"start":23,"value":"\"price\"","children":[{"start":24,"value":"price","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":59,"pickleLine":49,"tags":[],"steps":[{"pwStepLine":60,"gherkinStepLine":50,"keywordType":"Context","textWithKeyword":"Given a response with an undocumented status code","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":51,"keywordType":"Action","textWithKeyword":"When the validator checks it against the OpenAPI document","stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":52,"keywordType":"Outcome","textWithKeyword":"Then validation fails","stepMatchArguments":[]},{"pwStepLine":63,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"And the error mentions the undocumented status code","stepMatchArguments":[]}]},
]; // bdd-data-end