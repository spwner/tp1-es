# 🍪 Biscoitaria Delícia - Loja de Biscoitos Online

Um template de página web para venda de biscoitos construído com **Node.js**, **Express** e **JavaScript vanilla**.

## 📋 Características

- ✨ **Design Responsivo** - Funciona em desktop, tablet e mobile
- 🎨 **Estilo Moderno** - Cores quentes e layout atrativo
- 🛒 **Cartões de Produtos** - Exibição dinâmica de biscoitos com imagens (emojis), descrição e preço
- 📧 **Rodapé com Contato** - Email e telefone da loja
- 🔤 **Nome da Loja no Header** - "DELÍCIA" exibido no canto superior direito
- 💻 **JavaScript Interativo** - Adicionar produtos ao carrinho e busca de produtos

## 📁 Estrutura do Projeto

```
.
├── server.js          # Servidor Express
├── package.json       # Dependências do projeto
└── Main/
    ├── index.html     # Página principal
    ├── styles.css     # Estilos CSS
    └── script.js      # Lógica JavaScript
```

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```

### 3. Acessar a Página
Abra seu navegador e acesse:
```
http://localhost:3000
```

## 🎯 Funcionalidades

### Header
- Logo da loja com emoji de biscoito
- Nome da loja "DELÍCIA" no canto superior direito

### Seção Principal
- Banner de boas-vindas
- Grid responsivo de cartões de biscoitos

### Cartões de Produtos
Cada cartão contém:
- Emoji representativo (substituindo imagem)
- Nome do biscoito
- Descrição
- Preço
- Botão "Adicionar ao carrinho"

### Produtos Disponíveis
1. Biscoito de Chocolate - R$ 12,90
2. Biscoito de Baunilha - R$ 10,90
3. Biscoito de Morango - R$ 11,90
4. Biscoito de Aveia - R$ 9,90
5. Biscoito de Amendoim - R$ 13,90
6. Biscoito de Canela - R$ 11,90
7. Biscoito de Mel - R$ 14,90
8. Biscoito de Coco - R$ 12,90

### Rodapé
- Email: contato@biscoitaria.com
- Telefone: (11) 3214-5678
- Informações de copyright

## 🎨 Customização

### Adicionar Novos Biscoitos
Edite o array `products` em `Main/script.js`:

```javascript
{
  id: 9,
  name: "Nome do Biscoito",
  description: "Descrição do biscoito",
  price: "R$ X,XX",
  emoji: "🍪"
}
```

### Mudar Nome da Loja
Edite em `Main/index.html`:
```html
<div class="shop-name">SEU_NOME_AQUI</div>
```

### Alterar Email e Telefone
Edite em `Main/index.html` na seção footer:
```html
<p>📧 Email: <a href="mailto:seu-email@dominio.com">seu-email@dominio.com</a></p>
<p>📞 Telefone: <a href="tel:+55XXXXXXXXXX">(XX) XXXX-XXXX</a></p>
```

### Mudar Cores
Edite as cores no `Main/styles.css`:
- Cor principal: `#d4a574` (ouro/marrom claro)
- Cor secundária: `#c9915a` (marrom médio)

## 📱 Responsividade

O layout é totalmente responsivo:
- **Desktop**: 3-4 colunas de cartões
- **Tablet**: 2 colunas de cartões
- **Mobile**: 1 coluna de cartão

## 🔧 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript server-side
- **Express.js** - Framework web minimalista
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos e animações
- **JavaScript Vanilla** - Sem dependências de framework

## 💡 Próximos Passos (Sugestões)

- Adicionar um carrinho de compras funcional
- Integrar com banco de dados para persistência
- Adicionar sistema de autenticação de usuários
- Criar página de checkout
- Adicionar imagens reais dos produtos
- Implementar busca e filtros avançados
- Adicionar sistema de avaliações e comentários

## 📄 Licença

Este projeto é gratuito e pode ser usado para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ para a Biscoitaria Delícia**
