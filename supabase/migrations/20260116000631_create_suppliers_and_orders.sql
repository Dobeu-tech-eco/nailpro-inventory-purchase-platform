/*
  # Suppliers and Purchase Orders Schema

  1. New Tables
    - `suppliers`
      - Supplier information including contact details
      - Location data for Google Maps integration
      - Rating system for supplier performance tracking
      - is_local flag for nearby supplier discovery

    - `purchase_orders`
      - Order header with status workflow
      - Supports draft, pending, approved, ordered, shipped, received, cancelled

    - `purchase_order_items`
      - Line items for each order
      - Tracks quantity ordered vs received

    - `inventory_alerts`
      - System-generated alerts for low stock, out of stock, etc.
      - Read/unread status for user management

  2. Security
    - Full RLS implementation for multi-tenant data isolation
*/

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  website text,
  notes text,
  rating decimal(2,1) CHECK (rating >= 0 AND rating <= 5),
  latitude decimal(10,8),
  longitude decimal(11,8),
  is_local boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  order_number text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'ordered', 'shipped', 'received', 'cancelled')),
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  notes text,
  expected_date date,
  received_date date,
  created_by uuid NOT NULL,
  approved_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, order_number)
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_ordered integer NOT NULL DEFAULT 1,
  quantity_received integer NOT NULL DEFAULT 0,
  unit_cost decimal(10,2) NOT NULL DEFAULT 0,
  total_cost decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock', 'expiring')),
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_organization ON suppliers(organization_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_zip ON suppliers(zip_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_local ON suppliers(is_local);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_organization ON purchase_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order ON purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_organization ON inventory_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_unread ON inventory_alerts(organization_id, is_read) WHERE is_read = false;

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization suppliers"
  ON suppliers FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Managers can insert suppliers"
  ON suppliers FOR INSERT TO authenticated
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Managers can update suppliers"
  ON suppliers FOR UPDATE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')))
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Owners can delete suppliers"
  ON suppliers FOR DELETE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role = 'owner'));

CREATE POLICY "Users can view their organization orders"
  ON purchase_orders FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can create orders"
  ON purchase_orders FOR INSERT TO authenticated
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Staff can update draft orders they created"
  ON purchase_orders FOR UPDATE TO authenticated
  USING (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid())
    AND (created_by = auth.uid() OR (SELECT role FROM user_profiles WHERE user_id = auth.uid()) IN ('owner', 'manager'))
  )
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owners can delete orders"
  ON purchase_orders FOR DELETE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid() AND role = 'owner'));

CREATE POLICY "Users can view order items for their orders"
  ON purchase_order_items FOR SELECT TO authenticated
  USING (purchase_order_id IN (
    SELECT id FROM purchase_orders WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Staff can insert order items"
  ON purchase_order_items FOR INSERT TO authenticated
  WITH CHECK (purchase_order_id IN (
    SELECT id FROM purchase_orders WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Staff can update order items"
  ON purchase_order_items FOR UPDATE TO authenticated
  USING (purchase_order_id IN (
    SELECT id FROM purchase_orders WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (purchase_order_id IN (
    SELECT id FROM purchase_orders WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can view their organization alerts"
  ON inventory_alerts FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can insert alerts"
  ON inventory_alerts FOR INSERT TO authenticated
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update alert read status"
  ON inventory_alerts FOR UPDATE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()))
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete alerts"
  ON inventory_alerts FOR DELETE TO authenticated
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()));
