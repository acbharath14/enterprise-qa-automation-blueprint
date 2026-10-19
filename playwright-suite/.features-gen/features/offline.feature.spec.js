// Generated from: features/offline.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Offline Handling', () => {

  test('Shows a friendly message when the API is unreachable', async ({ Given, When, Then, And, context, page }) => { 
    await Given('I am on the DemoMart homepage with products loaded', null, { page }); 
    await When('the network goes offline', null, { context, page }); 
    await And('I search for "aurora"', null, { page }); 
    await Then('an error message "Could not load products" is shown', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/offline.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage with products loaded","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When the network goes offline","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And I search for \"aurora\"","stepMatchArguments":[{"group":{"start":13,"value":"\"aurora\"","children":[{"start":14,"value":"aurora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then an error message \"Could not load products\" is shown","stepMatchArguments":[{"group":{"start":17,"value":"\"Could not load products\"","children":[{"start":18,"value":"Could not load products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end