import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Store {
  id: string
  name: string
  address: string | null
}

interface StoreContextValue {
  stores: Store[]
  activeStore: Store | null
  loading: boolean
  selectStore: (storeId: string) => void
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)
const STORAGE_KEY = 'auxiliador:active-store'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([])
  const [activeStoreId, setActiveStoreId] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase.from('stores').select('id, name, address').order('name').then(({ data, error }) => {
      if (!active) return
      if (!error) {
        const nextStores = (data || []) as Store[]
        setStores(nextStores)
        setActiveStoreId(current => nextStores.some(store => store.id === current) ? current : (nextStores[0]?.id || ''))
      }
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (activeStoreId) localStorage.setItem(STORAGE_KEY, activeStoreId)
  }, [activeStoreId])

  const selectStore = useCallback((storeId: string) => {
    if (stores.some(store => store.id === storeId)) setActiveStoreId(storeId)
  }, [stores])

  const value = useMemo(() => ({
    stores,
    activeStore: stores.find(store => store.id === activeStoreId) || null,
    loading,
    selectStore,
  }), [stores, activeStoreId, loading, selectStore])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}
