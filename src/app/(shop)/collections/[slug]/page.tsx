'use client';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { getCollectionBySlug } from '@/lib/data/products';
import { useProductsStore } from '@/lib/store/products';

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getCollectionBySlug(params.slug);
  const { products } = useProductsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useProductsStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!collection) notFound();
  
  const collectionProducts = mounted ? products.filter(p => p.category === params.slug && p.active) : [];

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        <Image src={collection.image} alt={collection.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="fade-up">
            <h1 className="heading-1 mb-2">{collection.name}</h1>
            <p className="text-white/80">{collection.description}</p>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="container-custom">
          <nav className="text-xs text-gray-400 mb-8 fade-up">
            <Link href="/" className="hover:text-navy-900 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-navy-900 transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-navy-900">{collection.name}</span>
          </nav>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {collectionProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
