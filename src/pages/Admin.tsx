import { useAuth } from '@/contexts/AuthContext'
import { BarChart, Users, Package, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Analytics {
  totalProducts: number
  totalLists: number
  totalUsers: number
  mostSearchedProducts: Array<{ name: string; count: number }>
  averageShoppingTime: number
  abandonedItems: number
}

export default function Admin() {
  useAuth()
  const [analytics, setAnalytics] = useState<Analytics>({
    totalProducts: 0,
    totalLists: 0,
    totalUsers: 0,
    mostSearchedProducts: [],
    averageShoppingTime: 0,
    abandonedItems: 0
  })
  const [loading, setLoading] = useState(true)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: listsCount } = await supabase
        .from('shopping_lists')
        .select('*', { count: 'exact', head: true })

      // Count distinct users based on shopping_lists
      const { data: listUsers } = await supabase
        .from('shopping_lists')
        .select('user_id')

      const distinctUsers = new Set((listUsers || []).map(l => l.user_id)).size

      const mockAnalytics: Analytics = {
        totalProducts: productsCount || 0,
        totalLists: listsCount || 0,
        totalUsers: distinctUsers || 0,
        mostSearchedProducts: [
          { name: 'Arroz', count: 45 },
          { name: 'Feijão', count: 38 },
          { name: 'Leite', count: 32 },
          { name: 'Pão', count: 28 },
          { name: 'Café', count: 25 }
        ],
        averageShoppingTime: 25,
        abandonedItems: 12
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Visão geral do desempenho do supermercado</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Package className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Listas Criadas</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalLists}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-gray-900">
                  {showSensitiveData ? analytics.totalUsers : '***'}
                </p>
                <button
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.averageShoppingTime}min</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Searched Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Produtos Mais Buscados</h2>
          <div className="space-y-3">
            {analytics.mostSearchedProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <span className="text-sm font-medium text-primary-600">{product.count} buscas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">Gerenciar Produtos</div>
              <div className="text-sm text-gray-600">Adicionar, editar ou remover produtos do catálogo</div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">Gerenciar Departamentos</div>
              <div className="text-sm text-gray-600">Organizar setores da loja</div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">Relatórios Detalhados</div>
              <div className="text-sm text-gray-600">Exportar dados e análises completas</div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">Configurações</div>
              <div className="text-sm text-gray-600">Ajustar preferências do sistema</div>
            </button>
          </div>
        </div>
      </div>

      {/* Abandoned Items Alert */}
      {analytics.abandonedItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Itens Abandonados</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {analytics.abandonedItems} itens foram abandonados nas listas esta semana.
                  Considere revisar a disponibilidade ou preços desses produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
