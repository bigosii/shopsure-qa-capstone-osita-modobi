import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.pagePath = '/login';
    this.loginFormHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmailInput = page.getByTestId('login-email');
    this.loginPasswordInput = page.getByTestId('login-password');
    this.loginSubmitButton = page.getByTestId('login-button');
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
    this.signupFormHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupNameInput = page.getByTestId('signup-name');
    this.signupEmailInput = page.getByTestId('signup-email');
    this.signupSubmitButton = page.getByTestId('signup-button');
    this.signupErrorMessage = page.getByText(/already exist/i);
  }

  async open() {
    await this.navigateTo(this.pagePath);
  }

  async enterEmail(email) {
    await this.loginEmailInput.fill(email);
  }

  async enterPassword(password) {
    await this.loginPasswordInput.fill(password);
  }

  async submitLoginForm() {
    await this.loginSubmitButton.click();
  }

  async loginWithCredentials(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submitLoginForm();
  }

  async verifyLoginFormIsVisible() {
    await expect(this.loginFormHeading).toBeVisible();
  }

  async verifyLoginErrorIsVisible() {
    await expect(this.loginErrorMessage).toBeVisible();
  }

  async verifyIsOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
    await this.verifyLoginFormIsVisible();
  }

  async enterSignupName(name) {
    await this.signupNameInput.fill(name);
  }

  async enterSignupEmail(email) {
    await this.signupEmailInput.fill(email);
  }

  async submitSignupForm() {
    await this.signupSubmitButton.click();
  }

  async verifySignupFormIsVisible() {
    await expect(this.signupFormHeading).toBeVisible();
  }

  async verifySignupErrorText(expectedText) {
    await expect(this.signupErrorMessage).toHaveText(expectedText);
  }
}