// Generated from: features/factory.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Test Data Factory Contract', () => {

  test('Factory is deterministic for a fixed seed', async ({ When, Then, And, bdd }) => { 
    await When('I generate products twice with seed 42', null, { bdd }); 
    await Then('both runs produce identical product lists', null, { bdd }); 
    await And('the random number generator replays identically for a fixed seed', null, { bdd }); 
  });

  test('Different seeds produce different data', async ({ When, Then, bdd }) => { 
    await When('I generate products with seed 42 and with seed 7', null, { bdd }); 
    await Then('the two product lists differ', null, { bdd }); 
  });

  test('Generated products honor the store data contract', async ({ When, Then, And, bdd }) => { 
    await When('I generate 100 products', null, { bdd }); 
    await Then('every product has a name', null, { bdd }); 
    await And('every category is one of electronics, apparel, home, sports', null, { bdd }); 
    await And('every price is positive', null, { bdd }); 
    await And('every rating is between 0 and 5', null, { bdd }); 
    await And('every stock count is a non-negative integer', null, { bdd }); 
  });

  test('Generated orders balance', async ({ When, Then, And, bdd }) => { 
    await When('I generate orders', null, { bdd }); 
    await Then('each order total equals the sum of its line items', null, { bdd }); 
    await And('each order status is "confirmed"', null, { bdd }); 
  });

  test('Generated customers are submittable', async ({ When, Then, And, bdd }) => { 
    await When('I generate a customer', null, { bdd }); 
    await Then('the customer has a name', null, { bdd }); 
    await And('the email contains "@"', null, { bdd }); 
    await And('the customer has an address', null, { bdd }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/factory.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I generate products twice with seed 42","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then both runs produce identical product lists","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And the random number generator replays identically for a fixed seed","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I generate products with seed 42 and with seed 7","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the two product lists differ","stepMatchArguments":[]}]},
  {"pwTestLine":17,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":18,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I generate 100 products","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then every product has a name","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And every category is one of electronics, apparel, home, sports","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And every price is positive","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And every rating is between 0 and 5","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"And every stock count is a non-negative integer","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":24,"tags":[],"steps":[{"pwStepLine":27,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I generate orders","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then each order total equals the sum of its line items","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And each order status is \"confirmed\"","stepMatchArguments":[{"group":{"start":21,"value":"\"confirmed\"","children":[{"start":22,"value":"confirmed","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":32,"pickleLine":29,"tags":[],"steps":[{"pwStepLine":33,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I generate a customer","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the customer has a name","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And the email contains \"@\"","stepMatchArguments":[{"group":{"start":19,"value":"\"@\"","children":[{"start":20,"value":"@","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":36,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And the customer has an address","stepMatchArguments":[]}]},
]; // bdd-data-end