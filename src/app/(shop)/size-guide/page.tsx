import Link from 'next/link';

const sizes = [{ s: 'XS', b: '80-84', w: '60-64', h: '86-90' }, { s: 'S', b: '84-88', w: '64-68', h: '90-94' }, { s: 'M', b: '88-92', w: '68-72', h: '94-98' }, { s: 'L', b: '92-96', w: '72-76', h: '98-102' }, { s: 'XL', b: '96-100', w: '76-80', h: '102-106' }];

export default function SizeGuidePage() {
  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">Size Guide</h1><p className="text-gray-500">Find your perfect fit</p></div></section>
      <section className="py-14"><div className="container-custom max-w-3xl"><h2 className="font-medium mb-4 fade-up">Size Chart (cm)</h2><div className="bg-white border overflow-x-auto mb-8 fade-up delay-1"><table className="w-full text-sm"><thead className="bg-sand-50"><tr><th className="text-left p-4 font-medium">Size</th><th className="text-center p-4 font-medium">Bust</th><th className="text-center p-4 font-medium">Waist</th><th className="text-center p-4 font-medium">Hips</th></tr></thead><tbody className="divide-y">{sizes.map((x) => (<tr key={x.s}><td className="p-4 font-medium">{x.s}</td><td className="p-4 text-center text-gray-600">{x.b}</td><td className="p-4 text-center text-gray-600">{x.w}</td><td className="p-4 text-center text-gray-600">{x.h}</td></tr>))}</tbody></table></div><h2 className="font-medium mb-4 fade-up delay-2">How to Measure</h2><div className="grid grid-cols-3 gap-4 mb-8"><div className="bg-white border p-6 fade-up delay-2"><h3 className="font-medium text-sm mb-2">Bust</h3><p className="text-xs text-gray-600">Measure around the fullest part of your bust</p></div><div className="bg-white border p-6 fade-up delay-3"><h3 className="font-medium text-sm mb-2">Waist</h3><p className="text-xs text-gray-600">Measure around your natural waistline</p></div><div className="bg-white border p-6 fade-up delay-4"><h3 className="font-medium text-sm mb-2">Hips</h3><p className="text-xs text-gray-600">Measure around the fullest part of your hips</p></div></div><p className="text-sm text-gray-500 mb-4 fade-up">If between sizes, we recommend sizing up for comfort.</p><Link href="/contact" className="btn-outline fade-up">Need Help?</Link></div></section>
    </>
  );
}
