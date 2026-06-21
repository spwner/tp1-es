const express = require('express');
const path = require('path');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { ensureDatabase } = require('./db/setup');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/src', express.static(path.join(__dirname, '../../frontend/src')));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config', (req, res) => {
  res.json({
    whatsappPhone: process.env.WHATSAPP_PHONE || '5533998351907',
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app, ensureDatabase };
