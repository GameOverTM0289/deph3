import Image from 'next/image';
import Link from 'next/link';
import { collections } from '@/lib/data/products';

export default function CollectionsPage() {
  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14">
        <div className="container-custom text-center fade-up">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3 block">Browse</span>
          <h1 className="heading-1">Collections</h1>
        </div>
      </section>
      <section className="py-14">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((c, i) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className={`group relative aspect-[4/5] overflow-hidden block fade-up ${i === 1 ? 'delay-1' : ''}`}>
                <Image src={c.image} alt={c.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="text-3xl font-light mb-2">{c.name}</h2>
                  <p className="text-sm text-white/80">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
