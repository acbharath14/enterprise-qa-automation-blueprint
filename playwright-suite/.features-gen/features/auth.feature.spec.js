// Generated from: features/auth.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Sign In', () => {

  test('Rejects invalid credentials', async ({ Given, When, Then, page }) => { 
    await Given('I am on the sign-in page', null, { page }); 
    await When('I sign in with username "admin" and password "wrong"', null, { page }); 
    await Then('an error message "Invalid credentials" is shown', null, { page }); 
  });

  test('Signs in with valid credentials', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the sign-in page', null, { page }); 
    await When('I sign in with username "admin" and password "secret"', null, { page }); 
    await Then('the logout button is visible', null, { page }); 
    await And('the user label shows "admin"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/auth.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am on the sign-in page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I sign in with username \"admin\" and password \"wrong\"","stepMatchArguments":[{"group":{"start":24,"value":"\"admin\"","children":[{"start":25,"value":"admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":45,"value":"\"wrong\"","children":[{"start":46,"value":"wrong","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then an error message \"Invalid credentials\" is shown","stepMatchArguments":[{"group":{"start":17,"value":"\"Invalid credentials\"","children":[{"start":18,"value":"Invalid credentials","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":12,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given I am on the sign-in page","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I sign in with username \"admin\" and password \"secret\"","stepMatchArguments":[{"group":{"start":24,"value":"\"admin\"","children":[{"start":25,"value":"admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":45,"value":"\"secret\"","children":[{"start":46,"value":"secret","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the logout button is visible","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And the user label shows \"admin\"","stepMatchArguments":[{"group":{"start":21,"value":"\"admin\"","children":[{"start":22,"value":"admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end