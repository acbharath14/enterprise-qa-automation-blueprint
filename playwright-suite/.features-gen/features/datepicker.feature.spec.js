// Generated from: features/datepicker.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Delivery Date Picker', () => {

  test('Delivery date carries to the review step', async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('I have a product in my cart', null, { bdd, request }); 
    await And('I am on the checkout shipping step', null, { bdd, page, request }); 
    await When('I fill shipping details with delivery date "2026-10-25"', null, { page }); 
    await Then('the delivery date input holds "2026-10-25"', null, { page }); 
    await When('I continue to payment and fill valid card details', null, { page }); 
    await And('I continue to the review step', null, { page }); 
    await Then('the order summary shows "2026-10-25"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/datepicker.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I have a product in my cart","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I am on the checkout shipping step","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I fill shipping details with delivery date \"2026-10-25\"","stepMatchArguments":[{"group":{"start":43,"value":"\"2026-10-25\"","children":[{"start":44,"value":"2026-10-25","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then the delivery date input holds \"2026-10-25\"","stepMatchArguments":[{"group":{"start":30,"value":"\"2026-10-25\"","children":[{"start":31,"value":"2026-10-25","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I continue to payment and fill valid card details","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And I continue to the review step","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the order summary shows \"2026-10-25\"","stepMatchArguments":[{"group":{"start":24,"value":"\"2026-10-25\"","children":[{"start":25,"value":"2026-10-25","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end