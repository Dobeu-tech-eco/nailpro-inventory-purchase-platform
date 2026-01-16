import { useState } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Globe, Star, ExternalLink, Truck } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';

interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  website: string | null;
  rating: number | null;
  is_local: boolean;
  order_count: number;
  total_spent: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Beauty Plus Supply',
    contact_name: 'Maria Santos',
    email: 'orders@beautyplus.com',
    phone: '(732) 555-0123',
    address: '456 Beauty Ave',
    city: 'Neptune',
    state: 'NJ',
    zip_code: '07753',
    website: 'https://beautyplussupply.com',
    rating: 4.8,
    is_local: true,
    order_count: 24,
    total_spent: 12450.00,
  },
  {
    id: '2',
    name: 'Nail Warehouse NJ',
    contact_name: 'John Kim',
    email: 'sales@nailwarehousenz.com',
    phone: '(732) 555-0456',
    address: '789 Supply St',
    city: 'Asbury Park',
    state: 'NJ',
    zip_code: '07712',
    website: null,
    rating: 4.5,
    is_local: true,
    order_count: 18,
    total_spent: 8920.00,
  },
  {
    id: '3',
    name: 'Pro Nail Distributor',
    contact_name: 'Lisa Chen',
    email: 'contact@pronail.com',
    phone: '(201) 555-0789',
    address: '123 Distribution Center',
    city: 'Newark',
    state: 'NJ',
    zip_code: '07102',
    website: 'https://pronaildist.com',
    rating: 4.2,
    is_local: false,
    order_count: 12,
    total_spent: 6780.00,
  },
  {
    id: '4',
    name: 'Sally Beauty Supply',
    contact_name: null,
    email: 'corporate@sallybeauty.com',
    phone: '(800) 555-2456',
    address: '321 Retail Plaza',
    city: 'Freehold',
    state: 'NJ',
    zip_code: '07728',
    website: 'https://sallybeauty.com',
    rating: 4.0,
    is_local: false,
    order_count: 8,
    total_spent: 3450.00,
  },
];

export function SuppliersPage() {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocalOnly, setShowLocalOnly] = useState(false);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocal = !showLocalOnly || supplier.is_local;

    return matchesSearch && matchesLocal;
  });

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-300'
            )}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-slate-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500">
            Manage your supplier relationships and discover local vendors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MapPin className="h-4 w-4" />
            Find Local
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers, cities..."
            className="pl-10"
          />
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2">
          <input
            type="checkbox"
            checked={showLocalOnly}
            onChange={(e) => setShowLocalOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span className="text-sm text-slate-600">Local suppliers only</span>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                    <Truck className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                      {supplier.is_local && (
                        <Badge variant="success">Local</Badge>
                      )}
                    </div>
                    {supplier.contact_name && (
                      <p className="text-sm text-slate-600">{supplier.contact_name}</p>
                    )}
                    <div className="mt-1">{renderStars(supplier.rating)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {supplier.address && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>
                      {supplier.address}, {supplier.city}, {supplier.state} {supplier.zip_code}
                    </span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <a href={`tel:${supplier.phone}`} className="hover:text-rose-600">
                      {supplier.phone}
                    </a>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${supplier.email}`} className="hover:text-rose-600">
                      {supplier.email}
                    </a>
                  </div>
                )}
                {supplier.website && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-rose-600"
                    >
                      {supplier.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-slate-500">Orders</p>
                    <p className="font-semibold text-slate-900">{supplier.order_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Spent</p>
                    <p className="font-semibold text-slate-900">
                      ${supplier.total_spent.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  New Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">No suppliers found</h3>
            <p className="mt-1 text-slate-500">
              Try adjusting your search or add a new supplier
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline">
                <MapPin className="h-4 w-4" />
                Find Local Suppliers
              </Button>
              <Button>
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
