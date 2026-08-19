import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ListPlus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const templates = [
  { id: 'cafe', name: 'Café da manhã', description: 'O essencial para começar bem o dia.', items: ['Pão', 'Leite', 'Café', 'Frutas', 'Manteiga'] },
  { id: 'churrasco', name: 'Churrasco', description: 'Uma base prática para reunir a turma.', items: ['Carnes', 'Bebidas', 'Carvão', 'Pão de alho', 'Farofa'] },
  { id: 'limpeza', name: 'Limpeza da casa', description: 'Reposição dos produtos mais usados.', items: ['Detergente', 'Sabão em pó', 'Desinfetante', 'Esponjas', 'Sacos de lixo'] },
]

export default function PrebuiltLists() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [creating, setCreating] = useState<string | null>(null)

  const importTemplate = async (template: typeof templates[number]) => {
    if (!user) return
    setCreating(template.id)
    try {
      const { data: list, error: listError } = await supabase.from('shopping_lists')
        .insert({ name: template.name, user_id: user.id }).select('id').single()
      if (listError || !list) throw listError || new Error('Lista não criada')
      const { error: itemsError } = await supabase.from('list_items').insert(template.items.map(name => ({
        list_id: list.id, name, quantity: 1, unit: 'un', checked: false,
      })))
      if (itemsError) {
        await supabase.from('shopping_lists').delete().eq('id', list.id)
        throw itemsError
      }
      toast.success(`Lista “${template.name}” criada!`)
      navigate('/listas')
    } catch {
      toast.error('Não foi possível criar a lista sugerida')
    } finally {
      setCreating(null)
    }
  }

  return <div className="mx-auto max-w-6xl px-6 py-10">
    <span className="text-sm font-semibold uppercase tracking-wider text-primary-700">Comece mais rápido</span>
    <h1 className="mt-2 text-3xl font-bold text-gray-900">Listas sugeridas</h1>
    <p className="mb-7 mt-1 text-gray-600">Escolha um modelo e ajuste os itens na sua lista.</p>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {templates.map(template => <article key={template.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Sparkles className="mb-5 h-7 w-7 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
        <p className="mt-1 text-sm text-gray-600">{template.description}</p>
        <ul className="my-5 flex-1 space-y-2 text-sm text-gray-700">{template.items.map(item => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary-600" />{item}</li>)}</ul>
        {user ? <button onClick={() => importTemplate(template)} disabled={creating !== null} className="flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 disabled:bg-gray-400"><ListPlus className="h-4 w-4" />{creating === template.id ? 'Criando…' : 'Usar esta lista'}</button> : <Link to="/login" className="rounded-md border border-primary-600 px-4 py-2.5 text-center font-medium text-primary-700 hover:bg-primary-50">Entre para usar</Link>}
      </article>)}
    </div>
  </div>
}
