const { query } = require('../db');

function parseFloatValue(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error('Preço inválido.');
  }
  return parsed;
}

async function fetchActiveMenuItems() {
  const result = await query(
    `SELECT id, name, description, price::float8 AS price, emoji
     FROM menu_items
     WHERE is_active = TRUE
     ORDER BY id;`,
  );
  return result.rows;
}

async function createMenuItem({ name, description, price, emoji }) {
  const validatedPrice = parseFloatValue(price);
  const result = await query(
    `INSERT INTO menu_items (name, description, price, emoji)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, price::float8 AS price, emoji;`,
    [name, description, validatedPrice, emoji || '🍪'],
  );
  return result.rows[0];
}

async function updateMenuPrice(id, newPrice) {
  const validatedPrice = parseFloatValue(newPrice);
  const result = await query(
    `UPDATE menu_items SET price = $1, updated_at = NOW()
     WHERE id = $2 RETURNING id, name, description, price::float8 AS price, emoji;`,
    [validatedPrice, id],
  );

  if (result.rowCount === 0) {
    const error = new Error('Produto não encontrado.');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
}

async function deleteMenuItem(id) {
  const result = await query('DELETE FROM menu_items WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    const error = new Error('Produto não encontrado.');
    error.status = 404;
    throw error;
  }
}

module.exports = {
  fetchActiveMenuItems,
  createMenuItem,
  updateMenuPrice,
  deleteMenuItem,
};
