(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.menuModule = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  async function fetchMenu() {
    const response = await fetch('/api/menu');
    if (!response.ok) {
      throw new Error('Falha ao carregar cardápio');
    }
    return response.json();
  }

  function renderMenu(products) {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      emoji: product.emoji,
    }));
  }

  return {
    fetchMenu,
    renderMenu,
  };
});
