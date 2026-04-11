// Array de produtos (biscoitos)
const products = [
  {
    id: 1,
    name: "Sequilhos Tradicional",
    description: "Sequilhos Tradicional",
    price: 70,
    emoji: "🍫",
  },
  {
    id: 2,
    name: "Sequilhos de Limão",
    description: "Sequilhos de Limão",
    price: 75,
    emoji: "🍦",
  },
  {
    id: 3,
    name: "Sequilhos de Maracujá",
    description: "Sequilhos de Maracujá",
    price: 75,
    emoji: "🍓",
  },
  {
    id: 4,
    name: "Sequilhos de Canela",
    description: "Sequilhos de Canela",
    price: 80,
    emoji: "🌾",
  },
  {
    id: 5,
    name: "Sequilhos com Gotas de Chocolate",
    description: "Sequilhos com Gotas de Chocolate",
    price: 90,
    emoji: "🥜",
  },
  {
    id: 6,
    name: "Sequilhos de Côco",
    description: "Sequilhos de Côco",
    price: 90,
    emoji: "✨",
  },
  {
    id: 7,
    name: "Sequilhos Diet",
    description: "Sequilhos Diet",
    price: 90,
    emoji: "🍯",
  },
  {
    id: 8,
    name: "Biscoitos Amanteigados (com Raspas de Limão)",
    description: "Biscoitos Amanteigados (com Raspas de Limão)",
    price: 85,
    emoji: "🥥",
  },
  {
    id: 9,
    name: "Biscoitos de Cappuccino",
    description: "Biscoitos de Cappuccino",
    price: 90,
    emoji: "🍫",
  },
  {
    id: 10,
    name: "Biscoitos de Paçoquita",
    description: "Biscoitos de Paçoquita",
    price: 90,
    emoji: "🍦",
  },
  {
    id: 11,
    name: "Biscoitos de Chocolate",
    description: "Biscoitos de Chocolate",
    price: 90,
    emoji: "🍓",
  },
  {
    id: 12,
    name: "Biscoitos de Café",
    description: "Biscoitos de Café",
    price: 90,
    emoji: "🌾",
  },
  {
    id: 13,
    name: "Biscoitos de Limão",
    description: "Biscoitos de Limão",
    price: 90,
    emoji: "🥜",
  },
  {
    id: 14,
    name: "Biscoitos de Maracujá",
    description: "Biscoitos de Maracujá",
    price: 90,
    emoji: "✨",
  },
  {
    id: 15,
    name: "Biscoitos de Nutella",
    description: "Biscoitos de Nutella",
    price: 90,
    emoji: "🍯",
  },
  {
    id: 16,
    name: "Biscoitos de Ninho com Leite Condensado",
    description: "Biscoitos de Ninho com Leite Condensado",
    price: 105,
    emoji: "🥥",
  },
  {
    id: 17,
    name: "Biscoitos Diet",
    description: "Biscoitos Diet",
    price: 105,
    emoji: "🍫",
  },
  {
    id: 18,
    name: "Biscoitos Amanteigados (com Ovomaltine)",
    description: "Biscoitos Amanteigados (com Ovomaltine)",
    price: 105,
    emoji: "🍦",
  },
  {
    id: 19,
    name: "Biscoitos de Laranja com Chocolate",
    description: "Biscoitos de Laranja com Chocolate",
    price: 105,
    emoji: "🍓",
  },
  {
    id: 20,
    name: "Biscoitos de Amêndoas",
    description: "Biscoitos de Amêndoas",
    price: 110,
    emoji: "🌾",
  },
  {
    id: 21,
    name: "Biscoitos de Damasco",
    description: "Biscoitos de Damasco",
    price: 110,
    emoji: "🥜",
  },
  {
    id: 22,
    name: "Biscoitos de Pistache",
    description: "Biscoitos de Pistache",
    price: 120,
    emoji: "✨",
  },
  {
    id: 23,
    name: "Biscoitos Red Velvet",
    description: "Biscoitos Red Velvet",
    price: 120,
    emoji: "🍯",
  },
];

// ========== GERENCIAMENTO DO CARRINHO ==========

// Carrinho em memória (sincronizado com localStorage)
let cart = [];

// Carregar carrinho do localStorage
function loadCart() {
  const saved = localStorage.getItem("cart");
  cart = saved ? JSON.parse(saved) : [];
  updateCartUI();
}

// Salvar carrinho no localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Encontrar produto por ID
function getProductById(id) {
  return products.find(p => p.id === id);
}

// Adicionar produto ao carrinho
function addToCart(productId, productName) {
  const product = getProductById(productId);
  
  if (!product) return;

  // Verificar se produto já está no carrinho
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity: 1
    });
  }

  saveCart();
  showNotification(`✅ ${productName} adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

// Atualizar quantidade de um item
function updateQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart();
    }
  }
}

// Limpar carrinho
function clearCart() {
  cart = [];
  saveCart();
}

// Calcular total do carrinho
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calcular frete (5% do total ou mínimo R$ 10)
function calculateShipping() {
  const subtotal = calculateTotal();
  const shippingCost = Math.max(subtotal * 0.05, 10);
  return Math.round(shippingCost * 100) / 100;
}

// Atualizar UI do carrinho
function updateCartUI() {
  // Atualizar contador do carrinho no header
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = totalItems;

  // Se modal está aberto, renderizar carrinho
  if (!document.getElementById('cartModal').classList.contains('hidden')) {
    renderCart();
  }
}

// Renderizar itens do carrinho no modal
function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const emptyCartDiv = document.getElementById('emptyCart');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '';
    emptyCartDiv.classList.remove('hidden');
    cartFooter.style.display = 'none';
  } else {
    emptyCartDiv.classList.add('hidden');
    cartFooter.style.display = 'block';

    cartItemsDiv.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <input type="number" value="${item.quantity}" onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          R$ ${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
      </div>
    `).join('');

    // Atualizar resumo
    const subtotal = calculateTotal();
    const shipping = calculateShipping();
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `R$ ${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
  }
}

// Alternar exibição do modal
function toggleCart() {
  const modal = document.getElementById('cartModal');
  modal.classList.toggle('hidden');
  
  if (!modal.classList.contains('hidden')) {
    renderCart();
  }
}

// Notificação de feedback
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Finalizar pedido
function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const subtotal = calculateTotal();
  const shipping = calculateShipping();
  const total = subtotal + shipping;

  const message = `
Olá! Gostaria de fazer o seguinte pedido:

${cart.map(item => `${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: R$ ${subtotal.toFixed(2)}
Frete: R$ ${shipping.toFixed(2)}
Total: R$ ${total.toFixed(2)}
  `.trim();

  // Codificar mensagem para URL (WhatsApp)
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5533983519072&text=${encodedMessage}`;

  alert('Você será redirecionado para o WhatsApp para confirmar seu pedido.');
  window.open(whatsappUrl, '_blank');

  clearCart();
  toggleCart();
}

// ========== FUNÇÕES DE PRODUTOS ==========

// Função para criar um cartão de produto
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <div class="product-image">${product.emoji}</div>
    <div class="product-info">
      <h4 class="product-name">${product.name}</h4>
      <p class="product-description">${product.description}</p>
      <p class="product-price">R$ ${product.price.toFixed(2)}</p>
      <button class="product-btn" onclick="addToCart(${product.id}, '${product.name}')">
        🛒 Adicionar ao carrinho
      </button>
    </div>
  `;

  return card;
}

// Função para carregar todos os produtos
function loadProducts() {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = ""; // Limpar grid

  products.forEach((product) => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

// Função para buscar produtos por nome
function searchProducts(searchTerm) {
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  if (filtered.length === 0) {
    productsGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum biscoito encontrado.</p>';
  } else {
    filtered.forEach((product) => {
      const card = createProductCard(product);
      productsGrid.appendChild(card);
    });
  }
}

// Carregar produtos quando a página abrir
document.addEventListener("DOMContentLoaded", function () {
  console.log("🍪 Loja de Biscoitos Carregada!");
  loadProducts();
  loadCart(); // Carregar carrinho salvo
});
