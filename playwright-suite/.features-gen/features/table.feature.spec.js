// Generated from: features/table.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Catalog Sort', () => {

  test.beforeEach('Background', async ({ Given, bdd, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the DemoMart catalog page', null, { bdd, page }); 
  });
  
  test('Price ascending sorts card prices low to high', async ({ When, Then, page }) => { 
    await When('I sort the catalog by "price_asc"', null, { page }); 
    await Then('the visible card prices are in ascending order', null, { page }); 
  });

  test('Price descending sorts card prices high to low', async ({ When, Then, page }) => { 
    await When('I sort the catalog by "price_desc"', null, { page }); 
    await Then('the visible card prices are in descending order', null, { page }); 
  });

  test('Name sorts cards alphabetically', async ({ When, Then, page }) => { 
    await When('I sort the catalog by "name"', null, { page }); 
    await Then('the visible product names are in alphabetical order', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/table.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I sort the catalog by \"price_asc\"","stepMatchArguments":[{"group":{"start":22,"value":"\"price_asc\"","children":[{"start":23,"value":"price_asc","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the visible card prices are in ascending order","stepMatchArguments":[]}]},
  {"pwTestLine":15,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I sort the catalog by \"price_desc\"","stepMatchArguments":[{"group":{"start":22,"value":"\"price_desc\"","children":[{"start":23,"value":"price_desc","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the visible card prices are in descending order","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I sort the catalog by \"name\"","stepMatchArguments":[{"group":{"start":22,"value":"\"name\"","children":[{"start":23,"value":"name","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the visible product names are in alphabetical order","stepMatchArguments":[]}]},
]; // bdd-data-end