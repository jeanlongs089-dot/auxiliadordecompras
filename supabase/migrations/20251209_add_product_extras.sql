-- Add additional fields for product scanning and details
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS barcode TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS valid_until DATE,
  ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}'::text[];

-- Seed: Bolo Seven Boys
INSERT INTO products (name, description, price, unit, category, department_id, in_stock, barcode, valid_until, allergens)
VALUES (
  'Bolo Seven Boys',
  'Bolo Seven Boys tradicional',
  5.70,
  'un',
  'Padaria',
  (SELECT id FROM departments WHERE name = 'Padaria' LIMIT 1),
  true,
  '7891193020400',
  DATE '2025-12-09',
  ARRAY['ovo', 'derivados de trigo', 'soja', 'leite']
)
ON CONFLICT (barcode) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  unit = EXCLUDED.unit,
  category = EXCLUDED.category,
  department_id = EXCLUDED.department_id,
  in_stock = EXCLUDED.in_stock,
  valid_until = EXCLUDED.valid_until,
  allergens = EXCLUDED.allergens;
