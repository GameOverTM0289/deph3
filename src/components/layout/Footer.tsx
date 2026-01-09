'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import { CONTACT } from '@/lib/utils';
import { useNewsletterStore } from '@/lib/store/newsletter';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { subscribe } = useNewsletterStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(r => setTimeout(r, 500));
    const result = subscribe(email);
    if (result.success) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Failed');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <footer className="bg-navy-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-10 sm:py-14">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Join the Delphine Community</h3>
            <p className="text-white/70 text-sm sm:text-base mb-6">Subscribe for exclusive offers and early access to new collections.</p>
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-green-400 text-lg fade-in">
                <Icons.check className="w-5 h-5" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 w-full appearance-none px-4 sm:px-5 bg-white/10 border border-white/30 text-base text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-all duration-300 h-14 py-3 leading-[1.2]"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-navy-900 text-sm tracking-wider uppercase font-medium hover:bg-sand-100 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? <><span className="loader" /> Subscribing...</> : 'Subscribe'}
                </button>
              </form>
            )}
            {status === 'error' && <p className="text-red-400 text-sm mt-3 fade-in">{errorMsg}</p>}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            <Image src="/logo-white.svg" alt="Delphine" width={420} height={140} className="h-20 sm:h-24 md:h-28 w-auto mb-4 sm:mb-5" />
            <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">Elegant swimwear inspired by the Mediterranean coastline.</p>
            <div className="flex gap-3 sm:gap-4">
              <a href="https://instagram.com/delphineswimwear" target="_blank" rel="noopener noreferrer" className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-all duration-300 hover-lift">
                <Icons.instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="https://facebook.com/delphineswimwear" target="_blank" rel="noopener noreferrer" className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-all duration-300 hover-lift">
                <Icons.facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-base sm:text-lg tracking-wide">Shop</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors duration-300">All Products</Link></li>
              <li><Link href="/collections/bikinis" className="hover:text-white transition-colors duration-300">Bikinis</Link></li>
              <li><Link href="/collections/one-pieces" className="hover:text-white transition-colors duration-300">One Pieces</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-base sm:text-lg tracking-wide">Help</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-white/70">
              <li><Link href="/faq" className="hover:text-white transition-colors duration-300">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors duration-300">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors duration-300">Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors duration-300">Size Guide</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-base sm:text-lg tracking-wide">Contact</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-white/70">
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors duration-300">{CONTACT.email}</a></li>
              <li><a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-white transition-colors duration-300">{CONTACT.phone}</a></li>
              <li className="text-white/50">{CONTACT.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">© {new Date().getFullYear()} Delphine Swimwear. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors duration-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
