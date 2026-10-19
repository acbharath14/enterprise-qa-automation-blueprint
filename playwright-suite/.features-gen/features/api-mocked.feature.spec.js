// Generated from: features/api-mocked.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Storefront Resilience to Backend Conditions', () => {

  test('Mocked product list renders in the catalog', async ({ Given, When, Then, And, page }) => { 
    await Given('the products API is stubbed to return a single mocked product', null, { page }); 
    await When('I open the DemoMart homepage', null, { page }); 
    await Then('the mocked product card is visible', null, { page }); 
    await And('the product name reads "Mock Widget"', null, { page }); 
  });

  test('Mocked API failure shows a friendly error state', async ({ Given, When, Then, And, page }) => { 
    await Given('the products API is stubbed to return HTTP 500', null, { page }); 
    await When('I open the DemoMart homepage', null, { page }); 
    await Then('a friendly "Could not load products" error is shown', null, { page }); 
    await And('the product grid is empty', null, { page }); 
  });

  test('Slow API shows skeletons while loading', async ({ Given, When, Then, And, page }) => { 
    await Given('the products API is stubbed to respond after a delay', null, { page }); 
    await When('I open the DemoMart homepage', null, { page }); 
    await Then('catalog loading skeletons are visible while waiting', null, { page }); 
    await And('the real product catalog renders once the response arrives', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/api-mocked.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the products API is stubbed to return a single mocked product","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the mocked product card is visible","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the product name reads \"Mock Widget\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Mock Widget\"","children":[{"start":24,"value":"Mock Widget","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given the products API is stubbed to return HTTP 500","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then a friendly \"Could not load products\" error is shown","stepMatchArguments":[{"group":{"start":11,"value":"\"Could not load products\"","children":[{"start":12,"value":"Could not load products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the product grid is empty","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":21,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given the products API is stubbed to respond after a delay","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then catalog loading skeletons are visible while waiting","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"And the real product catalog renders once the response arrives","stepMatchArguments":[]}]},
]; // bdd-data-end