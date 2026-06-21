require('dotenv').config();
const { app, ensureDatabase } = require('./app');

const PORT = process.env.PORT || 3000;

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
