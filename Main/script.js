// Array de produtos (carregado pela API)
let products = [];
let config = {};

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    config = await response.json();
  } catch (error) {
    console.warn('Não conseguiu carregar configuração, usando padrão:', error);
    config = { whatsappPhone: '5533998351907' };
  }
}

// ========== GERENCIAMENTO DO CARRINHO ==========

// Carrinho em memória (sem localStorage)
let cart = [];

function persistCart() {
  updateCartUI();
}

async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  const normalizedText = text.trim();

  if (!normalizedText || normalizedText.startsWith('<!DOCTYPE')) {
    throw new Error('Backend indisponivel. Inicie o servidor Node com PostgreSQL ativo.');
  }

  throw new Error(normalizedText);
}

// Encontrar produto por ID
function getProductById(id) {
  return products.find(p => p.id === id);
}

// Adicionar produto ao carrinho
function addToCart(productId) {
  const product = getProductById(productId);
  
  if (!product) return;

  // Verificar se produto já está no carrinho
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 100; // Incrementar quantidade em 100g
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity: 500 // Definir quantidade inicial em 500g
    });
  }

  persistCart();
  showNotification(`✅ ${product.name} adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  persistCart();
}

// Atualizar quantidade de um item
function updateQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = Math.max(500, quantity); // Quantidade mínima de 500g
      persistCart();
    }
  }
}

// Limpar carrinho
function clearCart() {
  cart = [];
  persistCart();
}

// Calcular total do carrinho
function calculateTotal() {
  return cart.reduce((total, item) => total + ((item.price * item.quantity) / 1000), 0);
}

// Calcular frete (5% do total ou mínimo R$ 10)
function calculateShipping() {
  const subtotal = calculateTotal();
  const shippingCost = Math.max(subtotal * 0.05, 10);
  return Math.round(shippingCost * 100) / 100;
}

// Atualizar UI do carrinho
function updateCartUI() {
  // Pega o valor financeiro total do carrinho usando a função que já existe
  const totalValue = calculateTotal();
  
  // Atualiza a "badge" vermelha no header com o preço formatado em Reais
  document.getElementById('cartCount').textContent = `R$ ${totalValue.toFixed(2)}`;

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
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 100})">−</button>
          <input type="number" value="${item.quantity}" onchange="updateQuantity(${item.id}, parseInt(this.value))" min="500" step="100">
          <span style="font-weight: bold; color: #666; margin: 0 4px;">g</span>
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 100})">+</button>
        </div>
        <div class="cart-item-total">
          R$ ${((item.price * item.quantity) / 1000).toFixed(2)}
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
async function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
      }),
    });

    const payload = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(payload.error || 'Falha ao criar pedido.');
    }

    // Formata a lista de itens primeiro, sem espaços extras no início
    const itemsList = payload.items.map(item => 
      `${item.name} (${item.quantity}g) - R$ ${item.lineTotal.toFixed(2)}`
    ).join('\n');

    // Monta a mensagem final garantindo que o texto fique encostado na margem esquerda
    const message = `Olá! Gostaria de fazer o seguinte pedido:

${itemsList}

Frete: R$ ${payload.shipping.toFixed(2)}
Total: R$ ${payload.total.toFixed(2)}

Aguardo confirmação da encomenda e da data de entrega.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappPhone}&text=${encodedMessage}`;

    alert('Pedido salvo no sistema. Você será redirecionado para o WhatsApp para confirmar.');
    window.open(whatsappUrl, '_blank');

    clearCart();
    toggleCart();
  } catch (error) {
    alert(error.message || 'Nao foi possivel finalizar o pedido.');
  }
}

// ========== FUNÇÕES DE PRODUTOS ==========

// Função para criar um cartão de produto
// ========== FUNÇÕES DO CARD DINÂMICO ==========

// Atualiza a quantidade direto no card (com botões + e -)
function updateCardQuantity(productId, change) {
  const input = document.getElementById(`qty-${productId}`);
  let newQty = parseInt(input.value) + change;
  
  // Trava em 500g
  if (newQty < 500) newQty = 500;
  
  input.value = newQty;
  updateCardPrice(productId);
}

// Recalcula e exibe o preço no card baseado nas gramas
function updateCardPrice(productId) {
  const input = document.getElementById(`qty-${productId}`);
  let qty = parseInt(input.value);
  
  // Garantia caso o usuário digite um valor menor manualmente
  if (qty < 500) {
    qty = 500;
    input.value = 500;
  }
  
  const product = getProductById(productId);
  const total = (product.price * qty) / 1000;
  document.getElementById(`price-${productId}`).textContent = `R$ ${total.toFixed(2)}`;
}

// Cria o card com o seletor de peso e preço dinâmico
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Calcula o preço inicial para os 500g mínimos
  const minPrice = (product.price * 500) / 1000;

  card.innerHTML = `
    <div class="product-image">${product.emoji}</div>
    <div class="product-info">
      <h4 class="product-name">${product.name}</h4>
      <p class="product-description">${product.description}</p>
      <p class="product-price-base" style="font-size: 12px; color: #999; margin-bottom: 8px;">R$ ${product.price.toFixed(2)} / kg</p>
      
      <div class="card-quantity-selector">
        <button onclick="updateCardQuantity(${product.id}, -100)">−</button>
        <input type="number" id="qty-${product.id}" value="500" min="500" step="100" onchange="updateCardPrice(${product.id})">
        <span style="font-weight: bold; color: #666;">g</span>
        <button onclick="updateCardQuantity(${product.id}, 100)">+</button>
      </div>

      <div class="card-dynamic-price">
        Total: <strong id="price-${product.id}">R$ ${minPrice.toFixed(2)}</strong>
      </div>

      <button class="product-btn" onclick="addToCartFromCard(${product.id})">
        🛒 Adicionar ao carrinho
      </button>
    </div>
  `;

  return card;
}

// Adiciona ao carrinho lendo a quantidade escolhida no card
function addToCartFromCard(productId) {
  const product = getProductById(productId);
  const qtyInput = document.getElementById(`qty-${productId}`);
  const selectedQty = parseInt(qtyInput.value) || 500;

  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  // Se já tem no carrinho, apenas soma o novo peso
  if (existingItem) {
    existingItem.quantity += selectedQty;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity: selectedQty
    });
  }

  persistCart();
  showNotification(`✅ ${product.name} (${selectedQty}g) adicionado!`);

  // Reseta o card de volta para 500g para a próxima compra
  qtyInput.value = 500;
  updateCardPrice(productId);
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

async function fetchProducts() {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Carregando cardapio...</p>';

  try {
    const response = await fetch('/api/menu');
    const data = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Falha ao carregar cardapio.');
    }

    products = data.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    loadProducts();
  } catch (error) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">${error.message || 'Erro ao carregar cardapio.'}</p>`;
  }
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
  loadConfig();
  fetchProducts();
  updateCartUI();
});
