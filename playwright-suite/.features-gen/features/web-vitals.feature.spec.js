// Generated from: features/web-vitals.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Core Web Vitals', () => {

  test('LCP - largest contentful paint under 2.5s', async ({ When, Then, And, bdd, page }) => { 
    await When('I open the DemoMart homepage', null, { page }); 
    await Then('the largest contentful paint is recorded', null, { bdd, page }); 
    await And('it is under 2500 milliseconds', null, { bdd }); 
  });

  test('CLS - cumulative layout shift under 0.1', async ({ When, Then, page }) => { 
    await When('I open the DemoMart homepage and let it settle', null, { page }); 
    await Then('the cumulative layout shift (excluding input-driven shifts) is under 0.1', null, { page }); 
  });

  test('INP - interaction responds within 200ms', async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await When('I add a product to the cart and type in the search box', null, { page }); 
    await Then('the slowest interaction duration is under 200 milliseconds', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/web-vitals.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then the largest contentful paint is recorded","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And it is under 2500 milliseconds","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage and let it settle","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the cumulative layout shift (excluding input-driven shifts) is under 0.1","stepMatchArguments":[{"group":{"start":69,"value":"0.1"},"parameterTypeName":"float"}]}]},
  {"pwTestLine":17,"pickleLine":17,"tags":[],"steps":[{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I add a product to the cart and type in the search box","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the slowest interaction duration is under 200 milliseconds","stepMatchArguments":[]}]},
]; // bdd-data-end