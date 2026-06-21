# 🍪 De Mala e Cuia - Guia de Instalação e Execução

## Pré-requisitos

- **Node.js 18+** → https://nodejs.org
- **PostgreSQL 18** → https://www.postgresql.org/download/
- **Git** → https://git-scm.com

## Instalação Rápida

### 1. Clone o repositório
```bash
git clone <repo-url>
cd "TP1 ES"
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Banco de Dados (primeira vez apenas)

#### Criação do Usuário e Banco (Execute uma única vez)

**Windows (PowerShell como administrador):**
```powershell
$env:PGPASSWORD="<sua-senha-postgres>"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "DROP DATABASE IF EXISTS cookie_shop;"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "DROP USER IF EXISTS demalaecuia;"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "CREATE USER demalaecuia WITH PASSWORD 'ProjetoES';"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "CREATE DATABASE cookie_shop OWNER demalaecuia;"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -d cookie_shop -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO demalaecuia; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO demalaecuia;"
```

**Linux/Mac:**
```bash
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "DROP DATABASE IF EXISTS cookie_shop;"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "DROP USER IF EXISTS demalaecuia;"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "CREATE USER demalaecuia WITH PASSWORD 'ProjetoES';"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "CREATE DATABASE cookie_shop OWNER demalaecuia;"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -d cookie_shop -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO demalaecuia; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO demalaecuia;"
```

## Execução

### Windows
Execute o script para iniciar o servidor com as variaveis de ambiente do projeto:
```bash
.\iniciar-com-postgres.bat
```

### Linux/Mac
```bash
chmod +x iniciar-com-postgres.sh
./iniciar-com-postgres.sh
```

## Acesso

Abra em seu navegador: **http://localhost:3000**

---

## Credenciais do Banco

```
Host: 127.0.0.1
Port: 5432
User: demalaecuia
Password: ProjetoES
Database: cookie_shop
```

## Customização (Opcional)

Para alterar o número de WhatsApp dos pedidos, edite o arquivo `.env` na raiz:

```
WHATSAPP_PHONE=5511999999999
```

Se não configurar, usa `5533998351907` (padrão).

## Troubleshooting

| Problema | Solução |
|----------|---------|
| PostgreSQL não conecta | Verifique se está rodando: `systemctl status postgresql` (Linux) ou Services (Windows). Reinicie se necessário. |
| Erro de autenticação PostgreSQL | Verifique se a senha do usuário está correta. Execute os comandos do passo 3 para recriar o usuário. |
| Usuário ou banco não existe | Execute os comandos do passo 3 ("Criação do Usuário e Banco") |
| npm install falha | Execute: `rm -r node_modules package-lock.json` e depois `npm install` novamente |
| Porta 3000 ocupada | Mude em `server.js` ou feche a aplicação que está usando a porta |
| Erro ao conectar no servidor | Certifique-se que PostgreSQL está rodando antes de iniciar o servidor Node |

## Referência Rápida

### Comandos Úteis

**Windows (PowerShell):**
```powershell
# Verificar se PostgreSQL está rodando
Get-Service postgresql-x64-18

# Reiniciar PostgreSQL
Restart-Service -Name "postgresql-x64-18" -Force

# Conectar ao banco
$env:PGPASSWORD="ProjetoES"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U demalaecuia -h 127.0.0.1 -p 5432 -d cookie_shop
```

**Linux/Mac:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Conectar ao banco
psql -U demalaecuia -h 127.0.0.1 -p 5432 -d cookie_shop
```

---

## Desenvolvido para Projeto Em Grupo

Este projeto foi desenvolvido para ser usado por um time de desenvolvedores. Certifique-se de que todos seguem os passos 1-3 de instalação antes de executar o servidor.
