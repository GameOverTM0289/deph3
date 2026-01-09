export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  material?: string;
  care?: string[];
  stock: number;
  sold: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  variantName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  orderId: string;
  userId?: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  days: string;
  price: number;
  carrier: string;
}

export interface CountryShipping {
  code: string;
  name: string;
  flag: string;
  zone: 'domestic' | 'balkans' | 'europe' | 'international';
  rates: ShippingRate[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface Analytics {
  topProducts: { name: string; sales: number; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  recentActivity: { type: string; message: string; time: string }[];
  totalCustomers: number;
  conversionRate: number;
}
