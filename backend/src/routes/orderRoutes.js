const express = require('express');
const { getPendingOrders, createOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/pending', getPendingOrders);
router.post('/', createOrder);

module.exports = router;
