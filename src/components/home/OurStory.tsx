import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default function OurStory() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center fade-up">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 block">Our Story</span>
          <h2 className="heading-2 mb-5">Born from the Mediterranean</h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg font-light">
            Delphine was founded in Albania with a simple vision: creating swimwear that captures Mediterranean elegance while respecting our planet. Every piece is crafted from sustainable materials, designed to make you feel confident and beautiful.
          </p>
          <Link href="/about" className="inline-flex items-center gap-3 text-sm tracking-wide group">
            <span className="border-b border-navy-900 pb-1 group-hover:pb-2 transition-all">Learn More</span>
            <Icons.arrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
