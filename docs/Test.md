# Documentação e Implementação de Testes - Sistema "De Mala e Cuia"

Este documento detalha os pacotes necessários, os comandos para executar a suíte de testes do projeto (Backend e Frontend) e o código implementado para garantir a cobertura mínima de 80% e a execução dos testes End-to-End (E2E).

---

## 📦 1. Instalação e Dependências

Antes de rodar os testes, é necessário garantir que todas as dependências estejam instaladas corretamente. No terminal, na raiz do projeto, execute os seguintes comandos:

**1. Instalação geral das dependências:**
```bash
npm install
```

**2. Correção de dependências de teste:**
Alguns pacotes exigem versões específicas ou instalações manuais para funcionarem corretamente com o Jest nas versões mais recentes:
```bash
npm install supertest@latest --save-dev
npm install jest-environment-jsdom --save-dev
```
*(Nota: O `jest-environment-jsdom` é obrigatório para simular o DOM nos testes do frontend).*

**3. Instalação dos navegadores do Playwright (apenas na primeira vez):**
```bash
npx playwright install
```

---

## 🚀 2. Executando os Testes

O projeto utiliza duas ferramentas distintas para os testes: **Jest** (Unidade e Integração) e **Playwright** (E2E).

### Testes de Unidade e Integração (Jest)
Para rodar os testes internos do backend (serviços, controllers) e do frontend, execute:
```bash
npx jest
```

### Testes End-to-End / E2E (Playwright)
Para rodar os testes que simulam o comportamento real do usuário no navegador (ex: fluxo de compra, carrinho e checkout), execute:
```bash
npx playwright test
```
* São 4 testes E2E configurados no arquivo `shop.spec.js`.
* Para visualizar o relatório em HTML após a execução, use: `npx playwright show-report`.

---