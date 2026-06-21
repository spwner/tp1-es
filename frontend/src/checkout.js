(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.checkoutModule = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  async function submitOrder(items) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Falha ao criar pedido.');
    }

    return payload;
  }

  function buildWhatsAppUrl(phone, payload) {
    const itemsList = payload.items
      .map((item) => `${item.name} (${item.quantity}g) - R$ ${item.lineTotal.toFixed(2)}`)
      .join('\n');

    const message = `Olá! Gostaria de fazer o seguinte pedido:\n\n${itemsList}\n\nFrete: R$ ${payload.shipping.toFixed(2)}\nTotal: R$ ${payload.total.toFixed(2)}\n`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  }

  return {
    submitOrder,
    buildWhatsAppUrl,
  };
});
