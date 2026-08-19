# RPI — funções do `/app`

Data da revisão: 19 de agosto de 2026.

## 1. Research

O `/app` é a entrada do Shopper e deve validar o ciclo essencial: escolher uma loja, encontrar um produto, localizar o departamento, adicionar à lista e acompanhar o valor estimado.

### Achados principais

| Área | Estado encontrado | Risco |
| --- | --- | --- |
| Loja ativa | Catálogo e mapa consultavam dados de todas as lojas | Preço, disponibilidade e localização inconsistentes |
| Catálogo | Busca duplicada no servidor/cliente, descrição nula podia falhar e o mesmo item era duplicado na lista | Fluxo instável e lista poluída |
| Listas | Contadores não atualizavam na tela e não havia total estimado | Proposta central do Shopper incompleta |
| Mapa | Ignorava as posições cadastradas e usava uma grade gerada | Localização divergente do cadastro |
| Analytics | Não existia registro das intenções necessárias ao piloto Retail | Impossível medir a hipótese do produto |
| Scanner | Duas experiências concorrentes em `/experiencia` e `/scanner` | Manutenção e navegação confusas |
| API de autenticação | Rotas Express vazias coexistiam com Supabase Auth funcional | Contrato enganoso para integrações |
| Validação | TypeScript passava; lint tinha 35 erros; não havia testes automatizados | Regressões difíceis de detectar |

## 2. Planejamento

Prioridade adotada:

1. tornar loja, catálogo, mapa e lista um fluxo coerente;
2. corrigir falhas funcionais sem exigir uma mudança destrutiva no schema existente;
3. capturar os eventos mínimos do piloto sem bloquear a compra caso a migração ainda não tenha sido aplicada;
4. remover caminhos duplicados ou enganosos;
5. validar compilação, lint, build e navegação real.

Critérios de aceite:

- uma loja ativa persiste entre sessões e filtra catálogo/mapa;
- inserir novamente um produto incrementa sua quantidade;
- lista mostra progresso e total estimado dos itens vinculados ao catálogo;
- mapa usa coordenadas cadastradas;
- usuário anônimo recebe uma orientação clara ao abrir listas;
- rota legada do scanner redireciona para a experiência mantida;
- falha de analytics não interrompe a ação do Shopper;
- TypeScript, lint e build terminam sem erros.

## 3. Implementação

### Entregue

- contexto compartilhado de loja ativa, com persistência local e seletor responsivo;
- painel do `/app` reorganizado em torno das seis ações principais;
- catálogo filtrado pela loja, tolerante a dados incompletos e com incremento de quantidade;
- listas com estado anônimo, contadores reativos, preços associados e total estimado;
- confirmação antes de excluir uma lista;
- mapa filtrado pela loja, com coordenadas reais e feedback não bloqueante;
- eventos de loja, busca, ausência de resultado, localização, adição, marcação e conclusão;
- migração `intent_events` com RLS e índices;
- unificação do scanner por redirecionamento da rota legada;
- rotas Express de autenticação desativadas explicitamente em favor do Supabase Auth;
- login e cadastro direcionando o usuário ao `/app`.

### Validação executada

- `npm run check`: aprovado;
- `npm run lint`: aprovado, com dois avisos preexistentes de Fast Refresh;
- `npm run build`: aprovado;
- navegação local: `/app`, `/produtos`, `/listas` e redirecionamento `/experiencia` → `/scanner` aprovados;
- console do navegador: sem erros ou avisos nos fluxos verificados.

## Próximos incrementos recomendados

1. aplicar a migração de eventos no Supabase do ambiente;
2. modelar promoções com vigência e preço por loja, substituindo a tela “Em breve”;
3. transformar listas pré-prontas em ação real de criação/importação;
4. adicionar corredor e prateleira ao cadastro de localização;
5. substituir a simulação do scanner novo por leitura real do catálogo;
6. criar testes automatizados de catálogo/lista e um teste de ponta a ponta autenticado;
7. fazer code splitting do scanner para reduzir o pacote inicial, hoje acima do limite recomendado pelo Vite.

## Limites desta rodada

O Supabase configurado no ambiente não retornou lojas e não havia uma sessão autenticada disponível. Assim, consultas e estados anônimos foram validados no navegador, enquanto escrita autenticada, RLS e métricas reais foram validadas por tipos/build e revisão do contrato, mas precisam de uma rodada integrada com banco populado para certificação de produção.

## Incremento 2 — 19 de agosto de 2026

- promoções reais por loja, produto e período, com filtro de categoria e desconto calculado;
- modelos de lista importáveis, incluindo remoção da lista parcial se a criação dos itens falhar;
- corredor e prateleira no catálogo e no mapa;
- scanner de código de barras conectado ao catálogo por carregamento dinâmico do Quagga;
- todas as páginas carregadas sob demanda;
- pacote inicial reduzido de aproximadamente 647 kB para 395 kB; scanner e Quagga ficam em pacotes separados;
- Vitest configurado com testes de total estimado, desconto e quantidade;
- executor de migrações transacional com registro em `schema_migrations`.

As migrações não puderam ser aplicadas ao ambiente remoto porque o host presente em `SUPABASE_DB_URL` (`db.beeizsqjpsczzcysjbtu.supabase.co`) não resolveu DNS mesmo fora do sandbox. Após corrigir a URL, executar `npm run db:migrate`.
