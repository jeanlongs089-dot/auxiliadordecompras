## Contexto Atual
- Projeto Vite + React com base dinâmica via variável `BASE_PATH` já suportada em [vite.config.ts](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/vite.config.ts#L6-L10).
- Workflow de deploy para Pages já existe em [.github/workflows/deploy.yml](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L1-L15), dispara em push para `main`.
- Build sai em `dist` (padrão do Vite) e é publicado pelo workflow.

## Pré‑requisitos
- Ter um repositório GitHub (nome sugerido: `auxiliadordecompras`).
- Git configurado localmente com usuário e token/SSH válidos.

## Passos de Publicação
1. Criar repositório no GitHub (privado ou público), sem README inicial (opcional).
2. No projeto local:
   - Inicializar git e criar commit inicial.
   - Adicionar o remoto `origin` do repositório recém‑criado.
   - Fazer push para `main`.
3. O push para `main` acionará o workflow em [.github/workflows/deploy.yml](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L3-L6):
   - Instala dependências, define `BASE_PATH=/<repo>/` e executa `npm run build` ([deploy.yml:L33-L37](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L33-L37)).
   - Publica `dist` como artefato e faz deploy com GitHub Pages ([deploy.yml:L38-L52](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/.github/workflows/deploy.yml#L38-L52)).
4. Após a primeira execução, o site ficará acessível em `https://<seu-usuário>.github.io/<repo>/`.

## Ajustes para SPA (Roteamento)
- Para deep links funcionarem em Pages, é recomendado incluir `404.html` copiando `index.html` após o build.
- Proposta: inserir etapa no workflow (após `npm run build`) para copiar `dist/index.html` → `dist/404.html` antes do upload do artefato.

## Variáveis de Base/Rotas
- `vite.config.ts` já lê `BASE_PATH` e usa `base` adequado para Pages ([vite.config.ts:L6-L10](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/vite.config.ts#L6-L10)).
- Caso deseje usar um domínio `user.github.io` como repositório raiz (sem `/repo`), ajustaremos para `base: '/'` e removeremos a definição de `BASE_PATH` do workflow.

## Backend/Chamadas de API
- Em dev existe proxy para `/api` ([vite.config.ts:L20-L38](file:///c:/Users/jeanm/Documents/trae_projects/auxiliadordecompras/vite.config.ts#L20-L38)). Em produção (Pages), chamadas devem ir para um endpoint público (não há Node server em Pages). Se necessário, definiremos URLs de API via variáveis/env.

## Verificação
- Acompanhar execução do workflow (aba Actions) até concluir `build` e `deploy`.
- Checar site publicado e navegar por múltiplas rotas para confirmar o fallback SPA.

## Próximas Ações
- Se aprovado, vou:
  1) Configurar remoto Git e fazer o primeiro push para `main`.
  2) Atualizar o workflow para criar `404.html` após o build.
  3) Confirmar publicação e enviar a URL final.