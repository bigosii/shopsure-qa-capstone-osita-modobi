import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AccountInformationPage extends BasePage {
  constructor(page) {
    super(page);
    this.accountInformationHeading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.titleMrRadio = page.getByRole('radio', { name: 'Mr.', exact: true });
    this.titleMrsRadio = page.getByRole('radio', { name: 'Mrs.', exact: true });
    this.passwordInput = page.getByTestId('password');
    this.birthDaySelect = page.getByTestId('days');
    this.birthMonthSelect = page.getByTestId('months');
    this.birthYearSelect = page.getByTestId('years');
    this.firstNameInput = page.getByTestId('first_name');
    this.lastNameInput = page.getByTestId('last_name');
    this.companyInput = page.getByTestId('company');
    this.address1Input = page.getByTestId('address');
    this.address2Input = page.getByTestId('address2');
    this.countrySelect = page.getByTestId('country');
    this.stateInput = page.getByTestId('state');
    this.cityInput = page.getByTestId('city');
    this.zipcodeInput = page.getByTestId('zipcode');
    this.mobileNumberInput = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
  }

  async selectTitle(title) {
    const titleRadio = title === 'Mrs' ? this.titleMrsRadio : this.titleMrRadio;
    await titleRadio.check();
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async selectDateOfBirth(day, month, year) {
    await this.birthDaySelect.selectOption({ label: day });
    await this.birthMonthSelect.selectOption({ label: month });
    await this.birthYearSelect.selectOption({ label: year });
  }

  async enterFullName(firstName, lastName) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  async enterAddress(userProfile) {
    await this.companyInput.fill(userProfile.company);
    await this.address1Input.fill(userProfile.address1);
    await this.address2Input.fill(userProfile.address2);
    await this.countrySelect.selectOption({ label: userProfile.country });
    await this.stateInput.fill(userProfile.state);
    await this.cityInput.fill(userProfile.city);
    await this.zipcodeInput.fill(userProfile.zipcode);
  }

  async enterMobileNumber(mobileNumber) {
    await this.mobileNumberInput.fill(mobileNumber);
  }

  async submitCreateAccountForm() {
    await this.createAccountButton.click();
  }

  // The one combining method on this page: fills every field, then submits
  async createAccount(userProfile) {
    await this.selectTitle(userProfile.title);
    await this.enterPassword(userProfile.password);
    await this.selectDateOfBirth(userProfile.birthDay, userProfile.birthMonth, userProfile.birthYear);
    await this.enterFullName(userProfile.firstName, userProfile.lastName);
    await this.enterAddress(userProfile);
    await this.enterMobileNumber(userProfile.mobileNumber);
    await this.submitCreateAccountForm();
  }

  async verifyAccountInformationFormIsVisible() {
    await expect(this.accountInformationHeading).toBeVisible();
  }
}