# 📊 Diagramas UML - Sistema de E-commerce de Biscoitos

## Diagrama 1: Diagrama de Classes

```mermaid
classDiagram
    class Produto {
        -id: int
        -name: string
        -description: string
        -price: decimal
        -emoji: string
        -isActive: boolean
        -updatedAt: timestamp
        +atualizarPreço(novoPreço)
        +ativar()
        +desativar()
    }

    class CarrinhoCompras {
        -itens: ItemCarrinho[]
        -clienteId: string
        +adicionarProduto(produto, quantidade)
        +removerProduto(produtoId)
        +atualizarQuantidade(produtoId, quantidade)
        +calcularSubtotal(): decimal
        +calcularFrete(): decimal
        +calcularTotal(): decimal
        +limpar()
        +obterItens(): ItemCarrinho[]
    }

    class ItemCarrinho {
        -produtoId: int
        -nome: string
        -precoUnitario: decimal
        -quantidade: int
        -subTotal: decimal
        +calcularSubTotal(): decimal
    }

    class Pedido {
        -id: int
        -status: string
        -subtotal: decimal
        -frete: decimal
        -total: decimal
        -dataCriacao: timestamp
        -itens: ItemPedido[]
        +criarDoCarrinho(carrinho)
        +enviarWhatsApp()
        +obterItens(): ItemPedido[]
    }

    class ItemPedido {
        -id: int
        -pedidoId: int
        -menuItemId: int
        -nomeProduto: string
        -precoUnitario: decimal
        -quantidade: int
        -totalLinha: decimal
    }

    class Vendedor {
        -id: int
        -nome: string
        -numeroWhatsApp: string
        -senhaAdmin: string
        +atualizarCardapio(produtos)
        +atualizarPrazos(prazos)
        +visualizarPedidos()
        +atualizarStatusPedido(pedidoId, novoStatus)
    }

    CarrinhoCompras "1" *-- "*" ItemCarrinho
    CarrinhoCompras "1" --> "*" Produto
    ItemCarrinho "1" --> "1" Produto
    Pedido "1" *-- "*" ItemPedido
    ItemPedido "1" --> "1" Produto
    Vendedor "1" --> "*" Produto
    Vendedor "1" --> "*" Pedido
```

### Descrição das Classes:

| Classe | Responsabilidade |
|--------|-----------------|
| **Produto** | Representa um item do cardápio com preço, descrição e status |
| **CarrinhoCompras** | Gerencia os produtos selecionados pelo cliente (persistido em localStorage) |
| **ItemCarrinho** | Um produto específico no carrinho com quantidade e preço |
| **Pedido** | Pedido finalizado com cálculo de subtotal, frete e total |
| **ItemPedido** | Detalhe de cada produto em um pedido (armazenado no PostgreSQL) |
| **Vendedor** | Admin que gerencia cardápio, prazos e pedidos |

---

## Diagrama 2: Diagrama de Casos de Uso

```mermaid
flowchart LR
    %% Atores Principais
    Cliente((Cliente))
    Vendedor((Vendedor/Admin))

    %% Ator Secundário (Sistemas Externos)
    WhatsApp((API do WhatsApp))

    %% Fronteira do Sistema
    subgraph SistemaEcommerce [Sistema de E-commerce de Biscoitos]
        direction TB
        UC1([UC1: Visualizar Cardápio])
        UC2([UC2: Adicionar ao Carrinho])
        UC3([UC3: Gerenciar Carrinho])
        UC4([UC4: Calcular Preço Total com Frete])
        UC5([UC5: Finalizar Pedido])
        
        UC6([UC6: Atualizar Cardápio])
        UC7([UC7: Atualizar Prazos de Entrega])
        UC8([UC8: Visualizar Pedidos Recebidos])
        UC9([UC9: Atualizar Status dos Pedidos])
    end

    %% Associações Primárias (Cliente)
    Cliente --- UC1
    Cliente --- UC2
    Cliente --- UC3
    Cliente --- UC5

    %% Relacionamento de Inclusão (Include)
    UC5 -.->|<< include >>| UC4

    %% Associações Primárias (Vendedor)
    Vendedor --- UC6
    Vendedor --- UC7
    Vendedor --- UC8
    Vendedor --- UC9

    %% Associações Secundárias (Sistemas Externos)
    UC5 --- WhatsApp

    %% Estilização para facilitar a leitura
    style Cliente fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    style Vendedor fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style WhatsApp fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style SistemaEcommerce fill:#fafafa,stroke:#9c27b0,stroke-width:2px,stroke-dasharray: 5 5
```

### Descrição dos Casos de Uso:

#### **Cliente (5 casos de uso)**
| UC | Caso de Uso | Descrição |
|----|-----------|-|
| **UC1** | Visualizar Cardápio | Cliente consulta todos os produtos disponíveis |
| **UC2** | Adicionar ao Carrinho | Cliente adiciona um produto ao carrinho |
| **UC3** | Gerenciar Carrinho | Cliente altera quantidades ou remove itens |
| **UC4** | Calcular Preço Total | Sistema calcula subtotal, frete (5% mín. R$ 10) e total |
| **UC5** | Finalizar Pedido | Cliente envia pedido via WhatsApp ao vendedor |

#### **Vendedor/Admin (4 casos de uso)**
| UC | Caso de Uso | Descrição |
|----|-----------|-|
| **UC6** | Atualizar Cardápio | Vendedor adiciona/edita produtos e imagens |
| **UC7** | Atualizar Prazos | Vendedor altera prazos de entrega e encomenda |
| **UC8** | Visualizar Pedidos | Vendedor consulta pedidos recebidos |
| **UC9** | Atualizar Status | Vendedor muda o status dos pedidos (pending → processando → enviado, etc.) |

---

## Fluxo de Dados do Sistema

```
CLIENTE                        SERVIDOR NODE.JS              BANCO DE DADOS (PostgreSQL)
   │                                │                                    │
   ├─ Visualiza cardápio ────────> GET /api/menu ────────────────────> SELECT * FROM menu_items
   │                                │                                    │
   ├─ Adiciona ao carrinho ──────> localStorage (browser-side)          │
   │   (sem servidor)               │                                    │
   │                                │                                    │
   ├─ Finaliza pedido ───────────> POST /api/orders ───────────────────> INSERT INTO orders
   │   via WhatsApp                 │                                    │
   │                                ├──> Envia WhatsApp ────────────>   (notificação externa)
   │                                │    ao vendedor                      │
   │                                │                                    │
   └─ Recebe link WhatsApp ────────┘                                    │
                                                                         │
VENDEDOR                       SERVIDOR NODE.JS              BANCO DE DADOS (PostgreSQL)
   │                                │                                    │
   ├─ Atualiza preço ───────────> PUT /api/menu/:id ────────────────> UPDATE menu_items
   │   (com senha)                  │                                    │
   │                                │                                    │
   └─ Visualiza pedidos ────────> GET /api/orders ────────────────────> SELECT * FROM orders
                                    │                                    │
                                    └──> JOIN com order_items ───────────
```

---

## Tecnologias Utilizadas

| Componente | Tecnologia |
|------------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js + Express |
| Banco de Dados | PostgreSQL |
| Persistência Client-side | localStorage |
| Integração Externa | WhatsApp API |
| Diagrama UML | Mermaid.js |

---

## Status das Histórias de Usuário

- ✅ Cliente visualiza cardápio
- ✅ Cliente monta carrinho de compras
- ✅ Cliente realiza pedido válido
- ✅ Pedido encaminhado por WhatsApp
- ✅ Pedidos registrados no PostgreSQL
- ✅ Vendedor atualiza cardápio
- ✅ Vendedor atualiza prazos
- ✅ Cardápio suporta imagens
- ✅ **Dois diagramas UML em Mermaid**
