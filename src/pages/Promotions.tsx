import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgePercent, CalendarClock, Search, ShoppingCart, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/contexts/StoreContext'
import { toast } from 'sonner'
import { discountPercentage } from '@/lib/shopping'
import { trackIntent } from '@/lib/analytics'

interface Promotion {
  id: string
  promotional_price: number
  ends_at: string
  label: string | null
  products: { id: string; name: string; price: number; image_url: string | null; category: string | null; unit: string; in_stock: boolean } | null
}

type SortOption = 'ending' | 'discount' | 'lowest-price'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Promotions() {
  const { activeStore } = useStore()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [category, setCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('ending')
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!activeStore) {
      setPromotions([])
      setLoading(false)
      return
    }
    setLoading(true)
    const now = new Date().toISOString()
    supabase.from('promotions')
      .select('id, promotional_price, ends_at, label, products(id, name, price, image_url, category, unit, in_stock)')
      .eq('store_id', activeStore.id)
      .eq('active', true)
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('ends_at')
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) {
          setPromotions([])
          toast.error('Não foi possível carregar as promoções desta loja')
        } else setPromotions((data || []) as unknown as Promotion[])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [activeStore])

  useEffect(() => {
    setCategory('')
    setSearchTerm('')
  }, [activeStore?.id])

  const categories = useMemo(() => [...new Set(promotions.map(item => item.products?.category).filter(Boolean))].sort() as string[], [promotions])
  const visible = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR')
    return promotions
      .filter(item => !category || item.products?.category === category)
      .filter(item => !normalizedSearch || item.products?.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      .sort((a, b) => {
        if (sortBy === 'discount') {
          const discountA = a.products ? discountPercentage(a.products.price, a.promotional_price) : 0
          const discountB = b.products ? discountPercentage(b.products.price, b.promotional_price) : 0
          return discountB - discountA
        }
        if (sortBy === 'lowest-price') return a.promotional_price - b.promotional_price
        return new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
      })
  }, [category, promotions, searchTerm, sortBy])

  const addToList = useCallback(async (promotion: Promotion) => {
    const product = promotion.products
    if (!product || !product.in_stock) return

    setAddingProductId(product.id)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error('Entre na sua conta para adicionar ofertas à lista')
        return
      }

      const { data: lists, error: listsError } = await supabase
        .from('shopping_lists')
        .select('id')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      if (listsError) throw listsError

      let listId = lists?.[0]?.id
      if (!listId) {
        const { data: newList, error: listError } = await supabase
          .from('shopping_lists')
          .insert({ name: 'Minha Lista', user_id: userData.user.id })
          .select('id')
          .single()
        if (listError || !newList) throw listError || new Error('Não foi possível criar a lista')
        listId = newList.id
      }

      const { data: existing, error: existingError } = await supabase
        .from('list_items')
        .select('id, quantity')
        .eq('list_id', listId)
        .eq('product_id', product.id)
        .maybeSingle()
      if (existingError) throw existingError

      const { error } = existing
        ? await supabase.from('list_items').update({ quantity: existing.quantity + 1, checked: false }).eq('id', existing.id)
        : await supabase.from('list_items').insert({
            list_id: listId,
            name: product.name,
            quantity: 1,
            unit: product.unit || 'un',
            product_id: product.id,
            checked: false,
          })
      if (error) throw error

      void trackIntent('item_added_to_list', activeStore?.id || null, {
        list_id: listId,
        product_id: product.id,
        promotion_id: promotion.id,
        promotional_price: promotion.promotional_price,
        source: 'promotions',
      })
      toast.success(`${product.name} adicionado à lista`)
    } catch {
      toast.error('Não foi possível adicionar esta oferta à lista')
    } finally {
      setAddingProductId(null)
    }
  }, [activeStore])

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-7">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-700">Economize na lista</span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Promoções</h1>
          <p className="mt-1 text-gray-600">Ofertas vigentes em {activeStore?.name || 'sua loja'}.</p>
        </div>
        <div className="mt-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          <label className="relative sm:col-span-1">
            <span className="sr-only">Buscar promoção</span>
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar produto em oferta" className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </label>
          <select value={category} onChange={event => setCategory(event.target.value)} className="rounded-md border border-gray-300 bg-white px-3 py-2" aria-label="Filtrar promoções por categoria">
            <option value="">Todas as categorias</option>
            {categories.map(value => <option key={value} value={value}>{value}</option>)}
          </select>
          <select value={sortBy} onChange={event => setSortBy(event.target.value as SortOption)} className="rounded-md border border-gray-300 bg-white px-3 py-2" aria-label="Ordenar promoções">
            <option value="ending">Terminando primeiro</option>
            <option value="discount">Maior desconto</option>
            <option value="lowest-price">Menor preço</option>
          </select>
        </div>
      </div>

      {loading ? <div className="py-16 text-center text-gray-500">Carregando ofertas…</div> : visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map(promotion => {
            const product = promotion.products
            if (!product) return null
            const discount = discountPercentage(product.price, promotion.promotional_price)
            return <article key={promotion.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex h-36 items-center justify-center bg-primary-50">
                {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full object-cover" /> : <Tag className="h-12 w-12 text-primary-500" />}
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2"><span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-800">{promotion.label || 'Oferta'}</span>{discount > 0 && <span className="flex items-center gap-1 text-sm font-bold text-green-700"><BadgePercent className="h-4 w-4" />{discount}% OFF</span>}</div>
                <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                <div className="mt-3 flex items-baseline gap-2"><span className="text-sm text-gray-500 line-through">{money.format(product.price)}</span><strong className="text-2xl text-primary-700">{money.format(promotion.promotional_price)}</strong></div>
                <p className="mt-2 flex items-center gap-1 text-xs text-gray-500"><CalendarClock className="h-3.5 w-3.5" />Até {new Date(promotion.ends_at).toLocaleDateString('pt-BR')}</p>
                <button onClick={() => void addToList(promotion)} disabled={!product.in_stock || addingProductId === product.id} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400">
                  <ShoppingCart className="h-4 w-4" />
                  {!product.in_stock ? 'Indisponível' : addingProductId === product.id ? 'Adicionando…' : 'Adicionar à lista'}
                </button>
                <Link to={`/produtos?busca=${encodeURIComponent(product.name)}`} className="mt-2 inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50">Ver no catálogo</Link>
              </div>
            </article>
          })}
        </div>
      ) : <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center"><Tag className="mx-auto mb-3 h-10 w-10 text-gray-400" /><h2 className="font-semibold text-gray-900">{promotions.length ? 'Nenhuma oferta encontrada' : 'Nenhuma promoção ativa'}</h2><p className="mt-1 text-sm text-gray-600">{promotions.length ? 'Tente limpar a busca ou escolher outra categoria.' : 'As novas ofertas aparecerão aqui com período e preço atualizados.'}</p>{promotions.length > 0 && <button onClick={() => { setSearchTerm(''); setCategory('') }} className="mt-4 font-medium text-primary-700 hover:text-primary-800">Limpar filtros</button>}</div>}
    </div>
  )
}
