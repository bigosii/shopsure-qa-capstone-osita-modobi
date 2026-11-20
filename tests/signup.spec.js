import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountInformationPage } from '../pages/AccountInformationPage.js';
import { AccountStatusPage } from '../pages/AccountStatusPage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { TestDataGenerator } from '../utils/TestDataGenerator.js';
import registeredUser from '../test-data/registeredUser.json' with { type: 'json' };
import signupMessages from '../test-data/signupMessages.json' with { type: 'json' };

// Fills the "New User Signup!" form; shared by every signup test
async function startSignup(loginPage, name, email) {
  await loginPage.enterSignupName(name);
  await loginPage.enterSignupEmail(email);
  await loginPage.submitSignupForm();
}

test.describe('Signup', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.verifySignupFormIsVisible();
  });

  test('signup with an already registered email shows the exact error message', async () => {
    await startSignup(loginPage, registeredUser.name, registeredUser.email);
    await loginPage.verifySignupErrorText(signupMessages.existingEmailError);
    await loginPage.verifySignupFormIsVisible();
  });

  test.describe('Register new user', () => {
    let accountInformationPage;
    let accountStatusPage;
    let header;
    let isAccountCreated;

    test.beforeEach(async ({ page }) => {
      accountInformationPage = new AccountInformationPage(page);
      accountStatusPage = new AccountStatusPage(page);
      header = new HeaderComponent(page);
      isAccountCreated = false;
    });

    // Clean-up: delete the new account through the UI, only if it was created
    test.afterEach(async () => {
      if (!isAccountCreated) {
        return;
      }
      await header.deleteAccount();
      await accountStatusPage.verifyAccountDeleted(signupMessages.accountDeleted);
    });

    test('new user can register with a generated profile and is logged in', async () => {
      const userProfile = new TestDataGenerator().generateUserProfile();

      await startSignup(loginPage, userProfile.name, userProfile.email);
      await accountInformationPage.verifyAccountInformationFormIsVisible();
      await accountInformationPage.createAccount(userProfile);
      await accountStatusPage.verifyAccountCreated(signupMessages.accountCreated);
      isAccountCreated = true;

      await accountStatusPage.clickContinue();
      await header.verifyLoggedInAs(userProfile.name);
    });
  });
});