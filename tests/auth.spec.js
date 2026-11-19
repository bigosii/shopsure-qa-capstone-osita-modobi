import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import registeredUser from '../test-data/registeredUser.json' with { type: 'json' };
import invalidLogin from '../test-data/invalidLogin.json' with { type: 'json' };

test.describe('Login', () => {
  let loginPage;
  let headerComponent;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    headerComponent = new HeaderComponent(page);
    await loginPage.open();
    await loginPage.verifyLoginFormIsVisible();
  });

  test('registered user can log in with valid email and password', async () => {
    await loginPage.loginWithCredentials(registeredUser.email, registeredUser.password);
    await headerComponent.verifyLoggedInAs(registeredUser.name);
  });

  test('login with a wrong password shows an error and stays on the login page', async () => {
    await loginPage.loginWithCredentials(registeredUser.email, invalidLogin.wrongPassword);
    await loginPage.verifyLoginErrorIsVisible();
    await loginPage.verifyIsOnLoginPage();
  });

  test('logged-in user can log out and returns to the login page', async () => {
    await loginPage.loginWithCredentials(registeredUser.email, registeredUser.password);
    await headerComponent.verifyLoggedInAs(registeredUser.name);
    await headerComponent.logout();
    await headerComponent.verifyUserIsLoggedOut();
    await loginPage.verifyIsOnLoginPage();
  });
});