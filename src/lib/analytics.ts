import { supabase } from '@/lib/supabase'

export type IntentEvent =
  | 'store_selected'
  | 'product_searched'
  | 'search_no_results'
  | 'product_viewed'
  | 'location_viewed'
  | 'item_added_to_list'
  | 'item_checked'
  | 'shopping_session_completed'

export async function trackIntent(eventName: IntentEvent, storeId: string | null, properties: Record<string, unknown> = {}) {
  const { data } = await supabase.auth.getUser()
  const { error } = await supabase.from('intent_events').insert({
    event_name: eventName,
    store_id: storeId,
    user_id: data.user?.id || null,
    properties,
  })

  // Analytics must never block the shopper flow while a migration is pending.
  if (error && import.meta.env.DEV) console.info('Evento não registrado:', eventName)
}
