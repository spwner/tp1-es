// Array de produtos (biscoitos)
const products = [
  {
    id: 1,
    name: "Biscoito de Chocolate",
    description: "Delicioso biscoito com pedaços de chocolate belga",
    price: "R$ 12,90",
    emoji: "🍫"
  },
  {
    id: 2,
    name: "Biscoito de Baunilha",
    description: "Clássico biscoito com aroma intenso de baunilha",
    price: "R$ 10,90",
    emoji: "🍦"
  },
  {
    id: 3,
    name: "Biscoito de Morango",
    description: "Doce e macio com sabor natural de morango",
    price: "R$ 11,90",
    emoji: "🍓"
  },
  {
    id: 4,
    name: "Biscoito de Aveia",
    description: "Nutritivo e crocante, perfeito para manhã",
    price: "R$ 9,90",
    emoji: "🌾"
  },
  {
    id: 5,
    name: "Biscoito de Amendoim",
    description: "Crocante e saboroso para os amantes de amendoim",
    price: "R$ 13,90",
    emoji: "🥜"
  },
  {
    id: 6,
    name: "Biscoito de Canela",
    description: "Aromático e aquecedor com toque de açúcar cristal",
    price: "R$ 11,90",
    emoji: "✨"
  },
  {
    id: 7,
    name: "Biscoito de Mel",
    description: "Adoçado naturalmente com mel puro e mel de abelha",
    price: "R$ 14,90",
    emoji: "🍯"
  },
  {
    id: 8,
    name: "Biscoito de Coco",
    description: "Tropical e refrescante com coco ralado fino",
    price: "R$ 12,90",
    emoji: "🥥"
  }
];

// Função para criar um cartão de produto
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
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
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = ''; // Limpar grid
  
  products.forEach(product => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

// Função para adicionar um produto ao carrinho
function addToCart(productId, productName) {
  alert(`✅ ${productName} adicionado ao carrinho com sucesso!`);
  console.log(`Produto ${productId} - ${productName} foi adicionado ao carrinho`);
}

// Função para buscar produtos por nome
function searchProducts(searchTerm) {
  const filtered = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = '';
  
  if (filtered.length === 0) {
    productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum biscoito encontrado.</p>';
  } else {
    filtered.forEach(product => {
      const card = createProductCard(product);
      productsGrid.appendChild(card);
    });
  }
}

// Carregar produtos quando a página abrir
document.addEventListener('DOMContentLoaded', function() {
  console.log('🍪 Loja de Biscoitos Carregada!');
  loadProducts();
});
