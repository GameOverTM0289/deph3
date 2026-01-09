'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-500',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[420px] max-w-full bg-white z-[80] transform transition-transform duration-500 ease-out shadow-2xl flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-medium">Shopping Bag</h2>
            <p className="text-xs text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 transition-colors rounded-lg"
            aria-label="Close"
          >
            <Icons.x className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={item.variantId}
                  className={cn('flex gap-3 sm:gap-4 pb-4 border-b border-gray-100 last:border-0 fade-up')}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative w-20 sm:w-24 h-24 sm:h-28 bg-sand-100 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate">{item.productName}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.variantName}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg flex-shrink-0"
                        aria-label="Remove"
                      >
                        <Icons.trash className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-medium mt-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Icons.minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Icons.plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        Total: {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mb-4">
                <Icons.bag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-6">Your bag is empty</p>
              <button
                onClick={closeCart}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-4 sm:px-6 py-4 bg-white sticky bottom-0 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-base py-4"
            >
              Checkout — {formatPrice(subtotal)}
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-gray-500 hover:text-navy-900 transition-colors py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
