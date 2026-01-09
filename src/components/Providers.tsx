'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useUserStore } from '@/lib/store/user';
import { useOrdersStore } from '@/lib/store/orders';
import { useProductsStore } from '@/lib/store/products';
import { useNewsletterStore } from '@/lib/store/newsletter';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useUserStore.persist.rehydrate();
    useOrdersStore.persist.rehydrate();
    useProductsStore.persist.rehydrate();
    useNewsletterStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
