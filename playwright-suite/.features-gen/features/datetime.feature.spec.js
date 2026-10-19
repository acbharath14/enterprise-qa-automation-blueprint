// Generated from: features/datetime.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Order Timestamp Localization', () => {

  test('Order timestamp renders in the emulated timezone', { tag: ['@tz'] }, async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('the browser emulates Pacific/Auckland (en-NZ)'); 
    await And('I have completed a checkout with name "Tz Buyer"', null, { page }); 
    await When('I place the order', null, { bdd, page }); 
    await Then('the order confirmation shows a timestamp', null, { page }); 
    await And('the timestamp contains the current year', null, { page }); 
    await And('the date portion matches the New Zealand locale rendering', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/datetime.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":["@tz"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the browser emulates Pacific/Auckland (en-NZ)","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I have completed a checkout with name \"Tz Buyer\"","stepMatchArguments":[{"group":{"start":38,"value":"\"Tz Buyer\"","children":[{"start":39,"value":"Tz Buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I place the order","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the order confirmation shows a timestamp","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the timestamp contains the current year","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the date portion matches the New Zealand locale rendering","stepMatchArguments":[]}]},
]; // bdd-data-end