import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category_id: '',
    description: '',
    color: '',
    size: '',
    unit: 'piece',
    cost_price: '',
    retail_price: '',
    reorder_point: '5',
    reorder_quantity: '10',
    barcode: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    onSuccess();
    setFormData({
      name: '',
      sku: '',
      brand: '',
      category_id: '',
      description: '',
      color: '',
      size: '',
      unit: 'piece',
      cost_price: '',
      retail_price: '',
      reorder_point: '5',
      reorder_quantity: '10',
      barcode: '',
    });
  };

  if (!isOpen) return null;

  const categories = [
    { id: '1', name: 'Gel Polish' },
    { id: '2', name: 'Dip Powder' },
    { id: '3', name: 'Supplies' },
    { id: '4', name: 'Equipment' },
    { id: '5', name: 'Nail Tips' },
    { id: '6', name: 'Tools' },
    { id: '7', name: 'Consumables' },
  ];

  const units = ['piece', 'bottle', 'jar', 'box', 'pack', 'set', 'gallon', 'oz'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
          <CardTitle>Add New Product</CardTitle>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g., OPI GelColor - Big Apple Red"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    SKU *
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => updateField('sku', e.target.value.toUpperCase())}
                    placeholder="e.g., OPI-GEL-001"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Barcode
                  </label>
                  <Input
                    value={formData.barcode}
                    onChange={(e) => updateField('barcode', e.target.value)}
                    placeholder="Scan or enter barcode"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Brand
                  </label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => updateField('brand', e.target.value)}
                    placeholder="e.g., OPI, Gelish, SNS"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => updateField('category_id', e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Brief description of the product"
                  className="flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Specifications</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Color
                  </label>
                  <Input
                    value={formData.color}
                    onChange={(e) => updateField('color', e.target.value)}
                    placeholder="e.g., Red, Pink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Size
                  </label>
                  <Input
                    value={formData.size}
                    onChange={(e) => updateField('size', e.target.value)}
                    placeholder="e.g., 15ml, 1oz"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => updateField('unit', e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Pricing</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Cost Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost_price}
                      onChange={(e) => updateField('cost_price', e.target.value)}
                      placeholder="0.00"
                      className="pl-7"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Retail Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.retail_price}
                      onChange={(e) => updateField('retail_price', e.target.value)}
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Stock Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reorder Point
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.reorder_point}
                    onChange={(e) => updateField('reorder_point', e.target.value)}
                    placeholder="5"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Alert when stock falls below this level
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reorder Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.reorder_quantity}
                    onChange={(e) => updateField('reorder_quantity', e.target.value)}
                    placeholder="10"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Suggested quantity when reordering
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                Add Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
