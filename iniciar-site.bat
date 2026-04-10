@echo off
setlocal

echo ==========================================
echo Iniciando a loja de biscoitos
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado no PATH.
  echo Instale o Node.js em: https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Dependencias nao encontradas. Instalando...
  where npm.cmd >nul 2>&1
  if errorlevel 1 (
    echo [ERRO] npm nao encontrado no PATH.
    echo Reinstale o Node.js para incluir o npm.
    echo.
    pause
    exit /b 1
  )

  call npm.cmd install
  if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias.
    echo.
    pause
    exit /b 1
  )
)

echo Servidor iniciado em http://localhost:3000
echo Para encerrar, pressione Ctrl + C neste terminal.
echo.
node server.js

endlocal
