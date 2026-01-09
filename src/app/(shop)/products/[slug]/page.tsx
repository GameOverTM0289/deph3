'use client';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useProductsStore } from '@/lib/store/products';
import { Icons } from '@/components/ui/Icons';
import ProductCard from '@/components/product/ProductCard';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { products, getProductBySlug } = useProductsStore();
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState('');
  const [mainImg, setMainImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useProductsStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="text-center">
        <div className="loader-lg mx-auto mb-4" />
        <p className="text-gray-500">Loading product...</p>
      </div>
    </div>
  );
  
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  
  const inWishlist = isInWishlist(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id && p.active).slice(0, 4);

  const handleAdd = () => {
    if (!size) return;
    addItem({
      productId: product.id, productName: product.name, productImage: product.images[0],
      variantId: `${product.id}-${product.colors[colorIdx]?.name}-${size}`,
      variantName: `${product.colors[colorIdx]?.name} / ${size}`,
      size, color: product.colors[colorIdx]?.name || '', price: product.price, quantity,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 1200);
  };

  return (
    <>
      <section className="pt-20 sm:pt-24 pb-10 sm:pb-14">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-4 sm:mb-6 fade-up">
            <Link href="/" className="hover:text-navy-900 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-navy-900 transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-navy-900">{product.name}</span>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
            {/* Images */}
            <div className="slide-right">
              <div className="relative aspect-[3/4] bg-sand-100 overflow-hidden mb-3 img-zoom rounded-lg">
                <Image 
                  src={product.images[mainImg]} 
                  alt={product.name} 
                  fill 
                  className={cn('object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')} 
                  onLoad={() => setLoaded(true)} 
                  priority 
                />
                {!loaded && <div className="absolute inset-0 shimmer" />}
                
                {/* Wishlist button on image */}
                <button 
                  onClick={() => toggleItem(product.id)} 
                  className={cn(
                    'absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110',
                    inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  )}
                >
                  {inWishlist ? <Icons.heartFilled className="w-5 h-5" /> : <Icons.heart className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setMainImg(i); setLoaded(false); }} 
                    className={cn(
                      'relative w-16 sm:w-20 h-20 sm:h-24 flex-shrink-0 overflow-hidden transition-all duration-300 rounded-lg',
                      mainImg === i ? 'ring-2 ring-navy-900 ring-offset-2' : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:py-4 slide-left delay-1">
              {/* Category badge */}
              <span className="inline-block text-xs uppercase tracking-wider text-gray-500 mb-2">{product.category}</span>
              
              <h1 className="text-2xl sm:text-3xl font-light tracking-wide mb-3">{product.name}</h1>
              <p className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">{formatPrice(product.price)}</p>
              
              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">{product.description}</p>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                    Color: <span className="text-gray-900">{product.colors[colorIdx]?.name}</span>
                  </p>
                  <div className="flex gap-2 sm:gap-3">
                    {product.colors.map((c, i) => (
                      <button 
                        key={c.name} 
                        onClick={() => setColorIdx(i)} 
                        className={cn(
                          'w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 border-2',
                          colorIdx === i ? 'border-navy-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                        )} 
                        style={{ backgroundColor: c.hex }} 
                        title={c.name} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Size</p>
                  <Link href="/size-guide" className="text-xs text-navy-800 underline hover:no-underline">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)} 
                      className={cn(
                        'h-11 sm:h-12 min-w-[48px] sm:min-w-[52px] px-4 text-sm font-medium border-2 transition-all duration-300 rounded-lg',
                        size === s 
                          ? 'border-navy-900 bg-navy-900 text-white' 
                          : 'border-gray-200 hover:border-navy-900'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!size && <p className="text-xs text-gray-400 mt-2">Please select a size</p>}
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Icons.minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Icons.plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">{product.stock} in stock</span>
                </div>
              </div>

              {/* Add to bag button */}
              <button 
                onClick={handleAdd} 
                disabled={!size} 
                className={cn(
                  'w-full py-4 text-sm font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 rounded-lg',
                  added ? 'bg-green-600 text-white scale-[0.98]' : 'bg-navy-900 text-white hover:bg-navy-800 hover:shadow-lg',
                  !size && 'opacity-40 cursor-not-allowed'
                )}
              >
                {added ? (
                  <>
                    <Icons.check className="w-5 h-5" />
                    Added to Bag!
                  </>
                ) : (
                  <>
                    <Icons.bag className="w-5 h-5" />
                    Add to Bag — {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>

              {/* Product details */}
              <div className="border-t mt-8 sm:mt-10 pt-6 sm:pt-8 space-y-4">
                {product.material && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Material</p>
                    <p className="text-sm">{product.material}</p>
                  </div>
                )}
                {product.care && product.care.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Care</p>
                    <ul className="text-sm space-y-1">
                      {product.care.map((c, i) => <li key={i} className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-400 rounded-full" />{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - CENTERED */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-sand-50">
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-10 fade-up">
              <h2 className="text-2xl sm:text-3xl font-light tracking-wide">You May Also Like</h2>
              <p className="text-gray-500 mt-2">Complete your collection</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
