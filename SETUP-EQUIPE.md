# 🍪 Guia de Configuração para o Time

## Olá! 👋

Este arquivo foi criado especificamente para ajudar o time a configurar o projeto corretamente.
Siga os passos abaixo uma **única vez** durante a configuração inicial.

---

## ⚡ Configuração Rápida (5 minutos)

### 1️⃣ **Clone e Instale**

```bash
git clone <repo-url>
cd "TP1 ES"
npm install
```

### 2️⃣ **Configure PostgreSQL** 

**Importante:** Cada pessoa do time precisa fazer isto no proprio computador (ou usar um banco compartilhado ja pronto).

#### Windows (PowerShell como administrador):

```powershell
# Crie o usuário e banco:
$env:PGPASSWORD="<sua-senha-do-postgres>"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "DROP DATABASE IF EXISTS cookie_shop;"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "DROP USER IF EXISTS demalaecuia;"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "CREATE USER demalaecuia WITH PASSWORD 'ProjetoES';"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -c "CREATE DATABASE cookie_shop OWNER demalaecuia;"
& "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h 127.0.0.1 -p 5432 -d cookie_shop -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO demalaecuia; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO demalaecuia;"
```

#### Linux/Mac (Terminal):

```bash
# Crie o usuário e banco:
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "DROP DATABASE IF EXISTS cookie_shop;"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "DROP USER IF EXISTS demalaecuia;"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "CREATE USER demalaecuia WITH PASSWORD 'ProjetoES';"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -c "CREATE DATABASE cookie_shop OWNER demalaecuia;"
sudo -u postgres psql -h 127.0.0.1 -p 5432 -d cookie_shop -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO demalaecuia; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO demalaecuia;"
```

### 3️⃣ **Pronto!**

Agora todos podem iniciar o servidor:

```bash
# Windows
.\iniciar-com-postgres.bat

# Linux/Mac
chmod +x iniciar-com-postgres.sh
./iniciar-com-postgres.sh
```

Acesse: **http://localhost:3000**

---

## 🚨 Checklist de Configuração

- [ ] Node.js instalado (`node --version` deve retornar v18+)
- [ ] npm instalado (`npm --version`)
- [ ] PostgreSQL 18 instalado e rodando
- [ ] Nao foi necessario editar `pg_hba.conf` (usar configuracao padrao com senha)
- [ ] Usuário `demalaecuia` criado no PostgreSQL
- [ ] Banco `cookie_shop` criado
- [ ] Arquivo `.env` criado (o script faz automático)
- [ ] `npm install` executado

---

## ❓ Dúvidas Frequentes

**P: Qual a senha do usuário demalaecuia?**
R: A senha é `ProjetoES` (definida na configuração).

**P: Recebi erro "password authentication failed"?**
R: Execute novamente os comandos de criação do usuário do passo 2 (talvez a senha tenha se perdido ao resetar o PostgreSQL).

**P: PostgreSQL não inicia?**
R: Windows: `Get-Service postgresql-x64-18` | Linux: `sudo systemctl start postgresql`

**P: Porta 3000 já está em uso?**
R: Execute `npm start` em uma porta diferente: `PORT=3001 npm start`

---

## 📞 Suporte

Consulte `QUICKSTART.md` para instruções mais detalhadas ou `README.md` para informações do projeto.

Boa sorte! 🍪✨
