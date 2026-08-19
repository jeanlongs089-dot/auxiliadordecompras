import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '@/contexts/StoreContext'
import { trackIntent } from '@/lib/analytics'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  category: string
  department_id: string
  image_url?: string
  in_stock: boolean
  aisle?: string | null
  shelf?: string | null
}

interface Department {
  id: string
  name: string
  color: string
}

export default function Products() {
  const [searchParams] = useSearchParams()
  const { activeStore } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('busca') || '')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  

  const fetchProducts = useCallback(async () => {
    try {
      if (!activeStore) {
        setProducts([])
        return
      }

      let query = supabase
        .from('products')
        .select('*, departments!inner(store_id)')
        .eq('departments.store_id', activeStore.id)

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`)
      }

      if (selectedDepartment) {
        query = query.eq('department_id', selectedDepartment)
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch {
      toast.error('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }, [activeStore, searchTerm, selectedDepartment, sortBy, sortOrder])

  const fetchDepartments = useCallback(async () => {
    try {
      if (!activeStore) {
        setDepartments([])
        return
      }
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('store_id', activeStore.id)
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch {
      toast.error('Erro ao carregar departamentos')
    }
  }, [activeStore])

  useEffect(() => {
    const term = searchTerm.trim()
    if (term.length < 2 || loading) return
    const timeout = window.setTimeout(() => {
      void trackIntent(products.length ? 'product_searched' : 'search_no_results', activeStore?.id || null, {
        term,
        result_count: products.length,
      })
    }, 600)
    return () => window.clearTimeout(timeout)
  }, [activeStore, loading, products.length, searchTerm])

  useEffect(() => {
    setSelectedDepartment('')
  }, [activeStore?.id])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([fetchProducts(), fetchDepartments()])
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [fetchProducts, fetchDepartments])

  const addToList = useCallback(async (product: Product) => {
    try {
      // Get user's active shopping list or create one
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error('Você precisa estar logado para adicionar itens à lista')
        return
      }

      // Find or create a default list
      const { data: lists } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userData.user.id)
        .limit(1)

      let listId = lists?.[0]?.id

      if (!listId) {
        const { data: newList, error: listError } = await supabase
          .from('shopping_lists')
          .insert([{ name: 'Minha Lista', user_id: userData.user.id }])
          .select()
          .single()
        if (listError || !newList) throw listError || new Error('Não foi possível criar a lista')
        listId = newList.id
      }

      const { data: existing } = await supabase
        .from('list_items')
        .select('id, quantity')
        .eq('list_id', listId)
        .eq('product_id', product.id)
        .maybeSingle()

      const { error } = existing
        ? await supabase.from('list_items').update({ quantity: existing.quantity + 1, checked: false }).eq('id', existing.id)
        : await supabase.from('list_items').insert({
            list_id: listId,
            name: product.name,
            quantity: 1,
            unit: product.unit,
            product_id: product.id,
            checked: false,
          })

      if (error) throw error
      void trackIntent('item_added_to_list', activeStore?.id || null, { list_id: listId, product_id: product.id, quantity: 1 })
      toast.success(`${product.name} adicionado à sua lista!`)
    } catch {
      toast.error('Erro ao adicionar produto à lista')
    }
  }, [activeStore])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(term) ||
                           (product.description || '').toLowerCase().includes(term)
      const matchesDepartment = !selectedDepartment || product.department_id === selectedDepartment
      return matchesSearch && matchesDepartment
    })
  }, [products, searchTerm, selectedDepartment])

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Produtos</h1>
        <p className="text-gray-600">Preços e disponibilidade em {activeStore?.name || 'sua loja'}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos os Departamentos</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="price">Ordenar por Preço</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium"
          >
            {sortOrder === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {filteredProducts.length} produto(s) encontrado(s)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="mb-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description || 'Sem descrição disponível'}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.in_stock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'Em estoque' : 'Indisponível'}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {departments.find(d => d.id === product.department_id)?.name || 'Sem departamento'}
                  </span>
                </div>
                {(product.aisle || product.shelf) && <p className="mt-2 text-xs font-medium text-primary-700">{product.aisle ? `Corredor ${product.aisle}` : ''}{product.aisle && product.shelf ? ' • ' : ''}{product.shelf ? `Prateleira ${product.shelf}` : ''}</p>}
              </div>

              <button
                onClick={() => addToList(product)}
                disabled={!product.in_stock}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {product.in_stock ? 'Adicionar à lista' : 'Indisponível'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-600">Tente ajustar seus filtros de busca</p>
        </div>
      )}
    </div>
  )
}
