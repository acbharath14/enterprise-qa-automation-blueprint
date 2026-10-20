// Generated from: features/controls.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Catalog Toolbar Controls', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the DemoMart catalog page', null, { bdd, page }); 
  });
  
  test('Price slider filters card prices', async ({ When, Then, And, page }) => { 
    await When('I set the max-price slider to $50', null, { page }); 
    await Then('the slider output reads "$50.00"', null, { page }); 
    await And('every visible product card is priced at $50 or less', null, { page }); 
  });

  test('Theme toggle flips aria-checked', async ({ Given, When, Then, page }) => { 
    await Given('the theme toggle reports aria-checked="false"', null, { page }); 
    await When('I click the theme toggle', null, { page }); 
    await Then('the toggle reports aria-checked="true"', null, { page }); 
    await When('I click the theme toggle again', null, { page }); 
    await Then('the toggle reports aria-checked="false"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/controls.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I set the max-price slider to $50","stepMatchArguments":[{"group":{"start":31,"value":"50"},"parameterTypeName":"int"}]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the slider output reads \"$50.00\"","stepMatchArguments":[{"group":{"start":24,"value":"\"$50.00\"","children":[{"start":25,"value":"$50.00","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And every visible product card is priced at $50 or less","stepMatchArguments":[{"group":{"start":41,"value":"50"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":16,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given the theme toggle reports aria-checked=\"false\"","stepMatchArguments":[{"group":{"start":38,"value":"\"false\"","children":[{"start":39,"value":"false","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I click the theme toggle","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the toggle reports aria-checked=\"true\"","stepMatchArguments":[{"group":{"start":32,"value":"\"true\"","children":[{"start":33,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I click the theme toggle again","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the toggle reports aria-checked=\"false\"","stepMatchArguments":[{"group":{"start":32,"value":"\"false\"","children":[{"start":33,"value":"false","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end