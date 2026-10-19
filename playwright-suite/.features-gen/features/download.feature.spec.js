// Generated from: features/download.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Order Receipt Download', () => {

  test('Downloads the order receipt as CSV', async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('my cart contains the "Aurora Wireless Headphones"', null, { bdd, request }); 
    await And('I have completed checkout with valid details', null, { bdd, page, request }); 
    await When('I click the download receipt button', null, { bdd, page }); 
    await Then('a file named like "receipt-ord-<n>.csv" is downloaded', null, { bdd }); 
    await And('the CSV contains the header "product,quantity,unit_price,line_total"', null, { bdd }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/download.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given my cart contains the \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Aurora Wireless Headphones\"","children":[{"start":22,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I have completed checkout with valid details","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I click the download receipt button","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then a file named like \"receipt-ord-<n>.csv\" is downloaded","stepMatchArguments":[{"group":{"start":18,"value":"\"receipt-ord-<n>.csv\"","children":[{"start":19,"value":"receipt-ord-<n>.csv","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And the CSV contains the header \"product,quantity,unit_price,line_total\"","stepMatchArguments":[{"group":{"start":28,"value":"\"product,quantity,unit_price,line_total\"","children":[{"start":29,"value":"product,quantity,unit_price,line_total","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end