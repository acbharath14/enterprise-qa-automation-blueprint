// Generated from: features/theme.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Theme Toggle', () => {

  test('Toggles between light and dark', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await Then('the page background is the light theme color', null, { page }); 
    await And('the theme toggle is unchecked', null, { page }); 
    await When('I click the theme toggle', null, { page }); 
    await Then('the theme toggle is checked', null, { page }); 
    await And('the page background is the dark theme color', null, { page }); 
    await When('I click the theme toggle again', null, { page }); 
    await Then('the theme toggle is unchecked', null, { page }); 
    await And('the page background is the light theme color', null, { page }); 
  });

  test('Theme preference persists across reloads', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I switch to the dark theme', null, { page }); 
    await And('I reload the page', null, { page }); 
    await Then('the page background is still the dark theme color', null, { page }); 
    await And('the theme toggle is still checked', null, { page }); 
  });

  test('Declares support for both color schemes', async ({ Given, Then, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await Then('the color-scheme meta tag declares "dark light"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/theme.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the page background is the light theme color","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And the theme toggle is unchecked","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I click the theme toggle","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the theme toggle is checked","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the page background is the dark theme color","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I click the theme toggle again","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the theme toggle is unchecked","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the page background is the light theme color","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I switch to the dark theme","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"And I reload the page","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the page background is still the dark theme color","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the theme toggle is still checked","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the color-scheme meta tag declares \"dark light\"","stepMatchArguments":[{"group":{"start":35,"value":"\"dark light\"","children":[{"start":36,"value":"dark light","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end