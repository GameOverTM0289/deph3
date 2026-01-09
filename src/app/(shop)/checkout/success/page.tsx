'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOrdersStore } from '@/lib/store/orders';
import { formatPrice } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const { getOrderById } = useOrdersStore();
  const [order, setOrder] = useState<ReturnType<typeof getOrderById>>(undefined);

  useEffect(() => { useOrdersStore.persist.rehydrate(); if (orderId) setOrder(getOrderById(orderId)); }, [orderId, getOrderById]);

  return (
    <div className="text-center px-4 max-w-md mx-auto scale-in">
      <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
        <Icons.check className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="heading-2 mb-3">Thank You!</h1>
      <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
      {order && (
        <div className="bg-sand-50 p-6 text-left mb-8">
          <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">Order ID</span><span className="font-mono text-sm">{order.orderId}</span></div>
          <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">Status</span><span className="text-sm capitalize">{order.status}</span></div>
          <div className="flex justify-between"><span className="text-gray-500 text-sm">Total</span><span className="font-medium">{formatPrice(order.total)}</span></div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        <Link href="/account" className="btn-outline">View Orders</Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16">
      <Suspense fallback={<div className="text-center"><div className="loader mx-auto" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
