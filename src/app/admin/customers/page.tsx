'use client';
import { useEffect, useState } from 'react';
import { useOrdersStore } from '@/lib/store/orders';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

interface Customer {
  email: string;
  name: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const { orders } = useOrdersStore();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { setMounted(true); useOrdersStore.persist.rehydrate(); }, []);
  if (!mounted) return <div className="flex items-center justify-center h-64"><div className="loader" /></div>;

  // Aggregate customers from orders
  const customerMap: Record<string, Customer> = {};
  orders.forEach((order) => {
    const key = order.userEmail.toLowerCase();
    if (!customerMap[key]) {
      customerMap[key] = { email: order.userEmail, name: order.userName, orders: 0, totalSpent: 0, lastOrder: order.createdAt };
    }
    customerMap[key].orders += 1;
    customerMap[key].totalSpent += order.total;
    if (new Date(order.createdAt) > new Date(customerMap[key].lastOrder)) {
      customerMap[key].lastOrder = order.createdAt;
    }
  });

  const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-6 fade-up">
        <h1 className="heading-2 mb-1">Customers</h1>
        <p className="text-gray-500 text-sm">{customers.length} unique customers</p>
      </div>

      <div className="mb-6 fade-up delay-1">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input-field max-w-sm" />
      </div>

      <div className="card overflow-hidden fade-up delay-2">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.email}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-100 flex items-center justify-center text-navy-800 font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{customer.orders}</span></td>
                  <td className="font-medium">{formatPrice(customer.totalSpent)}</td>
                  <td className="text-sm text-gray-600">{formatDate(customer.lastOrder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
