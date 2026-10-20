// Generated from: features/forms.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Checkout Form Validation', () => {

  test.beforeEach('Background', async ({ Given, bdd, page, request }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the checkout page with a product in my cart', null, { bdd, page, request }); 
  });
  
  test('Shows inline errors for empty submit', async ({ When, Then, And, page }) => { 
    await When('I submit the shipping form with all fields empty', null, { page }); 
    await Then('an inline error "Full name is required." is shown for the name field', null, { page }); 
    await And('an inline error "Enter a valid email address." is shown for the email field', null, { page }); 
    await And('an inline error "Shipping address is required." is shown for the address field', null, { page }); 
    await And('the error summary is visible', null, { page }); 
  });

  test('Rejects an invalid email', async ({ When, Then, And, page }) => { 
    await When('I enter shipping details with email "not-an-email"', null, { page }); 
    await And('I continue to the next step', null, { page }); 
    await Then('an inline error "Enter a valid email address." is shown for the email field', null, { page }); 
    await And('the wizard stays on step 1', null, { page }); 
  });

  test('Places the order with the right payload', async ({ When, Then, And, bdd, page }) => { 
    await When('I enter valid shipping details', null, { page }); 
    await And('I continue to the payment step', null, { page }); 
    await And('I enter valid payment details', null, { bdd, page }); 
    await And('I continue to the review step', null, { page }); 
    await And('I place the order', null, { bdd, page }); 
    await Then('the order request payload contains name "Payload Buyer"', null, { bdd }); 
    await And('the order request payload contains email "payload@example.com"', null, { bdd }); 
    await And('the order request payload contains address "1 Payload Lane"', null, { bdd }); 
    await And('the order request payload contains shipping method "standard"', null, { bdd }); 
    await And('the order request payload contains the card\'s last 4 digits', null, { bdd }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/forms.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout page with a product in my cart","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I submit the shipping form with all fields empty","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then an inline error \"Full name is required.\" is shown for the name field","stepMatchArguments":[{"group":{"start":17,"value":"Full name is required."}},{"group":{"start":58,"value":"name"}}]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And an inline error \"Enter a valid email address.\" is shown for the email field","stepMatchArguments":[{"group":{"start":17,"value":"Enter a valid email address."}},{"group":{"start":64,"value":"email"}}]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And an inline error \"Shipping address is required.\" is shown for the address field","stepMatchArguments":[{"group":{"start":17,"value":"Shipping address is required."}},{"group":{"start":65,"value":"address"}}]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the error summary is visible","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout page with a product in my cart","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I enter shipping details with email \"not-an-email\"","stepMatchArguments":[{"group":{"start":36,"value":"\"not-an-email\"","children":[{"start":37,"value":"not-an-email","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I continue to the next step","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then an inline error \"Enter a valid email address.\" is shown for the email field","stepMatchArguments":[{"group":{"start":17,"value":"Enter a valid email address."}},{"group":{"start":64,"value":"email"}}]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And the wizard stays on step 1","stepMatchArguments":[]}]},
  {"pwTestLine":25,"pickleLine":22,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout page with a product in my cart","isBg":true,"stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I enter valid shipping details","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"And I continue to the payment step","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"And I enter valid payment details","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"And I continue to the review step","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"And I place the order","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then the order request payload contains name \"Payload Buyer\"","stepMatchArguments":[{"group":{"start":35,"value":"name"}},{"group":{"start":41,"value":"Payload Buyer"}}]},{"pwStepLine":32,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And the order request payload contains email \"payload@example.com\"","stepMatchArguments":[{"group":{"start":35,"value":"email"}},{"group":{"start":42,"value":"payload@example.com"}}]},{"pwStepLine":33,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"And the order request payload contains address \"1 Payload Lane\"","stepMatchArguments":[{"group":{"start":35,"value":"address"}},{"group":{"start":44,"value":"1 Payload Lane"}}]},{"pwStepLine":34,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"And the order request payload contains shipping method \"standard\"","stepMatchArguments":[{"group":{"start":35,"value":"shipping method"}},{"group":{"start":52,"value":"standard"}}]},{"pwStepLine":35,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And the order request payload contains the card's last 4 digits","stepMatchArguments":[]}]},
]; // bdd-data-end