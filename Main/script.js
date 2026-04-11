// Array de produtos (biscoitos)
const products = [
  {
    id: 1,
    name: "Sequilhos Tradicional",
    description: "Sequilhos Tradicional",
    price: "R$ 70,00",
    emoji: "🍫",
  },
  {
    id: 2,
    name: "Sequilhos de Limão",
    description: "Sequilhos de Limão",
    price: "R$ 75,00",
    emoji: "🍦",
  },
  {
    id: 3,
    name: "Sequilhos de Maracujá",
    description: "Sequilhos de Maracujá",
    price: "R$ 75,00",
    emoji: "🍓",
  },
  {
    id: 4,
    name: "Sequilhos de Canela",
    description: "Sequilhos de Canela",
    price: "R$ 80,00",
    emoji: "🌾",
  },
  {
    id: 5,
    name: "Sequilhos com Gotas de Chocolate",
    description: "Sequilhos com Gotas de Chocolate",
    price: "R$ 90,00",
    emoji: "🥜",
  },
  {
    id: 6,
    name: "Sequilhos de Côco",
    description: "Sequilhos de Côco",
    price: "R$ 90,00",
    emoji: "✨",
  },
  {
    id: 7,
    name: "Sequilhos Diet",
    description: "Sequilhos Diet",
    price: "R$ 90,00",
    emoji: "🍯",
  },
  {
    id: 8,
    name: "Biscoitos Amanteigados (com Raspas de Limão)",
    description: "Biscoitos Amanteigados (com Raspas de Limão)",
    price: "R$ 85,00",
    emoji: "🥥",
  },
  {
    id: 9,
    name: "Biscoitos de Cappuccino",
    description: "Biscoitos de Cappuccino",
    price: "R$ 90,00",
    emoji: "🍫",
  },
  {
    id: 10,
    name: "Biscoitos de Paçoquita",
    description: "Biscoitos de Paçoquita",
    price: "R$ 90,00",
    emoji: "🍦",
  },
  {
    id: 11,
    name: "Biscoitos de Chocolate",
    description: "Biscoitos de Chocolate",
    price: "R$ 90,00",
    emoji: "🍓",
  },
  {
    id: 12,
    name: "Biscoitos de Café",
    description: "Biscoitos de Café",
    price: "R$ 90,00",
    emoji: "🌾",
  },
  {
    id: 13,
    name: "Biscoitos de Limão",
    description: "Biscoitos de Limão",
    price: "R$ 90,00",
    emoji: "🥜",
  },
  {
    id: 14,
    name: "Biscoitos de Maracujá",
    description: "Biscoitos de Maracujá",
    price: "R$ 90,00",
    emoji: "✨",
  },
  {
    id: 15,
    name: "Biscoitos de Nutella",
    description: "Biscoitos de Nutella",
    price: "R$ 90,00",
    emoji: "🍯",
  },
  {
    id: 16,
    name: "Biscoitos de Ninho com Leite Condensado",
    description: "Biscoitos de Ninho com Leite Condensado",
    price: "R$ 105,00",
    emoji: "🥥",
  },
  {
    id: 17,
    name: "Biscoitos Diet",
    description: "Biscoitos Diet",
    price: "R$ 105,00",
    emoji: "🍫",
  },
  {
    id: 18,
    name: "Biscoitos Amanteigados (com Ovomaltine)",
    description: "Biscoitos Amanteigados (com Ovomaltine)",
    price: "R$ 105,00",
    emoji: "🍦",
  },
  {
    id: 19,
    name: "Biscoitos de Laranja com Chocolate",
    description: "Biscoitos de Laranja com Chocolate",
    price: "R$ 105,00",
    emoji: "🍓",
  },
  {
    id: 20,
    name: "Biscoitos de Amêndoas",
    description: "Biscoitos de Amêndoas",
    price: "R$ 110,00",
    emoji: "🌾",
  },
  {
    id: 21,
    name: "Biscoitos de Damasco",
    description: "Biscoitos de Damasco",
    price: "R$ 110,00",
    emoji: "🥜",
  },
  {
    id: 22,
    name: "Biscoitos de Pistache",
    description: "Biscoitos de Pistache",
    price: "R$ 120,00",
    emoji: "✨",
  },
  {
    id: 23,
    name: "Biscoitos Red Velvet",
    description: "Biscoitos Red Velvet",
    price: "R$ 120,00",
    emoji: "🍯",
  },
];

// Função para criar um cartão de produto
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <div class="product-image">${product.emoji}</div>
    <div class="product-info">
      <h4 class="product-name">${product.name}</h4>
      <p class="product-description">${product.description}</p>
      <p class="product-price">${product.price}</p>
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

// Função para adicionar um produto ao carrinho
function addToCart(productId, productName) {
  alert(`✅ ${productName} adicionado ao carrinho com sucesso!`);
  console.log(
    `Produto ${productId} - ${productName} foi adicionado ao carrinho`,
  );
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
});
