import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Check, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface ShoppingList {
  id: string
  name: string
  created_at: string
  user_id: string
  total_items: number
  completed_items: number
}

interface ListItem {
  id: string
  name: string
  quantity: number
  unit: string
  checked: boolean
  list_id: string
  product_id?: string
}

export default function ShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [newListName, setNewListName] = useState('')
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null)
  const [listItems, setListItems] = useState<ListItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'un' })

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLists(data || [])
    } catch (error) {
      toast.error('Erro ao carregar listas')
    } finally {
      setLoading(false)
    }
  }

  const createList = async () => {
    if (!newListName.trim()) return

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error('Você precisa estar logado para criar listas')
        return
      }

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([{ name: newListName, user_id: userData.user.id }])
        .select()
        .single()

      if (error) throw error
      
      setLists([data, ...lists])
      setNewListName('')
      toast.success('Lista criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar lista')
    }
  }

  const deleteList = async (listId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error
      
      setLists(lists.filter(list => list.id !== listId))
      if (selectedList?.id === listId) {
        setSelectedList(null)
        setListItems([])
      }
      toast.success('Lista excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir lista')
    }
  }

  const selectList = async (list: ShoppingList) => {
    setSelectedList(list)
    await fetchListItems(list.id)
  }

  const fetchListItems = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setListItems(data || [])
    } catch (error) {
      toast.error('Erro ao carregar itens da lista')
    }
  }

  const addItem = async () => {
    if (!newItem.name.trim() || !selectedList) return

    try {
      const { data, error } = await supabase
        .from('list_items')
        .insert([{
          list_id: selectedList.id,
          name: newItem.name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          checked: false
        }])
        .select()
        .single()

      if (error) throw error
      
      setListItems([...listItems, data])
      setNewItem({ name: '', quantity: 1, unit: 'un' })
      toast.success('Item adicionado com sucesso!')
    } catch (error) {
      toast.error('Erro ao adicionar item')
    }
  }

  const toggleItem = async (itemId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('list_items')
        .update({ checked })
        .eq('id', itemId)

      if (error) throw error
      
      setListItems(listItems.map(item => 
        item.id === itemId ? { ...item, checked } : item
      ))
    } catch (error) {
      toast.error('Erro ao atualizar item')
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      
      setListItems(listItems.filter(item => item.id !== itemId))
      toast.success('Item removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover item')
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Listas de Compras</h1>
        <p className="text-gray-600">Organize suas compras de forma inteligente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Suas Listas</h2>
              <button
                onClick={createList}
                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full"
                disabled={!newListName.trim()}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Nome da nova lista..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && createList()}
              />
            </div>

            <div className="space-y-2">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedList?.id === list.id
                      ? 'bg-primary-100 border-primary-300 border'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => selectList(list)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{list.name}</h3>
                      <p className="text-sm text-gray-600">
                        {list.total_items} itens • {list.completed_items} concluídos
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteList(list.id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {lists.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma lista criada ainda</p>
                  <p className="text-sm">Crie sua primeira lista acima!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedList ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedList.name}</h2>
                <div className="text-sm text-gray-600">
                  {listItems.filter(item => item.checked).length} / {listItems.length} concluídos
                </div>
              </div>

              <div className="mb-6">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nome do item..."
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  />
                  <input
                    type="number"
                    placeholder="Qtd"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    min="1"
                  />
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="cx">cx</option>
                  </select>
                  <button
                    onClick={addItem}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                    disabled={!newItem.name.trim()}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {listItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.checked ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    } border`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItem(item.id, !item.checked)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.checked
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {item.checked && <Check className="h-3 w-3 text-white" />}
                      </button>
                      <div>
                        <span className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {listItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum item na lista ainda</p>
                    <p className="text-sm">Adicione itens acima!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma lista</h3>
              <p className="text-gray-600">Escolha uma lista ao lado para visualizar e gerenciar seus itens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
