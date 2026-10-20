// Generated from: features/visual.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Visual Regression', () => {

  test('Storefront matches the committed baseline', async ({ Given, When, Then, page }) => { 
    await Given('a committed storefront baseline exists'); 
    await When('I open the DemoMart homepage', null, { page }); 
    await Then('the full-page screenshot matches the baseline within tolerance', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/visual.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given a committed storefront baseline exists","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I open the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the full-page screenshot matches the baseline within tolerance","stepMatchArguments":[]}]},
]; // bdd-data-end