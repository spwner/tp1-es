const { query } = require('./index');

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

async function seedMenuItems() {
  const countResult = await query('SELECT COUNT(*)::int AS count FROM menu_items;');
  const currentCount = countResult.rows[0]?.count || 0;

  if (currentCount === 0) {
    for (const item of seedMenu) {
      await query(
        `INSERT INTO menu_items (name, description, price, emoji) VALUES ($1, $2, $3, $4);`,
        [item.name, item.description, item.price, item.emoji],
      );
    }
  }
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

  await seedMenuItems();
}

module.exports = { ensureDatabase, seedMenuItems };
