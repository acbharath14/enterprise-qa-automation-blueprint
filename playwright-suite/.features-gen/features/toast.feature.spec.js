// Generated from: features/toast.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Add-to-Cart Toast', () => {

  test('Adding to cart shows a toast with the product name, then hides', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I add "Aurora Wireless Headphones" to the cart', null, { page }); 
    await Then('a toast is visible', null, { page }); 
    await And('the toast contains "Aurora Wireless Headphones"', null, { page }); 
    await When('I wait for the toast timeout', null, { page }); 
    await Then('the toast is hidden', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/toast.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I add \"Aurora Wireless Headphones\" to the cart","stepMatchArguments":[{"group":{"start":6,"value":"\"Aurora Wireless Headphones\"","children":[{"start":7,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then a toast is visible","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the toast contains \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Aurora Wireless Headphones\"","children":[{"start":20,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I wait for the toast timeout","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the toast is hidden","stepMatchArguments":[]}]},
]; // bdd-data-end