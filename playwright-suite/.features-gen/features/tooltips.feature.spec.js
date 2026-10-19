// Generated from: features/tooltips.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Product Info Tooltips', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the DemoMart catalog page', null, { bdd, page }); 
  });
  
  test('Hover reveals the tooltip with the product description', async ({ When, Then, And, page }) => { 
    await When('I hover the info button for "Aurora Wireless Headphones"', null, { page }); 
    await Then('the tooltip is visible', null, { page }); 
    await And('the tooltip contains "Over-ear Bluetooth headphones"', null, { page }); 
  });

  test('ESC dismisses the tooltip', async ({ Given, When, Then, page }) => { 
    await Given('the tooltip for "Aurora Wireless Headphones" is visible', null, { page }); 
    await When('I press Escape', null, { page }); 
    await Then('the tooltip is hidden', null, { page }); 
  });

  test('Keyboard focus reveals the tooltip', async ({ When, Then, page }) => { 
    await When('I focus the info button for "Aurora Wireless Headphones"', null, { page }); 
    await Then('the tooltip is visible', null, { page }); 
  });

  test('Tooltip is associated with the button via aria-describedby', async ({ Then, And, page }) => { 
    await Then('the info button references the tooltip id in aria-describedby', null, { page }); 
    await And('the tooltip carries that id', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/tooltips.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I hover the info button for \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":28,"value":"\"Aurora Wireless Headphones\"","children":[{"start":29,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the tooltip is visible","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the tooltip contains \"Over-ear Bluetooth headphones\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Over-ear Bluetooth headphones\"","children":[{"start":22,"value":"Over-ear Bluetooth headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":16,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given the tooltip for \"Aurora Wireless Headphones\" is visible","stepMatchArguments":[{"group":{"start":16,"value":"\"Aurora Wireless Headphones\"","children":[{"start":17,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I press Escape","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the tooltip is hidden","stepMatchArguments":[]}]},
  {"pwTestLine":22,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I focus the info button for \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":28,"value":"\"Aurora Wireless Headphones\"","children":[{"start":29,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then the tooltip is visible","stepMatchArguments":[]}]},
  {"pwTestLine":27,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then the info button references the tooltip id in aria-describedby","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And the tooltip carries that id","stepMatchArguments":[]}]},
]; // bdd-data-end