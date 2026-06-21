# Setup do Projeto

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure variáveis de ambiente em um arquivo `.env` na raiz do projeto:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=DeMalaECuia
PGPASSWORD=ProjetoES
PGDATABASE=cookie_shop
ADMIN_PASSWORD=suasenhaadmin
WHATSAPP_PHONE=5533998351907
```

3. Execute o servidor:

```bash
npm start
```

4. Acesse:

- `http://localhost:3000` para a loja
- `http://localhost:3000/admin` para o painel administrativo

## Observações
- O backend cria as tabelas e insere o cardápio inicial automaticamente.
- O frontend está em `frontend/public/`.
