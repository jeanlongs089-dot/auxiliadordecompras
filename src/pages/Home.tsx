import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { ShoppingCart, PlusCircle, MapPin, TrendingUp } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Auxiliador de Compras
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transforme sua experiência de compras no supermercado com nossa solução inteligente e moderna
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <ShoppingCart className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Listas Inteligentes</h3>
          <p className="text-gray-600">Crie e gerencie suas listas de compras de forma organizada e eficiente</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <PlusCircle className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Catálogo de Produtos</h3>
          <p className="text-gray-600">Explore nosso catálogo completo com preços atualizados em tempo real</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapa da Loja</h3>
          <p className="text-gray-600">Encontre produtos rapidamente com nosso mapa interativo do supermercado</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Economia Inteligente</h3>
          <p className="text-gray-600">Controle seus gastos e otimize suas compras com nossas ferramentas</p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {user ? 'Comece suas compras inteligentes agora!' : 'Junte-se a nós hoje!'}
        </h2>
        <p className="text-gray-600 mb-6">
          {user 
            ? 'Acesse suas listas e comece a economizar tempo e dinheiro nas suas compras'
            : 'Crie sua conta gratuita e descubra uma nova forma de fazer suas compras'
          }
        </p>
        {user ? (
          <div className="space-x-4">
            <Link
              to="/listas"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Minhas Listas
            </Link>
            <Link
              to="/produtos"
              className="bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 px-6 py-3 rounded-lg font-medium inline-block"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Cadastrar-se
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 px-6 py-3 rounded-lg font-medium inline-block"
            >
              Entrar
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}