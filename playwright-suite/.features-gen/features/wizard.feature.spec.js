// Generated from: features/wizard.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Checkout Wizard', () => {

  test('Step 1 is marked current and empty submit stays on step 1', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the checkout wizard', null, { page }); 
    await Then('step 1 is marked as the current step', null, { page }); 
    await When('I continue without entering shipping details', null, { page }); 
    await Then('step 1 is still visible', null, { page }); 
    await And('step 2 is hidden', null, { page }); 
  });

  test('Completes the full flow', async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('I have a product in my cart', null, { bdd, request }); 
    await And('I am on the checkout wizard', null, { page }); 
    await When('I enter shipping details for "Wizard Buyer"', null, { page }); 
    await And('I continue to step 2', null, { page }); 
    await And('I enter payment details', null, { page }); 
    await And('I continue to step 3', null, { page }); 
    await Then('the review shows my product', null, { page }); 
    await When('I place the order', null, { bdd, page }); 
    await Then('the order confirmation is visible', null, { page }); 
  });

  test('Back returns to step 1 with values preserved', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the checkout wizard', null, { page }); 
    await When('I enter shipping details:', {"dataTable":{"rows":[{"cells":[{"value":"name"},{"value":"Back Buyer"}]},{"cells":[{"value":"email"},{"value":"back@example.com"}]},{"cells":[{"value":"address"},{"value":"2 Back Road"}]}]}}, { page }); 
    await And('I continue to step 2', null, { page }); 
    await And('I go back to step 1', null, { page }); 
    await Then('step 1 is visible', null, { page }); 
    await And('the name field still shows "Back Buyer"', null, { page }); 
    await And('the email field still shows "back@example.com"', null, { page }); 
    await And('the address field still shows "2 Back Road"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/wizard.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the checkout wizard","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then step 1 is marked as the current step","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I continue without entering shipping details","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then step 1 is still visible","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And step 2 is hidden","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given I have a product in my cart","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"And I am on the checkout wizard","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I enter shipping details for \"Wizard Buyer\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Wizard Buyer\"","children":[{"start":30,"value":"Wizard Buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"And I continue to step 2","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"And I enter payment details","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I continue to step 3","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the review shows my product","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I place the order","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then the order confirmation is visible","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given I am on the checkout wizard","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I enter shipping details:","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"And I continue to step 2","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"And I go back to step 1","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then step 1 is visible","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And the name field still shows \"Back Buyer\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Back Buyer\"","children":[{"start":28,"value":"Back Buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":33,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And the email field still shows \"back@example.com\"","stepMatchArguments":[{"group":{"start":28,"value":"\"back@example.com\"","children":[{"start":29,"value":"back@example.com","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"And the address field still shows \"2 Back Road\"","stepMatchArguments":[{"group":{"start":30,"value":"\"2 Back Road\"","children":[{"start":31,"value":"2 Back Road","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end