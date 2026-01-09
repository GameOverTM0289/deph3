'use client';
import { useState } from 'react';
import { validateEmail, validateRequired, CONTACT, cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => { const e: Record<string, string> = {}; if (!validateRequired(form.name, '').valid) e.name = 'Required'; if (!validateEmail(form.email).valid) e.email = 'Invalid'; if (!validateRequired(form.message, '').valid) e.message = 'Required'; setErrors(e); return Object.keys(e).length === 0; };
  const handleSubmit = async (ev: React.FormEvent) => { ev.preventDefault(); if (!validate()) return; setLoading(true); await new Promise(r => setTimeout(r, 1000)); setSent(true); setLoading(false); };

  if (sent) return (<div className="min-h-screen flex items-center justify-center pt-20"><div className="text-center max-w-md px-4 scale-in"><div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-5"><Icons.check className="w-8 h-8 text-green-600" /></div><h1 className="heading-2 mb-3">Message Sent!</h1><p className="text-gray-500 mb-6">We&apos;ll reply within 24 hours.</p><button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }} className="btn-primary">Send Another</button></div></div>);

  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">Contact</h1><p className="text-gray-500">We&apos;d love to hear from you</p></div></section>
      <section className="py-14"><div className="container-custom"><div className="grid grid-cols-1 lg:grid-cols-3 gap-12"><div className="space-y-6 slide-right"><h2 className="font-medium">Get in Touch</h2><div className="flex items-start gap-3"><Icons.mail className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="font-medium text-sm">Email</p><a href={`mailto:${CONTACT.email}`} className="text-sm text-gray-500 hover:text-navy-900 transition-colors">{CONTACT.email}</a></div></div><div className="flex items-start gap-3"><Icons.phone className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="font-medium text-sm">Phone</p><a href={`tel:${CONTACT.phoneRaw}`} className="text-sm text-gray-500 hover:text-navy-900 transition-colors">{CONTACT.phone}</a></div></div></div><div className="lg:col-span-2 slide-left delay-1"><div className="bg-white p-8 border"><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className={cn('input-field', errors.name && 'input-error')} /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={cn('input-field', errors.email && 'input-error')} /></div><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Message" className={cn('input-field h-auto resize-none', errors.message && 'input-error')} /><button type="submit" disabled={loading} className="btn-primary">{loading ? <><span className="loader mr-2" /> Sending...</> : 'Send Message'}</button></form></div></div></div></div></section>
    </>
  );
}
