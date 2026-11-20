import { expect } from '@playwright/test';

export class HeaderComponent {
  constructor(page) {
    this.page = page;
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.loggedInUserLabel = page.getByText('Logged in as');
  }

  async openSignupLoginPage() {
    await this.signupLoginLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }

  async verifyLoggedInAs(userName) {
    await expect(this.loggedInUserLabel).toContainText(userName);
  }

  async verifyUserIsLoggedOut() {
    await expect(this.loggedInUserLabel).toBeHidden();
    await expect(this.signupLoginLink).toBeVisible();
  }
}