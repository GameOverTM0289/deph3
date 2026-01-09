import Link from 'next/link';
import { SHIPPING_ZONES } from '@/lib/utils';

export default function ShippingPage() {
  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">Shipping</h1><p className="text-gray-500">We ship from Albania worldwide</p></div></section>
      <section className="py-14"><div className="container-custom max-w-3xl"><div className="space-y-4"><div className="bg-white border p-6 fade-up"><h3 className="font-medium mb-2">🇦🇱 Albania (Domestic)</h3><p className="text-sm text-gray-600">Standard: €3.99 (1-2 days) • Express: €6.99 (Next day)</p></div><div className="bg-white border p-6 fade-up delay-1"><h3 className="font-medium mb-2">Balkans</h3><p className="text-xs text-gray-400 mb-2">{SHIPPING_ZONES.filter(c => c.zone === 'balkans').map(c => c.flag).join(' ')}</p><p className="text-sm text-gray-600">Standard: €5.99-€8.99 (2-5 days) • Express: €9.99-€15.99</p></div><div className="bg-white border p-6 fade-up delay-2"><h3 className="font-medium mb-2">Europe</h3><p className="text-xs text-gray-400 mb-2">{SHIPPING_ZONES.filter(c => c.zone === 'europe').map(c => c.flag).join(' ')}</p><p className="text-sm text-gray-600">Standard: €9.99-€15.99 (5-10 days) • Express: €18.99-€27.99</p></div><div className="bg-white border p-6 fade-up delay-3"><h3 className="font-medium mb-2">International</h3><p className="text-sm text-gray-600">Standard: €19.99+ (10-15 days) • Express: €39.99+</p></div></div><div className="mt-8 fade-up delay-4"><h2 className="font-medium mb-3">Processing Time</h2><p className="text-sm text-gray-600 mb-6">Orders are processed within 1-2 business days.</p><Link href="/contact" className="btn-outline">Have Questions?</Link></div></div></section>
    </>
  );
}
