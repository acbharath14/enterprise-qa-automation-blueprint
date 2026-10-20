// Generated from: features/upload.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Product Image Upload', () => {

  test('Product image upload sanitizes a hostile filename', async ({ When, Then, And, bdd, request }) => { 
    await When('I upload an image for prod-1 with a script-tag filename', null, { bdd, request }); 
    await Then('the response status is 200', null, { bdd }); 
    await And('the stored filename contains no "<" or ">"', null, { bdd }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/upload.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I upload an image for prod-1 with a script-tag filename","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the response status is 200","stepMatchArguments":[{"group":{"start":23,"value":"200"},"parameterTypeName":"int"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And the stored filename contains no \"<\" or \">\"","stepMatchArguments":[{"group":{"start":32,"value":"\"<\"","children":[{"start":33,"value":"<","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\">\"","children":[{"start":40,"value":">","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end