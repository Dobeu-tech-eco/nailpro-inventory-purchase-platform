import { useState } from 'react';
import { Plus, Search, Filter, Package, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';
import type { Product, Category } from '../../types';
import { AddProductModal } from './add-product-modal';

interface ProductWithCategory extends Product {
  category?: Category;
}

const mockProducts: ProductWithCategory[] = [
  {
    id: '1',
    organization_id: '1',
    category_id: '1',
    sku: 'OPI-GEL-001',
    name: 'OPI GelColor - Big Apple Red',
    description: 'Classic red gel polish',
    brand: 'OPI',
    color: 'Red',
    size: '15ml',
    unit: 'bottle',
    cost_price: 12.50,
    retail_price: 18.00,
    reorder_point: 5,
    reorder_quantity: 12,
    image_url: null,
    barcode: '094100003306',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', organization_id: '1', name: 'Gel Polish', slug: 'gel-polish', parent_id: null, description: null, sort_order: 1, created_at: new Date().toISOString() },
  },
  {
    id: '2',
    organization_id: '1',
    category_id: '2',
    sku: 'DIP-PWD-001',
    name: 'Dip Powder - French White',
    description: 'Premium dip powder for French manicures',
    brand: 'SNS',
    color: 'White',
    size: '1oz',
    unit: 'jar',
    cost_price: 8.00,
    retail_price: 15.00,
    reorder_point: 10,
    reorder_quantity: 24,
    image_url: null,
    barcode: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '2', organization_id: '1', name: 'Dip Powder', slug: 'dip-powder', parent_id: null, description: null, sort_order: 2, created_at: new Date().toISOString() },
  },
  {
    id: '3',
    organization_id: '1',
    category_id: '3',
    sku: 'ACE-REM-32',
    name: 'Acetone Remover',
    description: '100% pure acetone for gel removal',
    brand: 'Beauty Secrets',
    color: null,
    size: '32oz',
    unit: 'bottle',
    cost_price: 6.50,
    retail_price: 12.00,
    reorder_point: 8,
    reorder_quantity: 12,
    image_url: null,
    barcode: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '3', organization_id: '1', name: 'Supplies', slug: 'supplies', parent_id: null, description: null, sort_order: 3, created_at: new Date().toISOString() },
  },
  {
    id: '4',
    organization_id: '1',
    category_id: '4',
    sku: 'LED-LAMP-PRO',
    name: 'LED UV Nail Lamp 48W',
    description: 'Professional LED UV lamp with smart sensor',
    brand: 'SUN',
    color: 'White',
    size: null,
    unit: 'piece',
    cost_price: 35.00,
    retail_price: 65.00,
    reorder_point: 2,
    reorder_quantity: 6,
    image_url: null,
    barcode: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '4', organization_id: '1', name: 'Equipment', slug: 'equipment', parent_id: null, description: null, sort_order: 4, created_at: new Date().toISOString() },
  },
  {
    id: '5',
    organization_id: '1',
    category_id: '5',
    sku: 'NAIL-TIP-COF',
    name: 'Coffin Nail Tips - Clear',
    description: 'Clear coffin-shaped nail tips, 500pc',
    brand: 'BTArtbox',
    color: 'Clear',
    size: '500pc',
    unit: 'box',
    cost_price: 8.00,
    retail_price: 16.00,
    reorder_point: 5,
    reorder_quantity: 10,
    image_url: null,
    barcode: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '5', organization_id: '1', name: 'Nail Tips', slug: 'nail-tips', parent_id: null, description: null, sort_order: 5, created_at: new Date().toISOString() },
  },
];

const mockStockLevels: Record<string, number> = {
  '1': 24,
  '2': 8,
  '3': 0,
  '4': 3,
  '5': 2,
};

export function InventoryPage() {
  const [products] = useState<ProductWithCategory[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = [
    { id: null, name: 'All Products' },
    { id: '1', name: 'Gel Polish' },
    { id: '2', name: 'Dip Powder' },
    { id: '3', name: 'Supplies' },
    { id: '4', name: 'Equipment' },
    { id: '5', name: 'Nail Tips' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (productId: string) => {
    const stock = mockStockLevels[productId] || 0;
    const product = products.find((p) => p.id === productId);
    if (!product) return { status: 'unknown', stock };

    if (stock === 0) return { status: 'out', stock };
    if (stock <= product.reorder_point) return { status: 'low', stock };
    return { status: 'ok', stock };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500">
            Manage your products and stock levels
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-64">
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 font-medium text-slate-900">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id || 'all'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      selectedCategory === category.id
                        ? 'bg-rose-50 text-rose-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {category.name}
                    <span className="text-xs text-slate-400">
                      {category.id === null
                        ? products.length
                        : products.filter((p) => p.category_id === category.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, SKUs, brands..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                      Cost
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const { status, stock } = getStockStatus(product.id);

                    return (
                      <tr
                        key={product.id}
                        className="border-b transition-colors hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                              <Package className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{product.name}</p>
                              <p className="text-sm text-slate-500">
                                {product.brand} {product.size && `- ${product.size}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {product.sku}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-600">
                            {product.category?.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Badge
                              variant={
                                status === 'out'
                                  ? 'destructive'
                                  : status === 'low'
                                  ? 'warning'
                                  : 'success'
                              }
                            >
                              {status === 'out'
                                ? 'Out of Stock'
                                : status === 'low'
                                ? 'Low Stock'
                                : 'In Stock'}
                            </Badge>
                            <span className="font-medium text-slate-900">{stock}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium text-slate-900">
                            ${product.cost_price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="rounded p-1 hover:bg-slate-100">
                              <Eye className="h-4 w-4 text-slate-500" />
                            </button>
                            <button className="rounded p-1 hover:bg-slate-100">
                              <Edit className="h-4 w-4 text-slate-500" />
                            </button>
                            <button className="rounded p-1 hover:bg-red-50">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-medium text-slate-900">No products found</h3>
                <p className="mt-1 text-slate-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
