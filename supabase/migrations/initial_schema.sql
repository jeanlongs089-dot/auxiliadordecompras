-- Create stores table
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#22c55e',
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'un',
  category TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create list_items table
CREATE TABLE list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'un',
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

-- Policies for stores (public read)
CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (true);

-- Policies for departments (public read)
CREATE POLICY "Departments are viewable by everyone" ON departments
  FOR SELECT USING (true);

-- Policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Policies for shopping_lists (users can only access their own)
CREATE POLICY "Users can view own lists" ON shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lists" ON shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists" ON shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists" ON shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for list_items (users can only access items from their lists)
CREATE POLICY "Users can view items from own lists" ON list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = list_items.list_id
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items in own lists" ON list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = list_items.list_id
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in own lists" ON list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = list_items.list_id
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from own lists" ON list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = list_items.list_id
      AND shopping_lists.user_id = auth.uid()
    )
  );

-- Grant permissions
GRANT SELECT ON stores TO anon, authenticated;
GRANT SELECT ON departments TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT ALL ON shopping_lists TO authenticated;
GRANT ALL ON list_items TO authenticated;

-- Create function to update shopping_lists totals
CREATE OR REPLACE FUNCTION update_list_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE shopping_lists
    SET 
      total_items = (SELECT COUNT(*) FROM list_items WHERE list_id = NEW.list_id),
      completed_items = (SELECT COUNT(*) FROM list_items WHERE list_id = NEW.list_id AND checked = true),
      updated_at = NOW()
    WHERE id = NEW.list_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE shopping_lists
    SET 
      total_items = (SELECT COUNT(*) FROM list_items WHERE list_id = OLD.list_id),
      completed_items = (SELECT COUNT(*) FROM list_items WHERE list_id = OLD.list_id AND checked = true),
      updated_at = NOW()
    WHERE id = OLD.list_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for list_items changes
CREATE TRIGGER update_list_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON list_items
  FOR EACH ROW
  EXECUTE FUNCTION update_list_totals();

-- Insert sample data
INSERT INTO stores (name, address, phone) VALUES
  ('Supermercado Exemplo', 'Rua Principal, 123 - Centro', '(11) 1234-5678');

INSERT INTO departments (name, description, color, position_x, position_y, store_id) VALUES
  ('Padaria', 'Pães frescos, bolos e sobremesas', '#fbbf24', 50, 50, (SELECT id FROM stores LIMIT 1)),
  ('Açougue', 'Carnes frescas e embutidos', '#ef4444', 150, 50, (SELECT id FROM stores LIMIT 1)),
  ('Hortifruti', 'Frutas, legumes e verduras frescas', '#22c55e', 250, 50, (SELECT id FROM stores LIMIT 1)),
  ('Laticínios', 'Leite, queijos e iogurtes', '#3b82f6', 50, 130, (SELECT id FROM stores LIMIT 1)),
  ('Limpeza', 'Produtos de limpeza e higiene', '#8b5cf6', 150, 130, (SELECT id FROM stores LIMIT 1)),
  ('Bebidas', 'Refrigerantes, sucos e águas', '#06b6d4', 250, 130, (SELECT id FROM stores LIMIT 1)),
  ('Mercearia', 'Arroz, feijão, farinha e enlatados', '#f59e0b', 50, 210, (SELECT id FROM stores LIMIT 1)),
  ('Frios', 'Embutidos, queijos processados', '#84cc16', 150, 210, (SELECT id FROM stores LIMIT 1));

INSERT INTO products (name, description, price, unit, category, department_id, in_stock) VALUES
  ('Pão Francês', 'Pão fresco crocante por fora e macio por dentro', 0.50, 'un', 'Padaria', (SELECT id FROM departments WHERE name = 'Padaria' LIMIT 1), true),
  ('Bolo de Chocolate', 'Bolo caseiro de chocolate com cobertura', 25.90, 'un', 'Padaria', (SELECT id FROM departments WHERE name = 'Padaria' LIMIT 1), true),
  ('Carne Bovina', 'Contrafilé bovino de primeira qualidade', 45.90, 'kg', 'Açougue', (SELECT id FROM departments WHERE name = 'Açougue' LIMIT 1), true),
  ('Frango Inteiro', 'Frango fresco para assar', 18.90, 'kg', 'Açougue', (SELECT id FROM departments WHERE name = 'Açougue' LIMIT 1), true),
  ('Maçã Gala', 'Maçã vermelha e doce', 8.90, 'kg', 'Hortifruti', (SELECT id FROM departments WHERE name = 'Hortifruti' LIMIT 1), true),
  ('Banana Prata', 'Banana madura e saborosa', 4.90, 'kg', 'Hortifruti', (SELECT id FROM departments WHERE name = 'Hortifruti' LIMIT 1), true),
  ('Leite Integral', 'Leite pasteurizado 1L', 4.50, 'un', 'Laticínios', (SELECT id FROM departments WHERE name = 'Laticínios' LIMIT 1), true),
  ('Queijo Minas', 'Queijo minas frescal', 32.90, 'kg', 'Laticínios', (SELECT id FROM departments WHERE name = 'Laticínios' LIMIT 1), true),
  ('Detergente Líquido', 'Detergente para louças 500ml', 2.90, 'un', 'Limpeza', (SELECT id FROM departments WHERE name = 'Limpeza' LIMIT 1), true),
  ('Sabão em Pó', 'Sabão em pó para lavanderia 1kg', 12.90, 'un', 'Limpeza', (SELECT id FROM departments WHERE name = 'Limpeza' LIMIT 1), true),
  ('Coca-Cola 2L', 'Refrigerante Coca-Cola 2 litros', 8.90, 'un', 'Bebidas', (SELECT id FROM departments WHERE name = 'Bebidas' LIMIT 1), true),
  ('Suco de Laranja', 'Suco natural de laranja 1L', 6.90, 'un', 'Bebidas', (SELECT id FROM departments WHERE name = 'Bebidas' LIMIT 1), true),
  ('Arroz Branco', 'Arroz branco tipo 1 1kg', 6.50, 'un', 'Mercearia', (SELECT id FROM departments WHERE name = 'Mercearia' LIMIT 1), true),
  ('Feijão Carioca', 'Feijão carioca 1kg', 8.90, 'un', 'Mercearia', (SELECT id FROM departments WHERE name = 'Mercearia' LIMIT 1), true),
  ('Presunto', 'Presunto fatiado 200g', 12.90, 'un', 'Frios', (SELECT id FROM departments WHERE name = 'Frios' LIMIT 1), true),
  ('Queijo Prato', 'Queijo prato fatiado 200g', 15.90, 'un', 'Frios', (SELECT id FROM departments WHERE name = 'Frios' LIMIT 1), true);
