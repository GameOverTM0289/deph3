import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]"><Image src="/images/hero/slide-1.jpg" alt="Mediterranean" fill className="object-cover" priority /><div className="absolute inset-0 bg-black/30" /><div className="absolute inset-0 flex items-center justify-center text-center text-white"><div className="fade-up"><h1 className="heading-1 mb-2">Our Story</h1><p className="text-white/80">Born from a love for the sea</p></div></div></section>
      <section className="section"><div className="container-custom"><div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"><div className="slide-right"><span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 block">Since 2020</span><h2 className="heading-2 mb-6">From Albania to the World</h2><div className="space-y-4 text-gray-600 leading-relaxed"><p>Delphine was founded in Tirana, Albania, by designers who shared a vision: creating swimwear that celebrates Mediterranean beauty while protecting its ecosystems.</p><p>Our name comes from the Greek word &ldquo;delphis,&rdquo; meaning dolphin — a symbol of the Mediterranean&apos;s magic.</p></div></div><div className="relative aspect-[4/5] overflow-hidden img-zoom slide-left delay-1"><Image src="/images/collections/bikinis.jpg" alt="Delphine" fill className="object-cover" /></div></div></div></section>
      <section className="section bg-sand-50"><div className="container-custom"><h2 className="heading-2 text-center mb-12 fade-up">Our Values</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-white p-8 text-center fade-up"><h3 className="font-medium mb-2">Sustainability</h3><p className="text-sm text-gray-600">ECONYL® regenerated nylon from ocean waste</p></div><div className="bg-white p-8 text-center fade-up delay-1"><h3 className="font-medium mb-2">Quality</h3><p className="text-sm text-gray-600">Crafted to last season after season</p></div><div className="bg-white p-8 text-center fade-up delay-2"><h3 className="font-medium mb-2">Timeless Design</h3><p className="text-sm text-gray-600">Mediterranean elegance that never fades</p></div></div></div></section>
      <section className="section text-center fade-up"><Link href="/shop" className="inline-flex items-center gap-3 text-sm tracking-wide group"><span className="border-b border-navy-900 pb-1">Shop Collection</span><Icons.arrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></Link></section>
    </>
  );
}
