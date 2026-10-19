// Generated from: features/accessibility.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Accessibility (WCAG) Compliance', () => {

  test('Catalog has no serious accessibility violations', { tag: ['@a11y'] }, async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am on the DemoMart catalog page', null, { bdd, page }); 
    await When('an axe-core scan runs with the wcag2a and wcag2aa rule sets', null, { bdd, page }); 
    await Then('there are no violations of critical or serious impact', null, { bdd }); 
  });

  test('Checkout wizard has no serious accessibility violations', { tag: ['@a11y'] }, async ({ Given, When, Then, bdd, page }) => { 
    await Given('I am on the DemoMart checkout wizard', null, { page }); 
    await When('an axe-core scan runs with the wcag2a and wcag2aa rule sets', null, { bdd, page }); 
    await Then('there are no violations of critical or serious impact', null, { bdd }); 
  });

  test('Checkout form has a stable accessibility tree', { tag: ['@a11y'] }, async ({ Given, Then, page }) => { 
    await Given('I am on the DemoMart checkout form', null, { page }); 
    await Then('the checkout form\'s aria snapshot matches the committed baseline', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/accessibility.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":["@a11y"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart catalog page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When an axe-core scan runs with the wcag2a and wcag2aa rule sets","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then there are no violations of critical or serious impact","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":13,"tags":["@a11y"],"steps":[{"pwStepLine":13,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart checkout wizard","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When an axe-core scan runs with the wcag2a and wcag2aa rule sets","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then there are no violations of critical or serious impact","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":19,"tags":["@a11y"],"steps":[{"pwStepLine":19,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given I am on the DemoMart checkout form","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the checkout form's aria snapshot matches the committed baseline","stepMatchArguments":[]}]},
]; // bdd-data-end