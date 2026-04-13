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

# Tenta conectar
if psql -U postgres -h 127.0.0.1 -p 5432 -c "SELECT 1" &> /dev/null; then
    echo "✅ Conectado ao PostgreSQL"
    echo ""
    
    # Verifica se o usuário existe
    if ! psql -U postgres -h 127.0.0.1 -p 5432 -t -c "SELECT 1 FROM pg_user WHERE usename = 'demalaecuia'" 2>/dev/null | grep -q 1; then
        echo "⚠️ Criando usuário 'demalaecuia'..."
        psql -U postgres -h 127.0.0.1 -p 5432 -c "CREATE USER demalaecuia;" 2>/dev/null || true
        echo "✅ Usuario criado"
    else
        echo "✅ Usuario 'demalaecuia' encontrado"
    fi
    
    # Verifica se o banco existe
    if psql -U postgres -h 127.0.0.1 -p 5432 -l | grep -q "cookie_shop"; then
        echo "✅ Banco 'cookie_shop' encontrado"
    else
        echo "Criando banco 'cookie_shop'..."
        psql -U postgres -h 127.0.0.1 -p 5432 -c "CREATE DATABASE cookie_shop OWNER demalaecuia;" 2>/dev/null || true
        echo "✅ Banco criado"
    fi
    
    echo ""
else
    echo "❌ ERRO: Não consegui conectar ao PostgreSQL"
    echo ""
    echo "Verifique:"
    echo "  1. Se PostgreSQL está rodando:"
    echo "     - Ubuntu/Debian: sudo systemctl start postgresql"
    echo "     - Mac: brew services start postgresql"
    echo ""
    echo "  2. Se o arquivo /etc/postgresql/18/main/pg_hba.conf está configurado"
    echo "     com 'trust' para conexões locais (veja QUICKSTART.md)"
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
WHATSAPP_PHONE=5531973242222

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
