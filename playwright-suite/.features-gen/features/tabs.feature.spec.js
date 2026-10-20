// Generated from: features/tabs.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Product Detail Tabs', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on a product detail page', null, { bdd, page }); 
  });
  
  test('Clicking a tab shows its panel and updates aria-selected', async ({ When, Then, And, page }) => { 
    await When('I click the "Reviews" tab', null, { page }); 
    await Then('the reviews panel is visible', null, { page }); 
    await And('the "Reviews" tab reports aria-selected="true"', null, { page }); 
    await And('the "Description" tab reports aria-selected="false"', null, { page }); 
    await And('the description panel is hidden', null, { page }); 
  });

  test('ArrowRight moves to the next tab and focuses it', async ({ When, Then, And, page }) => { 
    await When('I focus the "Description" tab', null, { page }); 
    await And('I press ArrowRight', null, { page }); 
    await Then('the "Reviews" tab reports aria-selected="true"', null, { page }); 
    await And('the "Reviews" tab has keyboard focus', null, { page }); 
  });

  test('Home and End jump to the first and last tabs', async ({ When, Then, And, page }) => { 
    await When('I focus the "Shipping" tab', null, { page }); 
    await And('I press Home', null, { page }); 
    await Then('the "Description" tab reports aria-selected="true"', null, { page }); 
    await And('the "Description" tab has keyboard focus', null, { page }); 
    await When('I press End', null, { page }); 
    await Then('the "Shipping" tab reports aria-selected="true"', null, { page }); 
    await And('the "Shipping" tab has keyboard focus', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/tabs.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on a product detail page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I click the \"Reviews\" tab","stepMatchArguments":[{"group":{"start":12,"value":"\"Reviews\"","children":[{"start":13,"value":"Reviews","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the reviews panel is visible","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the \"Reviews\" tab reports aria-selected=\"true\"","stepMatchArguments":[{"group":{"start":4,"value":"\"Reviews\"","children":[{"start":5,"value":"Reviews","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":40,"value":"\"true\"","children":[{"start":41,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And the \"Description\" tab reports aria-selected=\"false\"","stepMatchArguments":[{"group":{"start":4,"value":"\"Description\"","children":[{"start":5,"value":"Description","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"false\"","children":[{"start":45,"value":"false","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the description panel is hidden","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on a product detail page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I focus the \"Description\" tab","stepMatchArguments":[{"group":{"start":12,"value":"\"Description\"","children":[{"start":13,"value":"Description","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I press ArrowRight","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the \"Reviews\" tab reports aria-selected=\"true\"","stepMatchArguments":[{"group":{"start":4,"value":"\"Reviews\"","children":[{"start":5,"value":"Reviews","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":40,"value":"\"true\"","children":[{"start":41,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And the \"Reviews\" tab has keyboard focus","stepMatchArguments":[{"group":{"start":4,"value":"\"Reviews\"","children":[{"start":5,"value":"Reviews","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":25,"pickleLine":22,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on a product detail page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I focus the \"Shipping\" tab","stepMatchArguments":[{"group":{"start":12,"value":"\"Shipping\"","children":[{"start":13,"value":"Shipping","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"And I press Home","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the \"Description\" tab reports aria-selected=\"true\"","stepMatchArguments":[{"group":{"start":4,"value":"\"Description\"","children":[{"start":5,"value":"Description","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"true\"","children":[{"start":45,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And the \"Description\" tab has keyboard focus","stepMatchArguments":[{"group":{"start":4,"value":"\"Description\"","children":[{"start":5,"value":"Description","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I press End","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then the \"Shipping\" tab reports aria-selected=\"true\"","stepMatchArguments":[{"group":{"start":4,"value":"\"Shipping\"","children":[{"start":5,"value":"Shipping","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":41,"value":"\"true\"","children":[{"start":42,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":32,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And the \"Shipping\" tab has keyboard focus","stepMatchArguments":[{"group":{"start":4,"value":"\"Shipping\"","children":[{"start":5,"value":"Shipping","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end