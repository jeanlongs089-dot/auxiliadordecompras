# Contexto do projeto — Auxiliador de Compras

Este documento consolida a direção de produto e negócio apresentada no paper/conversa de validação compartilhado em 12 de agosto de 2026 e a confronta com o estado atual do repositório. Ele deve orientar decisões de produto, design, conteúdo, dados e engenharia.

> Visão estratégica, preços, métricas e resultados comerciais descritos aqui são hipóteses até serem comprovados por entrevistas, pilotos ou dados reais. Nunca apresentá-los como fatos sem evidência documentada.

## 1. Tese do produto

O Auxiliador de Compras não é apenas um aplicativo de lista. A tese é ser **a camada digital da loja física**, conectando três participantes no momento da decisão de compra:

- o consumidor usa gratuitamente uma experiência para planejar e executar a compra;
- o supermercado contrata a plataforma e recebe experiência digital e inteligência de intenção;
- a indústria, em fase posterior, pode comprar mídia contextual e mensurável.

O modelo é **B2B2C**. O cliente pagante inicial é o supermercado; o consumidor é o usuário; marcas e indústrias são clientes futuros.

Mensagem central: **Seu cliente encontra. Sua loja entende.**

Posicionamento: **A plataforma digital para a experiência de compra dentro do supermercado.**

## 2. Problemas atendidos

### Consumidor

- encontrar produtos;
- consultar preços, disponibilidade e promoções;
- organizar lista e percurso;
- acompanhar quanto pretende gastar;
- encontrar alternativas para itens indisponíveis.

### Supermercado

O PDV mostra o que foi comprado, mas não toda a intenção anterior. O Auxiliador deve revelar, com consentimento e dados agregados:

- o que foi pesquisado, visualizado e comparado;
- quais ofertas despertaram interesse;
- quais produtos foram procurados e não encontrados;
- onde houve fricção ou abandono.

### Indústria

Marcas querem alcançar o consumidor perto da decisão e medir o resultado. Essa oportunidade só deve ser explorada depois de existir tráfego, consentimento e mensuração confiável.

## 3. Três produtos conectados

### Auxiliador Shopper — foco do MVP

1. selecionar a loja;
2. buscar produto, marca ou categoria;
3. consultar preço, promoção e disponibilidade;
4. localizar corredor/departamento;
5. montar e acompanhar uma lista;
6. visualizar o total estimado da cesta.

### Auxiliador Retail — próximo núcleo B2B

- importar e manter lojas, catálogo, preços, posição e promoções;
- acompanhar buscas, visualizações e adições à lista;
- identificar buscas sem resultado e demanda não atendida;
- medir uso e desempenho de ofertas;
- gerar evidências de valor do piloto.

### Auxiliador Ads — fase posterior

- produto patrocinado na busca;
- cupom ou oferta contextual;
- destaque no mapa;
- campanhas por loja ou categoria;
- mensuração de impressão, clique, adição à lista e, com integração ao PDV, compra influenciada.

Ads não integra o MVP inicial. Deve ser previsto na taxonomia de eventos sem aumentar a complexidade da primeira validação.

## 4. ICP e papéis

O ICP inicial são supermercados independentes e pequenas redes regionais com decisor acessível, catálogo importável e disposição para executar um piloto. Grandes redes não são prioridade inicial devido ao ciclo comercial e às integrações mais complexas.

Papéis do sistema:

- **Consumidor:** pesquisa, cria listas e usa o mapa;
- **Gestor:** mantém dados comerciais e acompanha indicadores;
- **Equipe da loja:** apoia catálogo, disponibilidade e localização;
- **Operador da plataforma:** implanta lojas e administra o produto;
- **Marca/agência:** papel futuro para campanhas de Ads.

## 5. MVP de validação

Pergunta central:

> Um supermercado paga para oferecer uma experiência digital dentro da loja e obter dados úteis sobre como seus clientes compram?

### Incluído

- catálogo e preços por loja;
- busca e localização de produto;
- listas e total estimado;
- promoções;
- importação básica de catálogo, preço e posição;
- eventos de uso e dashboard Retail básico;
- pesquisas sem resultado.

### Fora do MVP

- self-checkout, pagamento, fiscal e prevenção de perdas;
- estoque sofisticado em tempo real;
- sensores, hardware e prateleiras inteligentes;
- personalização avançada por IA;
- marketplace completo de Retail Media;
- integrações profundas com múltiplos ERPs/PDVs.

A leitura de código de barras pode continuar como experimento, mas não deve deslocar as prioridades acima.

## 6. Estado atual do repositório

### Stack

- React 18, TypeScript, Vite e Tailwind CSS;
- React Router;
- Supabase para PostgreSQL e autenticação;
- Express/Vercel Functions como API auxiliar;
- Quagga2 para leitura de código de barras.

### Já existe

- landing B2B em `/` e entrada do Shopper em `/app`;
- catálogo com busca, filtro e Supabase;
- mapa básico de departamentos;
- listas persistidas por usuário;
- login, cadastro e perfis;
- páginas iniciais de promoções, fidelidade e listas pré-prontas;
- leitor de código de barras;
- tela administrativa parcialmente real e parcialmente simulada.

### Lacunas

- contexto multi-loja inconsistente;
- mapa sem corredores, prateleiras ou rota real;
- total estimado não consolidado no modelo atual;
- promoções e páginas auxiliares pouco funcionais;
- eventos de intenção e funil não modelados;
- dashboard Retail com métricas simuladas;
- importação/gestão de catálogo e localização incompletas;
- autenticação dividida entre Supabase funcional e rotas Express com TODO;
- landing contém números, cases e garantias sem comprovação registrada;
- textos com sinais de encoding corrompido;
- documentação anterior divergente de rotas e schema implementados.

## 7. Dados e eventos necessários

O modelo atual cobre lojas, departamentos, produtos, listas e itens. Para validar Retail, evoluir gradualmente para preço/disponibilidade por loja, corredor/prateleira, promoções com vigência, sessões de compra e eventos de intenção.

| Evento | Propriedades essenciais |
| --- | --- |
| `store_selected` | loja, sessão |
| `product_searched` | loja, termo, quantidade de resultados |
| `search_no_results` | loja, termo |
| `product_viewed` | loja, produto, origem |
| `location_viewed` | loja, produto, departamento/corredor |
| `item_added_to_list` | loja, lista, produto, quantidade, preço |
| `item_checked` | loja, lista, produto, preço estimado |
| `promotion_viewed` | loja, promoção, produto |
| `shopping_session_completed` | loja, itens, total estimado, duração |

Não declarar “compra”, “conversão” ou “receita influenciada” a partir de uma lista marcada. Esses indicadores exigem integração ou reconciliação confiável com o PDV.

## 8. Métricas

North Star Metric: **sessões de compra ativas e concluídas por loja através da plataforma**. Sem confirmação do PDV, usar “sessão/lista concluída”, não “compra realizada”.

KPIs do piloto:

- usuários ativos por loja e retenção semanal;
- buscas por sessão e taxa sem resultado;
- produtos localizados;
- listas criadas e concluídas;
- total estimado das listas concluídas;
- interações com promoções;
- satisfação de consumidor e gestor;
- disposição do supermercado para continuar pagando.

Métricas futuras: MRR por loja, CAC, churn, LTV, payback, tempo de implantação e custo de suporte.

## 9. Negócio a validar

Receitas propostas: SaaS por loja, implantação/integração, analytics premium, Retail Media e API.

As faixas discutidas no paper — aproximadamente R$ 499 a R$ 2.990 por loja/mês, além de implantação — são âncoras para entrevistas, não uma tabela comercial aprovada.

Estratégia sugerida: piloto fundador de 90 dias com até três lojas, preço acessível ou implantação subsidiada em troca de dados, feedback e autorização específica para publicar um estudo de caso.

Marcos hipotéticos: 10 entrevistas → 3 pilotos → 1–2 clientes pagantes → R$ 10 mil de MRR → 10 lojas com ROI demonstrável.

## 10. Princípios

- Vender resultado e clareza, não “tecnologia inovadora”.
- Manter o consumidor gratuito; monetização inicial é B2B.
- Instrumentar intenção com privacidade e consentimento.
- Distinguir total estimado de valor pago e disponibilidade de estoque em tempo real.
- Não inventar cases, clientes, depoimentos, percentuais, prazos ou garantias.
- Tratar preços, ROI e projeções como hipóteses identificadas.
- Priorizar uso mobile dentro da loja.
- Evitar self-checkout e integrações complexas antes da validação.
- Toda funcionalidade deve gerar utilidade Shopper, inteligência Retail ou monetização futura Ads.

## 11. Roadmap

1. **Fundação:** corrigir encoding e claims; alinhar documentação; definir loja ativa e eventos.
2. **MVP Shopper:** catálogo/preço por loja, busca, localização, lista, total e promoções.
3. **Piloto Retail:** importação, dashboard real, buscas sem resultado e relatório por loja.
4. **Prova de ROI:** executar pilotos, validar adoção, preço e custo de implantação.
5. **Escala e Ads:** integrações repetíveis, mídia patrocinada, atribuição e governança.

## 12. Checklist de decisão

Antes de incluir uma funcionalidade:

1. Quem recebe valor: consumidor, supermercado ou indústria?
2. Qual hipótese será validada?
3. Qual evento demonstrará sucesso?
4. Ela depende de dados que ainda não existem?
5. Pode ser testada manualmente ou com menor integração?
6. Pertence ao MVP ou a uma fase futura?

## 13. Fonte e limites

Fonte estratégica: [conversa compartilhada “Validação e plano de negócio”](https://chatgpt.com/share/6a7c7f13-d0b4-83e9-bd4b-83212f3bca78).

O material de origem é uma análise estratégica, não uma pesquisa de mercado auditada. Concorrência, mercado, legislação, privacidade, preços e viabilidade financeira exigem validação própria antes de orientar investimento ou comunicação pública.
