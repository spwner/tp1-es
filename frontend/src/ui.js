(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.uiModule = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  const cartModule = window.cartModule;
  const checkoutModule = window.checkoutModule;
  const menuModule = window.menuModule;

  let config = { whatsappPhone: '5533998351907' };

  function formatCurrency(value) {
    return `R$ ${value.toFixed(2)}`;
  }

  async function loadConfig() {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) {
        return;
      }
      config = await response.json();
    } catch (error) {
      console.warn('Não conseguiu carregar configuração, usando padrão:', error);
    }
  }

  function getProductById(id) {
    return window.products?.find((product) => product.id === id);
  }

  function renderProducts(products) {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    container.innerHTML = products
      .map(
        (product) => `
          <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
              <h4 class="product-name">${product.name}</h4>
              <p class="product-description">${product.description}</p>
              <p class="product-price">${formatCurrency(product.price)}</p>
              <button class="product-btn" onclick="window.addToCart(${product.id})">Adicionar</button>
            </div>
          </div>
        `,
      )
      .join('');
  }

  function persistCart() {
    updateCartUI();
  }

  function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');
    const cartFooter = document.getElementById('cartFooter');

    const cart = cartModule.getCart();

    if (!cart || cart.length === 0) {
      cartItemsDiv.innerHTML = '';
      emptyCartDiv.classList.remove('hidden');
      cartFooter.style.display = 'none';
      return;
    }

    emptyCartDiv.classList.add('hidden');
    cartFooter.style.display = 'block';

    cartItemsDiv.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-emoji">${item.emoji}</div>
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
              <button onclick="window.updateQuantity(${item.id}, ${item.quantity - 100})">−</button>
              <input type="number" value="${item.quantity}" onchange="window.updateQuantity(${item.id}, parseInt(this.value))" min="500" step="100">
              <span>g</span>
              <button onclick="window.updateQuantity(${item.id}, ${item.quantity + 100})">+</button>
            </div>
            <div class="cart-item-total">${formatCurrency((item.price * item.quantity) / 1000)}</div>
            <button class="remove-btn" onclick="window.removeFromCart(${item.id})">🗑️</button>
          </div>
        `,
      )
      .join('');

    document.getElementById('subtotal').textContent = formatCurrency(cartModule.calculateTotal());
    document.getElementById('shipping').textContent = formatCurrency(cartModule.calculateShipping());
    document.getElementById('total').textContent = formatCurrency(cartModule.calculateTotal() + cartModule.calculateShipping());
  }

  function updateCartUI() {
    const totalValue = cartModule.calculateTotal();
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = formatCurrency(totalValue);
    }

    const modal = document.getElementById('cartModal');
    if (modal && !modal.classList.contains('hidden')) {
      renderCart();
    }
  }

  function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
      renderCart();
    }
  }

  function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    cartModule.addToCart(product);
    persistCart();
    showNotification(`✅ ${product.name} adicionado ao carrinho!`);
  }

  function removeFromCart(productId) {
    cartModule.removeFromCart(productId);
    persistCart();
  }

  function updateQuantity(productId, quantity) {
    cartModule.updateQuantity(productId, quantity);
    persistCart();
  }

  function clearCart() {
    cartModule.clearCart();
    persistCart();
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  async function checkout() {
    const cart = cartModule.getCart();
    if (!cart || cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    try {
      const payload = await checkoutModule.submitOrder(cart);
      const whatsappUrl = checkoutModule.buildWhatsAppUrl(config.whatsappPhone, payload);
      alert('Pedido salvo no sistema. Você será redirecionado para o WhatsApp para confirmar.');
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      alert(error.message);
    }
  }

  async function init() {
    await loadConfig();
    try {
      const products = await menuModule.fetchMenu();
      window.products = products;
      renderProducts(products);
      updateCartUI();
    } catch (error) {
      console.error(error);
      alert('Falha ao carregar o cardápio.');
    }
  }

  function initBrowser() {
    if (typeof window === 'undefined') return;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.clearCart = clearCart;
    window.toggleCart = toggleCart;
    window.checkout = checkout;
    window.updateCartUI = updateCartUI;

    if (document.readyState !== 'loading') {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', init);
    }
  }

  initBrowser();

  return {
    init,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleCart,
    checkout,
    updateCartUI,
  };
});
