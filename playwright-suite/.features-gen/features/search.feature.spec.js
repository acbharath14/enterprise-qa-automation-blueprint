// Generated from: features/search.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Catalog Search', () => {

  test('Searching \'aurora\' returns the 3 matching products', { tag: ['@smoke'] }, async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart catalog', null, { bdd, page }); 
    await When('I search for "aurora"', null, { page }); 
    await Then('3 product cards are shown', null, { page }); 
    await And('the cards for prod-1, prod-5 and prod-9 are visible', null, { page }); 
    await And('the no-results message is hidden', null, { page }); 
  });

  test('Searching \'zzz-no-match\' shows the no-results state', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart catalog', null, { bdd, page }); 
    await When('I search for "zzz-no-match"', null, { page }); 
    await Then('the no-results message is visible', null, { page }); 
    await And('0 product cards are shown', null, { page }); 
  });

  test('Clearing the search restores page 1', async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart catalog', null, { bdd, page }); 
    await And('I have searched for "zzz-no-match"', null, { page }); 
    await When('I clear the search', null, { page }); 
    await Then('the no-results message is hidden', null, { page }); 
    await And('the page indicator shows "Page 1 of ..."', null, { page }); 
    await And('6 product cards are shown', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/search.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":["@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I search for \"aurora\"","stepMatchArguments":[{"group":{"start":13,"value":"\"aurora\"","children":[{"start":14,"value":"aurora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 3 product cards are shown","stepMatchArguments":[{"group":{"start":0,"value":"3"},"parameterTypeName":"int"}]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the cards for prod-1, prod-5 and prod-9 are visible","stepMatchArguments":[{"group":{"start":14,"value":"prod-1, prod-5 and prod-9"}}]},{"pwStepLine":11,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the no-results message is hidden","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I search for \"zzz-no-match\"","stepMatchArguments":[{"group":{"start":13,"value":"\"zzz-no-match\"","children":[{"start":14,"value":"zzz-no-match","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the no-results message is visible","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And 0 product cards are shown","stepMatchArguments":[{"group":{"start":0,"value":"0"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":21,"pickleLine":20,"tags":[],"steps":[{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"And I have searched for \"zzz-no-match\"","stepMatchArguments":[{"group":{"start":20,"value":"\"zzz-no-match\"","children":[{"start":21,"value":"zzz-no-match","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I clear the search","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then the no-results message is hidden","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And the page indicator shows \"Page 1 of ...\"","stepMatchArguments":[{"group":{"start":26,"value":"Page 1 of ..."}}]},{"pwStepLine":27,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And 6 product cards are shown","stepMatchArguments":[{"group":{"start":0,"value":"6"},"parameterTypeName":"int"}]}]},
]; // bdd-data-end