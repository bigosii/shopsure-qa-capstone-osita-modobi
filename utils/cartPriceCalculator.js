// Turns price text from the site, e.g. "Rs. 500", into the number 500
function parsePriceText(priceText) {
  if (typeof priceText !== 'string') {
    throw new Error('parsePriceText() needs a string, e.g. "Rs. 500"');
  }
  const numberMatch = priceText.replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (!numberMatch) {
    throw new Error(`No number found in price text: "${priceText}"`);
  }
  return Number(numberMatch[0]);
}

// Price of one cart row: unit price x quantity
function calculateLineTotal(unitPrice, quantity) {
  if (typeof unitPrice !== 'number' || Number.isNaN(unitPrice) || unitPrice < 0) {
    throw new Error('unitPrice must be a number of 0 or more');
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('quantity must be a whole number of 1 or more');
  }
  return unitPrice * quantity;
}

// Sum of every row in the cart; an empty cart is 0
function calculateCartTotal(cartItemList) {
  if (!Array.isArray(cartItemList)) {
    throw new Error('calculateCartTotal() needs an array of { unitPrice, quantity }');
  }
  let cartTotal = 0;
  for (const cartItem of cartItemList) {
    cartTotal += calculateLineTotal(cartItem.unitPrice, cartItem.quantity);
  }
  return cartTotal;
}

module.exports = { parsePriceText, calculateLineTotal, calculateCartTotal };