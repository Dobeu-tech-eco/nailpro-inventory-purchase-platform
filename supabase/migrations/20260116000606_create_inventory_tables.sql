/*
  # Inventory Management Schema

  1. New Tables
    - `categories`
      - Product categories for nail salon inventory (Gel Polish, Dip Powder, etc.)
      - Supports hierarchical categorization with parent_id

    - `products`
      - Core product catalog with nail salon specific fields
      - Includes SKU, barcode, color, size for polish variants
      - Cost and retail pricing
      - Reorder points for automated alerts

    - `stock_levels`
      - Current stock quantities per product per location
      - Enables multi-location inventory tracking

    - `stock_movements`
      - Audit trail for all inventory changes
      - Types: purchase, sale, adjustment, transfer_in, transfer_out

  2. Security
    - RLS policies for organization-based data isolation
    - Staff can view, managers/owners can modify
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, slug)
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sku text NOT NULL,
  name text NOT NULL,
  description text,
  brand text,
  color text,
  size text,
  unit text NOT NULL DEFAULT 'piece',
  cost_price decimal(10,2) NOT NULL DEFAULT 0,
  retail_price decimal(10,2),
  reorder_point integer NOT NULL DEFAULT 5,
  reorder_quantity integer NOT NULL DEFAULT 10,
  image_url text,
  barcode text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, sku)
);

CREATE TABLE IF NOT EXISTS stock_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  last_counted_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, location_id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  movement_type text NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'transfer_in', 'transfer_out')),
  quantity integer NOT NULL,
  reference_id uuid,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_organization ON categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_organization ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(organization_id, sku);
CREATE INDEX IF NOT EXISTS idx_stock_levels_product ON stock_levels(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_levels_location ON stock_levels(location_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization categories"
  ON categories FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Managers can insert categories"
  ON categories FOR INSERT TO authenticated
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Managers can update categories"
  ON categories FOR UPDATE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')))
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Owners can delete categories"
  ON categories FOR DELETE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role = 'owner'));

CREATE POLICY "Users can view their organization products"
  ON products FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Managers can insert products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Managers can update products"
  ON products FOR UPDATE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')))
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Owners can delete products"
  ON products FOR DELETE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role = 'owner'));

CREATE POLICY "Users can view stock levels for their locations"
  ON stock_levels FOR SELECT TO authenticated
  USING (location_id IN (
    SELECT l.id FROM locations l
    JOIN user_profiles up ON up.organization_id = l.organization_id
    WHERE up.user_id = auth.uid()
  ));

CREATE POLICY "Staff can update stock levels"
  ON stock_levels FOR UPDATE TO authenticated
  USING (location_id IN (
    SELECT l.id FROM locations l
    JOIN user_profiles up ON up.organization_id = l.organization_id
    WHERE up.user_id = auth.uid()
  ))
  WITH CHECK (location_id IN (
    SELECT l.id FROM locations l
    JOIN user_profiles up ON up.organization_id = l.organization_id
    WHERE up.user_id = auth.uid()
  ));

CREATE POLICY "Staff can insert stock levels"
  ON stock_levels FOR INSERT TO authenticated
  WITH CHECK (location_id IN (
    SELECT l.id FROM locations l
    JOIN user_profiles up ON up.organization_id = l.organization_id
    WHERE up.user_id = auth.uid()
  ));

CREATE POLICY "Users can view stock movements for their locations"
  ON stock_movements FOR SELECT TO authenticated
  USING (location_id IN (
    SELECT l.id FROM locations l
    JOIN user_profiles up ON up.organization_id = l.organization_id
    WHERE up.user_id = auth.uid()
  ));

CREATE POLICY "Staff can insert stock movements"
  ON stock_movements FOR INSERT TO authenticated
  WITH CHECK (
    location_id IN (
      SELECT l.id FROM locations l
      JOIN user_profiles up ON up.organization_id = l.organization_id
      WHERE up.user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );
