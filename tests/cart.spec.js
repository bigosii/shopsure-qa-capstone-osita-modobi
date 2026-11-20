import { test } from '../fixtures/baseTest.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CartPage } from '../pages/CartPage.js';
import { calculateLineTotal, calculateCartTotal } from '../utils/cartPriceCalculator.js';
import cartProducts from '../test-data/cartProducts.json' with { type: 'json' };

// Opens each product from the Products page and adds it with its quantity
async function addProductsToCart(productsPage, productDetailPage, productList) {
  for (const product of productList) {
    await productsPage.open();
    await productsPage.openProductDetails(product.name);
    await productDetailPage.addToCartWithQuantity(product.quantity);
  }
}

test.describe('Cart', () => {
  let cartPage;

  // Every cart test starts with the two test-data products in the cart
  test.beforeEach(async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailPage = new ProductDetailPage(page);
    cartPage = new CartPage(page);

    await addProductsToCart(productsPage, productDetailPage, cartProducts.productsToAdd);
    await cartPage.open();
    await cartPage.verifyCartRowCount(cartProducts.productsToAdd.length);
  });

  test('cart line totals and cart total match the price calculator', async () => {
    for (const product of cartProducts.productsToAdd) {
      const calculatedLineTotal = calculateLineTotal(product.unitPrice, product.quantity);
      await cartPage.verifyCartLine(product, calculatedLineTotal);
    }
    await cartPage.verifyCartTotal(calculateCartTotal(cartProducts.productsToAdd));
  });

  test('removing a product takes its row out of the cart', async () => {
    await cartPage.removeProduct(cartProducts.productToRemove);
    await cartPage.verifyProductIsNotInCart(cartProducts.productToRemove);
    await cartPage.verifyCartRowCount(cartProducts.productsToAdd.length - 1);
  });
});
