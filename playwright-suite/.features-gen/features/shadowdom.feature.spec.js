// Generated from: features/shadowdom.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Shadow DOM Components', () => {

  test('Star rating exposes its value through the open shadow root', async ({ Given, Then, bdd, page }) => { 
    await Given('I am on the DemoMart homepage', null, { bdd, page }); 
    await Then('the star rating for "prod-1" announces "Rated 4.5 out of 5"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/shadowdom.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the star rating for \"prod-1\" announces \"Rated 4.5 out of 5\"","stepMatchArguments":[{"group":{"start":20,"value":"\"prod-1\"","children":[{"start":21,"value":"prod-1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\"Rated 4.5 out of 5\"","children":[{"start":40,"value":"Rated 4.5 out of 5","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end