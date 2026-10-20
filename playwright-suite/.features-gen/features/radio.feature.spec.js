// Generated from: features/radio.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Shipping Method Radio Group', () => {

  test.beforeEach('Background', async ({ Given, bdd, page, request }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the checkout shipping step', null, { bdd, page, request }); 
  });
  
  test('Group has a legend describing the choice', async ({ Then, page }) => { 
    await Then('the shipping method group has a legend reading "Shipping method"', null, { page }); 
  });

  test('Standard is selected by default', async ({ Then, And, page }) => { 
    await Then('the "Standard" option is checked', null, { page }); 
    await And('the "Express" option is not checked', null, { page }); 
  });

  test('Selecting Express unchecks Standard', async ({ When, Then, And, page }) => { 
    await When('I select the "Express" shipping method', null, { page }); 
    await Then('the "Express" option is checked', null, { page }); 
    await And('the "Standard" option is not checked', null, { page }); 
  });

  test('Arrow keys move selection between radios', async ({ When, Then, And, page }) => { 
    await When('I focus the "Standard" option', null, { page }); 
    await And('I press ArrowDown', null, { page }); 
    await Then('the "Express" option is checked', null, { page }); 
    await And('the "Standard" option is not checked', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/radio.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout shipping step","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the shipping method group has a legend reading \"Shipping method\"","stepMatchArguments":[{"group":{"start":47,"value":"\"Shipping method\"","children":[{"start":48,"value":"Shipping method","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":14,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout shipping step","isBg":true,"stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the \"Standard\" option is checked","stepMatchArguments":[{"group":{"start":4,"value":"\"Standard\"","children":[{"start":5,"value":"Standard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the \"Express\" option is not checked","stepMatchArguments":[{"group":{"start":4,"value":"\"Express\"","children":[{"start":5,"value":"Express","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":19,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout shipping step","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I select the \"Express\" shipping method","stepMatchArguments":[{"group":{"start":13,"value":"\"Express\"","children":[{"start":14,"value":"Express","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the \"Express\" option is checked","stepMatchArguments":[{"group":{"start":4,"value":"\"Express\"","children":[{"start":5,"value":"Express","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And the \"Standard\" option is not checked","stepMatchArguments":[{"group":{"start":4,"value":"\"Standard\"","children":[{"start":5,"value":"Standard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":25,"pickleLine":21,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout shipping step","isBg":true,"stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I focus the \"Standard\" option","stepMatchArguments":[{"group":{"start":12,"value":"\"Standard\"","children":[{"start":13,"value":"Standard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"And I press ArrowDown","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then the \"Express\" option is checked","stepMatchArguments":[{"group":{"start":4,"value":"\"Express\"","children":[{"start":5,"value":"Express","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And the \"Standard\" option is not checked","stepMatchArguments":[{"group":{"start":4,"value":"\"Standard\"","children":[{"start":5,"value":"Standard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end