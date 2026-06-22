const checkoutModule = require('../src/checkout');

global.fetch = jest.fn();

describe('checkout module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds WhatsApp url correctly', () => {
    const payload = {
      items: [{ name: 'A', quantity: 500, lineTotal: 25 }],
      shipping: 10,
      total: 35,
    };

    const url = checkoutModule.buildWhatsAppUrl('5533998351907', payload);
    expect(url).toContain('whatsapp.com');
    expect(url).toContain('5533998351907');
    expect(url).toContain('R%24%2025.00');
  });

  it('submitOrder posts order items and returns payload', async () => {
    const fakeResponse = { orderId: 1, items: [] };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => fakeResponse });

    const result = await checkoutModule.submitOrder([{ id: 1, quantity: 500 }]);
    expect(result).toEqual(fakeResponse);
    expect(fetch).toHaveBeenCalledWith('/api/orders', expect.objectContaining({ method: 'POST' }));
  });

  it('submitOrder throws on server error', async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Falha' }) });
    await expect(checkoutModule.submitOrder([{ id: 1, quantity: 500 }])).rejects.toThrow('Falha');
  });
});
