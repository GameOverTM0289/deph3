'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import { useOrdersStore } from '@/lib/store/orders';
import { useProductsStore } from '@/lib/store/products';
import { formatPrice, validateEmail, validatePhone, validateRequired, PHONE_PREFIXES, SHIPPING_ZONES, getShippingRates, cn, generateOrderId } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { ShippingRate } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { addOrder } = useOrdersStore();
  const { incrementSold } = useProductsStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', address: '', city: '', country: 'AL', postalCode: '', phonePrefix: '+355', phone: '' });

  useEffect(() => { setMounted(true); useCartStore.persist.rehydrate(); useUserStore.persist.rehydrate(); useOrdersStore.persist.rehydrate(); useProductsStore.persist.rehydrate(); }, []);
  useEffect(() => { if (user) { const [firstName = '', lastName = ''] = (user.name || '').split(' '); setForm(f => ({ ...f, email: user.email || '', firstName, lastName })); } }, [user]);
  useEffect(() => { const rates = getShippingRates(form.country); setShippingRates(rates); if (rates.length > 0) setSelectedShipping(rates[0].id); }, [form.country]);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const selectedRate = shippingRates.find(r => r.id === selectedShipping);
  const shippingCost = selectedRate?.price || 0;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!validateEmail(form.email).valid) e.email = 'Required';
    if (!validateRequired(form.firstName, '').valid) e.firstName = 'Required';
    if (!validateRequired(form.lastName, '').valid) e.lastName = 'Required';
    if (!validateRequired(form.address, '').valid) e.address = 'Required';
    if (!validateRequired(form.city, '').valid) e.city = 'Required';
    if (!validateRequired(form.postalCode, '').valid) e.postalCode = 'Required';
    if (!validatePhone(form.phone).valid) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    items.forEach(item => incrementSold(item.productId, item.quantity));
    
    const order = addOrder({ orderId: generateOrderId(),
      userEmail: form.email, userName: `${form.firstName} ${form.lastName}`,
      items, subtotal, shipping: shippingCost, tax, total,
      shippingAddress: { firstName: form.firstName, lastName: form.lastName, address: form.address, city: form.city, country: form.country, postalCode: form.postalCode, phone: `${form.phonePrefix}${form.phone}` },
      shippingMethod: selectedShipping, paymentMethod: 'pok', paymentStatus: 'paid', status: 'processing',
    });
    
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'confirmation', order }),
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
    
    clearCart();
    router.push(`/checkout/success?order=${order.orderId}`);
  };

  if (items.length === 0) {
    return (<div className="min-h-screen flex items-center justify-center pt-20"><div className="text-center fade-up"><Icons.bag className="w-16 h-16 text-gray-200 mx-auto mb-5" /><h1 className="heading-2 mb-4">Your bag is empty</h1><Link href="/shop" className="btn-primary">Continue Shopping</Link></div></div>);
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-20 pb-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8 fade-up">
          <Link href="/shop" className="text-sm text-gray-500 hover:text-navy-900 flex items-center gap-2 transition-colors"><Icons.chevronLeft className="w-4 h-4" /> Back</Link>
          <Link href="/"><Image src="/logo.svg" alt="Delphine" width={120} height={36} className="h-8 sm:h-9 w-auto" /></Link>
          <div className="w-16" />
        </div>
        
        <h1 className="heading-2 text-center mb-10 fade-up delay-1">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6 fade-up delay-2">
            <div className="bg-white p-4 sm:p-6 border">
              <h2 className="font-medium mb-4">Contact Information</h2>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className={cn('input-field', errors.email && 'input-error')} />
            </div>
            
            <div className="bg-white p-4 sm:p-6 border">
              <h2 className="font-medium mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className={cn('input-field', errors.firstName && 'input-error')} />
                <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className={cn('input-field', errors.lastName && 'input-error')} />
              </div>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className={cn('input-field mb-4', errors.address && 'input-error')} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className={cn('input-field', errors.city && 'input-error')} />
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="select-field">{SHIPPING_ZONES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}</select>
                <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="Postal code" className={cn('input-field', errors.postalCode && 'input-error')} />
              </div>
              {/* Fixed phone field for mobile */}
              <div className="flex flex-row gap-2 sm:gap-3">
                <select value={form.phonePrefix} onChange={(e) => setForm({ ...form, phonePrefix: e.target.value })} className="select-field w-[100px] sm:w-28 flex-shrink-0">{PHONE_PREFIXES.map((p) => <option key={p.code} value={p.prefix}>{p.flag} {p.prefix}</option>)}</select>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className={cn('input-field flex-1 min-w-0', errors.phone && 'input-error')} />
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 border">
              <h2 className="font-medium mb-4">Shipping Method</h2>
              <div className="space-y-3">{shippingRates.map((rate) => (<label key={rate.id} className={cn('flex items-center p-4 border cursor-pointer transition-all', selectedShipping === rate.id ? 'border-navy-900 bg-sand-50' : 'border-gray-200 hover:border-gray-300')}><input type="radio" name="shipping" checked={selectedShipping === rate.id} onChange={() => setSelectedShipping(rate.id)} className="sr-only" /><div className="flex-1"><p className="font-medium text-sm">{rate.name}</p><p className="text-xs text-gray-500">{rate.days} • {rate.carrier}</p></div><span className="font-medium">{formatPrice(rate.price)}</span></label>))}</div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 border">
              <h2 className="font-medium mb-4">Payment Method</h2>
              <div className="flex items-center p-4 border border-navy-900 bg-sand-50">
                <div className="w-12 h-8 bg-navy-900 flex items-center justify-center text-white font-bold text-xs mr-4">POK</div>
                <div className="flex-1"><p className="font-medium text-sm">Pay on Delivery</p><p className="text-xs text-gray-500">Cash payment when order arrives</p></div>
                <Icons.check className="w-5 h-5 text-navy-900" />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 fade-up delay-3">
            <div className="bg-white p-4 sm:p-6 border sticky top-24">
              <h2 className="font-medium mb-4">Order Summary</h2>
              <ul className="divide-y mb-4 max-h-64 overflow-y-auto">{items.map((item) => (<li key={item.variantId} className="py-3 flex gap-3"><div className="relative w-16 h-20 bg-sand-100 flex-shrink-0"><Image src={item.productImage} alt={item.productName} fill className="object-cover" /><span className="absolute -top-1 -right-1 w-5 h-5 bg-navy-900 text-white text-xs flex items-center justify-center">{item.quantity}</span></div><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.productName}</p><p className="text-xs text-gray-500">{item.variantName}</p><p className="text-sm mt-1">{formatPrice(item.price * item.quantity)}</p></div></li>))}</ul>
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between font-medium text-lg pt-3 border-t"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6">{loading ? <><span className="loader mr-2" /> Processing...</> : `Pay ${formatPrice(total)}`}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
