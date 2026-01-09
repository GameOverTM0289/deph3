'use client';
import { useEffect, useState } from 'react';
import { useOrdersStore } from '@/lib/store/orders';
import { formatPrice, formatDateTime, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { Order } from '@/lib/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateTracking, deleteOrder, exportOrders } = useOrdersStore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [tracking, setTracking] = useState('');
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  useEffect(() => { setMounted(true); useOrdersStore.persist.rehydrate(); }, []);
  if (!mounted) return <div className="flex items-center justify-center h-64"><div className="loader" /></div>;

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const sendEmailNotification = async (order: Order, type: 'shipped' | 'delivered') => {
    try {
      setEmailStatus('sending');
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, order }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEmailStatus(result.skipped ? 'skipped' : 'sent');
        setTimeout(() => setEmailStatus(null), 3000);
      } else {
        setEmailStatus('error');
        setTimeout(() => setEmailStatus(null), 3000);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;
    
    const oldStatus = order.status;
    updateOrderStatus(orderId, newStatus);
    
    // Send email for shipped or delivered status
    if ((newStatus === 'shipped' || newStatus === 'delivered') && oldStatus !== newStatus) {
      // Get updated order with new status
      const updatedOrder = { ...order, status: newStatus };
      await sendEmailNotification(updatedOrder, newStatus);
    }
  };

  const handleExport = () => {
    const csv = exportOrders();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleUpdateTracking = async () => {
    if (selected && tracking) {
      updateTracking(selected.orderId, tracking);
      
      // Send shipped email when tracking is added
      const updatedOrder = { ...selected, trackingNumber: tracking, status: 'shipped' as const };
      await sendEmailNotification(updatedOrder, 'shipped');
      
      setTracking('');
      setSelected(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 fade-up">
        <div>
          <h1 className="heading-2 mb-1">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          {emailStatus && (
            <span className={cn(
              'text-xs px-3 py-1 rounded-full',
              emailStatus === 'sent' ? 'bg-green-100 text-green-700' :
              emailStatus === 'sending' ? 'bg-blue-100 text-blue-700' :
              emailStatus === 'skipped' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            )}>
              {emailStatus === 'sent' ? '✓ Email sent' :
               emailStatus === 'sending' ? '• Sending...' :
               emailStatus === 'skipped' ? '⚠ Email skipped' :
               '✗ Email failed'}
            </span>
          )}
          <button onClick={handleExport} className="btn-outline text-sm"><Icons.download className="w-4 h-4 mr-2" /> Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap fade-up delay-1">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 text-xs uppercase tracking-wide transition-colors', filter === f ? 'bg-navy-900 text-white' : 'bg-white border text-gray-600 hover:border-gray-300')}>{f}</button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden fade-up delay-2">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-sm">{order.orderId}</td>
                  <td>
                    <p className="font-medium">{order.userName}</p>
                    <p className="text-xs text-gray-400">{order.userEmail}</p>
                  </td>
                  <td className="text-sm">{formatDateTime(order.createdAt)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value as Order['status'])}
                      className={cn('text-xs px-2 py-1 border-0 cursor-pointer', order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td><span className={cn('badge', order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning')}>{order.paymentStatus}</span></td>
                  <td className="font-medium">{formatPrice(order.total)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(order)} className="p-2 hover:bg-sand-100 transition-colors" title="View"><Icons.eye className="w-4 h-4" /></button>
                      <button onClick={() => deleteOrder(order.orderId)} className="p-2 hover:bg-red-50 text-red-600 transition-colors" title="Delete"><Icons.trash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-medium">Order {selected.orderId}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-sand-100"><Icons.x className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs text-gray-400 uppercase mb-2">Customer</h3>
                  <p className="font-medium">{selected.userName}</p>
                  <p className="text-sm text-gray-600">{selected.userEmail}</p>
                </div>
                <div>
                  <h3 className="text-xs text-gray-400 uppercase mb-2">Shipping Address</h3>
                  <p className="text-sm">{selected.shippingAddress.firstName} {selected.shippingAddress.lastName}</p>
                  <p className="text-sm text-gray-600">{selected.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">{selected.shippingAddress.city}, {selected.shippingAddress.country}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs text-gray-400 uppercase mb-2">Items</h3>
                <div className="space-y-2">
                  {selected.items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(selected.shipping)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{formatPrice(selected.tax)}</span></div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
                </div>
              </div>
              {selected.status !== 'delivered' && selected.status !== 'cancelled' && (
                <div>
                  <h3 className="text-xs text-gray-400 uppercase mb-2">Add Tracking Number</h3>
                  <div className="flex gap-2">
                    <input type="text" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Enter tracking number" className="input-field flex-1" />
                    <button onClick={handleUpdateTracking} className="btn-primary">Save & Send Email</button>
                  </div>
                  {selected.trackingNumber && <p className="text-sm text-gray-500 mt-2">Current: {selected.trackingNumber}</p>}
                  <p className="text-xs text-gray-400 mt-2">Customer will receive a shipping notification email</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
