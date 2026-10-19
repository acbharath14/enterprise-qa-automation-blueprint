// Generated from: features/popup.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Order Receipt Popup', () => {

  test('View receipt opens the receipt in a new tab', async ({ Given, When, Then, And, bdd, page, request }) => { 
    await Given('I have placed an order for "Aurora Wireless Headphones"', null, { bdd, page, request }); 
    await When('I click "View receipt"', null, { page }); 
    await Then('a new tab opens at the receipt URL', null, { page }); 
    await And('the receipt tab shows CSV content with a "product,quantity" header', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/popup.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I have placed an order for \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aurora Wireless Headphones\"","children":[{"start":28,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I click \"View receipt\"","stepMatchArguments":[{"group":{"start":8,"value":"\"View receipt\"","children":[{"start":9,"value":"View receipt","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then a new tab opens at the receipt URL","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the receipt tab shows CSV content with a \"product,quantity\" header","stepMatchArguments":[{"group":{"start":41,"value":"\"product,quantity\"","children":[{"start":42,"value":"product,quantity","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end