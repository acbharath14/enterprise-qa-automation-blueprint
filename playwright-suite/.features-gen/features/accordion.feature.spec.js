// Generated from: features/accordion.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Product Detail Accordion', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on a product detail page', null, { bdd, page }); 
  });
  
  test('Clicking a trigger expands its panel', async ({ When, Then, And, page }) => { 
    await When('I click the "Shipping" accordion trigger', null, { page }); 
    await Then('the shipping panel is visible', null, { page }); 
    await And('the trigger reports aria-expanded="true"', null, { page }); 
  });

  test('Only one section is open at a time', async ({ When, Then, And, page }) => { 
    await When('I expand the "Shipping" section', null, { page }); 
    await And('I expand the "Returns" section', null, { page }); 
    await Then('the returns panel is visible', null, { page }); 
    await And('the shipping panel is hidden', null, { page }); 
  });

  test('Keyboard Enter toggles a section', async ({ When, Then, And, page }) => { 
    await When('I focus the "Returns" accordion trigger', null, { page }); 
    await And('I press Enter', null, { page }); 
    await Then('the returns panel is visible', null, { page }); 
    await When('I press Enter again', null, { page }); 
    await Then('the returns panel is hidden', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/accordion.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on a product detail page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I click the \"Shipping\" accordion trigger","stepMatchArguments":[{"group":{"start":12,"value":"\"Shipping\"","children":[{"start":13,"value":"Shipping","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the shipping panel is visible","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the trigger reports aria-expanded=\"true\"","stepMatchArguments":[{"group":{"start":34,"value":"\"true\"","children":[{"start":35,"value":"true","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":16,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on a product detail page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I expand the \"Shipping\" section","stepMatchArguments":[{"group":{"start":13,"value":"\"Shipping\"","children":[{"start":14,"value":"Shipping","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"And I expand the \"Returns\" section","stepMatchArguments":[{"group":{"start":13,"value":"\"Returns\"","children":[{"start":14,"value":"Returns","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the returns panel is visible","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And the shipping panel is hidden","stepMatchArguments":[]}]},
  {"pwTestLine":23,"pickleLine":20,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on a product detail page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I focus the \"Returns\" accordion trigger","stepMatchArguments":[{"group":{"start":12,"value":"\"Returns\"","children":[{"start":13,"value":"Returns","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"And I press Enter","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then the returns panel is visible","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I press Enter again","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the returns panel is hidden","stepMatchArguments":[]}]},
]; // bdd-data-end