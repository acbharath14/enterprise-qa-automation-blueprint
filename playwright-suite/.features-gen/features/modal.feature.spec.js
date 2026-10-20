// Generated from: features/modal.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Quick-View Modal', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the DemoMart catalog page', null, { bdd, page }); 
  });
  
  test('Modal opens with dialog semantics and initial focus', async ({ When, Then, And, page }) => { 
    await When('I open the quick view for "Aurora Wireless Headphones"', null, { page }); 
    await Then('the modal has role "dialog" and aria-modal="true"', null, { page }); 
    await And('the close button has keyboard focus', null, { page }); 
  });

  test('Tab focus is trapped within the modal', async ({ Given, When, Then, page }) => { 
    await Given('the quick-view modal is open', null, { page }); 
    await When('I press Tab on the last focusable button', null, { page }); 
    await Then('focus wraps to the first focusable button', null, { page }); 
    await When('I press Shift+Tab on the first button', null, { page }); 
    await Then('focus wraps back to the last button', null, { page }); 
  });

  test('ESC closes the modal and returns focus to the trigger', async ({ When, Then, And, page }) => { 
    await When('I open the quick view for "Aurora Wireless Headphones"', null, { page }); 
    await And('I press Escape', null, { page }); 
    await Then('the modal is hidden', null, { page }); 
    await And('the quick-view trigger has keyboard focus', null, { page }); 
  });

  test('Backdrop click closes the modal', async ({ Given, When, Then, page }) => { 
    await Given('the quick-view modal is open', null, { page }); 
    await When('I click the modal backdrop', null, { page }); 
    await Then('the modal is hidden', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/modal.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I open the quick view for \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Aurora Wireless Headphones\"","children":[{"start":27,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the modal has role \"dialog\" and aria-modal=\"true\"","stepMatchArguments":[{"group":{"start":19,"value":"\"dialog\"","children":[{"start":20,"value":"dialog","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"true\"","children":[{"start":44,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the close button has keyboard focus","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given the quick-view modal is open","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I press Tab on the last focusable button","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then focus wraps to the first focusable button","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I press Shift+Tab on the first button","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then focus wraps back to the last button","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":21,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I open the quick view for \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Aurora Wireless Headphones\"","children":[{"start":27,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":26,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"And I press Escape","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then the modal is hidden","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And the quick-view trigger has keyboard focus","stepMatchArguments":[]}]},
  {"pwTestLine":31,"pickleLine":27,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":28,"keywordType":"Context","textWithKeyword":"Given the quick-view modal is open","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"When I click the modal backdrop","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Then the modal is hidden","stepMatchArguments":[]}]},
]; // bdd-data-end