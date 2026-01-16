import { useState } from 'react';
import { AlertTriangle, Package, Check, Bell, BellOff, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';

type AlertType = 'low_stock' | 'out_of_stock' | 'overstock' | 'price_change';

interface Alert {
  id: string;
  type: AlertType;
  product_name: string;
  product_sku: string;
  message: string;
  is_read: boolean;
  created_at: string;
  quantity?: number;
  threshold?: number;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'out_of_stock',
    product_name: 'Acetone Remover 32oz',
    product_sku: 'ACE-REM-32',
    message: 'Product is out of stock',
    is_read: false,
    created_at: '2025-01-15T10:00:00Z',
    quantity: 0,
    threshold: 8,
  },
  {
    id: '2',
    type: 'low_stock',
    product_name: 'OPI GelColor - Big Apple Red',
    product_sku: 'OPI-GEL-001',
    message: 'Stock below reorder point',
    is_read: false,
    created_at: '2025-01-15T09:30:00Z',
    quantity: 3,
    threshold: 5,
  },
  {
    id: '3',
    type: 'low_stock',
    product_name: 'Coffin Nail Tips - Clear',
    product_sku: 'NAIL-TIP-COF',
    message: 'Stock below reorder point',
    is_read: false,
    created_at: '2025-01-15T08:15:00Z',
    quantity: 2,
    threshold: 5,
  },
  {
    id: '4',
    type: 'low_stock',
    product_name: 'Cuticle Oil - Lavender',
    product_sku: 'CUT-OIL-LAV',
    message: 'Stock below reorder point',
    is_read: true,
    created_at: '2025-01-14T16:00:00Z',
    quantity: 5,
    threshold: 10,
  },
  {
    id: '5',
    type: 'price_change',
    product_name: 'Dip Powder - French White',
    product_sku: 'DIP-PWD-001',
    message: 'Supplier price increased by 15%',
    is_read: true,
    created_at: '2025-01-14T12:00:00Z',
  },
];

const alertConfig: Record<AlertType, { label: string; color: string; icon: React.ElementType }> = {
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  low_stock: { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  overstock: { label: 'Overstock', color: 'bg-blue-100 text-blue-700', icon: Package },
  price_change: { label: 'Price Change', color: 'bg-slate-100 text-slate-700', icon: Bell },
};

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<AlertType | 'all'>('all');

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const filteredAlerts = alerts.filter(
    (alert) => filter === 'all' || alert.type === filter
  );

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, is_read: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, is_read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const filterOptions: { value: AlertType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Alerts' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'price_change', label: 'Price Changes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
          <p className="text-slate-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Bell className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === option.value
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {option.label}
            {option.value !== 'all' && (
              <span className="ml-1.5 text-xs">
                ({alerts.filter((a) => a.type === option.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <Card
              key={alert.id}
              className={cn(
                'transition-all',
                !alert.is_read && 'border-l-4 border-l-rose-500'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      alert.type === 'out_of_stock'
                        ? 'bg-red-100'
                        : alert.type === 'low_stock'
                        ? 'bg-amber-100'
                        : 'bg-slate-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        alert.type === 'out_of_stock'
                          ? 'text-red-600'
                          : alert.type === 'low_stock'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">{alert.product_name}</h3>
                          <Badge className={config.color}>{config.label}</Badge>
                          {!alert.is_read && (
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500">SKU: {alert.product_sku}</p>
                      </div>
                      <span className="text-xs text-slate-400">{formatTime(alert.created_at)}</span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">{alert.message}</p>

                    {alert.quantity !== undefined && (
                      <p className="mt-1 text-sm text-slate-500">
                        Current stock: <span className="font-medium">{alert.quantity}</span>
                        {alert.threshold && (
                          <> (Reorder point: {alert.threshold})</>
                        )}
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {!alert.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <Check className="h-4 w-4" />
                          Mark Read
                        </Button>
                      )}
                      {(alert.type === 'low_stock' || alert.type === 'out_of_stock') && (
                        <Button size="sm">
                          Reorder Now
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-600"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BellOff className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">No alerts</h3>
            <p className="mt-1 text-slate-500">
              {filter === 'all'
                ? "You're all caught up! No alerts at the moment."
                : `No ${filterOptions.find((f) => f.value === filter)?.label.toLowerCase()} alerts.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
