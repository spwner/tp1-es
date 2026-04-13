const express = require('express');
const path = require('path');
const { pool, query } = require('./db');
const app = express();
const PORT = 3000;

app.use(express.static('Main'));
app.use(express.json());

const seedMenu = [
  { name: 'Sequilhos Tradicional', description: 'Sequilhos Tradicional', price: 70, emoji: '🍫' },
  { name: 'Sequilhos de Limão', description: 'Sequilhos de Limão', price: 75, emoji: '🍦' },
  { name: 'Sequilhos de Maracujá', description: 'Sequilhos de Maracujá', price: 75, emoji: '🍓' },
  { name: 'Sequilhos de Canela', description: 'Sequilhos de Canela', price: 80, emoji: '🌾' },
  { name: 'Sequilhos com Gotas de Chocolate', description: 'Sequilhos com Gotas de Chocolate', price: 90, emoji: '🥜' },
  { name: 'Sequilhos de Côco', description: 'Sequilhos de Côco', price: 90, emoji: '✨' },
  { name: 'Sequilhos Diet', description: 'Sequilhos Diet', price: 90, emoji: '🍯' },
  { name: 'Biscoitos Amanteigados (com Raspas de Limão)', description: 'Biscoitos Amanteigados (com Raspas de Limão)', price: 85, emoji: '🥥' },
  { name: 'Biscoitos de Cappuccino', description: 'Biscoitos de Cappuccino', price: 90, emoji: '🍫' },
  { name: 'Biscoitos de Paçoquita', description: 'Biscoitos de Paçoquita', price: 90, emoji: '🍦' },
  { name: 'Biscoitos de Chocolate', description: 'Biscoitos de Chocolate', price: 90, emoji: '🍓' },
  { name: 'Biscoitos de Café', description: 'Biscoitos de Café', price: 90, emoji: '🌾' },
  { name: 'Biscoitos de Limão', description: 'Biscoitos de Limão', price: 90, emoji: '🥜' },
  { name: 'Biscoitos de Maracujá', description: 'Biscoitos de Maracujá', price: 90, emoji: '✨' },
  { name: 'Biscoitos de Nutella', description: 'Biscoitos de Nutella', price: 90, emoji: '🍯' },
  { name: 'Biscoitos de Ninho com Leite Condensado', description: 'Biscoitos de Ninho com Leite Condensado', price: 105, emoji: '🥥' },
  { name: 'Biscoitos Diet', description: 'Biscoitos Diet', price: 105, emoji: '🍫' },
  { name: 'Biscoitos Amanteigados (com Ovomaltine)', description: 'Biscoitos Amanteigados (com Ovomaltine)', price: 105, emoji: '🍦' },
  { name: 'Biscoitos de Laranja com Chocolate', description: 'Biscoitos de Laranja com Chocolate', price: 105, emoji: '🍓' },
  { name: 'Biscoitos de Amêndoas', description: 'Biscoitos de Amêndoas', price: 110, emoji: '🌾' },
  { name: 'Biscoitos de Damasco', description: 'Biscoitos de Damasco', price: 110, emoji: '🥜' },
  { name: 'Biscoitos de Pistache', description: 'Biscoitos de Pistache', price: 120, emoji: '✨' },
  { name: 'Biscoitos Red Velvet', description: 'Biscoitos Red Velvet', price: 120, emoji: '🍯' },
];

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

async function ensureDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      emoji TEXT NOT NULL DEFAULT '🍪',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      subtotal NUMERIC(10, 2) NOT NULL,
      shipping NUMERIC(10, 2) NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      menu_item_id INTEGER REFERENCES menu_items(id),
      item_name TEXT NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      line_total NUMERIC(10, 2) NOT NULL
    );
  `);

  const countResult = await query('SELECT COUNT(*)::int AS count FROM menu_items;');
  const currentCount = countResult.rows[0].count;

  if (currentCount === 0) {
    for (const item of seedMenu) {
      await query(
        `
          INSERT INTO menu_items (name, description, price, emoji)
          VALUES ($1, $2, $3, $4);
        `,
        [item.name, item.description, item.price, item.emoji],
      );
    }
    console.log('Cardapio inicial inserido no PostgreSQL.');
  }
}

app.get('/api/config', (req, res) => {
  res.json({
    whatsappPhone: process.env.WHATSAPP_PHONE || '5531973242222',
  });
});

app.get('/api/menu', async (req, res) => {
  try {
    const result = await query(
      `
        SELECT id, name, description, price::float8 AS price, emoji
        FROM menu_items
        WHERE is_active = TRUE
        ORDER BY id;
      `,
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar cardapio:', error);
    res.status(500).json({ error: 'Falha ao carregar cardapio.' });
  }
});

app.get('/api/orders/pending', async (req, res) => {
  try {
    const result = await query(
      `
        SELECT
          o.id,
          o.status,
          o.subtotal::float8 AS subtotal,
          o.shipping::float8 AS shipping,
          o.total::float8 AS total,
          o.created_at,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', oi.id,
                'menuItemId', oi.menu_item_id,
                'name', oi.item_name,
                'unitPrice', oi.unit_price::float8,
                'quantity', oi.quantity,
                'lineTotal', oi.line_total::float8
              )
              ORDER BY oi.id
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'::json
          ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status = 'pending'
        GROUP BY o.id
        ORDER BY o.created_at DESC;
      `,
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos pendentes:', error);
    res.status(500).json({ error: 'Falha ao carregar pedidos pendentes.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const items = req.body?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Pedido invalido: itens obrigatorios.' });
  }

  const normalizedItems = items
    .map((item) => ({ id: Number(item.id), quantity: Number(item.quantity) }))
    .filter((item) => Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0);

  if (normalizedItems.length !== items.length) {
    return res.status(400).json({ error: 'Pedido invalido: itens com formato incorreto.' });
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.id))];

  try {
    const productResult = await query(
      `
        SELECT id, name, price::float8 AS price
        FROM menu_items
        WHERE is_active = TRUE AND id = ANY($1::int[]);
      `,
      [productIds],
    );

    if (productResult.rowCount !== productIds.length) {
      return res.status(400).json({ error: 'Pedido invalido: produto inexistente ou inativo.' });
    }

    const productsById = new Map(productResult.rows.map((row) => [row.id, row]));
    const pricedItems = normalizedItems.map((item) => {
      const product = productsById.get(item.id);
      const lineTotal = roundCurrency(product.price * item.quantity);

      return {
        menuItemId: item.id,
        name: product.name,
        unitPrice: roundCurrency(product.price),
        quantity: item.quantity,
        lineTotal,
      };
    });

    const subtotal = roundCurrency(pricedItems.reduce((sum, item) => sum + item.lineTotal, 0));
    const shipping = roundCurrency(Math.max(subtotal * 0.05, 10));
    const total = roundCurrency(subtotal + shipping);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `
          INSERT INTO orders (status, subtotal, shipping, total)
          VALUES ('pending', $1, $2, $3)
          RETURNING id, status, subtotal::float8 AS subtotal, shipping::float8 AS shipping, total::float8 AS total, created_at;
        `,
        [subtotal, shipping, total],
      );

      const order = orderResult.rows[0];

      for (const item of pricedItems) {
        await client.query(
          `
            INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
          [order.id, item.menuItemId, item.name, item.unitPrice, item.quantity, item.lineTotal],
        );
      }

      await client.query('COMMIT');

      return res.status(201).json({
        orderId: order.id,
        status: order.status,
        createdAt: order.created_at,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        items: pricedItems,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ error: 'Falha ao salvar pedido.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Main', 'index.html'));
});

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao inicializar banco PostgreSQL:', error);
    process.exit(1);
  });
