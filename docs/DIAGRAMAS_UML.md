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
graph TB
    Cliente((Cliente))
    Vendedor((Vendedor/Admin))
    Sistema[Sistema de E-commerce]
    
    Cliente -->|UC1| VisualizarCardapio["Visualizar Cardápio"]
    Cliente -->|UC2| AdicionarCarrinho["Adicionar Produto ao Carrinho"]
    Cliente -->|UC3| GerenciarCarrinho["Gerenciar Carrinho<br/>- Aumentar/Diminuir Quantidade<br/>- Remover Itens"]
    Cliente -->|UC4| CalcularPreços["Calcular Preço Total<br/>com Frete"]
    Cliente -->|UC5| FinalizarPedido["Finalizar Pedido<br/>via WhatsApp"]
    
    Vendedor -->|UC6| AtualizarCardapio["Atualizar Cardápio<br/>- Adicionar Produtos<br/>- Atualizar Preços<br/>- Adicionar Imagens"]
    Vendedor -->|UC7| AtualizarPrazos["Atualizar Prazos<br/>de Entrega"]
    Vendedor -->|UC8| VisualizarPedidos["Visualizar Pedidos<br/>Recebidos"]
    Vendedor -->|UC9| AtualizarStatusPedido["Atualizar Status<br/>dos Pedidos"]
    
    VisualizarCardapio -->|inclui| Sistema
    AdicionarCarrinho -->|inclui| Sistema
    GerenciarCarrinho -->|inclui| Sistema
    CalcularPreços -->|inclui| Sistema
    FinalizarPedido -->|inclui| Sistema
    AtualizarCardapio -->|inclui| Sistema
    AtualizarPrazos -->|inclui| Sistema
    VisualizarPedidos -->|inclui| Sistema
    AtualizarStatusPedido -->|inclui| Sistema
    
    FinalizarPedido -.->|gera| NotificacaoWhatsApp["Notificação<br/>WhatsApp"]
    
    style Cliente fill:#e1f5ff
    style Vendedor fill:#fff3e0
    style Sistema fill:#f3e5f5
    style NotificacaoWhatsApp fill:#ffebee
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
