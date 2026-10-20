// Generated from: features/security.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Baseline Security Headers and Output Encoding', () => {

  test('HTML responses carry the nosniff header', async ({ When, Then, bdd, request }) => { 
    await When('I request the DemoMart homepage', null, { bdd, request }); 
    await Then('the response carries X-Content-Type-Options: nosniff', null, { bdd }); 
  });

  test('API responses carry the nosniff header', async ({ When, Then, bdd, request }) => { 
    await When('I send a GET request to "/api/products"', null, { bdd, request }); 
    await Then('the response carries X-Content-Type-Options: nosniff', null, { bdd }); 
  });

  test('Clickjacking defense header is present', async ({ When, Then, bdd, request }) => { 
    await When('I request the homepage, the payment frame, and the products API', null, { bdd, request }); 
    await Then('every response carries X-Frame-Options: SAMEORIGIN', null, { bdd }); 
  });

  test('Product names are HTML-escaped in the catalog', async ({ Given, When, Then, bdd, page, request }) => { 
    await Given('a product exists whose name contains an image-tag XSS payload', null, { bdd, request }); 
    await When('I search the catalog for that product', null, { page }); 
    await Then('the product name renders as escaped text, never as HTML', null, { bdd, page, request }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/security.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I request the DemoMart homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the response carries X-Content-Type-Options: nosniff","stepMatchArguments":[]}]},
  {"pwTestLine":11,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I send a GET request to \"/api/products\"","stepMatchArguments":[{"group":{"start":24,"value":"\"/api/products\"","children":[{"start":25,"value":"/api/products","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the response carries X-Content-Type-Options: nosniff","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I request the homepage, the payment frame, and the products API","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then every response carries X-Frame-Options: SAMEORIGIN","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":17,"tags":[],"steps":[{"pwStepLine":22,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"Given a product exists whose name contains an image-tag XSS payload","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I search the catalog for that product","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the product name renders as escaped text, never as HTML","stepMatchArguments":[]}]},
]; // bdd-data-end