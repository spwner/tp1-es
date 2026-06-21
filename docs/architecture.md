# Arquitetura do Projeto

Este projeto foi organizado em camadas claras para separar frontend, backend e documentação.

## Estrutura proposta

- `backend/`
  - `src/`
    - `server.js` - inicializa a aplicação
    - `app.js` - configura o Express, rotas, middleware e arquivos estáticos
    - `routes/` - define roteadores REST separados
    - `controllers/` - manipula requisições e respostas
    - `services/` - contém regras de negócio e transações
    - `db/` - conecta ao PostgreSQL e inicializa tabelas/seed
    - `middleware/` - validações e tratamento de erros
    - `utils/` - utilitários compartilhados

- `frontend/`
  - `public/` - HTML, CSS, imagens e scripts estáticos
  - `src/` - módulos de frontend reutilizáveis e organização futura

- `docs/` - documentação de arquitetura, API e setup

## Princípios aplicados

- separação de responsabilidades (SoC)
- camadas de abstração para acesso a dados, regras de negócio e controle de requisição
- modularização de rotas e serviços para facilitar testes
- uso de middleware para validação e autenticação
