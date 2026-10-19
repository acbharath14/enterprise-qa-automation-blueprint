// Generated from: features/dropdown.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Category Filter Dropdown', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the DemoMart catalog page', null, { bdd, page }); 
  });
  
  test('Selecting \'apparel\' shows only apparel products', async ({ When, Then, And, page }) => { 
    await When('I filter the catalog by category "apparel"', null, { page }); 
    await Then('3 product cards are shown', null, { page }); 
    await And('every visible card is in the "apparel" category', null, { page }); 
  });

  test('Selecting \'All categories\' restores page 1', async ({ Given, When, Then, And, page }) => { 
    await Given('I have filtered the catalog by category "apparel"', null, { page }); 
    await When('I reset the category filter to "All categories"', null, { page }); 
    await Then('the page indicator reads "Page 1 of N"', null, { page }); 
    await And('6 product cards are shown', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/dropdown.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I filter the catalog by category \"apparel\"","stepMatchArguments":[{"group":{"start":33,"value":"\"apparel\"","children":[{"start":34,"value":"apparel","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 3 product cards are shown","stepMatchArguments":[{"group":{"start":0,"value":"3"},"parameterTypeName":"int"}]},{"pwStepLine":13,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And every visible card is in the \"apparel\" category","stepMatchArguments":[{"group":{"start":29,"value":"\"apparel\"","children":[{"start":30,"value":"apparel","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":16,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I have filtered the catalog by category \"apparel\"","stepMatchArguments":[{"group":{"start":40,"value":"\"apparel\"","children":[{"start":41,"value":"apparel","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I reset the category filter to \"All categories\"","stepMatchArguments":[{"group":{"start":31,"value":"\"All categories\"","children":[{"start":32,"value":"All categories","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the page indicator reads \"Page 1 of N\"","stepMatchArguments":[{"group":{"start":25,"value":"\"Page 1 of N\"","children":[{"start":26,"value":"Page 1 of N","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And 6 product cards are shown","stepMatchArguments":[{"group":{"start":0,"value":"6"},"parameterTypeName":"int"}]}]},
]; // bdd-data-end