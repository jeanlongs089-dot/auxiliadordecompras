import { Link } from 'react-router-dom'
import {
  Bell,
  ListChecks,
  LineChart,
  Target,
  BarChart3,
  Trophy,
  CheckCircle
} from 'lucide-react'
import { useMemo, useState } from 'react'

export default function Landing() {
  const [numClients, setNumClients] = useState(3000)
  const [avgTicket, setAvgTicket] = useState(120)
  const [churnRate, setChurnRate] = useState(12)
  const [currentCost, setCurrentCost] = useState(5000)
  const [scheduled, setScheduled] = useState(false)

  const churnRetained = useMemo(() => Math.round(numClients * (churnRate / 100) * 0.4 * 12), [numClients, churnRate])
  const freqRevenue = useMemo(() => Math.round(numClients * avgTicket * 0.25 * 12), [numClients, avgTicket])
  const ticketRevenue = useMemo(() => Math.round(numClients * avgTicket * 0.18 * 12), [numClients, avgTicket])
  const totalRevenue = useMemo(() => freqRevenue + ticketRevenue, [freqRevenue, ticketRevenue])
  const yearlyCost = useMemo(() => currentCost * 12, [currentCost])
  const roiPct = useMemo(() => {
    if (yearlyCost <= 0) return 0
    return Math.round(((totalRevenue - yearlyCost) / yearlyCost) * 100)
  }, [totalRevenue, yearlyCost])

  return (
    <div>
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="mb-4 text-sm text-white/80">Já ajudamos 23 supermercados independentes a recuperar clientes perdidos para atacarejos</div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Seu programa de fidelidade não funciona porque seus clientes não precisam de pontos. Eles precisam de ajuda para comprar melhor.</h1>
              <p className="mt-6 text-lg text-gray-300">O Auxiliador de Compras transforma seu supermercado no assistente pessoal de compras do cliente — presente todos os dias, gerando valor real, criando hábito e blindando sua base contra atacarejos.</p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <a href="#agendar" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-black font-medium hover:bg-gray-200 transition">Agendar demonstração — 20 minutos</a>
                <Link to="/experiencia" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-medium hover:bg-white/10 transition">Ver como funciona na prática</Link>
              </div>
              <div className="mt-3 text-xs text-white/70">Privacidade garantida. Sem spam.</div>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <div className="text-sm text-white/70 mb-2">App de fidelidade tradicional</div>
                  <div className="h-36 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">Vazio, sem uso</div>
                  <div className="mt-3 h-8 rounded-xl bg-white/5 border border-white/10"></div>
                  <div className="mt-2 h-8 rounded-xl bg-white/5 border border-white/10"></div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <div className="text-sm text-white/70 mb-2">Auxiliador de Compras</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <Bell className="h-4 w-4" />
                      <span>Alerta: iogurte favorito em promoção</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <ListChecks className="h-4 w-4" />
                      <span>Lista ativa: reposição da semana</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <LineChart className="h-4 w-4" />
                      <span>Comparação: arroz R$ 2,00 mais barato aqui</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900">Você já tentou de tudo. Nada cola.</h2>
            <p className="mt-3 text-gray-700">O problema não é seu programa. É que ele não resolve o verdadeiro problema do cliente: "Como eu compro melhor com o dinheiro que eu tenho?"</p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">App sem uso</h3>
              <p className="mt-2 text-sm text-gray-700">Gastou R$ 30-50mil em um app que ninguém abre. Taxa de engajamento abaixo de 5%. Clientes baixam, fazem uma compra e abandonam.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Programa de fidelidade morto</h3>
              <p className="mt-2 text-sm text-gray-700">Cashback, pontos, descontos... o cliente some do mesmo jeito. Enquanto isso, o Assaí está a 10 minutos de carro oferecendo preço baixo sem precisar de cartão.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Concorrência desleal</h3>
              <p className="mt-2 text-sm text-gray-700">Atacarejos vendem no varejo, têm economia de escala e margem que você não consegue bater. Competir só no preço é morte lenta.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-900">Pare de tentar fazer o cliente voltar. Esteja com ele todos os dias.</h2>
            <p className="mt-4 text-gray-700">O Auxiliador de Compras coloca seu supermercado dentro da rotina do cliente — do planejamento à execução da compra. Ele não precisa lembrar de você. Você está lá quando ele precisa.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-gray-900">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Engajamento diário, não pontual</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Seu cliente abre o app 3-5x por semana para planejar compras, criar listas, comparar produtos. Seu supermercado aparece em cada interação — não como propaganda, mas como solução.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-gray-900">
                <LineChart className="h-5 w-5" />
                <span className="font-semibold">Inteligência que gera preferência</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Ele vê que o arroz está R$ 2,00 mais barato no seu mercado. Recebe alerta que o iogurte que ele sempre compra está em promoção. Descobre produtos alinhados com a dieta dele. Resultado: volta porque faz sentido, não por cashback.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-gray-900">
                <BarChart3 className="h-5 w-5" />
                <span className="font-semibold">Dados que você usa de verdade</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Dashboard mostra quais clientes estão migrando, quais produtos estão perdendo para concorrentes, quais categorias têm potencial inexplorado. Você age com precisão, não no achismo.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-gray-900">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Fidelização orgânica</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Quanto mais o cliente usa, mais o app aprende os hábitos dele. Sugestões ficam melhores, listas se criam sozinhas, avisos chegam no momento certo. Ele não sai porque ficou dependente da conveniência, não de desconto.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <h2 className="text-3xl font-semibold text-gray-900">Por que o Auxiliador funciona onde seu app atual falhou</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
            <div className="grid grid-cols-2 bg-gray-50">
              <div className="px-4 py-3 font-semibold text-gray-700">Seu App Atual</div>
              <div className="px-4 py-3 font-semibold text-gray-700">Auxiliador de Compras</div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">Razão de uso: Acumular pontos</div>
                <div className="px-4 py-3">Razão de uso: Comprar melhor, economizar, planejar</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">Frequência de abertura: 1-2x/mês (só na compra)</div>
                <div className="px-4 py-3">Frequência de abertura: 3-5x/semana (planejamento contínuo)</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">Valor percebido: Desconto eventual</div>
                <div className="px-4 py-3">Valor percebido: Assistente pessoal diário</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">Defesa contra atacarejo: Nenhuma (cliente compara só preço)</div>
                <div className="px-4 py-3">Defesa contra atacarejo: Alta (mostra contexto: qualidade, nutrição, conveniência)</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">Custo de manutenção: Alto (desenvolvimento próprio)</div>
                <div className="px-4 py-3">Custo de manutenção: Fixo e previsível (SaaS)</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">Dados acionáveis: Relatório de vendas básico</div>
                <div className="px-4 py-3">Dados acionáveis: Comportamento, intenção, padrões de abandono</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1">
                <h2 className="text-3xl font-semibold text-gray-900">Como o Supermercado Vila Nova recuperou 340 clientes em 4 meses</h2>
                <div className="mt-4 text-gray-700">
                  <div>Supermercado familiar de bairro, 2 lojas, 60 anos de tradição. Perdendo 15-20 clientes/mês para Atacadão que abriu a 3km. App próprio com 8% de engajamento.</div>
                  <div className="mt-2">Implementaram o Auxiliador de Compras em abril. Migraram a base do app antigo. Comunicaram na loja, WhatsApp e redes sociais.</div>
                </div>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-gray-900">340</div>
                    <div className="text-sm text-gray-600">clientes reativados</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-gray-900">47%</div>
                    <div className="text-sm text-gray-600">engajamento semanal</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-gray-900">+22%</div>
                    <div className="text-sm text-gray-600">ticket médio</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-gray-900">68</div>
                    <div className="text-sm text-gray-600">NPS</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-gray-900">-35%</div>
                    <div className="text-sm text-gray-600">churn mensal</div>
                  </div>
                </div>
                <div className="mt-6 italic text-gray-800">"Finalmente temos um jeito de competir que não é baixar margem até quebrar. O cliente volta porque a gente ajuda ele a comprar melhor, não porque deu 5% de desconto. E os dados mudaram como compramos e expomos produtos." — Rodrigo Andrade, Sócio-Diretor</div>
                <div className="mt-8">
                  <a href="#agendar" className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 transition">Quero resultados assim no meu mercado</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <h2 className="text-3xl font-semibold text-gray-900">Tudo que você precisa para engajar, reter e vender mais</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <BarChart3 className="h-5 w-5" />
                <span className="font-semibold">Dashboard de Inteligência</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Veja em tempo real: produtos em risco de perda para concorrentes, clientes prestes a migrar, oportunidades de upsell por perfil de compra.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Campanhas Segmentadas</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Envie promoções só para quem realmente vai comprar. Notificações baseadas em histórico, preferências e momento de reposição.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <ListChecks className="h-5 w-5" />
                <span className="font-semibold">Listas Inteligentes</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Cliente cria listas que se repetem automaticamente. O app avisa quando está faltando algo. Você aparece na hora certa.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <Bell className="h-5 w-5" />
                <span className="font-semibold">Alertas de Oportunidade</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Cliente recebe notificação quando produto favorito está em oferta ou quando há risco de falta no estoque dele.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <LineChart className="h-5 w-5" />
                <span className="font-semibold">Analytics Comportamental</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Entenda jornadas de compra, padrões de abandono, produtos que andam juntos, horários de pico por perfil de cliente.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Gamificação Nativa</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">Desafios, metas, conquistas que geram engajamento real — não pontos vazios, mas objetivos ligados à vida do cliente.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <h2 className="text-3xl font-semibold text-gray-900">Quanto isso vale para o seu supermercado?</h2>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Número de clientes ativos/mês</label>
                  <input type="number" value={numClients} onChange={(e) => setNumClients(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Ticket médio (R$)</label>
                  <input type="number" value={avgTicket} onChange={(e) => setAvgTicket(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Taxa de churn mensal atual (%)</label>
                  <input type="number" value={churnRate} onChange={(e) => setChurnRate(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Custo atual com programa de fidelidade/mês (R$)</label>
                  <input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Estimativa de Impacto (12 meses)</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-800"><CheckCircle className="h-5 w-5 text-green-600" /> Redução de churn: -40% = {churnRetained.toLocaleString('pt-BR')} clientes retidos</div>
                <div className="flex items-center gap-2 text-gray-800"><CheckCircle className="h-5 w-5 text-green-600" /> Aumento de frequência: +25% = R$ {freqRevenue.toLocaleString('pt-BR')}</div>
                <div className="flex items-center gap-2 text-gray-800"><CheckCircle className="h-5 w-5 text-green-600" /> Lift em ticket médio: +18% = R$ {ticketRevenue.toLocaleString('pt-BR')}</div>
                <div className="flex items-center gap-2 text-gray-800"><CheckCircle className="h-5 w-5 text-green-600" /> ROI estimado: {roiPct}% no primeiro ano</div>
              </div>
              <div className="mt-6">
                <a href="#agendar" className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 transition">Simular meu ROI em uma demo personalizada</a>
              </div>
              <div className="mt-3 text-xs text-gray-500">Estimativas simplificadas para projeção inicial. Ajustamos com seus dados reais na demonstração.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <h2 className="text-3xl font-semibold text-gray-900">Menos que você gasta hoje. Muito mais resultado.</h2>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-4">Seu Gasto Atual / Resultado Atual</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>App próprio: R$ 30-80k (desenvolvimento) + R$ 3-8k/mês (manutenção)</li>
                <li>Engajamento &lt;10%, sem dados acionáveis</li>
                <li>Programa de fidelidade tradicional: R$ 4-10k/mês (cashback + gestão)</li>
                <li>Clientes só voltam por desconto, margem corroída</li>
                <li>Marketing genérico: R$ 5-15k/mês (panfleto, redes)</li>
                <li>Alcance sem conversão, difícil medir ROI</li>
                <li>Total médio: R$ 12-33k/mês</li>
                <li>Retenção baixa, churn alto, sem defesa contra atacarejo</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-4">Auxiliador de Compras / Resultado</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>R$ [X]/mês (SaaS, sem setup)</li>
                <li>Engajamento 40-50%, churn -40%, ticket +18-25%, dados em tempo real</li>
                <li>Inclui: plataforma + suporte + atualizações + analytics</li>
                <li>Cliente retido por conveniência, não por desconto</li>
                <li>ROI positivo em 3-6 meses</li>
                <li>Diferenciação competitiva sustentável</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <h2 className="text-3xl font-semibold text-gray-900">No ar em 14 dias. Zero dor de cabeça.</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="rounded-2xl bg-white p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">Dia 1-3: Integração</div>
              <div className="mt-2 text-sm text-gray-700">Conectamos com seu sistema de preços/estoque (ERP, planilha, API). Nossa equipe técnica faz tudo.</div>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">Dia 4-7: Configuração</div>
              <div className="mt-2 text-sm text-gray-700">Customizamos o app com sua marca, definimos categorias, configuramos campanhas iniciais.</div>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">Dia 8-10: Migração de Base</div>
              <div className="mt-2 text-sm text-gray-700">Importamos clientes do seu app/programa atual. Envios comunicação de transição.</div>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">Dia 11-14: Treinamento e Lançamento</div>
              <div className="mt-2 text-sm text-gray-700">Treinamos sua equipe (gestores, caixas, atendimento). App vai ao ar. Suporte dedicado nas primeiras semanas.</div>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">Dia 30+: Otimização Contínua</div>
              <div className="mt-2 text-sm text-gray-700">Reuniões mensais de performance, ajustes com base em dados, novas campanhas.</div>
            </div>
          </div>
          <div className="mt-8">
            <a href="#agendar" className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 transition">Começar minha implementação</a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <h2 className="text-3xl font-semibold text-gray-900">Perguntas Frequentes</h2>
          <div className="mt-8 max-w-3xl">
            <details className="rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium text-gray-900">E se meu cliente já usa outros apps de comparação de preços?</summary>
              <div className="mt-2 text-sm text-gray-700">Ótimo. Agora ele vai usar o seu app para isso — e você estará no momento da decisão, não fora dele. Além disso, oferecemos contexto que apps genéricos não têm: nutrição, histórico pessoal, sugestões baseadas na dieta.</div>
            </details>
            <details className="mt-4 rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium text-gray-900">Meu público é mais velho, não usa muito app...</summary>
              <div className="mt-2 text-sm text-gray-700">Nossos dados mostram que 62% dos usuários têm 45+ anos. A interface é simples, com onboarding guiado e suporte via WhatsApp. Além disso, funciona também via web (não só app).</div>
            </details>
            <details className="mt-4 rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium text-gray-900">Vou depender de vocês para sempre?</summary>
              <div className="mt-2 text-sm text-gray-700">O contrato é mensal, sem fidelidade. Mas nossos clientes ficam porque funciona — a média de retenção é 94% após 6 meses. Você pode exportar seus dados a qualquer momento.</div>
            </details>
            <details className="mt-4 rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium text-gray-900">E se eu quiser funcionalidades específicas?</summary>
              <div className="mt-2 text-sm text-gray-700">Rodmap é colaborativo. Clientes votam em funcionalidades e priorizamos com base em impacto. Customizações pontuais são possíveis (consultoria separada).</div>
            </details>
            <details className="mt-4 rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium text-gray-900">Quanto custa, afinal?</summary>
              <div className="mt-2 text-sm text-gray-700">Modelo SaaS baseado em número de clientes ativos. Supermercado com 3 mil clientes: a partir de R$ [X]/mês. Sem taxa de setup. Demonstração inclui simulação exata para o seu caso.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-900">Você tem duas escolhas:</h2>
            <div className="mt-6 space-y-4 text-gray-800">
              <div>
                <div className="font-semibold">Opção 1: Continuar fazendo o mesmo</div>
                <div>Perder clientes para atacarejos, queimar margem em promoções que não fidelizam, olhar seu app/programa morrer aos poucos enquanto investe dinheiro que não volta.</div>
              </div>
              <div>
                <div className="font-semibold">Opção 2: Virar o jogo</div>
                <div>Estar presente na vida do cliente todos os dias, defender margem com inteligência, usar dados para crescer, construir vantagem competitiva que atacarejo não consegue copiar.</div>
              </div>
            </div>
            <div className="mt-8">
              <a href="#agendar" className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 transition">Agendar demonstração agora</a>
            </div>
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <div>✓ Sem contrato de fidelidade</div>
              <div>✓ Implementação em 14 dias</div>
              <div>✓ Suporte dedicado nos primeiros 90 dias</div>
              <div>✓ ROI positivo ou ajustamos a estratégia sem custo adicional</div>
            </div>
          </div>
        </div>
      </section>

      <section id="agendar" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">Agendar demonstração</h2>
              <p className="mt-3 text-gray-700">Preencha o formulário abaixo. Em até 4 horas úteis, nosso time confirma o melhor horário e entende seu contexto.</p>
              <div className="mt-6 rounded-2xl bg-gray-50 p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setScheduled(true)
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700">Nome completo</label>
                      <input className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Cargo</label>
                      <input className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Nome do Supermercado</label>
                      <input className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Número aproximado de clientes ativos/mês</label>
                      <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Telefone/WhatsApp</label>
                      <input className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">E-mail</label>
                      <input type="email" className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Número de lojas</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="lojas" defaultChecked /> 1</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="lojas" /> 2-3</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="lojas" /> 4+</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Você tem app ou programa de fidelidade hoje?</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Sim, app próprio</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Sim, programa de pontos/cartão</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Não, nada no momento</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Qual seu maior desafio agora?</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Perder clientes para atacarejos</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> App/programa sem engajamento</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Não sei usar dados de venda</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Competir só em preço não funciona mais</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Quando você quer ver isso funcionando?</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="quando" defaultChecked /> Urgente (próximas 2 semanas)</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="quando" /> Curto prazo (próximo mês)</label>
                      <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="quando" /> Explorando opções (próximos 3 meses)</label>
                    </div>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 transition">Agendar minha demonstração</button>
                  <div className="mt-2 text-xs text-gray-500">Compromisso com privacidade. Não compartilhamos seus dados. Sem spam.</div>
                </form>
                {scheduled && (
                  <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    Agendamento recebido! Nosso time comercial entrará em contato em até 4 horas úteis para confirmar melhor data/horário e entender seu contexto. Enquanto isso, você pode explorar nosso <Link to="/experiencia" className="underline">Case Completo: Como o Mercado X recuperou 340 clientes</Link>.
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Elegância que prioriza acessibilidade</h3>
              <p className="mt-2 text-gray-700">Tipografia clara, contraste adequado e navegação intuitiva em um layout responsivo, inspirado em boas práticas.</p>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="rounded-xl bg-white p-4">
                  <div className="text-2xl font-bold text-gray-900">3-5x</div>
                  <div className="text-sm text-gray-600">aberturas por semana</div>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-2xl font-bold text-gray-900">-40%</div>
                  <div className="text-sm text-gray-600">churn</div>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-2xl font-bold text-gray-900">+18-25%</div>
                  <div className="text-sm text-gray-600">ticket médio</div>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-2xl font-bold text-gray-900">14 dias</div>
                  <div className="text-sm text-gray-600">implantação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm">© {new Date().getFullYear()} Auxiliador de Compras</div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">Privacidade</a>
              <a href="#" className="hover:underline">Termos</a>
              <Link to="/login" className="hover:underline">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

