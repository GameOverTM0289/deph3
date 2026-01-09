import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default function SustainabilityPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]"><Image src="/images/hero/slide-3.jpg" alt="Ocean" fill className="object-cover" priority /><div className="absolute inset-0 bg-black/30" /><div className="absolute inset-0 flex items-center justify-center text-center text-white"><div className="fade-up"><h1 className="heading-1 mb-2">Sustainability</h1><p className="text-white/80">Our commitment to the planet</p></div></div></section>
      <section className="section"><div className="container-custom max-w-3xl text-center"><h2 className="heading-2 mb-6 fade-up">Fashion That Doesn&apos;t Cost the Earth</h2><p className="text-gray-600 leading-relaxed mb-10 fade-up delay-1">Sustainability isn&apos;t just a buzzword for us—it&apos;s the foundation of everything we create. From the materials we choose to the way we package our products.</p><div className="grid grid-cols-2 gap-4 mb-10"><div className="bg-sand-50 p-8 fade-up delay-1"><h3 className="font-medium mb-2">Recycled Materials</h3><p className="text-sm text-gray-600">ECONYL® nylon from ocean waste</p></div><div className="bg-sand-50 p-8 fade-up delay-2"><h3 className="font-medium mb-2">Eco Packaging</h3><p className="text-sm text-gray-600">100% recyclable materials</p></div><div className="bg-sand-50 p-8 fade-up delay-3"><h3 className="font-medium mb-2">Carbon Neutral</h3><p className="text-sm text-gray-600">Offset all shipping emissions</p></div><div className="bg-sand-50 p-8 fade-up delay-4"><h3 className="font-medium mb-2">2% for Ocean</h3><p className="text-sm text-gray-600">Donated to ocean conservation</p></div></div><Link href="/shop" className="inline-flex items-center gap-3 text-sm tracking-wide group fade-up"><span className="border-b border-navy-900 pb-1">Shop Sustainably</span><Icons.arrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></Link></div></section>
    </>
  );
}
