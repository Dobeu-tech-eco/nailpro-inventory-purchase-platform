import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Download,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { cn } from '../../lib/utils';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

const metrics: MetricCard[] = [
  { title: 'Total Inventory Value', value: '$24,580', change: 12.5, trend: 'up', icon: DollarSign },
  { title: 'Products Tracked', value: '1,284', change: 8.2, trend: 'up', icon: Package },
  { title: 'Monthly Orders', value: '47', change: 15.3, trend: 'up', icon: ShoppingCart },
  { title: 'Avg. Order Value', value: '$342', change: 3.1, trend: 'down', icon: BarChart3 },
];

const topCategories = [
  { name: 'Gel Polish', value: 8450, percentage: 35 },
  { name: 'Dip Powder', value: 5620, percentage: 23 },
  { name: 'Supplies', value: 4280, percentage: 18 },
  { name: 'Equipment', value: 3540, percentage: 15 },
  { name: 'Nail Tips', value: 2190, percentage: 9 },
];

const recentActivity = [
  { type: 'order', description: 'New order from Beauty Plus Supply', amount: '$456.80', time: '2 hours ago' },
  { type: 'stock', description: 'Low stock alert: OPI GelColor Red', amount: '3 units', time: '4 hours ago' },
  { type: 'order', description: 'Order PO-2025-003 received', amount: '$892.00', time: '1 day ago' },
  { type: 'stock', description: 'Stock count completed', amount: '156 items', time: '2 days ago' },
];

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  const dateRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500">
            Track your inventory performance and spending trends
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-slate-200">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  dateRange === range.value
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
                  <metric.icon className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {metric.change}%
                </span>
                <span className="text-sm text-slate-500">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-500" />
              Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">
                  Chart visualization would render here
                </p>
                <p className="text-xs text-slate-400">
                  Integrate with a charting library like Recharts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-slate-500" />
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{category.name}</span>
                    <span className="text-slate-600">${category.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div
                      className={cn(
                        'h-2 rounded-full',
                        index === 0
                          ? 'bg-rose-500'
                          : index === 1
                          ? 'bg-rose-400'
                          : index === 2
                          ? 'bg-rose-300'
                          : 'bg-rose-200'
                      )}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        activity.type === 'order' ? 'bg-emerald-50' : 'bg-amber-50'
                      )}
                    >
                      {activity.type === 'order' ? (
                        <ShoppingCart
                          className={cn(
                            'h-5 w-5',
                            activity.type === 'order' ? 'text-emerald-600' : 'text-amber-600'
                          )}
                        />
                      ) : (
                        <Package className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-600">{activity.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <TrendingDown className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">Slow-Moving Products</p>
                    <p className="mt-1 text-sm text-amber-700">
                      12 products haven't sold in 30+ days. Consider running promotions.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 text-amber-700">
                      View Products
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-900">Fast-Moving Products</p>
                    <p className="mt-1 text-sm text-emerald-700">
                      8 products are selling faster than usual. Consider increasing stock.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 text-emerald-700">
                      View Products
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-5 w-5 text-rose-600" />
                  <div>
                    <p className="font-medium text-rose-900">Cost Savings Opportunity</p>
                    <p className="mt-1 text-sm text-rose-700">
                      3 suppliers offer better prices for products you regularly order.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 text-rose-700">
                      Compare Prices
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
