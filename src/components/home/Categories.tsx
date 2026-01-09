import Image from 'next/image';
import Link from 'next/link';
import { collections } from '@/lib/data/products';
import { cn } from '@/lib/utils';

export default function Categories() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 fade-up">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3 block">Collections</span>
          <h2 className="heading-2">Explore Our Collection</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {collections.map((c, i) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className={cn("group relative aspect-[4/5] overflow-hidden block fade-up", i === 1 && 'delay-1')}>
              <Image src={c.image} alt={c.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-2">{c.name}</h3>
                <p className="text-sm text-white/80">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
