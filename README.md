# tp1-es

## Integrantes
- Caio Cordeiro Fabri (full)
- Davi Oliveira Sad (full)
- Giordano Henrique Liporati (front)
- João Gabriel Guimarães Alves Vaz (back)

## Objetivo
Desenvolver uma platforma para auxiliar a comunicação entre possíveis compradores e vendedores de biscoitos, permitindo a seleção e avaliação dos produtos disponíveis assim como prazos de entrega e de encomenda. O site deve ser hospedado em domínio gerenciado pelo vendedor, que possui acesso a ferramentas para a atualização dos dados do serviço.

## Tecnologias
- Linguagem: Javascript
- Framework: Node.js
- Banco de Dados: PostgreSQL
- Agente de IA: Github Copilot, Gemini

## Histórias de usuário
- [x] Cliente precisa visualizar o cardápio Giordano
- [x] Cliente precisa montar um carrinho de compras Joao
- [x] Cliente precisa realizar um pedido válido para o vendedor Caio
- [x] Pedido precisa ser encaminhado por WhatsApp para o vendedor Joao
- [X] Pedidos precisam ser registrados no banco de dados Davi
- [ ] Cliente precisa consultar os prazos de entrega e de encomenda Davi
- [x] Vendedor pode atualizar o cardápio Caio   
- [x] Vendedor pode atualizar os prazos Caio
- [x] Cardápio deve suportar imagens dos produtos Caio
- [ ] Vendedor precisa ter acesso restrito as páginas de edição Davi
- [ ] Cliente e vendedor querem poder usar o tema escuro (geeglo inspired) Giordano

## TODO
- [ ] Dois diagramas UML em Mermaid

## Execucao rapida (Windows)
1. Abra a pasta do projeto.
2. Execute `npm install` (apenas na primeira vez).
3. Rode `iniciar-com-postgres.bat`.
4. Abra `http://localhost:3000` no navegador.

Para encerrar o servidor, use `Ctrl + C` no terminal.

## Execucao rapida (Linux)
1. No terminal, entre na pasta do projeto.
2. Rode `npm install` (apenas na primeira vez).
3. Rode `chmod +x iniciar-com-postgres.sh` (apenas na primeira vez).
4. Rode `./iniciar-com-postgres.sh`.
5. Abra `http://localhost:3000` no navegador.

Para encerrar o servidor, use `Ctrl + C` no terminal.
