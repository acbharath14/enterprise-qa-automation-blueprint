// Generated from: features/iframe.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Payment Iframe', () => {

  test('Fill the cardholder field inside the payment iframe', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on checkout step 2 with shipping details entered', null, { page }); 
    await When('I type "Test Buyer" into the cardholder field in the payment frame', null, { page }); 
    await Then('the cardholder field shows "Test Buyer"', null, { page }); 
    await And('the frame note is visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/iframe.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on checkout step 2 with shipping details entered","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I type \"Test Buyer\" into the cardholder field in the payment frame","stepMatchArguments":[{"group":{"start":7,"value":"\"Test Buyer\"","children":[{"start":8,"value":"Test Buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the cardholder field shows \"Test Buyer\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Test Buyer\"","children":[{"start":28,"value":"Test Buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the frame note is visible","stepMatchArguments":[]}]},
]; // bdd-data-end