#!/bin/bash

# Script de inicialização para Linux/Mac
# Inicia o servidor Node.js com PostgreSQL

echo ""
echo "========================================"
echo "De Mala e Cuia - Servidor Node"
echo "========================================"
echo ""

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ ERRO: Node.js não encontrado"
    echo "Instale em: https://nodejs.org"
    exit 1
fi

# Verifica se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ ERRO: npm não encontrado"
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Verifica se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ ERRO: PostgreSQL não encontrado"
    echo "Instale com:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql"
    echo "  Mac: brew install postgresql"
    exit 1
fi

echo "✅ PostgreSQL encontrado"
echo ""

# Configurar variáveis de ambiente
export PGHOST="127.0.0.1"
export PGPORT="5432"
export PGUSER="demalaecuia"
export PGPASSWORD="ProjetoES"
export PGDATABASE="cookie_shop"

echo "Testando conexão PostgreSQL..."
echo "  Host: $PGHOST"
echo "  Porta: $PGPORT"
echo "  Usuario: $PGUSER"
echo "  Banco: $PGDATABASE"
echo ""

# Tenta conectar com as credenciais da aplicacao
if PGPASSWORD="$PGPASSWORD" psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -c "SELECT 1" &> /dev/null; then
    echo "✅ Conectado ao PostgreSQL com o usuario da aplicacao"
    echo ""
else
    echo "❌ ERRO: Não consegui conectar ao PostgreSQL"
    echo ""
    echo "Verifique:"
    echo "  1. Se PostgreSQL está rodando:"
    echo "     - Ubuntu/Debian: sudo systemctl start postgresql"
    echo "     - Mac: brew services start postgresql"
    echo ""
    echo "  2. Se o usuario/senha do projeto foram criados (veja QUICKSTART.md)"
    echo ""
    echo "  3. Se a porta 5432 está aberta: sudo lsof -i :5432"
    echo ""
    exit 1
fi

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "Criando arquivo .env..."
    cat > .env << EOF
# Configuracao do PostgreSQL
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=demalaecuia
PGPASSWORD=ProjetoES
PGDATABASE=cookie_shop

# WhatsApp
WHATSAPP_PHONE=5533998351907

# Environment
NODE_ENV=development
EOF
    echo "✅ .env criado com sucesso"
    echo ""
fi

echo "========================================"
echo "Iniciando servidor em http://localhost:3000"
echo "========================================"
echo ""

# Inicia o servidor
npm start

echo ""
echo "Servidor encerrado."
