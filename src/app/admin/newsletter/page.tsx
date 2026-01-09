'use client';
import { useEffect, useState } from 'react';
import { useNewsletterStore } from '@/lib/store/newsletter';
import { formatDateTime, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function AdminNewsletterPage() {
  const { subscribers, unsubscribe, getActiveSubscribers, exportSubscribers } = useNewsletterStore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');

  useEffect(() => { setMounted(true); useNewsletterStore.persist.rehydrate(); }, []);
  if (!mounted) return <div className="flex items-center justify-center h-64"><div className="loader" /></div>;

  const activeCount = getActiveSubscribers().length;
  const filtered = filter === 'all' ? subscribers : subscribers.filter(s => filter === 'active' ? s.status === 'active' : s.status === 'unsubscribed');

  const handleExport = () => {
    const csv = exportSubscribers();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 fade-up">
        <div>
          <h1 className="heading-2 mb-1">Newsletter</h1>
          <p className="text-gray-500 text-sm">{activeCount} active subscribers</p>
        </div>
        <button onClick={handleExport} className="btn-outline text-sm"><Icons.download className="w-4 h-4 mr-2" /> Export Active</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-6 fade-up delay-1">
          <p className="text-2xl font-semibold mb-1">{subscribers.length}</p>
          <p className="text-sm text-gray-500">Total Subscribers</p>
        </div>
        <div className="card p-6 fade-up delay-2">
          <p className="text-2xl font-semibold mb-1 text-green-600">{activeCount}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="card p-6 fade-up delay-3">
          <p className="text-2xl font-semibold mb-1 text-gray-400">{subscribers.length - activeCount}</p>
          <p className="text-sm text-gray-500">Unsubscribed</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 fade-up delay-4">
        {['all', 'active', 'unsubscribed'].map((f) => (
          <button key={f} onClick={() => setFilter(f as typeof filter)} className={cn('px-4 py-2 text-xs uppercase tracking-wide transition-colors', filter === f ? 'bg-navy-900 text-white' : 'bg-white border text-gray-600 hover:border-gray-300')}>{f}</button>
        ))}
      </div>

      <div className="card overflow-hidden fade-up delay-5">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id}>
                  <td className="font-medium">{sub.email}</td>
                  <td className="text-sm text-gray-600">{formatDateTime(sub.subscribedAt)}</td>
                  <td><span className={cn('badge', sub.status === 'active' ? 'badge-success' : 'badge-gray')}>{sub.status}</span></td>
                  <td>
                    {sub.status === 'active' && (
                      <button onClick={() => unsubscribe(sub.id)} className="text-xs text-red-600 hover:underline">Unsubscribe</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
