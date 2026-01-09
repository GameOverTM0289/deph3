import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">Returns</h1><p className="text-gray-500">Easy returns within 30 days</p></div></section>
      <section className="py-14"><div className="container-custom max-w-3xl"><div className="bg-white border p-8 mb-8 fade-up"><h2 className="font-medium mb-4">Return Policy</h2><div className="text-sm text-gray-600 space-y-3"><p>We accept returns within <strong className="text-navy-900">30 days</strong> of delivery.</p><p>Items must be unworn, unwashed, and with all tags attached.</p><p>Swimwear hygiene liners must be intact for returns to be accepted.</p></div></div><div className="mb-8 fade-up delay-1"><h2 className="font-medium mb-4">How to Return</h2><div className="grid grid-cols-3 gap-4"><div className="bg-white border p-6 text-center"><div className="w-10 h-10 bg-sand-100 flex items-center justify-center mx-auto mb-3"><span className="font-medium">1</span></div><p className="text-sm text-gray-600">Email us to request a return</p></div><div className="bg-white border p-6 text-center"><div className="w-10 h-10 bg-sand-100 flex items-center justify-center mx-auto mb-3"><span className="font-medium">2</span></div><p className="text-sm text-gray-600">Ship with provided label</p></div><div className="bg-white border p-6 text-center"><div className="w-10 h-10 bg-sand-100 flex items-center justify-center mx-auto mb-3"><span className="font-medium">3</span></div><p className="text-sm text-gray-600">Refund in 5-7 days</p></div></div></div><Link href="/contact" className="btn-outline fade-up delay-2">Start a Return</Link></div></section>
    </>
  );
}
