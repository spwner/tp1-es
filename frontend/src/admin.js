(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.adminModule = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  function getPassword() {
    return document.getElementById('adminPassword')?.value || '';
  }

  async function loadMenu() {
    const response = await fetch('/api/menu');
    const items = await response.json();
    const list = document.getElementById('adminList');
    if (!list) return;

    list.innerHTML = items
      .map(
        (item) => `
          <div class="admin-item">
            <span>${item.emoji} <strong>${item.name}</strong> (R$ ${item.price.toFixed(2)}/kg)</span>
            <div>
              <input type="number" id="price-${item.id}" value="${item.price.toFixed(2)}" step="0.01" style="width:80px">
              <button onclick="window.adminModule.updatePrice(${item.id})" style="background:#d4a574; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer">Atualizar Preço</button>
              <button class="btn-delete" onclick="window.adminModule.deleteProduct(${item.id}, '${item.name}')">🗑️ Remover</button>
            </div>
          </div>
        `,
      )
      .join('');
  }

  async function addProduct() {
    const body = {
      name: document.getElementById('newName')?.value,
      description: document.getElementById('newDesc')?.value,
      price: parseFloat(document.getElementById('newPrice')?.value),
      emoji: document.getElementById('newEmoji')?.value,
      password: getPassword(),
    };

    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert('Produto adicionado!');
      await loadMenu();
      return;
    }

    const err = await res.json();
    alert('Erro: ' + err.error);
  }

  async function deleteProduct(id, name) {
    if (!confirm(`Tem certeza que deseja remover "${name}" do cardápio?`)) {
      return;
    }

    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getPassword() }),
    });

    if (res.ok) {
      alert('Produto removido!');
      await loadMenu();
      return;
    }

    const err = await res.json();
    alert('Erro: ' + err.error);
  }

  async function updatePrice(id) {
    const newPrice = document.getElementById(`price-${id}`)?.value;
    const res = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPrice, password: getPassword() }),
    });
    if (res.ok) {
      alert('Preço atualizado!');
      await loadMenu();
      return;
    }
    const err = await res.json();
    alert('Erro: ' + err.error);
  }

  function init() {
    if (typeof document === 'undefined') return;
    if (document.readyState !== 'loading') {
      loadMenu();
    } else {
      document.addEventListener('DOMContentLoaded', loadMenu);
    }
  }

  if (typeof window !== 'undefined') {
    window.adminModule = {
      loadMenu,
      addProduct,
      deleteProduct,
      updatePrice,
    };
    window.addProduct = addProduct;
    window.deleteProduct = deleteProduct;
    window.updatePrice = updatePrice;
    init();
  }

  return {
    loadMenu,
    addProduct,
    deleteProduct,
    updatePrice,
  };
});
