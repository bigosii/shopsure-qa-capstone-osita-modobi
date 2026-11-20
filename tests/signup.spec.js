import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
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
});