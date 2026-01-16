import { useState } from 'react';
import { Plus, Search, Filter, ShoppingCart, Eye, FileText, Truck, Check, Clock, X } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';

type OrderStatus = 'draft' | 'pending' | 'approved' | 'ordered' | 'shipped' | 'received' | 'cancelled';

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_name: string;
  status: OrderStatus;
  items_count: number;
  subtotal: number;
  tax: number;
  total: number;
  expected_date: string | null;
  created_at: string;
}

const mockOrders: PurchaseOrder[] = [
  {
    id: '1',
    order_number: 'PO-2025-001',
    supplier_name: 'Beauty Plus Supply',
    status: 'shipped',
    items_count: 12,
    subtotal: 420.00,
    tax: 36.80,
    total: 456.80,
    expected_date: '2025-01-18',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    order_number: 'PO-2025-002',
    supplier_name: 'Nail Warehouse NJ',
    status: 'pending',
    items_count: 8,
    subtotal: 215.00,
    tax: 19.50,
    total: 234.50,
    expected_date: null,
    created_at: '2025-01-12T14:30:00Z',
  },
  {
    id: '3',
    order_number: 'PO-2025-003',
    supplier_name: 'Pro Nail Distributor',
    status: 'received',
    items_count: 25,
    subtotal: 820.00,
    tax: 72.00,
    total: 892.00,
    expected_date: '2025-01-08',
    created_at: '2025-01-05T09:15:00Z',
  },
  {
    id: '4',
    order_number: 'PO-2025-004',
    supplier_name: 'Sally Beauty',
    status: 'draft',
    items_count: 5,
    subtotal: 145.00,
    tax: 0,
    total: 145.00,
    expected_date: null,
    created_at: '2025-01-14T16:00:00Z',
  },
  {
    id: '5',
    order_number: 'PO-2025-005',
    supplier_name: 'Beauty Plus Supply',
    status: 'ordered',
    items_count: 18,
    subtotal: 560.00,
    tax: 49.00,
    total: 609.00,
    expected_date: '2025-01-22',
    created_at: '2025-01-13T11:45:00Z',
  },
];

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'; icon: React.ElementType }> = {
  draft: { label: 'Draft', variant: 'secondary', icon: FileText },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  approved: { label: 'Approved', variant: 'default', icon: Check },
  ordered: { label: 'Ordered', variant: 'default', icon: ShoppingCart },
  shipped: { label: 'Shipped', variant: 'default', icon: Truck },
  received: { label: 'Received', variant: 'success', icon: Check },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: X },
};

export function OrdersPage() {
  const [orders] = useState<PurchaseOrder[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  const statusFilters: { status: OrderStatus | null; label: string }[] = [
    { status: null, label: 'All Orders' },
    { status: 'draft', label: 'Drafts' },
    { status: 'pending', label: 'Pending' },
    { status: 'ordered', label: 'Ordered' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'received', label: 'Received' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === null || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-500">
            Manage your supplier orders and track deliveries
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.status || 'all'}
            onClick={() => setSelectedStatus(filter.status)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              selectedStatus === filter.status
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders or suppliers..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const { label, variant, icon: StatusIcon } = statusConfig[order.status];

          return (
            <Card key={order.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                      <ShoppingCart className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{order.order_number}</h3>
                        <Badge variant={variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {label}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{order.supplier_name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span>{order.items_count} items</span>
                        <span>Created {formatDate(order.created_at)}</span>
                        {order.expected_date && (
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Expected {formatDate(order.expected_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-500">
                        Subtotal: ${order.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {order.status === 'draft' && (
                        <Button size="sm">
                          Submit
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button size="sm" variant="success">
                          Receive
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">No orders found</h3>
            <p className="mt-1 text-slate-500">
              {searchQuery || selectedStatus
                ? 'Try adjusting your search or filters'
                : 'Create your first purchase order'}
            </p>
            {!searchQuery && !selectedStatus && (
              <Button className="mt-4">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
