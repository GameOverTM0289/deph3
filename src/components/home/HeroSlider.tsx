'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_SLIDES, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  
  const next = useCallback(() => setCurrent(p => (p + 1) % HERO_SLIDES.length), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  return (
    <section 
      className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden bg-navy-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {HERO_SLIDES.map((slide, i) => (
        <div key={i} className={cn(
          'absolute inset-0 transition-all duration-1000',
          current === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        )}>
          <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={i === 0} />
          {/* Darker overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}
      
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container-custom">
          <div className={cn('text-center text-white px-4', loaded && 'fade-up')}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light tracking-wide mb-6 sm:mb-8">
              Rhythm of a Free Spirit
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 text-white/80">
              {HERO_SLIDES[current].subtitle}
            </p>
            
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-8 sm:mb-10 text-white/90">
              {HERO_SLIDES[current].title}
            </p>
            
            <Link href="/shop" className="inline-flex items-center gap-3 sm:gap-4 text-base sm:text-lg tracking-wide group">
              <span className="border-b-2 border-white pb-2 group-hover:pb-3 transition-all duration-300 font-medium">{HERO_SLIDES[current].cta}</span>
              <Icons.arrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-3 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Arrows */}
      <button onClick={prev} className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-all duration-300">
        <Icons.chevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>
      <button onClick={next} className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-all duration-300">
        <Icons.chevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={cn(
            'h-1 transition-all duration-500',
            current === i ? 'w-8 sm:w-12 bg-white' : 'w-2 sm:w-3 bg-white/40 hover:bg-white/60'
          )} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden sm:block">
        <Icons.chevronDown className="w-6 h-6 text-white/60" />
      </div>
    </section>
  );
}
