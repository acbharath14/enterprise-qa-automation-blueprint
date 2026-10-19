// Generated from: features/authed.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Persisted Session', () => {

  test('Session persists without signing in again', async ({ Given, When, Then, page }) => { 
    await Given('I have a saved signed-in session', null, { page }); 
    await When('I visit the DemoMart homepage', null, { page }); 
    await Then('the user label shows "Signed in as admin"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/authed.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I have a saved signed-in session","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I visit the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the user label shows \"Signed in as admin\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Signed in as admin\"","children":[{"start":22,"value":"Signed in as admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end