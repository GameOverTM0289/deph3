'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useUserStore } from '@/lib/store/user';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const { getCount } = useWishlistStore();
  const { isAuthenticated, user } = useUserStore();
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    const unsubCart = useCartStore.subscribe((s) => setCartCount(s.getItemCount()));
    const unsubWish = useWishlistStore.subscribe((s) => setWishCount(s.getCount()));
    setCartCount(getItemCount());
    setWishCount(getCount());
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); unsubCart(); unsubWish(); };
  }, [getItemCount, getCount]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isSolid = scrolled || !isHome || menuOpen;
  const useWhiteLogo = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isSolid ? 'bg-white/98 backdrop-blur-md shadow-sm py-2 sm:py-3' : 'bg-transparent py-4 sm:py-6'
      )}>
        <div className="container-custom">
          <div className="relative flex items-center justify-between">
            {/* Left side - Burger + Nav */}
            <div className="flex items-center gap-4 sm:gap-8">
              {/* Burger - Mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={cn(
                  'lg:hidden p-2.5 sm:p-3 transition-all duration-300 relative z-[70]',
                  !isSolid && 'bg-black/40 backdrop-blur-sm',
                  isSolid ? 'text-gray-900 hover:bg-gray-100' : 'text-white'
                )}
                aria-label="Menu"
              >
                <div className="relative w-6 h-5 flex flex-col justify-between">
                  <span className={cn('w-full h-0.5 bg-current transition-all duration-300 origin-left', menuOpen && 'rotate-45 translate-x-px')} />
                  <span className={cn('w-full h-0.5 bg-current transition-all duration-300', menuOpen && 'opacity-0 scale-0')} />
                  <span className={cn('w-full h-0.5 bg-current transition-all duration-300 origin-left', menuOpen && '-rotate-45 translate-x-px')} />
                </div>
              </button>

              {/* Desktop Nav - Shop, Collections, Our Story */}
              <nav className="hidden lg:flex items-center gap-10">
                <Link href="/shop" className={cn('text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 link-underline', isSolid ? 'text-gray-900 hover:text-navy-800' : 'text-white hover:text-white/80')}>Shop</Link>
                <Link href="/collections" className={cn('text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 link-underline', isSolid ? 'text-gray-900 hover:text-navy-800' : 'text-white hover:text-white/80')}>Collections</Link>
                <Link href="/about" className={cn('text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 link-underline', isSolid ? 'text-gray-900 hover:text-navy-800' : 'text-white hover:text-white/80')}>Our Story</Link>
              </nav>
            </div>

            {/* Center Logo - Bigger */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-[70]">
              <Image
                src={useWhiteLogo ? '/logo-white.svg' : '/logo.svg'}
                alt="Delphine"
                width={380}
                height={120}
                className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto transition-all duration-500"
                priority
              />
            </Link>

            {/* Right side - Wishlist, Cart, Account */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/wishlist" className={cn('relative p-2 sm:p-2.5 transition-all duration-300', isSolid ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10')} aria-label="Wishlist">
                <Icons.heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishCount > 0 && (
                  <span className={cn('absolute -top-0.5 -right-0.5 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] text-[10px] sm:text-[11px] font-medium flex items-center justify-center', isSolid ? 'bg-navy-900 text-white' : 'bg-white text-navy-900')}>
                    {wishCount}
                  </span>
                )}
              </Link>
              <button onClick={openCart} className={cn('relative p-2 sm:p-2.5 transition-all duration-300', isSolid ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10')} aria-label="Cart">
                <Icons.bag className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className={cn('absolute -top-0.5 -right-0.5 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] text-[10px] sm:text-[11px] font-medium flex items-center justify-center', isSolid ? 'bg-navy-900 text-white' : 'bg-white text-navy-900')}>
                    {cartCount}
                  </span>
                )}
              </button>
              <Link href={isAuthenticated ? (user?.isAdmin ? '/admin' : '/account') : '/account'} className={cn('hidden sm:flex p-2 sm:p-2.5 transition-all duration-300', isSolid ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10')} aria-label="Account">
                <Icons.user className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={cn('lg:hidden fixed inset-0 z-[60] transition-all duration-500', menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}>
        <div className={cn('absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500', menuOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setMenuOpen(false)} />
        <div className={cn('absolute top-0 left-0 h-full w-full max-w-xs sm:max-w-sm bg-white transform transition-transform duration-500 ease-out shadow-2xl', menuOpen ? 'translate-x-0' : '-translate-x-full')}>
          <div className="flex flex-col h-full">
            <div className="p-6 pt-24 flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-2">
                {[
                  { href: '/shop', label: 'Shop' },
                  { href: '/collections', label: 'Collections' },
                  { href: '/about', label: 'Our Story' },
                  { href: '/contact', label: 'Contact' },
                ].map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn('text-lg tracking-wide font-medium py-3 px-4 border-b border-gray-100 hover:bg-sand-50 hover:text-navy-800 transition-all duration-300', menuOpen && 'slide-right')}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-6 border-t bg-sand-50">
              <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-navy-900 font-medium">
                <Icons.user className="w-5 h-5" />
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
