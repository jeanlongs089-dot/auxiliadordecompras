# Auxiliador de Compras

Transforme a experiência de compras no supermercado com tecnologia inteligente e moderna.

## 🚀 Começando

### 1. Configure o Supabase

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL do projeto e a chave anon (anon key)

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
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