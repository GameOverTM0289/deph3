'use client';
import { useEffect, useState } from 'react';
import { useOrdersStore } from '@/lib/store/orders';
import { useProductsStore } from '@/lib/store/products';
import { formatPrice, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function AdminAnalyticsPage() {
  const { getAnalytics, getStats } = useOrdersStore();
  const { products } = useProductsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); useOrdersStore.persist.rehydrate(); useProductsStore.persist.rehydrate(); }, []);
  if (!mounted) return <div className="flex items-center justify-center h-64"><div className="loader" /></div>;

  const analytics = getAnalytics();
  const stats = getStats();
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div>
      <div className="mb-6 fade-up">
        <h1 className="heading-2 mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm">Performance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6 fade-up delay-1">
          <div className="flex items-center gap-3 mb-3">
            <Icons.chart className="w-5 h-5 text-navy-800" />
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <p className="text-2xl font-semibold">{formatPrice(stats.totalRevenue)}</p>
        </div>
        <div className="card p-6 fade-up delay-2">
          <div className="flex items-center gap-3 mb-3">
            <Icons.package className="w-5 h-5 text-navy-800" />
            <span className="text-sm text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-semibold">{stats.totalOrders}</p>
        </div>
        <div className="card p-6 fade-up delay-3">
          <div className="flex items-center gap-3 mb-3">
            <Icons.trendUp className="w-5 h-5 text-navy-800" />
            <span className="text-sm text-gray-500">Avg Order Value</span>
          </div>
          <p className="text-2xl font-semibold">{formatPrice(stats.avgOrderValue)}</p>
        </div>
        <div className="card p-6 fade-up delay-4">
          <div className="flex items-center gap-3 mb-3">
            <Icons.users className="w-5 h-5 text-navy-800" />
            <span className="text-sm text-gray-500">Customers</span>
          </div>
          <p className="text-2xl font-semibold">{analytics.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6 fade-up delay-5">
          <h3 className="font-medium mb-6">Monthly Revenue</h3>
          <div className="space-y-4">
            {analytics.revenueByMonth.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{m.month}</span>
                  <span className="font-medium">{formatPrice(m.revenue)}</span>
                </div>
                <div className="h-2 bg-sand-100 overflow-hidden">
                  <div className="h-full bg-navy-800 chart-bar" style={{ width: `${(m.revenue / 8500) * 100}%`, animationDelay: `${i * 0.1}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 fade-up delay-5">
          <h3 className="font-medium mb-6">Orders by Status</h3>
          <div className="space-y-4">
            {analytics.ordersByStatus.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-3 h-3',
                    item.status === 'delivered' ? 'bg-green-500' :
                    item.status === 'shipped' ? 'bg-blue-500' :
                    item.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-300'
                  )} />
                  <span className="capitalize">{item.status}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 fade-up delay-5">
        <h3 className="font-medium mb-6">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium">{product.name}</td>
                  <td>{product.sold}</td>
                  <td className="font-medium">{formatPrice(product.sold * product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
