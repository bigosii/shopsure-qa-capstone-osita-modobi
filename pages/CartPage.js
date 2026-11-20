import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { parsePriceText } from '../utils/cartPriceCalculator.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.pagePath = '/view_cart';
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.lineTotalCells = page.locator('#cart_info_table .cart_total_price');
  }

  async open() {
    await this.navigateTo(this.pagePath);
  }

  // One cart row, found by the product name link inside it
  getCartRow(productName) {
    return this.cartRows.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
  }

  async removeProduct(productName) {
    // The remove button is an "x" icon with no text or label, so we use its class
    await this.getCartRow(productName).locator('.cart_quantity_delete').click();
  }

  async verifyCartRowCount(expectedCount) {
    await expect(this.cartRows).toHaveCount(expectedCount);
  }

  // Checks quantity, unit price and line total for one row
  async verifyCartLine(product, expectedLineTotal) {
    const cartRow = this.getCartRow(product.name);
    await expect(cartRow.locator('.cart_quantity')).toHaveText(String(product.quantity));
    const unitPriceText = await cartRow.locator('.cart_price').textContent();
    const lineTotalText = await cartRow.locator('.cart_total_price').textContent();
    expect(parsePriceText(unitPriceText)).toBe(product.unitPrice);
    expect(parsePriceText(lineTotalText)).toBe(expectedLineTotal);
  }

  // The site shows no grand total, so we add up the line totals shown on screen
  async verifyCartTotal(expectedCartTotal) {
    await expect(this.lineTotalCells.first()).toBeVisible();
    const lineTotalTexts = await this.lineTotalCells.allTextContents();
    let shownCartTotal = 0;
    for (const lineTotalText of lineTotalTexts) {
      shownCartTotal += parsePriceText(lineTotalText);
    }
    expect(shownCartTotal).toBe(expectedCartTotal);
  }

  async verifyProductIsInCart(productName) {
    await expect(this.getCartRow(productName)).toBeVisible();
  }

  async verifyProductIsNotInCart(productName) {
    await expect(this.getCartRow(productName)).toHaveCount(0);
  }
}
