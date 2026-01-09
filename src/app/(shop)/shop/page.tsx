'use client';
import { useState, useEffect } from 'react';
import { useProductsStore } from '@/lib/store/products';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'bikinis', label: 'Bikinis' },
  { id: 'one-pieces', label: 'One Pieces' },
];

export default function ShopPage() {
  const { products, getActiveProducts } = useProductsStore();
  const [category, setCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useProductsStore.persist.rehydrate();
  }, []);

  const activeProducts = mounted ? getActiveProducts() : [];
  const filtered = category === 'all' 
    ? activeProducts 
    : activeProducts.filter(p => p.category === category);

  return (
    <>
      <section className="bg-sand-50 pt-28 sm:pt-32 pb-10 sm:pb-14">
        <div className="container-custom text-center fade-up">
          <h1 className="heading-1 mb-2 sm:mb-3">Shop</h1>
          <p className="text-gray-500 text-sm sm:text-base">{filtered.length} products</p>
        </div>
      </section>
      
      <section className="py-8 sm:py-12 lg:py-14">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 fade-up delay-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm uppercase tracking-wide transition-all duration-300 rounded-lg',
                  category === cat.id 
                    ? 'bg-navy-900 text-white shadow-lg' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-900 hover:text-navy-900'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
