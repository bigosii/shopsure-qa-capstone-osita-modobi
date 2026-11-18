const signupOptions = require('../test-data/signupOptions.json');

// Counts how many emails this process has made, so two calls in the
// same millisecond still get different values. "let" because it changes.
let emailCounter = 0;

class TestDataGenerator {
  // Prefix + timestamp + counter + random letters + @testmail.com
  generateUniqueEmail(prefix = 'shopsure') {
    emailCounter += 1;
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).slice(2, 8);
    return `${prefix}.${timestamp}.${emailCounter}${randomPart}@testmail.com`;
  }

  // Returns one random element; throws if the input is not a non-empty array
  pickRandomItem(itemList) {
    if (!Array.isArray(itemList) || itemList.length === 0) {
      throw new Error('pickRandomItem() needs a non-empty array');
    }
    const randomIndex = Math.floor(Math.random() * itemList.length);
    return itemList[randomIndex];
  }

  // Full signup profile, built from the two helpers below
  generateUserProfile() {
    return { ...this.buildPersonalDetails(), ...this.buildAddressDetails() };
  }

  buildPersonalDetails() {
    const firstName = this.pickRandomItem(signupOptions.firstNames);
    const lastName = this.pickRandomItem(signupOptions.lastNames);
    return {
      name: `${firstName} ${lastName}`,
      email: this.generateUniqueEmail('shopsure'),
      password: `Test@${Date.now()}`,
      title: this.pickRandomItem(signupOptions.titles),
      birthDay: this.pickRandomItem(signupOptions.birthDays),
      birthMonth: this.pickRandomItem(signupOptions.birthMonths),
      birthYear: this.pickRandomItem(signupOptions.birthYears),
      firstName,
      lastName,
    };
  }

  buildAddressDetails() {
    const location = this.pickRandomItem(signupOptions.locations);
    return {
      company: 'ShopSure QA',
      address1: `${Math.floor(Math.random() * 900) + 100} Test Street`,
      address2: 'Suite 2',
      ...location,
      mobileNumber: `555${String(Date.now()).slice(-7)}`,
    };
  }
}

module.exports = TestDataGenerator;