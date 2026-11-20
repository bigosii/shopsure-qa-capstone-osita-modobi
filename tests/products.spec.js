import { test } from '../fixtures/baseTest.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import products from '../test-data/products.json' with { type: 'json' };

test.describe('Products', () => {
  let productsPage;
  let productDetailPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    productDetailPage = new ProductDetailPage(page);
    await productsPage.open();
    await productsPage.verifyAllProductsAreVisible();
  });

  test('searching for a product shows only matching results', async () => {
    await productsPage.enterSearchTerm(products.searchTerm);
    await productsPage.submitSearch();
    await productsPage.verifySearchResultsMatch(products.searchTerm);
  });

  test('product details page shows name, category, price, availability, condition and brand', async () => {
    await productsPage.openProductDetails(products.productDetails.name);
    await productDetailPage.verifyProductDetails(products.productDetails);
  });
});
