'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrdersStore } from '@/lib/store/orders';
import { useProductsStore } from '@/lib/store/products';
import { useNewsletterStore } from '@/lib/store/newsletter';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function AdminDashboard() {
  const { getStats, getAnalytics, getRecentOrders, orders } = useOrdersStore();
  const { products } = useProductsStore();
  const { getSubscriberCount, getActiveSubscribers } = useNewsletterStore();
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    useOrdersStore.persist.rehydrate();
    useProductsStore.persist.rehydrate();
    useNewsletterStore.persist.rehydrate();
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="loader-lg mx-auto mb-4" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );

  const stats = getStats();
  const analytics = getAnalytics();
  const recentOrders = getRecentOrders(5);
  const subscriberCount = getSubscriberCount();
  const activeSubscribers = getActiveSubscribers().length;
  const lowStockProducts = products.filter(p => p.stock < 10 && p.active);
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const totalSold = products.reduce((acc, p) => acc + p.sold, 0);

  // Calculate growth (mock data for demo)
  const revenueGrowth = 12.5;
  const orderGrowth = 8.2;
  const customerGrowth = 15.3;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: Icons.chart, change: `+${revenueGrowth}%`, up: true, color: 'from-green-500 to-emerald-600' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: Icons.package, change: `+${orderGrowth}%`, up: true, color: 'from-blue-500 to-indigo-600' },
    { label: 'Avg Order Value', value: formatPrice(stats.avgOrderValue), icon: Icons.trendUp, change: '+3.1%', up: true, color: 'from-purple-500 to-violet-600' },
    { label: 'Active Subscribers', value: activeSubscribers.toString(), icon: Icons.mail, change: `+${customerGrowth}%`, up: true, color: 'from-orange-500 to-red-600' },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/admin/products', icon: Icons.plus, color: 'bg-green-500' },
    { label: 'View Orders', href: '/admin/orders', icon: Icons.package, color: 'bg-blue-500' },
    { label: 'Export Data', href: '/admin/analytics', icon: Icons.download, color: 'bg-purple-500' },
    { label: 'Settings', href: '/admin/settings', icon: Icons.settings, color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header with greeting and time */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light mb-1">{greeting}! 👋</h1>
          <p className="text-gray-500">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="glass px-4 py-2 rounded-lg text-right">
          <p className="text-2xl font-mono font-light">{time.toLocaleTimeString()}</p>
          <p className="text-xs text-gray-500">{time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up delay-1">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} href={action.href} className="group flex items-center gap-3 p-4 bg-white border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-lg">
              <div className={cn('p-2 rounded-lg text-white', action.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium group-hover:text-navy-800">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={cn('stat-card card p-5 lg:p-6 rounded-xl fade-up', `delay-${i + 1}`)}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn('p-3 rounded-xl bg-gradient-to-br text-white', stat.color)}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', stat.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl lg:text-3xl font-semibold mb-1 count-up">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-5 lg:p-6 rounded-xl fade-up delay-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-lg">Revenue Overview</h3>
            <select className="text-xs border rounded-lg px-3 py-1.5 bg-white">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-48 lg:h-56">
            {analytics.revenueByMonth.map((m, i) => {
              const maxRevenue = Math.max(...analytics.revenueByMonth.map(x => x.revenue));
              const height = (m.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div className="w-full bg-sand-100 rounded-t-lg relative overflow-hidden" style={{ height: `${height}%` }}>
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-navy-800 to-navy-600 chart-bar rounded-t-lg" 
                      style={{ animationDelay: `${i * 0.1}s` }} 
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatPrice(m.revenue)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status */}
        <div className="card p-5 lg:p-6 rounded-xl fade-up delay-4">
          <h3 className="font-medium text-lg mb-6">Order Status</h3>
          <div className="space-y-4">
            {analytics.ordersByStatus.map((item, i) => {
              const total = analytics.ordersByStatus.reduce((acc, x) => acc + x.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              const colors: Record<string, string> = {
                pending: 'bg-yellow-500',
                processing: 'bg-blue-500',
                shipped: 'bg-purple-500',
                delivered: 'bg-green-500',
                cancelled: 'bg-red-500',
              };
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', colors[item.status] || 'bg-gray-400')} />
                      {item.status}
                    </span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full progress-bar', colors[item.status] || 'bg-gray-400')}
                      style={{ width: `${percentage}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-5 lg:p-6 rounded-xl fade-up delay-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-navy-800 hover:underline flex items-center gap-1">
              View All <Icons.arrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-sand-50 transition-colors">
                    <td className="py-3 font-mono text-xs">{order.orderId.slice(-8)}</td>
                    <td className="py-3">
                      <p className="font-medium truncate max-w-[120px]">{order.userName}</p>
                    </td>
                    <td className="py-3 text-gray-500 hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="py-3">
                      <span className={cn('badge', 
                        order.status === 'delivered' ? 'badge-success' : 
                        order.status === 'shipped' ? 'badge-info' : 
                        order.status === 'cancelled' ? 'badge-error' : 'badge-warning'
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-right">{formatPrice(order.total)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4 lg:space-y-6">
          {/* Product Stats */}
          <div className="card p-5 lg:p-6 rounded-xl fade-up delay-5">
            <h3 className="font-medium text-lg mb-4">Product Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Products</span>
                <span className="text-2xl font-semibold">{totalProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Active Products</span>
                <span className="text-xl font-medium text-green-600">{activeProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Sold</span>
                <span className="text-xl font-medium text-blue-600">{totalSold}</span>
              </div>
              <Link href="/admin/products" className="block text-center py-2 bg-sand-100 text-navy-900 text-sm font-medium hover:bg-sand-200 transition-colors rounded-lg">
                Manage Products
              </Link>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="card p-5 lg:p-6 rounded-xl fade-up delay-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Low Stock</h3>
              {lowStockProducts.length > 0 && (
                <span className="w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                  {lowStockProducts.length}
                </span>
              )}
            </div>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="truncate pr-2">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category}</p>
                    </div>
                    <span className={cn('badge flex-shrink-0', product.stock === 0 ? 'badge-error' : 'badge-warning')}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Icons.check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All products well stocked!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card p-5 lg:p-6 rounded-xl fade-up delay-6">
        <h3 className="font-medium text-lg mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.recentActivity.slice(0, 4).map((activity, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-sand-50 rounded-lg">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                activity.type === 'order' ? 'bg-green-100 text-green-600' : 
                activity.type === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              )}>
                {activity.type === 'order' ? <Icons.bag className="w-4 h-4" /> : 
                 activity.type === 'shipped' ? <Icons.package className="w-4 h-4" /> : 
                 <Icons.user className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate">{activity.message}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
