'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import { useWishlistStore } from '@/lib/store/wishlist';
import { Icons } from '@/components/ui/Icons';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [inWishlist, setInWishlist] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    useWishlistStore.persist.rehydrate();
    setInWishlist(isInWishlist(product.id));
    const unsub = useWishlistStore.subscribe((state) => {
      setInWishlist(state.isInWishlist(product.id));
    });
    return () => unsub();
  }, [product.id, isInWishlist]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <div 
      className={cn('group relative fade-up', `delay-${Math.min(index + 1, 5)}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-sand-100 overflow-hidden mb-3">
          {/* Main Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-all duration-700',
              imgLoaded ? 'opacity-100' : 'opacity-0',
              hovered && product.images[1] ? 'opacity-0' : 'opacity-100'
            )}
            onLoad={() => setImgLoaded(true)}
          />
          
          {/* Hover Image */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-all duration-700 absolute inset-0',
                hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              )}
            />
          )}
          
          {/* Loading skeleton */}
          {!imgLoaded && <div className="absolute inset-0 shimmer" />}
          
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full transition-all duration-300 shadow-sm',
              'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0',
              inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? <Icons.heartFilled className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icons.heart className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          
          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-gray-900 text-white px-3 py-1 text-xs uppercase tracking-wide">
                Sold Out
              </span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-medium truncate group-hover:text-navy-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base font-semibold">{formatPrice(product.price)}</p>
          
          {/* Color swatches - show on mobile too */}
          {product.colors.length > 1 && (
            <div className="flex gap-1.5 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
