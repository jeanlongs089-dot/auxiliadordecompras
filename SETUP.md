# Auxiliador de Compras

Transforme a experiência de compras no supermercado com tecnologia inteligente e moderna.

## 🚀 Começando

### 1. Configure o Supabase

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL do projeto e a chave anon (anon key)

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Preencha com os valores do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=CHAVE_PUBLICA_ANON
```

### 3. Configure o banco de dados

Execute a migration no seu projeto Supabase:

```sql
-- Copie o conteúdo de supabase/migrations/20231123000000_initial_schema.sql
-- e execute no SQL Editor do Supabase
```

### 4. Instale e execute

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📋 Funcionalidades

- ✅ Listas de compras inteligentes
- ✅ Catálogo de produtos com preços
- ✅ Mapa interativo da loja
- ✅ Autenticação de usuários
- ✅ Painel administrativo
- ✅ Analytics básico

## 🎯 Benefícios para Supermercados

- Redução de filas
- Aumento do ticket médio
- Diferencial competitivo
- Dados sobre comportamento do cliente
- Maior engajamento e fidelização
## 🌐 Deploy na Vercel (trocar conta)
1. Instale a CLI da Vercel:
   - `npm i -g vercel`
2. Faça login na NOVA conta/equipe:
   - `vercel login` e confirme o e‑mail
   - Alternativa não‑interativa: definir `VERCEL_TOKEN` como variável de ambiente
3. Vincule o projeto local à nova conta:
   - `vercel link` e selecione a equipe certa
   - Escolha ou crie o projeto (ex.: auxiliadordecompras)
4. Configure variáveis de ambiente no projeto Vercel:
   - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nos ambientes Preview/Production
5. Faça o primeiro deploy:
   - `vercel` (Preview) e `vercel --prod` (Production)
6. Atribua o domínio:
   - Em Project → Settings → Domains, adicione `auxiliadordecompras.com`
   - Opcional: adicionar `www.auxiliadordecompras.com` com redirecionamento para a raiz
7. SPA e roteamento:
   - O arquivo `vercel.json` já contém rewrites para SPA
8. Validação:
   - Acesse https://auxiliadordecompras.com e verifique SSL, rotas e redirects
