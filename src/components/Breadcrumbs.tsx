import { Link, useLocation } from 'react-router-dom'

const labels: Record<string, string> = {
  '': 'Início',
  'app': 'App',
  'scanner': 'Scanner',
  'produtos': 'Produtos',
  'mapa': 'Mapa da Loja',
  'experiencia': 'Experiência',
  'fidelidade': 'Clube de Fidelidade',
  'listas-pre-prontas': 'Listas Pré-prontas',
  'promocoes': 'Promoções',
  'login': 'Entrar',
  'register': 'Cadastrar',
  'listas': 'Minhas Listas',
  'admin': 'Admin',
}

const appRoutes = new Set([
  'produtos',
  'mapa',
  'experiencia',
  'fidelidade',
  'listas-pre-prontas',
  'promocoes',
  'listas',
  'scanner',
])

function titleFor(segment: string) {
  return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
}

export default function Breadcrumbs() {
  const location = useLocation()
  const routeParts = location.pathname.split('/').filter(Boolean)
  const parts = appRoutes.has(routeParts[0]) ? ['app', ...routeParts] : routeParts
  const crumbs = [''].concat(parts)
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-gray-600 gap-2">
        {crumbs.map((segment, idx) => {
          const path = '/' + crumbs.slice(1, idx + 1).join('/')
          const isLast = idx === crumbs.length - 1
          const label = titleFor(segment)
          return (
            <li key={path} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-gray-900">{label}</span>
              ) : (
                <Link to={path || '/'} className="hover:text-primary-600">{label}</Link>
              )}
              {!isLast && <span className="mx-2 text-gray-300">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
