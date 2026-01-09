'use client';
import { useState } from 'react';
import { CONTACT } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function AdminSettingsPage() {
  const [store, setStore] = useState({ name: 'Delphine Swimwear', email: CONTACT.email, phone: CONTACT.phone, currency: 'EUR' });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6 fade-up">
        <h1 className="heading-2 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Store configuration</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="card p-6 fade-up delay-1">
          <h3 className="font-medium mb-6">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase mb-1 block">Store Name</label>
              <input type="text" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase mb-1 block">Email</label>
                <input type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase mb-1 block">Phone</label>
                <input type="tel" value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase mb-1 block">Currency</label>
              <select value={store.currency} onChange={(e) => setStore({ ...store, currency: e.target.value })} className="select-field">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="ALL">ALL (L)</option>
              </select>
            </div>
          </div>
          {saved && <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm mt-4 flex items-center gap-2"><Icons.check className="w-4 h-4" /> Settings saved</div>}
          <button type="submit" className="btn-primary mt-6">Save Changes</button>
        </form>

        <div className="card p-6 mt-6 fade-up delay-2">
          <h3 className="font-medium mb-4">Payment Methods</h3>
          <div className="flex items-center justify-between p-4 bg-sand-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-navy-900 flex items-center justify-center text-white font-bold text-xs">POK</div>
              <div>
                <p className="font-medium text-sm">POK Payment</p>
                <p className="text-xs text-gray-500">Albanian digital payment</p>
              </div>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">Demo mode enabled - no real transactions processed</p>
        </div>

        <div className="card p-6 mt-6 fade-up delay-3">
          <h3 className="font-medium mb-4">Demo Mode</h3>
          <p className="text-sm text-gray-600 mb-4">This store is running in demo mode. All data is stored locally in the browser and will persist across sessions.</p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Icons.check className="w-4 h-4" />
            Demo mode active
          </div>
        </div>
      </div>
    </div>
  );
}
