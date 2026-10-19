// Generated from: features/performance.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Performance Budgets', () => {

  test('Storefront becomes interactive within budget', async ({ When, Then, page }) => { 
    await When('I open the DemoMart homepage', null, { page }); 
    await Then('the catalog heading is visible within 8 seconds', null, { page }); 
  });

  test('Products API responds within budget', async ({ When, Then, bdd, request }) => { 
    await When('I send a GET request to "/api/products"', null, { bdd, request }); 
    await Then('the response is successful within 2 seconds', null, { bdd }); 
  });

  test('No console errors or page errors on load', async ({ When, Then, bdd, page }) => { 
    await When('I open the DemoMart homepage and wait for network idle', null, { bdd, page }); 
    await Then('there are no console errors and no page errors', null, { bdd }); 
  });

  test('No console errors or page errors during checkout', async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am filling the checkout wizard with valid details', null, { bdd, page }); 
    await When('I complete the shipping and payment steps', null, { bdd, page }); 
    await Then('there are no console errors and no page errors', null, { bdd }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/performance.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the catalog heading is visible within 8 seconds","stepMatchArguments":[]}]},
  {"pwTestLine":11,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/products\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/products\"","children":[{"start":25,"value":"/api/products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the response is successful within 2 seconds","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage and wait for network idle","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then there are no console errors and no page errors","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":18,"tags":[],"steps":[{"pwStepLine":22,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given I am filling the checkout wizard with valid details","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I complete the shipping and payment steps","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then there are no console errors and no page errors","stepMatchArguments":[]}]},
]; // bdd-data-end