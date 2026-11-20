import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.productInformation = page.locator('.product-information');
    this.productName = this.productInformation.getByRole('heading', { level: 2 });
    this.productCategory = this.productInformation.getByText('Category:');
    this.productPrice = this.productInformation.getByText(/^Rs\./);
    this.productAvailability = this.productInformation.locator('p').filter({ hasText: 'Availability:' });
    this.productCondition = this.productInformation.locator('p').filter({ hasText: 'Condition:' });
    this.productBrand = this.productInformation.locator('p').filter({ hasText: 'Brand:' });
    this.quantityInput = this.productInformation.getByRole('spinbutton');
    this.addToCartButton = this.productInformation.getByRole('button', { name: 'Add to cart' });
    this.addedToCartHeading = page.getByRole('heading', { name: 'Added!' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // The one combining method on this page: set quantity, add, confirm, close the pop-up
  async addToCartWithQuantity(quantity) {
    await this.setQuantity(quantity);
    await this.clickAddToCart();
    await this.verifyProductAddedToCart();
    await this.continueShopping();
  }

  async verifyProductAddedToCart() {
    await expect(this.addedToCartHeading).toBeVisible();
  }

  async verifyProductDetails(expectedProduct) {
    await expect(this.productName).toHaveText(expectedProduct.name);
    await expect(this.productCategory).toHaveText(expectedProduct.category);
    await expect(this.productPrice).toHaveText(expectedProduct.price);
    await expect(this.productAvailability).toContainText(expectedProduct.availability);
    await expect(this.productCondition).toContainText(expectedProduct.condition);
    await expect(this.productBrand).toContainText(expectedProduct.brand);
  }
}
