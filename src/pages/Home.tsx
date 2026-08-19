import { Link } from 'react-router-dom'
import { Barcode, ListChecks, MapPin, Search, Sparkles, Tag } from 'lucide-react'
import { useStore } from '@/contexts/StoreContext'

const actions = [
  { to: '/produtos', title: 'Encontrar produtos', text: 'Consulte preço, disponibilidade e departamento.', icon: Search },
  { to: '/listas', title: 'Minha lista', text: 'Organize os itens e acompanhe o total estimado.', icon: ListChecks },
  { to: '/mapa', title: 'Mapa da loja', text: 'Descubra onde encontrar cada produto.', icon: MapPin },
  { to: '/promocoes', title: 'Promoções', text: 'Veja oportunidades disponíveis no catálogo.', icon: Tag },
  { to: '/listas-pre-prontas', title: 'Listas sugeridas', text: 'Comece rapidamente com uma lista temática.', icon: Sparkles },
  { to: '/scanner', title: 'Leitor de produtos', text: 'Consulte itens usando a câmera do celular.', icon: Barcode },
]

export default function Home() {
  const { activeStore, stores, loading } = useStore()
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <span className="text-sm font-semibold uppercase tracking-wider text-primary-700">Sua compra, organizada</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-2">O que você precisa hoje?</h1>
      <p className="text-gray-600 mb-2">Busque produtos, monte sua lista e encontre o melhor caminho pela loja.</p>
      <p className="text-sm text-gray-500 mb-7">
        {loading ? 'Carregando loja…' : activeStore ? `Comprando em ${activeStore.name}${activeStore.address ? ` — ${activeStore.address}` : ''}` : stores.length === 0 ? 'Nenhuma loja disponível no momento.' : 'Selecione uma loja.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map(({ to, title, text, icon: Icon }) => (
          <Link key={to} to={to} className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition">
            <Icon className="h-7 w-7 text-primary-600 mb-5 group-hover:scale-105 transition" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-sm leading-6 text-gray-600">{text}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
