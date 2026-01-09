import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, Analytics } from '@/lib/types';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (email: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  updateTracking: (orderId: string, trackingNumber: string) => void;
  addNote: (orderId: string, note: string) => void;
  deleteOrder: (orderId: string) => void;
  getStats: () => { totalRevenue: number; totalOrders: number; pendingOrders: number; completedOrders: number; avgOrderValue: number; todayRevenue: number; todayOrders: number };
  getAnalytics: () => Analytics;
  getRecentOrders: (limit: number) => Order[];
  exportOrders: () => string;
  searchOrders: (query: string) => Order[];
  getTopCustomers: (limit: number) => { email: string; name: string; orders: number; totalSpent: number }[];
}

const defaultOrders: Order[] = [
  {
    id: '1', orderId: 'DLP-20241220-001', userName: 'Maria Koci', userEmail: 'maria@example.com',
    items: [{ productId: 'prod-1', productName: 'Coastal Breeze Bikini', productImage: '/images/products/yellow-simple-1.jpg', variantId: 'v1', variantName: 'Sand / M', size: 'M', color: 'Sand', price: 89.00, quantity: 1 }],
    shippingAddress: { firstName: 'Maria', lastName: 'Koci', address: 'Rruga Myslym Shyri', city: 'Tirana', postalCode: '1001', country: 'AL', phone: '+355691234567' },
    shippingMethod: 'standard', paymentMethod: 'pok', paymentStatus: 'paid', status: 'delivered',
    subtotal: 89.00, shipping: 3.99, tax: 0, total: 92.99,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(),
    trackingNumber: 'DHL1234567890',
  },
  {
    id: '2', orderId: 'DLP-20241221-002', userName: 'Elena Hoxha', userEmail: 'elena@example.com',
    items: [
      { productId: 'prod-2', productName: 'Mediterranean Blue', productImage: '/images/products/blue-simple-1.jpg', variantId: 'v2', variantName: 'Ocean / S', size: 'S', color: 'Ocean', price: 95.00, quantity: 1 },
      { productId: 'prod-3', productName: 'Sunset One Piece', productImage: '/images/products/sunset-1.jpg', variantId: 'v3', variantName: 'Coral / M', size: 'M', color: 'Coral', price: 120.00, quantity: 1 },
    ],
    shippingAddress: { firstName: 'Elena', lastName: 'Hoxha', address: 'Rruga Barrikadave', city: 'Pristina', postalCode: '10000', country: 'XK', phone: '+38349123456' },
    shippingMethod: 'express', paymentMethod: 'pok', paymentStatus: 'paid', status: 'shipped',
    subtotal: 215.00, shipping: 5.99, tax: 0, total: 220.99,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(),
    trackingNumber: 'DHL0987654321',
  },
  {
    id: '3', orderId: 'DLP-20241222-003', userName: 'Sofia Bianchi', userEmail: 'sofia@example.com',
    items: [{ productId: 'prod-4', productName: 'Classic Black', productImage: '/images/products/black-simple-1.jpg', variantId: 'v4', variantName: 'Black / L', size: 'L', color: 'Black', price: 85.00, quantity: 2 }],
    shippingAddress: { firstName: 'Sofia', lastName: 'Bianchi', address: 'Via Roma 123', city: 'Milan', postalCode: '20100', country: 'IT', phone: '+393331234567' },
    shippingMethod: 'standard', paymentMethod: 'pok', paymentStatus: 'pending', status: 'pending',
    subtotal: 170.00, shipping: 12.99, tax: 0, total: 182.99,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '4', orderId: 'DLP-20241223-004', userName: 'Ana Shehu', userEmail: 'ana@example.com',
    items: [{ productId: 'prod-1', productName: 'Coastal Breeze Bikini', productImage: '/images/products/yellow-simple-1.jpg', variantId: 'v5', variantName: 'Sand / XS', size: 'XS', color: 'Sand', price: 89.00, quantity: 1 }],
    shippingAddress: { firstName: 'Ana', lastName: 'Shehu', address: 'Rruga e Kavajes', city: 'Durres', postalCode: '2001', country: 'AL', phone: '+355682345678' },
    shippingMethod: 'express', paymentMethod: 'pok', paymentStatus: 'paid', status: 'processing',
    subtotal: 89.00, shipping: 3.99, tax: 0, total: 92.99,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: defaultOrders,
      
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },
      
      getOrderById: (orderId) => get().orders.find((o) => o.orderId === orderId),
      getUserOrders: (email) => get().orders.filter((o) => o.userEmail.toLowerCase() === email.toLowerCase()),
      getAllOrders: () => get().orders,
      
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      
      updatePaymentStatus: (orderId, paymentStatus) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      
      updateTracking: (orderId, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId ? { ...o, trackingNumber, status: 'shipped', updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      
      addNote: (orderId, note) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId ? { ...o, notes: [...(o.notes || []), note], updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      
      deleteOrder: (orderId) => {
        set((state) => ({ orders: state.orders.filter((o) => o.orderId !== orderId) }));
      },
      
      getStats: () => {
        const orders = get().orders;
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
        const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
        const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);
        return {
          totalRevenue,
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          completedOrders: orders.filter((o) => o.status === 'delivered').length,
          avgOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
          todayRevenue: todayOrders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0),
          todayOrders: todayOrders.length,
        };
      },
      
      getAnalytics: () => {
        const orders = get().orders;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenueByMonth = months.map((month, i) => ({
          month,
          revenue: 2500 + Math.random() * 6000 + (i * 500),
        }));
        
        const statusCounts: Record<string, number> = {};
        orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
        
        const uniqueEmails = new Set(orders.map((o) => o.userEmail.toLowerCase()));
        
        return {
          topProducts: [],
          revenueByMonth,
          ordersByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
          recentActivity: [
            { type: 'order', message: 'New order #DLP-20241223-004', time: 'Just now' },
            { type: 'shipped', message: 'Order #DLP-20241221-002 shipped', time: '2 hours ago' },
            { type: 'subscriber', message: 'New newsletter subscriber', time: '5 hours ago' },
            { type: 'order', message: 'New order #DLP-20241222-003', time: 'Yesterday' },
          ],
          totalCustomers: uniqueEmails.size,
          conversionRate: 3.2,
        };
      },
      
      getRecentOrders: (limit) => {
        return [...get().orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
      },
      
      exportOrders: () => {
        const orders = get().orders;
        const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Status', 'Payment', 'Total'];
        const rows = orders.map((o) => [
          o.orderId, new Date(o.createdAt).toLocaleDateString(), o.userName, o.userEmail, o.status, o.paymentStatus, o.total.toFixed(2),
        ]);
        return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      },
      
      searchOrders: (query) => {
        const q = query.toLowerCase();
        return get().orders.filter((o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q)
        );
      },
      
      getTopCustomers: (limit) => {
        const orders = get().orders;
        const customers: Record<string, { email: string; name: string; orders: number; totalSpent: number }> = {};
        orders.forEach((o) => {
          const key = o.userEmail.toLowerCase();
          if (!customers[key]) {
            customers[key] = { email: o.userEmail, name: o.userName, orders: 0, totalSpent: 0 };
          }
          customers[key].orders += 1;
          customers[key].totalSpent += o.total;
        });
        return Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
      },
    }),
    { name: 'delphine-orders' }
  )
);
