const { pool, query } = require('../db');

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

async function fetchPendingOrders() {
  const result = await query(
    `SELECT
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
          ) ORDER BY oi.id
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status = 'pending'
    GROUP BY o.id
    ORDER BY o.created_at DESC;`,
  );

  return result.rows;
}

async function createOrder(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Pedido inválido: itens obrigatórios.');
    error.status = 400;
    throw error;
  }

  const normalizedItems = items
    .map((item) => ({ id: Number(item.id), quantity: Number(item.quantity) }))
    .filter((item) => Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0);

  if (normalizedItems.length !== items.length) {
    const error = new Error('Pedido inválido: itens com formato incorreto.');
    error.status = 400;
    throw error;
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.id))];
  const productResult = await query(
    `SELECT id, name, price::float8 AS price
     FROM menu_items
     WHERE is_active = TRUE AND id = ANY($1::int[]);`,
    [productIds],
  );

  if (productResult.rowCount !== productIds.length) {
    const error = new Error('Pedido inválido: produto inexistente ou inativo.');
    error.status = 400;
    throw error;
  }

  const productsById = new Map(productResult.rows.map((row) => [row.id, row]));
  const pricedItems = normalizedItems.map((item) => {
    const product = productsById.get(item.id);
    const lineTotal = roundCurrency((product.price * item.quantity) / 1000);

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
      `INSERT INTO orders (status, subtotal, shipping, total)
       VALUES ('pending', $1, $2, $3)
       RETURNING id, status, subtotal::float8 AS subtotal, shipping::float8 AS shipping, total::float8 AS total, created_at;`,
      [subtotal, shipping, total],
    );

    const order = orderResult.rows[0];
    for (const item of pricedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [order.id, item.menuItemId, item.name, item.unitPrice, item.quantity, item.lineTotal],
      );
    }

    await client.query('COMMIT');

    return {
      orderId: order.id,
      status: order.status,
      createdAt: order.created_at,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      items: pricedItems,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  fetchPendingOrders,
  createOrder,
};
