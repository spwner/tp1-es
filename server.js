const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('Main'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Main', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
