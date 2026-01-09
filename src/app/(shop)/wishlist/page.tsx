'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useProductsStore } from '@/lib/store/products';
import { Icons } from '@/components/ui/Icons';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const { products } = useProductsStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); useWishlistStore.persist.rehydrate(); useProductsStore.persist.rehydrate(); }, []);
  
  const wishlistProducts = mounted ? products.filter(p => items.includes(p.id)) : [];

  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">Wishlist</h1><p className="text-gray-500">{mounted ? items.length : 0} {items.length === 1 ? 'item' : 'items'}</p></div></section>
      <section className="py-14"><div className="container-custom">{wishlistProducts.length > 0 ? (<><div className="flex justify-end mb-6 fade-up"><button onClick={clearWishlist} className="text-xs text-gray-400 hover:text-navy-900 transition-colors">Clear All</button></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">{wishlistProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div></>) : (<div className="text-center py-20 fade-up"><Icons.heart className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-500 mb-6">Your wishlist is empty</p><Link href="/shop" className="btn-primary">Browse Products</Link></div>)}</div></section>
    </>
  );
}
