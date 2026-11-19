import assert from 'node:assert';
import { TestDataGenerator } from '../../utils/TestDataGenerator.js';
import {
  parsePriceText,
  calculateLineTotal,
  calculateCartTotal,
} from '../../utils/cartPriceCalculator.js';
import signupOptions from '../../test-data/signupOptions.json' with { type: 'json' };
const generator = new TestDataGenerator();
let passedCount = 0;
let failedCount = 0;

// Runs one check and prints PASS or FAIL with its name
function check(checkName, checkFunction) {
  try {
    checkFunction();
    passedCount += 1;
    console.log(`PASS  ${checkName}`);
  } catch (error) {
    failedCount += 1;
    console.log(`FAIL  ${checkName}: ${error.message}`);
  }
}

// TestDataGenerator
check('generateUniqueEmail: 1,000 emails are all different', () => {
  const emailSet = new Set();
  for (let i = 0; i < 1000; i += 1) {
    emailSet.add(generator.generateUniqueEmail('check'));
  }
  assert.strictEqual(emailSet.size, 1000);
});
check('generateUniqueEmail: starts with the prefix, ends with @testmail.com', () => {
  assert.match(generator.generateUniqueEmail('demo'), /^demo\..+@testmail\.com$/);
});
check('pickRandomItem: returns an item from the list', () => {
  assert.ok(['a', 'b', 'c'].includes(generator.pickRandomItem(['a', 'b', 'c'])));
});
check('pickRandomItem: throws for an empty array', () => {
  assert.throws(() => generator.pickRandomItem([]));
});
check('pickRandomItem: throws for something that is not an array', () => {
  assert.throws(() => generator.pickRandomItem('abc'));
});
check('generateUserProfile: has all 17 signup fields, none empty', () => {
  const profileValues = Object.values(generator.generateUserProfile());
  assert.strictEqual(profileValues.length, 17);
  assert.ok(profileValues.every((value) => String(value).length > 0));
});
check('generateUserProfile: country is one of the dropdown options', () => {
  const countryList = signupOptions.locations.map((location) => location.country);
  assert.ok(countryList.includes(generator.generateUserProfile().country));
});

// cartPriceCalculator
check('parsePriceText: "Rs. 500" gives 500', () => {
  assert.strictEqual(parsePriceText('Rs. 500'), 500);
});
check('parsePriceText: "Rs. 1,500" gives 1500', () => {
  assert.strictEqual(parsePriceText('Rs. 1,500'), 1500);
});
check('parsePriceText: throws when no number is left', () => {
  assert.throws(() => parsePriceText('Rs.'));
});
check('calculateLineTotal: 500 x 3 gives 1500', () => {
  assert.strictEqual(calculateLineTotal(500, 3), 1500);
});
check('calculateLineTotal: throws when quantity is below 1', () => {
  assert.throws(() => calculateLineTotal(500, 0));
});
check('calculateCartTotal: adds up every line', () => {
  const cartItemList = [{ unitPrice: 500, quantity: 2 }, { unitPrice: 400, quantity: 1 }];
  assert.strictEqual(calculateCartTotal(cartItemList), 1400);
});
check('calculateCartTotal: an empty cart gives 0', () => {
  assert.strictEqual(calculateCartTotal([]), 0);
});

console.log(`\n${passedCount + failedCount} checks run, ${passedCount} passed, ${failedCount} failed`);
process.exitCode = failedCount > 0 ? 1 : 0;