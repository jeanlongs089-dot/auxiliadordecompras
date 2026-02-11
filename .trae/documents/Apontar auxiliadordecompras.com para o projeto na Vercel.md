## Contexto
O domínio auxiliadordecompras.com já foi comprado na Vercel (DNS gerenciado pela Vercel). A aplicação é um SPA em Vite/React com rewrites para /index.html definidos em vercel.json, então o roteamento funciona no domínio raiz sem ajustes adicionais.

## Passo 1 — Adicionar e atribuir o domínio ao projeto
- Acesse Vercel → Project do app → Settings → Domains → Add.
- Insira “auxiliadordecompras.com” e confirme.
- Na lista de domínios, clique em “Assign” para vincular ao ambiente Production do projeto.

## Passo 2 — Configurar www → raiz (opcional, recomendado)
- Ainda em Settings → Domains, adicione “www.auxiliadordecompras.com”.
- Configure “Redirect to auxiliadordecompras.com” para forçar versão canônica sem www.
- Alternativa técnica (se preferir em código): usar "redirects" no vercel.json com regra baseada em host (www → raiz).

## Passo 3 — Certificado SSL e verificação
- A Vercel provisiona SSL automaticamente; aguarde status “Active/Valid”.
- Verifique que ambos auxiliadordecompras.com e www.auxiliadordecompras.com estão com certificado válido.

## Passo 4 — Ajustes de SEO (opcional, recomendado)
- Adicionar tag canonical no index.html: <link rel="canonical" href="https://auxiliadordecompras.com" />.
- Atualizar og:url e twitter:url para o domínio canônico.
- Criar robots.txt e sitemap.xml básicos e publicá-los (ex.: /robots.txt, /sitemap.xml) para melhor indexação.

## Passo 5 — Variáveis de ambiente
- Confirmar em Vercel → Settings → Environment Variables que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas em Production (não dependem do domínio, mas garantem funcionamento).

## Passo 6 — Validação pós-apontamento
- Acessar https://auxiliadordecompras.com e validar:
  - Cadeado SSL no navegador.
  - Rotas SPA funcionam (ex.: /alguma-rota) graças ao rewrite já presente.
  - Redirecionamento de www para a raiz (se configurado).
- Testar Lighthouse/SEO rapidamente para confirmar canonical e metas.

## Observações do projeto
- vercel.json já contém rewrites para SPA: /(.*) → /index.html, mantendo navegação client-side.
- O BrowserRouter não usa basename, correto para deploy na raiz do domínio.

## Entregáveis
- Domínio auxiliadordecompras.com atribuído ao projeto (Production) e ativo.
- Redirecionamento www → raiz (via Vercel Domains ou vercel.json).
- SEO opcional: canonical, robots, sitemap.

Confirma que seguimos com esta configuração? Após a confirmação, executo os ajustes opcionais de SEO no código e envio para revisão.