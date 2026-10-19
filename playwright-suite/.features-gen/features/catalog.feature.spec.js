// Generated from: features/catalog.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Product Catalog', () => {

  test('Renders the 12 seeded products, 6 per page', { tag: ['@smoke'] }, async ({ Given, When, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart catalog', null, { bdd, page }); 
    await When('I page through the whole catalog', null, { bdd, page }); 
    await Then('all 12 seeded products (prod-1 through prod-12) are shown', null, { bdd }); 
    await And('each full page shows exactly 6 product cards', null, { bdd }); 
  });

  test('Cards show name, price, category and rating', async ({ Given, Then, And, bdd, page }) => { 
    await Given('I am on the DemoMart catalog', null, { bdd, page }); 
    await Then('the prod-1 card shows name "Aurora Wireless Headphones"', null, { page }); 
    await And('the prod-1 card shows price "$129.99"', null, { page }); 
    await And('the prod-1 card shows category "electronics"', null, { page }); 
    await And('the prod-1 card shows rating "4.5"', null, { page }); 
  });

  test('All four seeded categories appear across the pages', async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am on the DemoMart catalog', null, { bdd, page }); 
    await When('I page through the whole catalog', null, { bdd, page }); 
    await Then('the categories "electronics", "apparel", "home" and "sports" all appear', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/catalog.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":["@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I page through the whole catalog","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then all 12 seeded products (prod-1 through prod-12) are shown","stepMatchArguments":[{"group":{"start":4,"value":"12"},"parameterTypeName":"int"},{"group":{"start":24,"value":"prod-1"}},{"group":{"start":39,"value":"prod-12"}}]},{"pwStepLine":10,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And each full page shows exactly 6 product cards","stepMatchArguments":[]}]},
  {"pwTestLine":13,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the prod-1 card shows name \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":4,"value":"prod-1"}},{"group":{"start":22,"value":"name"}},{"group":{"start":28,"value":"Aurora Wireless Headphones"}}]},{"pwStepLine":16,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the prod-1 card shows price \"$129.99\"","stepMatchArguments":[{"group":{"start":4,"value":"prod-1"}},{"group":{"start":22,"value":"price"}},{"group":{"start":29,"value":"$129.99"}}]},{"pwStepLine":17,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the prod-1 card shows category \"electronics\"","stepMatchArguments":[{"group":{"start":4,"value":"prod-1"}},{"group":{"start":22,"value":"category"}},{"group":{"start":32,"value":"electronics"}}]},{"pwStepLine":18,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the prod-1 card shows rating \"4.5\"","stepMatchArguments":[{"group":{"start":4,"value":"prod-1"}},{"group":{"start":22,"value":"rating"}},{"group":{"start":30,"value":"4.5"}}]}]},
  {"pwTestLine":21,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I page through the whole catalog","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the categories \"electronics\", \"apparel\", \"home\" and \"sports\" all appear","stepMatchArguments":[{"group":{"start":16,"value":"electronics"}},{"group":{"start":31,"value":"apparel"}},{"group":{"start":42,"value":"home"}},{"group":{"start":53,"value":"sports"}}]}]},
]; // bdd-data-end