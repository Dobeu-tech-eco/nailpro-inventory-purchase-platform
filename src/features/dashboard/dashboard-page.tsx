import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../components/ui';
import { useAuth } from '../../hooks';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
            <Icon className="h-5 w-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1">
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              trend === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-slate-500">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface AlertItem {
  id: string;
  product: string;
  type: 'low' | 'out';
  quantity: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  trend: 'up' | 'down';
}

const mockAlerts: AlertItem[] = [
  { id: '1', product: 'OPI GelColor - Red', type: 'low', quantity: 3 },
  { id: '2', product: 'Acetone Remover 32oz', type: 'out', quantity: 0 },
  { id: '3', product: 'Cuticle Oil - Lavender', type: 'low', quantity: 5 },
  { id: '4', product: 'Nail Tips - Coffin Clear', type: 'low', quantity: 2 },
];

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'OPI GelColor Collection', category: 'Gel Polish', sold: 234, revenue: 2340, trend: 'up' },
  { id: '2', name: 'Dip Powder - French White', category: 'Dip Powder', sold: 187, revenue: 1870, trend: 'up' },
  { id: '3', name: 'Acrylic Nail Kit', category: 'Supplies', sold: 145, revenue: 3625, trend: 'down' },
  { id: '4', name: 'LED Nail Lamp Pro', category: 'Equipment', sold: 89, revenue: 4450, trend: 'up' },
];

const mockRecentOrders = [
  { id: 'PO-001', supplier: 'Beauty Plus Supply', items: 12, total: 456.80, status: 'shipped' },
  { id: 'PO-002', supplier: 'Nail Warehouse NJ', items: 8, total: 234.50, status: 'pending' },
  { id: 'PO-003', supplier: 'Pro Nail Distributor', items: 25, total: 892.00, status: 'received' },
];

export function DashboardPage() {
  const { profile, organization, currentLocation } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {profile?.first_name}
        </h1>
        <p className="text-slate-500">
          Here's what's happening at {currentLocation?.name || organization?.name} today
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value="1,284"
          change={12}
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Low Stock Items"
          value="23"
          change={8}
          icon={AlertTriangle}
          trend="down"
        />
        <StatCard
          title="Pending Orders"
          value="7"
          change={15}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Monthly Spend"
          value="$4,832"
          change={5}
          icon={DollarSign}
          trend="down"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Products</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg font-semibold text-slate-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {product.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-slate-500">{product.sold} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock Alerts</CardTitle>
            <Badge variant="destructive">{mockAlerts.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 p-3"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                      alert.type === 'out'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{alert.product}</p>
                    <p className="text-xs text-slate-500">
                      {alert.type === 'out'
                        ? 'Out of stock'
                        : `Only ${alert.quantity} left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-100 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <ShoppingCart className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{order.id}</p>
                      <Badge
                        variant={
                          order.status === 'received'
                            ? 'success'
                            : order.status === 'shipped'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{order.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">{order.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <Package className="h-6 w-6 text-rose-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Add Product</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <ShoppingCart className="h-6 w-6 text-rose-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">New Order</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <Clock className="h-6 w-6 text-rose-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Stock Count</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <BarChart3 className="h-6 w-6 text-rose-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
