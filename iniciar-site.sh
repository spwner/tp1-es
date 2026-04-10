#!/usr/bin/env bash

set -u

echo "=========================================="
echo "Iniciando a loja de biscoitos"
echo "=========================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[ERRO] Node.js nao encontrado no PATH."
  echo "Instale o Node.js em: https://nodejs.org/"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERRO] npm nao encontrado no PATH."
  echo "Reinstale o Node.js para incluir o npm."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Dependencias nao encontradas. Instalando..."
  npm install
  if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependencias."
    exit 1
  fi
fi

echo "Servidor iniciado em http://localhost:3000"
echo "Para encerrar, pressione Ctrl + C neste terminal."
echo

node server.js
