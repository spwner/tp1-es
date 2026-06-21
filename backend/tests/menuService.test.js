jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const menuService = require('../src/services/menuService');
const db = require('../src/db');

describe('menuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchActiveMenuItems returns menu rows', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'A', description: 'B', price: 10, emoji: '🍪' }] });

    const result = await menuService.fetchActiveMenuItems();

    expect(result).toEqual([{ id: 1, name: 'A', description: 'B', price: 10, emoji: '🍪' }]);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('FROM menu_items'), undefined);
  });

  it('createMenuItem inserts a valid item', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'A', description: 'B', price: 10, emoji: '🍪' }] });

    const result = await menuService.createMenuItem({ name: 'A', description: 'B', price: 10, emoji: '🍪' });

    expect(result).toEqual({ id: 1, name: 'A', description: 'B', price: 10, emoji: '🍪' });
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO menu_items'), ['A', 'B', 10, '🍪']);
  });

  it('createMenuItem rejects invalid price', async () => {
    await expect(menuService.createMenuItem({ name: 'A', description: 'B', price: -1, emoji: '🍪' })).rejects.toThrow('Preço inválido.');
  });

  it('updateMenuPrice throws 404 when item not found', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(menuService.updateMenuPrice(1, 10)).rejects.toThrow('Produto não encontrado.');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE menu_items'), [10, 1]);
  });

  it('deleteMenuItem throws 404 when item not found', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    await expect(menuService.deleteMenuItem(1)).rejects.toThrow('Produto não encontrado.');
    expect(db.query).toHaveBeenCalledWith('DELETE FROM menu_items WHERE id = $1', [1]);
  });
});
