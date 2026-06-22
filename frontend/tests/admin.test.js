const adminModule = require('../src/admin');

describe('admin module', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="adminPassword" value="secret" />
      <input id="newName" value="Biscoito Teste" />
      <textarea id="newDesc">Descrição</textarea>
      <input id="newPrice" value="95.00" />
      <input id="newEmoji" value="🍪" />
      <div id="adminList"></div>
    `;

    global.fetch = jest.fn();
    global.alert = jest.fn();
    global.confirm = jest.fn().mockReturnValue(true);
  });

  it('loads menu items into admin list', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, name: 'Sequilhos', price: 80, emoji: '🍪' }] });

    await adminModule.loadMenu();

    expect(document.getElementById('adminList').innerHTML).toContain('Sequilhos');
    expect(fetch).toHaveBeenCalledWith('/api/menu');
  });

  it('submits new product with admin password', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, name: 'Sequilhos', price: 80, emoji: '🍪' }] });

    await adminModule.addProduct();

    expect(fetch).toHaveBeenCalledWith('/api/menu', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String),
    }));
    expect(fetch.mock.calls[0][1].body).toContain('"password":"secret"');
  });
});
