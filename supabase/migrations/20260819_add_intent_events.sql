CREATE TABLE IF NOT EXISTS intent_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL CHECK (event_name IN (
    'store_selected', 'product_searched', 'search_no_results', 'product_viewed',
    'location_viewed', 'item_added_to_list', 'item_checked', 'shopping_session_completed'
  )),
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS intent_events_store_created_idx ON intent_events (store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS intent_events_name_created_idx ON intent_events (event_name, created_at DESC);

ALTER TABLE intent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create intent events" ON intent_events
  FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());

GRANT INSERT ON intent_events TO anon, authenticated;
