// Generated from: features/integration.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('UI to API Integration', () => {

  test('Adding to cart calls the API and renders its response', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I add the "Beacon 4K Monitor" to the cart', null, { page }); 
    await Then('the cart API is called with a POST to "/api/cart/items"', null, { page }); 
    await And('the API response contains the product with quantity at least 1', null, { bdd }); 
    await And('a toast shows "Beacon 4K Monitor"', null, { page }); 
    await And('the cart badge count increases', null, { bdd, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/integration.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I add the \"Beacon 4K Monitor\" to the cart","stepMatchArguments":[{"group":{"start":10,"value":"\"Beacon 4K Monitor\"","children":[{"start":11,"value":"Beacon 4K Monitor","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the cart API is called with a POST to \"/api/cart/items\"","stepMatchArguments":[{"group":{"start":38,"value":"\"/api/cart/items\"","children":[{"start":39,"value":"/api/cart/items","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the API response contains the product with quantity at least 1","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And a toast shows \"Beacon 4K Monitor\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Beacon 4K Monitor\"","children":[{"start":15,"value":"Beacon 4K Monitor","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the cart badge count increases","stepMatchArguments":[]}]},
]; // bdd-data-end