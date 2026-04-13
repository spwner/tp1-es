@echo off
REM Script de inicialização para Windows
REM Configura variáveis de ambiente e inicia o servidor Node

echo.
echo ========================================
echo De Mala e Cuia - Servidor
echo ========================================
echo.

REM Configurar variáveis de ambiente para PostgreSQL
set PGHOST=127.0.0.1
set PGPORT=5432
set PGUSER=demalaecuia
set PGPASSWORD=ProjetoES
set PGDATABASE=cookie_shop

echo Configuracao:
echo   Host: %PGHOST%
echo   Porta: %PGPORT%
echo   Usuario: %PGUSER%
echo   Banco: %PGDATABASE%
echo.

REM Verificar se .env existe, senao criar
if not exist .env (
    echo Criando arquivo .env...
    (
        echo # Configuracao do PostgreSQL
        echo PGHOST=%PGHOST%
        echo PGPORT=%PGPORT%
        echo PGUSER=%PGUSER%
        echo PGPASSWORD=ProjetoES
        echo PGDATABASE=%PGDATABASE%
        echo.
        echo # WhatsApp
        echo WHATSAPP_PHONE=5531998351907
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env
    echo .env criado com sucesso!
)

echo.
echo Iniciando servidor em http://localhost:3000
echo.

npm.cmd start

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao iniciar o servidor
    echo Verifique:
    echo   1. PostgreSQL esta rodando?
    echo   2. Arquivo .env esta correto?
    echo   3. As dependencias foram instaladas: npm install
    echo.
    pause
)

exit /b %errorlevel%
