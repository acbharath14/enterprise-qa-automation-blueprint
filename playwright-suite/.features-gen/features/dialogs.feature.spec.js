// Generated from: features/dialogs.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Cart Remove Confirmation Dialog', () => {

  test.beforeEach('Background', async ({ Given, bdd, page, request }, testInfo) => { if (testInfo.error) return;
    await Given('my cart contains one line item', null, { bdd, page, request }); 
  });
  
  test('Dismissing the dialog keeps the cart line', async ({ When, Then, And, bdd, page }) => { 
    await When('I click remove on the cart line', null, { bdd, page }); 
    await And('I dismiss the confirmation dialog', null, { bdd }); 
    await Then('the cart line is still visible', null, { bdd, page }); 
  });

  test('Accepting the dialog removes the cart line', async ({ When, Then, And, bdd, page }) => { 
    await When('I click remove on the cart line', null, { bdd, page }); 
    await And('I accept the confirmation dialog', null, { bdd, page }); 
    await Then('the cart line is gone', null, { bdd, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/dialogs.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given my cart contains one line item","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I click remove on the cart line","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I dismiss the confirmation dialog","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the cart line is still visible","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given my cart contains one line item","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I click remove on the cart line","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"And I accept the confirmation dialog","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the cart line is gone","stepMatchArguments":[]}]},
]; // bdd-data-end