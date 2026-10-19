// Generated from: features/skeletons.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Loading Skeletons', () => {

  test('Slow products API shows skeletons, then the product cards', async ({ Given, When, Then, And, page }) => { 
    await Given('the products API is delayed', null, { page }); 
    await When('I visit the DemoMart homepage', null, { page }); 
    await Then('6 catalog skeletons are shown', null, { page }); 
    await And('the product grid is marked busy', null, { page }); 
    await When('the API response arrives', null, { page }); 
    await Then('the product card for "prod-1" is visible', null, { page }); 
    await And('no skeletons remain', null, { page }); 
    await And('the product grid is no longer marked busy', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/skeletons.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the products API is delayed","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I visit the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 6 catalog skeletons are shown","stepMatchArguments":[{"group":{"start":0,"value":"6"},"parameterTypeName":"int"}]},{"pwStepLine":10,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And the product grid is marked busy","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When the API response arrives","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the product card for \"prod-1\" is visible","stepMatchArguments":[{"group":{"start":21,"value":"\"prod-1\"","children":[{"start":22,"value":"prod-1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And no skeletons remain","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the product grid is no longer marked busy","stepMatchArguments":[]}]},
]; // bdd-data-end