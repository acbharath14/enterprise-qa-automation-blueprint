// Generated from: features/failure-showcase.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Intentional Failure Showcase', () => {

  test('Product price reads $9999.99 (intentionally wrong)', { tag: ['@showcase'] }, async ({ Given, Then, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await Then('the price of prod-1 reads "$9999.99"', null, { page }); 
  });

  test('Products API exposes a discount field (intentionally wrong)', { tag: ['@showcase'] }, async ({ When, Then, bdd, request }) => { 
    await When('I send a GET request to "/api/products"', null, { bdd, request }); 
    await Then('the first product has a "discount" of 10', null, { request }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/failure-showcase.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":8,"tags":["@showcase"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the price of prod-1 reads \"$9999.99\"","stepMatchArguments":[{"group":{"start":26,"value":"\"$9999.99\"","children":[{"start":27,"value":"$9999.99","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":11,"pickleLine":15,"tags":["@showcase"],"steps":[{"pwStepLine":12,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/products\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/products\"","children":[{"start":25,"value":"/api/products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the first product has a \"discount\" of 10","stepMatchArguments":[{"group":{"start":24,"value":"\"discount\"","children":[{"start":25,"value":"discount","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":38,"value":"10"},"parameterTypeName":"int"}]}]},
]; // bdd-data-end