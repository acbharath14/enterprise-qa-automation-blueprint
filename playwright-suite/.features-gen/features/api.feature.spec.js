// Generated from: features/api.feature
import { test } from "../../features/steps/fixtures.ts";

test.describe('Store API', () => {

  test.describe('Product catalog endpoints', () => {

    test('Lists the seeded products', async ({ When, Then, And, bdd, request }) => { 
      await When('I request GET /api/products', null, { bdd, request }); 
      await Then('the response is 200 with JSON content', null, { bdd }); 
      await And('the list contains prod-1 through prod-12', null, { bdd }); 
      await And('each product has id, name, category, price, rating, stock and description', null, { bdd }); 
    });

    test('Supports search, category filter and sort', async ({ When, Then, bdd, request }) => { 
      await When('I request GET /api/products?q=aurora', null, { bdd, request }); 
      await Then('3 products are returned and every name contains "aurora"', null, { bdd }); 
      await When('I request GET /api/products?category=apparel', null, { bdd, request }); 
      await Then('3 products are returned and every category is "apparel"', null, { bdd }); 
      await When('I request GET /api/products?sort=price_asc', null, { bdd, request }); 
      await Then('the products are ordered by ascending price', null, { bdd }); 
    });

    test('Product values are sane', async ({ When, Then, And, bdd, request }) => { 
      await When('I request GET /api/products', null, { bdd, request }); 
      await Then('every product has a price greater than 0', null, { bdd }); 
      await And('every product has a rating between 0 and 5', null, { bdd }); 
      await And('every product has a non-negative integer stock', null, { bdd }); 
    });

    test('Get-by-id returns the product; unknown id is a JSON 404', async ({ When, Then, bdd, request }) => { 
      await When('I request GET /api/products/prod-1', null, { bdd, request }); 
      await Then('the response is 200 and the product name is "Aurora Wireless Headphones"', null, { bdd }); 
      await When('I request GET /api/products/nope', null, { bdd, request }); 
      await Then('the response is 404 with JSON content and an error field', null, { bdd }); 
    });

    test('Product CRUD round-trips', async ({ When, Then, And, bdd, request }) => { 
      await When('I create a product named "API Test Widget" priced at 12.50', null, { bdd, request }); 
      await Then('the response is 201 and the product is returned', null, { bdd }); 
      await When('I patch the product price to 15', null, { bdd, request }); 
      await Then('the response is 200 and the price is 15', null, { bdd }); 
      await When('I create a product with a negative price', null, { bdd, request }); 
      await Then('the response is 400 with an error field', null, { bdd }); 
      await When('I delete the product', null, { bdd, request }); 
      await Then('the response is 204', null, { bdd }); 
      await And('requesting the product afterwards returns 404', null, { bdd, request }); 
    });

    test('Unknown API routes return JSON 404', async ({ When, Then, bdd, request }) => { 
      await When('I request GET /api/does-not-exist', null, { bdd, request }); 
      await Then('the response is 404 with JSON content and an error field', null, { bdd }); 
    });

  });

  test.describe('Cart endpoints', () => {

    test('Cart math is internally consistent', async ({ Given, When, Then, And, bdd, page, request }) => { 
      await Given('a product priced at $42.50 exists', null, { bdd, request }); 
      await When('I add 5 units to my cart', null, { bdd, request }); 
      await Then('my cart line shows quantity 5', null, { bdd, request }); 
      await And('the line total is 5 x $42.50', null, { bdd, request }); 
      await And('the cart subtotal equals the sum of the line totals', null, { page }); 
    });

    test('Rejects unknown products, bad quantities and over-stock', async ({ When, Then, bdd, request }) => { 
      await When('I add an unknown product to my cart', null, { bdd, request }); 
      await Then('the response is 404', null, { bdd }); 
      await When('I add prod-1 with quantity 0', null, { bdd, request }); 
      await Then('the response is 400', null, { bdd }); 
      await When('I add prod-1 with quantity 99999', null, { bdd, request }); 
      await Then('the response is 400', null, { bdd }); 
    });

    test('Quantity updates and removal work', async ({ Given, When, Then, And, bdd, request }) => { 
      await Given('a product exists and 1 unit is in my cart', null, { bdd, request }); 
      await When('I set the quantity to 4', null, { bdd, request }); 
      await Then('the cart line shows quantity 4', null, { bdd, request }); 
      await When('I remove the line from my cart', null, { bdd, request }); 
      await Then('the product is no longer in my cart', null, { bdd, request }); 
      await And('removing it again returns 404', null, { bdd, request }); 
    });

  });

  test.describe('Order endpoints', () => {

    test('Checkout creates an order and clears its lines', async ({ Given, When, Then, And, bdd, request }) => { 
      await Given('2 units of a product are in my cart', null, { bdd, request }); 
      await When('I place an order with valid buyer details', null, { bdd, request }); 
      await Then('the response is 201', null, { bdd }); 
      await And('the order id matches the pattern "ord-<number>"', null, { bdd }); 
      await And('the order status is "confirmed"', null, { bdd }); 
      await And('the order contains the product with quantity 2', null, { bdd }); 
      await And('the order total equals the sum of the line totals', null, { bdd }); 
      await And('my cart no longer contains the product', null, { bdd, request }); 
      await And('I can retrieve the order by its id', null, { bdd, request }); 
    });

    test('Rejects empty carts and invalid payloads', async ({ Given, When, Then, bdd, request }) => { 
      await Given('my cart is empty', null, { bdd }); 
      await When('I place an order', null, { bdd, request }); 
      await Then('the response is 422', null, { bdd }); 
      await Given('1 unit of a product is in my cart', null, { bdd, request }); 
      await When('I place an order with email "not-an-email"', null, { bdd, request }); 
      await Then('the response is 400', null, { bdd }); 
    });

    test('Receipt downloads as CSV', async ({ Given, When, Then, And, bdd, request }) => { 
      await Given('1 unit of a product is in my cart', null, { bdd, request }); 
      await When('I place an order with valid buyer details', null, { bdd, request }); 
      await And('I download the receipt for the order', null, { bdd, request }); 
      await Then('the response is 200 with CSV content', null, { bdd }); 
      await And('the download is named "receipt-<order id>.csv"', null, { bdd }); 
      await And('the CSV has the header "product,quantity,unit_price,line_total"', null, { bdd }); 
      await And('the CSV contains the product name', null, { bdd }); 
      await And('downloading the receipt for an unknown order returns 404', null, { bdd, request }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/api.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I request GET /api/products","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products"}}]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the response is 200 with JSON content","stepMatchArguments":[{"group":{"start":16,"value":"200"},"parameterTypeName":"int"}]},{"pwStepLine":11,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the list contains prod-1 through prod-12","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And each product has id, name, category, price, rating, stock and description","stepMatchArguments":[{"group":{"start":17,"value":"id, name, category, price, rating, stock and description"}}]}]},
  {"pwTestLine":15,"pickleLine":15,"tags":[],"steps":[{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I request GET /api/products?q=aurora","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products?q=aurora"}}]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then 3 products are returned and every name contains \"aurora\"","stepMatchArguments":[{"group":{"start":0,"value":"3"},"parameterTypeName":"int"},{"group":{"start":49,"value":"aurora"}}]},{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I request GET /api/products?category=apparel","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products?category=apparel"}}]},{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then 3 products are returned and every category is \"apparel\"","stepMatchArguments":[{"group":{"start":0,"value":"3"},"parameterTypeName":"int"},{"group":{"start":47,"value":"apparel"}}]},{"pwStepLine":20,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I request GET /api/products?sort=price_asc","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products?sort=price_asc"}}]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then the products are ordered by ascending price","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":25,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I request GET /api/products","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products"}}]},{"pwStepLine":26,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then every product has a price greater than 0","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And every product has a rating between 0 and 5","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And every product has a non-negative integer stock","stepMatchArguments":[]}]},
  {"pwTestLine":31,"pickleLine":29,"tags":[],"steps":[{"pwStepLine":32,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I request GET /api/products/prod-1","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products/prod-1"}}]},{"pwStepLine":33,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the response is 200 and the product name is \"Aurora Wireless Headphones\"","stepMatchArguments":[{"group":{"start":44,"value":"\"Aurora Wireless Headphones\"","children":[{"start":45,"value":"Aurora Wireless Headphones","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When I request GET /api/products/nope","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/products/nope"}}]},{"pwStepLine":35,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"Then the response is 404 with JSON content and an error field","stepMatchArguments":[]}]},
  {"pwTestLine":38,"pickleLine":35,"tags":[],"steps":[{"pwStepLine":39,"gherkinStepLine":36,"keywordType":"Action","textWithKeyword":"When I create a product named \"API Test Widget\" priced at 12.50","stepMatchArguments":[{"group":{"start":25,"value":"\"API Test Widget\"","children":[{"start":26,"value":"API Test Widget","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":53,"value":"12.50"},"parameterTypeName":"float"}]},{"pwStepLine":40,"gherkinStepLine":37,"keywordType":"Outcome","textWithKeyword":"Then the response is 201 and the product is returned","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I patch the product price to 15","stepMatchArguments":[{"group":{"start":29,"value":"15"},"parameterTypeName":"float"}]},{"pwStepLine":42,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the response is 200 and the price is 15","stepMatchArguments":[{"group":{"start":37,"value":"15"},"parameterTypeName":"float"}]},{"pwStepLine":43,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"When I create a product with a negative price","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":41,"keywordType":"Outcome","textWithKeyword":"Then the response is 400 with an error field","stepMatchArguments":[]},{"pwStepLine":45,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"When I delete the product","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"Then the response is 204","stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"And requesting the product afterwards returns 404","stepMatchArguments":[]}]},
  {"pwTestLine":50,"pickleLine":46,"tags":[],"steps":[{"pwStepLine":51,"gherkinStepLine":47,"keywordType":"Action","textWithKeyword":"When I request GET /api/does-not-exist","stepMatchArguments":[{"group":{"start":10,"value":"GET"}},{"group":{"start":14,"value":"/api/does-not-exist"}}]},{"pwStepLine":52,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then the response is 404 with JSON content and an error field","stepMatchArguments":[]}]},
  {"pwTestLine":59,"pickleLine":52,"tags":[],"steps":[{"pwStepLine":60,"gherkinStepLine":53,"keywordType":"Context","textWithKeyword":"Given a product priced at $42.50 exists","stepMatchArguments":[{"group":{"start":21,"value":"42.50"}}]},{"pwStepLine":61,"gherkinStepLine":54,"keywordType":"Action","textWithKeyword":"When I add 5 units to my cart","stepMatchArguments":[{"group":{"start":6,"value":"5"},"parameterTypeName":"int"}]},{"pwStepLine":62,"gherkinStepLine":55,"keywordType":"Outcome","textWithKeyword":"Then my cart line shows quantity 5","stepMatchArguments":[{"group":{"start":28,"value":"5"},"parameterTypeName":"int"}]},{"pwStepLine":63,"gherkinStepLine":56,"keywordType":"Outcome","textWithKeyword":"And the line total is 5 x $42.50","stepMatchArguments":[{"group":{"start":18,"value":"5"},"parameterTypeName":"int"},{"group":{"start":23,"value":"42.50"}}]},{"pwStepLine":64,"gherkinStepLine":57,"keywordType":"Outcome","textWithKeyword":"And the cart subtotal equals the sum of the line totals","stepMatchArguments":[]}]},
  {"pwTestLine":67,"pickleLine":59,"tags":[],"steps":[{"pwStepLine":68,"gherkinStepLine":60,"keywordType":"Action","textWithKeyword":"When I add an unknown product to my cart","stepMatchArguments":[]},{"pwStepLine":69,"gherkinStepLine":61,"keywordType":"Outcome","textWithKeyword":"Then the response is 404","stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":62,"keywordType":"Action","textWithKeyword":"When I add prod-1 with quantity 0","stepMatchArguments":[{"group":{"start":6,"value":"prod-1"}},{"group":{"start":27,"value":"0"},"parameterTypeName":"int"}]},{"pwStepLine":71,"gherkinStepLine":63,"keywordType":"Outcome","textWithKeyword":"Then the response is 400","stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":64,"keywordType":"Action","textWithKeyword":"When I add prod-1 with quantity 99999","stepMatchArguments":[{"group":{"start":6,"value":"prod-1"}},{"group":{"start":27,"value":"99999"},"parameterTypeName":"int"}]},{"pwStepLine":73,"gherkinStepLine":65,"keywordType":"Outcome","textWithKeyword":"Then the response is 400","stepMatchArguments":[]}]},
  {"pwTestLine":76,"pickleLine":67,"tags":[],"steps":[{"pwStepLine":77,"gherkinStepLine":68,"keywordType":"Context","textWithKeyword":"Given a product exists and 1 unit is in my cart","stepMatchArguments":[]},{"pwStepLine":78,"gherkinStepLine":69,"keywordType":"Action","textWithKeyword":"When I set the quantity to 4","stepMatchArguments":[{"group":{"start":22,"value":"4"},"parameterTypeName":"int"}]},{"pwStepLine":79,"gherkinStepLine":70,"keywordType":"Outcome","textWithKeyword":"Then the cart line shows quantity 4","stepMatchArguments":[{"group":{"start":29,"value":"4"},"parameterTypeName":"int"}]},{"pwStepLine":80,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"When I remove the line from my cart","stepMatchArguments":[]},{"pwStepLine":81,"gherkinStepLine":72,"keywordType":"Outcome","textWithKeyword":"Then the product is no longer in my cart","stepMatchArguments":[]},{"pwStepLine":82,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"And removing it again returns 404","stepMatchArguments":[]}]},
  {"pwTestLine":89,"pickleLine":77,"tags":[],"steps":[{"pwStepLine":90,"gherkinStepLine":78,"keywordType":"Context","textWithKeyword":"Given 2 units of a product are in my cart","stepMatchArguments":[{"group":{"start":0,"value":"2"},"parameterTypeName":"int"}]},{"pwStepLine":91,"gherkinStepLine":79,"keywordType":"Action","textWithKeyword":"When I place an order with valid buyer details","stepMatchArguments":[]},{"pwStepLine":92,"gherkinStepLine":80,"keywordType":"Outcome","textWithKeyword":"Then the response is 201","stepMatchArguments":[]},{"pwStepLine":93,"gherkinStepLine":81,"keywordType":"Outcome","textWithKeyword":"And the order id matches the pattern \"ord-<number>\"","stepMatchArguments":[{"group":{"start":33,"value":"\"ord-<number>\"","children":[{"start":34,"value":"ord-<number>","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":94,"gherkinStepLine":82,"keywordType":"Outcome","textWithKeyword":"And the order status is \"confirmed\"","stepMatchArguments":[{"group":{"start":20,"value":"\"confirmed\"","children":[{"start":21,"value":"confirmed","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":95,"gherkinStepLine":83,"keywordType":"Outcome","textWithKeyword":"And the order contains the product with quantity 2","stepMatchArguments":[{"group":{"start":45,"value":"2"},"parameterTypeName":"int"}]},{"pwStepLine":96,"gherkinStepLine":84,"keywordType":"Outcome","textWithKeyword":"And the order total equals the sum of the line totals","stepMatchArguments":[]},{"pwStepLine":97,"gherkinStepLine":85,"keywordType":"Outcome","textWithKeyword":"And my cart no longer contains the product","stepMatchArguments":[]},{"pwStepLine":98,"gherkinStepLine":86,"keywordType":"Outcome","textWithKeyword":"And I can retrieve the order by its id","stepMatchArguments":[]}]},
  {"pwTestLine":101,"pickleLine":88,"tags":[],"steps":[{"pwStepLine":102,"gherkinStepLine":89,"keywordType":"Context","textWithKeyword":"Given my cart is empty","stepMatchArguments":[]},{"pwStepLine":103,"gherkinStepLine":90,"keywordType":"Action","textWithKeyword":"When I place an order","stepMatchArguments":[]},{"pwStepLine":104,"gherkinStepLine":91,"keywordType":"Outcome","textWithKeyword":"Then the response is 422","stepMatchArguments":[]},{"pwStepLine":105,"gherkinStepLine":92,"keywordType":"Context","textWithKeyword":"Given 1 unit of a product is in my cart","stepMatchArguments":[{"group":{"start":0,"value":"1"},"parameterTypeName":"int"}]},{"pwStepLine":106,"gherkinStepLine":93,"keywordType":"Action","textWithKeyword":"When I place an order with email \"not-an-email\"","stepMatchArguments":[{"group":{"start":28,"value":"\"not-an-email\"","children":[{"start":29,"value":"not-an-email","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":107,"gherkinStepLine":94,"keywordType":"Outcome","textWithKeyword":"Then the response is 400","stepMatchArguments":[]}]},
  {"pwTestLine":110,"pickleLine":96,"tags":[],"steps":[{"pwStepLine":111,"gherkinStepLine":97,"keywordType":"Context","textWithKeyword":"Given 1 unit of a product is in my cart","stepMatchArguments":[{"group":{"start":0,"value":"1"},"parameterTypeName":"int"}]},{"pwStepLine":112,"gherkinStepLine":98,"keywordType":"Action","textWithKeyword":"When I place an order with valid buyer details","stepMatchArguments":[]},{"pwStepLine":113,"gherkinStepLine":99,"keywordType":"Action","textWithKeyword":"And I download the receipt for the order","stepMatchArguments":[]},{"pwStepLine":114,"gherkinStepLine":100,"keywordType":"Outcome","textWithKeyword":"Then the response is 200 with CSV content","stepMatchArguments":[]},{"pwStepLine":115,"gherkinStepLine":101,"keywordType":"Outcome","textWithKeyword":"And the download is named \"receipt-<order id>.csv\"","stepMatchArguments":[{"group":{"start":22,"value":"\"receipt-<order id>.csv\"","children":[{"start":23,"value":"receipt-<order id>.csv","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":116,"gherkinStepLine":102,"keywordType":"Outcome","textWithKeyword":"And the CSV has the header \"product,quantity,unit_price,line_total\"","stepMatchArguments":[{"group":{"start":23,"value":"\"product,quantity,unit_price,line_total\"","children":[{"start":24,"value":"product,quantity,unit_price,line_total","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":117,"gherkinStepLine":103,"keywordType":"Outcome","textWithKeyword":"And the CSV contains the product name","stepMatchArguments":[]},{"pwStepLine":118,"gherkinStepLine":104,"keywordType":"Outcome","textWithKeyword":"And downloading the receipt for an unknown order returns 404","stepMatchArguments":[]}]},
]; // bdd-data-end