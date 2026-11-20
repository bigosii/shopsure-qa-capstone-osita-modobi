import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

// Covers both "Account Created!" and "Account Deleted!" pages (same layout)
export class AccountStatusPage extends BasePage {
  constructor(page) {
    super(page);
    this.accountCreatedHeading = page.getByTestId('account-created');
    this.accountDeletedHeading = page.getByTestId('account-deleted');
    this.continueButton = page.getByTestId('continue-button');
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async verifyAccountCreated(expectedText) {
    await expect(this.accountCreatedHeading).toHaveText(expectedText);
  }

  async verifyAccountDeleted(expectedText) {
    await expect(this.accountDeletedHeading).toHaveText(expectedText);
  }
}