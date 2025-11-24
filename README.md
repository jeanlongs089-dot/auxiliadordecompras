# Auxiliador de Compras - Supermercado Inteligente

Uma solução moderna e inteligente para transformar a experiência de compras em supermercados.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Backend**: Supabase (BaaS)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL
- **Gerenciamento de Estado**: Zustand
- **Notificações**: Sonner
- **Ícones**: Lucide React

## 📋 Funcionalidades

### Para Clientes
- ✅ **Listas de Compras Inteligentes**: Crie e gerencie listas personalizadas
- ✅ **Catálogo de Produtos**: Explore produtos com preços atualizados
- ✅ **Mapa Interativo**: Encontre departamentos e produtos na loja
- ✅ **Autenticação**: Sistema seguro de login e cadastro
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

### Para Supermercados
- ✅ **Painel Administrativo**: Visualize métricas e analytics
- ✅ **Gestão de Produtos**: Controle completo do catálogo
- ✅ **Mapa da Loja**: Configure departamentos e setores
- ✅ **Dados de Comportamento**: Insights sobre clientes e produtos

## 🎯 Benefícios

- **Redução de Filas**: Clientes calculam antes de chegar ao caixa
- **Aumento do Ticket Médio**: Sugestões inteligentes e organização
- **Diferencial Competitivo**: Tecnologia moderna e acessível
- **Maior Organização**: Listas digitais e mapas interativos
- **Engajamento e Fidelização**: Experiência superior para o cliente
- **Dados Valiosos**: Comportamento de compra e preferências

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v18 ou superior)
- Conta no Supabase

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd auxiliadordecompras
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

4. **Configure o banco de dados**
Execute as migrations do Supabase (ver seção de estrutura do banco abaixo)

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
Abra seu navegador em `http://localhost:5173`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `stores` - Lojas/Supermercados
- `id` (UUID, PK)
- `name` (Text)
- `address` (Text)
- `phone` (Text)
- `created_at` (Timestamp)

#### `departments` - Departamentos/Setores
- `id` (UUID, PK)
- `name` (Text)
- `description` (Text)
- `color` (Text)
- `position_x` (Integer)
- `position_y` (Integer)
- `store_id` (UUID, FK)

#### `products` - Produtos
- `id` (UUID, PK)
- `name` (Text)
- `description` (Text)
- `price` (Decimal)
- `unit` (Text)
- `category` (Text)
- `department_id` (UUID, FK)
- `image_url` (Text)
- `in_stock` (Boolean)
- `created_at` (Timestamp)

#### `shopping_lists` - Listas de Compras
- `id` (UUID, PK)
- `name` (Text)
- `user_id` (UUID, FK)
- `created_at` (Timestamp)
- `total_items` (Integer)
- `completed_items` (Integer)

#### `list_items` - Itens das Listas
- `id` (UUID, PK)
- `list_id` (UUID, FK)
- `product_id` (UUID, FK, optional)
- `name` (Text)
- `quantity` (Integer)
- `unit` (Text)
- `checked` (Boolean)
- `created_at` (Timestamp)

### Configuração de Segurança (RLS)

As tabelas possuem Row Level Security (RLS) configurada com as seguintes políticas:

- **Anon (usuários não autenticados)**: Leitura de produtos e departamentos
- **Authenticated (usuários autenticados)**: CRUD completo em suas próprias listas
- **Admin**: Acesso completo a todas as funcionalidades

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
├── contexts/           # Contextos React (AuthContext)
├── hooks/              # Hooks customizados
├── lib/                # Configurações e utilitários
├── pages/              # Páginas da aplicação
├── utils/              # Funções utilitárias
└── main.tsx            # Ponto de entrada
```

## 🎨 Design System

- **Cores Primárias**: Verde (representando frescor e saúde)
- **Tipografia**: Inter (moderna e legível)
- **Componentes**: Baseados em Tailwind CSS
- **Ícones**: Lucide React (consistentes e modernos)

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Executa linter
- `npm run preview` - Preview do build de produção

## 🚧 Próximas Funcionalidades

- [ ] Sistema de notificações push
- [ ] Compartilhamento de listas entre familiares
- [ ] Cupons e promoções personalizadas
- [ ] Integração com sistemas de pagamento
- [ ] App mobile nativo
- [ ] Inteligência artificial para sugestões

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para: suporte@auxiliadordecompras.com.br

---

**Desenvolvido com ❤️ para transformar a experiência de compras em supermercados**