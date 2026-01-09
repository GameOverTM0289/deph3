'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const faqs = [{ cat: 'Orders', qs: [{ q: 'How long does shipping take?', a: 'Albania: 1-2 days. Balkans: 2-5 days. Europe: 5-10 days. International: 10-15 days.' }, { q: 'Do you ship internationally?', a: 'Yes! We ship from Albania worldwide with DHL.' }] }, { cat: 'Returns', qs: [{ q: 'What is your return policy?', a: '30-day returns. Items must be unworn with tags attached.' }, { q: 'When will I receive my refund?', a: '5-7 business days after we receive your return.' }] }, { cat: 'Products', qs: [{ q: 'How do I find my size?', a: 'Check our Size Guide. If between sizes, we recommend sizing up.' }, { q: 'Are your products sustainable?', a: 'Yes! Made from ECONYL® regenerated nylon from ocean waste.' }] }];

export default function FAQPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ '0-0': true });
  const toggle = (key: string) => setOpen(p => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">FAQ</h1><p className="text-gray-500">Common questions</p></div></section>
      <section className="py-14"><div className="container-custom max-w-3xl">{faqs.map((cat, ci) => (<div key={ci} className="mb-8 fade-up" style={{ animationDelay: `${ci * 0.1}s` }}><h2 className="font-medium mb-4">{cat.cat}</h2><div className="space-y-2">{cat.qs.map((faq, qi) => { const key = `${ci}-${qi}`; return (<div key={qi} className="bg-white border overflow-hidden"><button onClick={() => toggle(key)} className="w-full p-4 text-left flex justify-between items-center hover:bg-sand-50 transition-colors"><span className="text-sm pr-4">{faq.q}</span><Icons.chevronDown className={cn('w-4 h-4 text-gray-400 transition-transform duration-300', open[key] && 'rotate-180')} /></button><div className={cn('overflow-hidden transition-all duration-300', open[key] ? 'max-h-40' : 'max-h-0')}><div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div></div></div>); })}</div></div>))}<div className="bg-navy-900 text-white p-8 text-center mt-10 fade-up"><p className="mb-4">Still have questions?</p><Link href="/contact" className="btn-white">Contact Us</Link></div></div></section>
    </>
  );
}
