const menuModule = require('../src/menu');

global.fetch = jest.fn();

describe('menu module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches menu data from API', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, name: 'A', description: 'B', price: 10, emoji: '🍪' }] });

    const result = await menuModule.fetchMenu();
    expect(result[0].name).toBe('A');
    expect(fetch).toHaveBeenCalledWith('/api/menu');
  });

  it('throws when API fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Erro' }) });
    await expect(menuModule.fetchMenu()).rejects.toThrow('Falha ao carregar cardápio');
  });
});
