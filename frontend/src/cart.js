(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.cartModule = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  const MIN_QUANTITY = 500;
  let cart = [];

  function getCart() {
    return cart;
  }

  function clearCart() {
    cart = [];
  }

  function findCartItem(productId) {
    return cart.find((item) => item.id === productId);
  }

  function addToCart(product) {
    const existingItem = findCartItem(product.id);
    if (existingItem) {
      existingItem.quantity += 100;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        quantity: MIN_QUANTITY,
      });
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
  }

  function updateQuantity(productId, quantity) {
    const item = findCartItem(productId);
    if (!item) {
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    item.quantity = Math.max(MIN_QUANTITY, quantity);
  }

  function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * (item.quantity / 1000), 0);
  }

  function calculateShipping() {
    const subtotal = calculateTotal();
    return Math.round(Math.max(subtotal * 0.05, 10) * 100) / 100;
  }

  return {
    getCart,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    calculateShipping,
  };
});
