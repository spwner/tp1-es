(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./cart'), require('./menu'), require('./checkout'));
  } else {
    root.indexModule = factory(root.cartModule, root.menuModule, root.checkoutModule);
  }
})(typeof window !== 'undefined' ? window : this, function (cartModule, menuModule, checkoutModule) {
  async function init() {
    try {
      const products = await menuModule.fetchMenu();
      if (typeof window !== 'undefined') {
        window.products = products;
      }
      renderProducts(products);
    } catch (error) {
      console.error(error);
      if (typeof window !== 'undefined') {
        alert('Falha ao carregar o cardápio.');
      }
    }
  }

  function renderProducts(products) {
    const container = document.getElementById('productsGrid');
    if (!container) {
      return;
    }

    container.innerHTML = products
      .map(
        (product) => `
          <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
              <h4 class="product-name">${product.name}</h4>
              <p class="product-description">${product.description}</p>
              <p class="product-price">R$ ${product.price.toFixed(2)}</p>
              <button class="product-btn" onclick="window.cartModule.addToCart(${product.id}); window.updateCartUI();">Adicionar</button>
            </div>
          </div>
        `,
      )
      .join('');
  }

  if (typeof window !== 'undefined') {
    window.indexModule = {
      init,
    };

    document.addEventListener('DOMContentLoaded', init);
  }

  return {
    init,
  };
});
