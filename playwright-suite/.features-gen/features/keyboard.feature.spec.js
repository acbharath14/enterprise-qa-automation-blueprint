// Generated from: features/keyboard.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Keyboard Navigation', () => {

  test('Tab order follows the header nav then the catalog toolbar', async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I press Tab repeatedly', null, { page }); 
    await Then('focus moves through the header controls in order:', {"dataTable":{"rows":[{"cells":[{"value":"store-logo"}]},{"cells":[{"value":"nav-cart"}]},{"cells":[{"value":"theme-toggle"}]},{"cells":[{"value":"login-button"}]},{"cells":[{"value":"search-input"}]},{"cells":[{"value":"category-filter"}]},{"cells":[{"value":"sort-select"}]},{"cells":[{"value":"price-max-slider"}]}]}}, { page }); 
  });

  test('Enter on the cart button opens the cart view', async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I focus the cart button and press Enter', null, { page }); 
    await Then('the "Your Cart" heading is visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/keyboard.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I press Tab repeatedly","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then focus moves through the header controls in order:","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":20,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I focus the cart button and press Enter","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then the \"Your Cart\" heading is visible","stepMatchArguments":[{"group":{"start":4,"value":"\"Your Cart\"","children":[{"start":5,"value":"Your Cart","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end