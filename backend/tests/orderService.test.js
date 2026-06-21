jest.mock('../src/db', () => ({
  query: jest.fn(),
  pool: {
    connect: jest.fn(),
  },
}));

const orderService = require('../src/services/orderService');
const db = require('../src/db');

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchPendingOrders returns orders rows', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, status: 'pending', subtotal: 10, shipping: 5, total: 15, items: [] }] });

    const result = await orderService.fetchPendingOrders();

    expect(result).toEqual([{ id: 1, status: 'pending', subtotal: 10, shipping: 5, total: 15, items: [] }]);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), undefined);
  });

  it('createOrder rejects missing items', async () => {
    await expect(orderService.createOrder(null)).rejects.toMatchObject({ status: 400 });
  });

  it('createOrder rejects malformed items', async () => {
    await expect(orderService.createOrder([{ id: 'x', quantity: 0 }])).rejects.toMatchObject({ status: 400 });
  });

  it('createOrder rejects invalid products', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(orderService.createOrder([{ id: 1, quantity: 500 }])).rejects.toMatchObject({ status: 400 });
  });

  it('createOrder inserts order and items successfully', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, name: 'Biscoito', price: 100 }] });

    const client = {
      query: jest.fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: 1, status: 'pending', subtotal: 50, shipping: 10, total: 60, created_at: '2026-01-01T00:00:00Z' }] })
        .mockResolvedValue({}),
      release: jest.fn(),
    };

    db.pool.connect.mockResolvedValueOnce(client);

    const result = await orderService.createOrder([{ id: 1, quantity: 500 }]);

    expect(result).toEqual({
      orderId: 1,
      status: 'pending',
      createdAt: '2026-01-01T00:00:00Z',
      subtotal: 50,
      shipping: 10,
      total: 60,
      items: [{ menuItemId: 1, name: 'Biscoito', unitPrice: 100, quantity: 500, lineTotal: 50 }],
    });

    expect(client.query).toHaveBeenCalledWith('BEGIN');
    expect(client.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO orders'), [50, 10, 60]);
    expect(client.release).toHaveBeenCalled();
  });
});
