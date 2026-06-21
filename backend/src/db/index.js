const { Pool } = require('pg');
require('dotenv').config(); // Carrega variáveis do .env se existir

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };
  }

  return {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'DeMalaECuia',
    password: process.env.PGPASSWORD || 'ProjetoES',
    database: process.env.PGDATABASE || 'cookie_shop',
  };
}

const pool = new Pool(buildPoolConfig());

function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};
