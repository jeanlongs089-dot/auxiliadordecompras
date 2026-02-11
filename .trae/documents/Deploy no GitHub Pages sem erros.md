## Visão Geral
- Publicar o frontend (Vite + React) no GitHub Pages usando o workflow já presente em [deploy.yml](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml).
- Garantir base de rotas correta via Vite (BASE_URL) e SPA fallback 404 já implementado.
- Injetar variáveis do Supabase no build para evitar falhas de runtime.

## Pré-requisitos
- Conta GitHub com repositório "auxiliadordecompras" (público ou privado com Pages habilitado).
- Variáveis do Supabase disponíveis para o frontend:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Verificar scripts de build em [package.json](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/package.json#L6-L16) e base em [vite.config.ts](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/vite.config.ts#L5-L12).

## Passos de Deploy
1. Criar repositório GitHub "auxiliadordecompras" (se não existir) e associar o remoto:
   - git init; git add .; git commit -m "init"
   - git remote add origin git@github.com:<seu-usuario>/auxiliadordecompras.git
   - git branch -M main; git push -u origin main
2. Habilitar GitHub Pages:
   - Settings → Pages → Source: "GitHub Actions".
3. Definir variáveis/secrets para o build na aba Settings → Secrets and variables → Actions:
   - Secrets: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
4. Build com base correta (feito automaticamente):
   - O workflow seta BASE_PATH para "/${{ github.event.repository.name }}/" antes do build [deploy.yml:L33-L37](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L33-L37).
   - Vite usa BASE_PATH na base e exporta import.meta.env.BASE_URL [vite.config.ts:L7-L10](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/vite.config.ts#L7-L10), consumida pelo Router [App.tsx:L18](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/src/App.tsx#L18).
5. Disparar o workflow:
   - Push para main ou usar "Run workflow" (workflow_dispatch).

## Garantia de Zero Erros
- Pré-checagens no CI antes do build (vamos adicionar após sua confirmação):
  - Typecheck: npm run check
  - Lint: npm run lint (com falha em warnings, se desejado)
- Variáveis do Supabase obrigatórias:
  - O cliente é inicializado em [supabase.ts](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/src/lib/supabase.ts#L1-L6). Sem valores, o app funcionará de forma limitada; definindo-os evita erros de auth e dados.
- SPA fallback já incluído: copia index.html para 404.html [deploy.yml:L37-L40](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L37-L40).

## Validação Pós-Deploy
- Acessar a URL gerada pelo Pages (exposta pelo passo de deploy em "Deployments").
- Smoke test:
  - Verificar carregamento da Home [Landing](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/src/pages/Landing.tsx).
  - Navegar para /app, /produtos, /listas, /login e confirmar que rotas funcionam (basename aplicado).
  - Testar refresh direto em rotas internas e em caminhos inexistentes (esperar 404.html servir SPA e redirecionar).
  - Exercitar autenticação Supabase (Login/Register) para garantir configuração correta.

## Observações de Segurança
- A chave anon do Supabase é pública por definição; ainda assim, use GitHub Secrets para manter governança centralizada.
- Não há backend necessário no Pages; o app consome Supabase diretamente (sem chamadas a /api).