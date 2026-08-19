ALTER TABLE products
  ADD COLUMN IF NOT EXISTS aisle TEXT,
  ADD COLUMN IF NOT EXISTS shelf TEXT;

CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  promotional_price DECIMAL(10,2) NOT NULL CHECK (promotional_price >= 0),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  label TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CHECK (ends_at > starts_at),
  UNIQUE (store_id, product_id, starts_at)
);

CREATE INDEX IF NOT EXISTS promotions_store_period_idx ON promotions (store_id, starts_at, ends_at);
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active promotions are viewable by everyone" ON promotions
  FOR SELECT USING (active = true AND starts_at <= NOW() AND ends_at >= NOW());

GRANT SELECT ON promotions TO anon, authenticated;

INSERT INTO promotions (store_id, product_id, promotional_price, starts_at, ends_at, label)
SELECT d.store_id, p.id, ROUND((p.price * 0.9)::numeric, 2), NOW(), NOW() + INTERVAL '30 days', 'Oferta da loja'
FROM products p
JOIN departments d ON d.id = p.department_id
WHERE p.in_stock = true
  AND NOT EXISTS (SELECT 1 FROM promotions existing WHERE existing.store_id = d.store_id AND existing.product_id = p.id)
ORDER BY p.name
LIMIT 4;
