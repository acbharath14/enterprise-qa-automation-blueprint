// Generated from: features/empty-states.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Empty States', () => {

  test('Search with no matches shows the no-results message', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I search for "zzz-no-match"', null, { page }); 
    await Then('the no-results message is visible', null, { page }); 
    await And('the product grid is empty', null, { page }); 
  });

  test('Empty cart shows the cart-empty message', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('my cart is empty', null, { bdd }); 
    await When('I open the cart', null, { page }); 
    await Then('the "Your Cart" heading is visible', null, { page }); 
    await And('the cart-empty message is visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/empty-states.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I search for \"zzz-no-match\"","stepMatchArguments":[{"group":{"start":13,"value":"\"zzz-no-match\"","children":[{"start":14,"value":"zzz-no-match","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the no-results message is visible","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the product grid is empty","stepMatchArguments":[]}]},
  {"pwTestLine":13,"pickleLine":11,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given my cart is empty","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I open the cart","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the \"Your Cart\" heading is visible","stepMatchArguments":[{"group":{"start":4,"value":"\"Your Cart\"","children":[{"start":5,"value":"Your Cart","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the cart-empty message is visible","stepMatchArguments":[]}]},
]; // bdd-data-end