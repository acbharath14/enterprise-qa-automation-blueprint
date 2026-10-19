// Generated from: features/store-smoke.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Store Smoke Tests', () => {

  test('Catalog renders the seeded products', { tag: ['@smoke'] }, async ({ Given, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await Then('the product grid is visible', null, { page }); 
    await And('the card for "Aurora Wireless Headphones" (prod-1) is visible', null, { page }); 
    await And('6 product cards are shown on page 1', null, { page }); 
  });

  test('Adding a product updates the cart badge', { tag: ['@smoke'] }, async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('a product exists in the catalog', null, { bdd, request }); 
    await And('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I search for the product', null, { bdd, page }); 
    await And('I add it to the cart', null, { bdd, page }); 
    await Then('the cart badge count increases by 1', null, { bdd, page }); 
    await And('a confirmation toast shows the product name', null, { bdd, page }); 
  });

  test('Cart page shows the line item and correct total', { tag: ['@smoke'] }, async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('a product priced at $42.50 exists in the catalog', null, { bdd, request }); 
    await And('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I search for the product', null, { bdd, page }); 
    await And('I add it to the cart', null, { bdd, page }); 
    await And('I open the cart', null, { page }); 
    await Then('the cart shows the product line item', null, { bdd, page }); 
    await And('the line total is "$42.50"', null, { bdd, page }); 
    await And('the cart subtotal equals the sum of the line totals', null, { page }); 
  });

  test('Checkout wizard completes and shows an order id', { tag: ['@smoke'] }, async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('a product exists in the catalog', null, { bdd, request }); 
    await And('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I search for the product', null, { bdd, page }); 
    await And('I add it to the cart', null, { bdd, page }); 
    await And('I open the cart', null, { page }); 
    await And('I start checkout', null, { page }); 
    await And('I enter valid shipping details', null, { page }); 
    await And('I enter valid payment details', null, { bdd, page }); 
    await And('I place the order', null, { bdd, page }); 
    await Then('the order confirmation is shown', null, { page }); 
    await And('the displayed order id matches the pattern "ord-<number>"', null, { page }); 
    await And('the confirmation lists the product', null, { bdd, page }); 
    await And('the displayed order total equals the sum of the line totals', null, { bdd, page, request }); 
  });

  test('Demo login works', { tag: ['@smoke'] }, async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I log in with username "admin" and password "secret"', null, { page }); 
    await Then('the logout button is visible', null, { page }); 
    await And('the user label shows "admin"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/store-smoke.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":["@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then the product grid is visible","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And the card for \"Aurora Wireless Headphones\" (prod-1) is visible","stepMatchArguments":[{"group":{"start":14,"value":"Aurora Wireless Headphones"}},{"group":{"start":43,"value":"prod-1"}}]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 6 product cards are shown on page 1","stepMatchArguments":[{"group":{"start":0,"value":"6"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":13,"pickleLine":14,"tags":["@smoke"],"steps":[{"pwStepLine":14,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given a product exists in the catalog","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"And I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I search for the product","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I add it to the cart","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the cart badge count increases by 1","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And a confirmation toast shows the product name","stepMatchArguments":[]}]},
  {"pwTestLine":22,"pickleLine":23,"tags":["@smoke"],"steps":[{"pwStepLine":23,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given a product priced at $42.50 exists in the catalog","stepMatchArguments":[{"group":{"start":21,"value":"42.50"}}]},{"pwStepLine":24,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"And I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I search for the product","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"And I add it to the cart","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"And I open the cart","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the cart shows the product line item","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"And the line total is \"$42.50\"","stepMatchArguments":[{"group":{"start":18,"value":"\"$42.50\"","children":[{"start":19,"value":"$42.50","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"And the cart subtotal equals the sum of the line totals","stepMatchArguments":[]}]},
  {"pwTestLine":33,"pickleLine":34,"tags":["@smoke"],"steps":[{"pwStepLine":34,"gherkinStepLine":35,"keywordType":"Context","textWithKeyword":"Given a product exists in the catalog","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":36,"keywordType":"Context","textWithKeyword":"And I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"When I search for the product","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"And I add it to the cart","stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":39,"keywordType":"Action","textWithKeyword":"And I open the cart","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"And I start checkout","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"And I enter valid shipping details","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"And I enter valid payment details","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"And I place the order","stepMatchArguments":[]},{"pwStepLine":43,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Then the order confirmation is shown","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"And the displayed order id matches the pattern \"ord-<number>\"","stepMatchArguments":[{"group":{"start":43,"value":"\"ord-<number>\"","children":[{"start":44,"value":"ord-<number>","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"And the confirmation lists the product","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":47,"keywordType":"Outcome","textWithKeyword":"And the displayed order total equals the sum of the line totals","stepMatchArguments":[]}]},
  {"pwTestLine":49,"pickleLine":50,"tags":["@smoke"],"steps":[{"pwStepLine":50,"gherkinStepLine":51,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"When I log in with username \"admin\" and password \"secret\"","stepMatchArguments":[{"group":{"start":23,"value":"\"admin\"","children":[{"start":24,"value":"admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"secret\"","children":[{"start":45,"value":"secret","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":52,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Then the logout button is visible","stepMatchArguments":[]},{"pwStepLine":53,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"And the user label shows \"admin\"","stepMatchArguments":[{"group":{"start":21,"value":"\"admin\"","children":[{"start":22,"value":"admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end