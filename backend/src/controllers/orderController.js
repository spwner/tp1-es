const orderService = require('../services/orderService');

async function getPendingOrders(req, res, next) {
  try {
    const orders = await orderService.fetchPendingOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const { items } = req.body;
    const order = await orderService.createOrder(items);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPendingOrders,
  createOrder,
};
