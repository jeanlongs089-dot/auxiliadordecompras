import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Navigation, Search } from 'lucide-react'
''
interface Department {
  id: string
  name: string
  color: string
  position_x: number
  position_y: number
  description: string
}

interface Product {
  id: string
  name: string
  department_id: string
  in_stock: boolean
}

export default function StoreMap() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchDepartments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, department_id, in_stock')
        .eq('in_stock', true)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([fetchDepartments(), fetchProducts()])
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [fetchDepartments, fetchProducts])

  const findProductLocation = useCallback((productName: string) => {
    const term = productName.trim().toLowerCase()
    if (!term) return null
    const product = products.find(p => p.name.toLowerCase().includes(term))
    if (!product) return null
    return departments.find(d => d.id === product.department_id) || null
  }, [products, departments])

  const handleSearch = useCallback(() => {
    const department = findProductLocation(searchTerm)
    if (department) {
      setSelectedDepartment(department)
    } else if (searchTerm.trim()) {
      alert('Produto não encontrado ou fora de estoque')
    }
  }, [searchTerm, findProductLocation])

  const getDepartmentProducts = useCallback((departmentId: string) => {
    return products.filter(p => p.department_id === departmentId)
  }, [products])

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa da Loja</h1>
        <p className="text-gray-600">Encontre produtos e departamentos facilmente</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar produto (ex: Arroz, Feijão, Leite)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium flex items-center space-x-2"
          >
            <Navigation className="h-5 w-5" />
            <span>Localizar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Store Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Planta da Loja</h2>
            
            {/* Interactive Map */}
            <div className="relative bg-gray-100 rounded-lg p-8 min-h-96">
              <div className="absolute inset-0 p-8">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  {/* Store Layout */}
                  <rect x="0" y="0" width="400" height="300" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
                  
                  {/* Entrance */}
                  <rect x="180" y="290" width="40" height="10" fill="#22c55e"/>
                  <text x="200" y="285" textAnchor="middle" className="text-xs fill-green-700">ENTRADA</text>
                  
                  {/* Departments */}
                  {departments.map((dept, index) => {
                    const cols = 3
                    // const rows = Math.ceil(departments.length / cols)
                    const col = index % cols
                    const row = Math.floor(index / cols)
                    const x = 50 + col * 100
                    const y = 50 + row * 80
                    
                    return (
                      <g key={dept.id}>
                        <rect
                          x={x}
                          y={y}
                          width="80"
                          height="60"
                          fill={selectedDepartment?.id === dept.id ? '#dcfce7' : dept.color}
                          stroke={selectedDepartment?.id === dept.id ? '#16a34a' : '#9ca3af'}
                          strokeWidth={selectedDepartment?.id === dept.id ? '3' : '1'}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedDepartment(dept)}
                        />
                        <text
                          x={x + 40}
                          y={y + 25}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-800"
                        >
                          {dept.name}
                        </text>
                        <text
                          x={x + 40}
                          y={y + 40}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {getDepartmentProducts(dept.id).length} produtos
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
              
              {selectedDepartment && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedDepartment.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{selectedDepartment.description}</p>
                  <div className="text-sm">
                    <strong>Produtos disponíveis:</strong>
                    <ul className="mt-1 space-y-1">
                      {getDepartmentProducts(selectedDepartment.id).slice(0, 5).map(product => (
                        <li key={product.id} className="text-gray-700">• {product.name}</li>
                      ))}
                      {getDepartmentProducts(selectedDepartment.id).length > 5 && (
                        <li className="text-gray-500">... e mais {getDepartmentProducts(selectedDepartment.id).length - 5} produtos</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Department List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Departamentos</h2>
            
            <div className="space-y-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDepartment?.id === dept.id
                      ? 'bg-primary-100 border-primary-300 border'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">
                        {getDepartmentProducts(dept.id).length} produtos disponíveis
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {departments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum departamento cadastrado</p>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-primary-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dicas Rápidas</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use a busca para encontrar produtos rapidamente</li>
              <li>• Clique nos departamentos para ver detalhes</li>
              <li>• Os produtos em verde estão disponíveis em estoque</li>
              <li>• O mapa mostra a localização de cada departamento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
