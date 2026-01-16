export interface Organization {
  id: string;
  name: string;
  slug: string;
  zip_code: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  role: 'owner' | 'manager' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  organization_id: string;
  category_id: string | null;
  sku: string;
  name: string;
  description: string | null;
  brand: string | null;
  color: string | null;
  size: string | null;
  unit: string;
  cost_price: number;
  retail_price: number | null;
  reorder_point: number;
  reorder_quantity: number;
  image_url: string | null;
  barcode: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockLevel {
  id: string;
  product_id: string;
  location_id: string;
  quantity: number;
  last_counted_at: string | null;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  location_id: string;
  movement_type: 'purchase' | 'sale' | 'adjustment' | 'transfer_in' | 'transfer_out';
  quantity: number;
  reference_id: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  website: string | null;
  notes: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  is_local: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  organization_id: string;
  location_id: string;
  supplier_id: string | null;
  order_number: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'shipped' | 'received' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  expected_date: string | null;
  received_date: string | null;
  created_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_cost: number;
  created_at: string;
}

export interface InventoryAlert {
  id: string;
  organization_id: string;
  product_id: string;
  location_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  message: string;
  is_read: boolean;
  created_at: string;
}
