// Generated from: features/mobile.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Mobile Experience', () => {

  test('Viewport meta tag enables proper mobile scaling', { tag: ['@mobile'] }, async ({ Given, Then, And, page }) => { 
    await Given('I am on the DemoMart homepage on a mobile device', null, { page }); 
    await Then('a viewport meta tag exists', null, { page }); 
    await And('its content includes "width=device-width"', null, { page }); 
  });

  test('Catalog fits a 375px viewport with no horizontal overflow', { tag: ['@mobile'] }, async ({ Given, Then, And, page }) => { 
    await Given('I am on the DemoMart homepage on a 375px-wide viewport', null, { page }); 
    await Then('there is no horizontal overflow', null, { page }); 
    await And('the catalog heading is visible', null, { page }); 
    await And('the product card for "prod-1" is visible', null, { page }); 
  });

  test('Touch tap on add-to-cart shows the toast', { tag: ['@mobile'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the DemoMart homepage on a touch-enabled device', null, { page }); 
    await When('I tap the add-to-cart button for "Aurora Wireless Headphones"', null, { page }); 
    await Then('a toast is visible', null, { page }); 
    await And('the toast contains "Aurora Wireless Headphones"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/mobile.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":["@mobile"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage on a mobile device","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then a viewport meta tag exists","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And its content includes \"width=device-width\"","stepMatchArguments":[{"group":{"start":21,"value":"\"width=device-width\"","children":[{"start":22,"value":"width=device-width","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":12,"pickleLine":13,"tags":["@mobile"],"steps":[{"pwStepLine":13,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage on a 375px-wide viewport","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then there is no horizontal overflow","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the catalog heading is visible","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the product card for \"prod-1\" is visible","stepMatchArguments":[{"group":{"start":21,"value":"\"prod-1\"","children":[{"start":22,"value":"prod-1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":19,"pickleLine":20,"tags":["@mobile"],"steps":[{"pwStepLine":20,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage on a touch-enabled device","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I tap the add-to-cart button for \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Aurora Wireless Headphones\"","children":[{"start":34,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then a toast is visible","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"And the toast contains \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Aurora Wireless Headphones\"","children":[{"start":20,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end