import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.pagePath = '/products';
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.searchInput = page.getByPlaceholder('Search Product');
    // The search button is an icon with no text or label, so its id is the only stable hook
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productNames = page.locator('.features_items .productinfo p');
  }

  async open() {
    await this.navigateTo(this.pagePath);
  }

  async enterSearchTerm(searchTerm) {
    await this.searchInput.fill(searchTerm);
  }

  async submitSearch() {
    await this.searchButton.click();
  }

  async openProductDetails(productName) {
    const productCard = this.productCards.filter({ hasText: productName });
    await productCard.getByRole('link', { name: 'View Product' }).click();
  }

  async verifyAllProductsAreVisible() {
    await expect(this.allProductsHeading).toBeVisible();
  }

  // Every product name in the results must contain the search term
  async verifySearchResultsMatch(searchTerm) {
    await expect(this.searchedProductsHeading).toBeVisible();
    await expect(this.productNames.first()).toBeVisible();
    for (const productName of await this.productNames.all()) {
      await expect(productName).toContainText(searchTerm, { ignoreCase: true });
    }
  }
}
