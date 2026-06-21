# API

## Endpoints disponíveis

### GET /api/menu
Retorna a lista de itens ativos do cardápio.

### POST /api/menu
Cadastra um novo item consumível no cardápio.
Requer `password` no corpo da requisição.

### PUT /api/menu/:id
Atualiza o preço de um item do cardápio.
Requer `password` no corpo da requisição.

### DELETE /api/menu/:id
Remove um item do cardápio.
Requer `password` no corpo da requisição.

### POST /api/orders
Cria um pedido com os itens do carrinho.

### GET /api/orders/pending
Retorna pedidos pendentes.
