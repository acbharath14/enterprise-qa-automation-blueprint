// Generated from: features/pagination.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Catalog Pagination', () => {

  test('Page 1 shows page info with prev disabled and next enabled', async ({ Given, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await Then('the page info reads "Page 1 of N"', null, { page }); 
    await And('the previous button is disabled', null, { page }); 
    await And('the next button is enabled', null, { page }); 
    await And('6 product cards are shown', null, { page }); 
  });

  test('Next goes to page 2 with different products', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on catalog page 1', null, { page }); 
    await When('I click the next button', null, { page }); 
    await Then('the page info reads "Page 2 of N"', null, { page }); 
    await And('the product card for "prod-7" is visible', null, { page }); 
    await And('the product card for "prod-1" is hidden', null, { page }); 
  });

  test('Last page disables next; prev walks back to page 1', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I page forward to the last page', null, { page }); 
    await Then('the next button is disabled', null, { page }); 
    await And('the previous button is enabled', null, { page }); 
    await When('I page back to the first page', null, { page }); 
    await Then('the page info reads "Page 1 of N"', null, { page }); 
    await And('the product card for "prod-1" is visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/pagination.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the page info reads \"Page 1 of N\"","stepMatchArguments":[{"group":{"start":20,"value":"\"Page 1 of N\"","children":[{"start":21,"value":"Page 1 of N","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And the previous button is disabled","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the next button is enabled","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 6 product cards are shown","stepMatchArguments":[{"group":{"start":0,"value":"6"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":14,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given I am on catalog page 1","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I click the next button","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the page info reads \"Page 2 of N\"","stepMatchArguments":[{"group":{"start":20,"value":"\"Page 2 of N\"","children":[{"start":21,"value":"Page 2 of N","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the product card for \"prod-7\" is visible","stepMatchArguments":[{"group":{"start":21,"value":"\"prod-7\"","children":[{"start":22,"value":"prod-7","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the product card for \"prod-1\" is hidden","stepMatchArguments":[{"group":{"start":21,"value":"\"prod-1\"","children":[{"start":22,"value":"prod-1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":22,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":23,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I page forward to the last page","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the next button is disabled","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"And the previous button is enabled","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I page back to the first page","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the page info reads \"Page 1 of N\"","stepMatchArguments":[{"group":{"start":20,"value":"\"Page 1 of N\"","children":[{"start":21,"value":"Page 1 of N","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And the product card for \"prod-1\" is visible","stepMatchArguments":[{"group":{"start":21,"value":"\"prod-1\"","children":[{"start":22,"value":"prod-1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end