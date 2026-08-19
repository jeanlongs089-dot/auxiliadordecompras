## Objetivo
Publicar a última versão no GitHub Pages usando as ferramentas MCP do GitHub, corrigindo o erro que impede o deploy e garantindo que a aplicação estática funcione corretamente.

## Diagnóstico (read-only)
- Revisar o workflow atual de Pages e configuração de build: [.github/workflows/deploy.yml](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L1-L63)
- Confirmar Vite base e fallback SPA: [vite.config.ts](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/vite.config.ts#L6-L10)
- Validar que o projeto não depende de backend no Pages (Express não roda no Pages): [api](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/api)

## Correções propostas
1. ESLint
- Ajustar .eslintrc.cjs para CommonJS (module.exports) e/ou evitar que o lint bloqueie o pipeline.
- Manter verificação de tipo (tsc --noEmit) para segurança.

2. Workflow de Pages
- Garantir permissões: contents: read, pages: write, id-token: write.
- Manter steps: checkout, setup-node, npm ci, typecheck, lint (não bloqueante), build, copiar 404, upload artifact, deploy.
- Injetar BASE_PATH=/<repo_name>/ no ambiente de build.

3. Variáveis de ambiente
- Confirmar presença dos segredos do repositório: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (anon, nunca service_role). Se ausentes, instruir criação em Settings → Secrets → Actions.

## Execução com MCP GitHub (state-changing após aprovação)
- Atualizar arquivos necessários via MCP GitHub:
  - .eslintrc.cjs: CommonJS.
  - .github/workflows/deploy.yml: manter lint como não bloqueante e BASE_PATH.
- Efetuar commit com mcp_GitHub_push_files para a branch main.
- O push acionará automaticamente o workflow de Pages.

## Validação pós-deploy
- Verificar que o job concluiu sem erros.
- Acessar a URL publicada: https://jeanlongs089-dot.github.io/auxiliadordecompras/
- Testar navegação SPA (fallback 404.html), assets sob /auxiliadordecompras/, e funcionalidades que dependem do Supabase.

## Observações
- GitHub Pages serve apenas conteúdo estático; chamadas a /api devem apontar para um backend hospedado (ex.: Vercel/Render) em produção.
- O workflow já copia index.html para 404.html para suportar roteamento SPA.

## Próximo passo
Após sua confirmação, aplico as correções via MCP GitHub, faço o commit na main e acompanho o deploy até publicar a URL acima, reportando o status e possíveis ajustes adicionais necessários.