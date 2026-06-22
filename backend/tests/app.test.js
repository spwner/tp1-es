/** @jest-environment node */
jest.mock('../src/services/menuService', () => ({
  // Mantido: usado no teste de GET /api/menu
  fetchActiveMenuItems: jest.fn().mockResolvedValue([]),
}));

jest.mock('../src/services/orderService', () => ({
  // Mantido: usado no teste de POST /api/orders
  createOrder: jest.fn().mockResolvedValue({ orderId: 1, items: [] }),
}));

const request = require('supertest');
const express = require('express');
const menuRoutes = require('../src/routes/menuRoutes');
const orderRoutes = require('../src/routes/orderRoutes');

const app = express();
app.use(express.json());
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

describe('API routes', () => {
  it('GET /api/menu returns 200', async () => {
    const res = await request(app).get('/api/menu');
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/orders returns 201', async () => {
    const res = await request(app).post('/api/orders').send({ items: [{ id: 1, quantity: 500 }] });
    
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ orderId: 1, items: [] });
  });
});