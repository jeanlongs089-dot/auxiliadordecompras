import { useState } from 'react'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, MapPin, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/contexts/StoreContext'
import { trackIntent } from '@/lib/analytics'
import Breadcrumbs from '@/components/Breadcrumbs'

interface LayoutProps {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const { stores, activeStore, selectStore } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLanding && <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/app" className="flex items-center space-x-2">
                <ShoppingCart className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Auxiliador de Compras</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/app" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Painel
              </Link>
              <Link to="/produtos" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Produtos</Link>
              <Link to="/mapa" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Mapa</Link>
              <Link to="/listas" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Listas</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {stores.length > 0 && (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  <span className="sr-only">Loja ativa</span>
                  <select
                    value={activeStore?.id || ''}
                    onChange={(event) => {
                      selectStore(event.target.value)
                      void trackIntent('store_selected', event.target.value)
                    }}
                    className="max-w-44 rounded-md border border-gray-300 bg-white px-2 py-2"
                  >
                    {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                  </select>
                </label>
              )}
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 text-sm">Olá, {user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/app"
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Painel
              </Link>
              <Link to="/produtos" className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Produtos</Link>
              <Link to="/mapa" className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Mapa da Loja</Link>
              <Link to="/listas" className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Minhas Listas</Link>
              {stores.length > 0 && (
                <select value={activeStore?.id || ''} onChange={(event) => selectStore(event.target.value)} className="mx-3 mb-2 w-[calc(100%-1.5rem)] rounded-md border border-gray-300 bg-white px-3 py-2">
                  {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                </select>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="bg-primary-600 hover:bg-primary-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Sair
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>}

      <main className={isLanding ? '' : 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'}>
        {!isLanding && <Breadcrumbs />}
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
