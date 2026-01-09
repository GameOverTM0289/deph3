'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/user';
import { useOrdersStore } from '@/lib/store/orders';
import { formatPrice, formatDate, validateEmail, validateRequired, validatePassword, cn, PHONE_PREFIXES } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function AccountPage() {
  const { user, isAuthenticated, login, register, logout, updateProfile, changePassword } = useUserStore();
  const { getUserOrders } = useOrdersStore();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [tab, setTab] = useState<'orders' | 'profile' | 'security'>('orders');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', password: '', phonePrefix: '+355', phone: '' });
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => { setMounted(true); useUserStore.persist.rehydrate(); useOrdersStore.persist.rehydrate(); }, []);
  useEffect(() => { if (user) { setProfileForm({ name: user.name, phone: user.phone || '' }); } }, [user]);
  
  if (!mounted) return null;

  const orders = user ? getUserOrders(user.email) : [];

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'register' && !validateRequired(form.name, '').valid) e.name = 'Required';
    if (!validateEmail(form.email).valid) e.email = 'Invalid email';
    if (mode === 'register' && !validatePassword(form.password).valid) e.password = 'Min 8 chars, A-Z, a-z, 0-9';
    if (mode === 'login' && !form.password) e.password = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setError('');
    const result = mode === 'login' ? await login(form.email, form.password) : await register({ name: form.name, email: form.email, password: form.password, phone: form.phone ? `${form.phonePrefix}${form.phone}` : undefined });
    if (!result.success) setError(result.error || 'An error occurred');
    setLoading(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    await new Promise(r => setTimeout(r, 500));
    updateProfile({ name: profileForm.name, phone: profileForm.phone || undefined });
    setSuccess('Profile updated successfully');
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) { setError('Passwords do not match'); return; }
    if (!validatePassword(passwordForm.new).valid) { setError('Password: 8+ chars with uppercase, lowercase, number'); return; }
    setLoading(true); setError(''); setSuccess('');
    const result = await changePassword(passwordForm.current, passwordForm.new);
    if (result.success) {
      setSuccess('Password changed successfully');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } else {
      setError(result.error || 'Failed to change password');
    }
    setLoading(false);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-16 bg-sand-50">
        <div className="w-full max-w-md px-4">
          <div className="bg-white p-8 border scale-in">
            <div className="text-center mb-8">
              <h1 className="heading-2 mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="text-gray-500 text-sm">{mode === 'login' ? 'Sign in to your account' : 'Join the Delphine family'}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className={cn('input-field', errors.name && 'input-error')} />}
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className={cn('input-field', errors.email && 'input-error')} />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className={cn('input-field', errors.password && 'input-error')} />
              {mode === 'register' && (<div className="flex gap-3"><select value={form.phonePrefix} onChange={(e) => setForm({ ...form, phonePrefix: e.target.value })} className="select-field w-24">{PHONE_PREFIXES.map((p) => <option key={p.code} value={p.prefix}>{p.flag} {p.prefix}</option>)}</select><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="input-field flex-1" /></div>)}
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? <><span className="loader mr-2" /> Please wait...</> : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
            </form>
            <p className="text-center mt-6 text-sm text-gray-500">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}<button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-navy-900 ml-1 font-medium">{mode === 'login' ? 'Sign up' : 'Sign in'}</button></p>
            <div className="mt-6 p-4 bg-sand-50 text-sm text-gray-500"><p className="font-medium text-gray-700 mb-2">Demo Accounts:</p><p>admin@delphine.com / admin123</p><p>demo@delphine.com / demo123</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-navy-900 text-white pt-32 pb-14">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fade-up">
            <div><h1 className="heading-2 mb-1">Hello, {user?.name?.split(' ')[0]}</h1><p className="text-white/60">{user?.email}</p></div>
            <div className="flex gap-3">
              {user?.isAdmin && <Link href="/admin" className="btn-white text-sm">Admin Dashboard</Link>}
              <button onClick={logout} className="btn border border-white text-white hover:bg-white hover:text-navy-900 text-sm">Sign Out</button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="container-custom">
          <div className="flex gap-6 border-b mb-8 fade-up">
            {[{ id: 'orders', label: 'Orders' }, { id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={cn('pb-3 text-sm transition-colors border-b-2 -mb-px', tab === t.id ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-900')}>{t.label}</button>
            ))}
          </div>

          {tab === 'orders' && (
            orders.length > 0 ? (
              <div className="space-y-4 fade-up">{orders.map((order) => (<div key={order.id} className="bg-white border p-5 hover:shadow-md transition-shadow"><div className="flex flex-wrap justify-between items-start gap-4"><div><p className="font-mono text-sm text-gray-400">{order.orderId}</p><p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p></div><div className="text-right"><p className="font-medium">{formatPrice(order.total)}</p><span className={cn('badge mt-1', order.status === 'delivered' ? 'badge-success' : order.status === 'shipped' ? 'badge-info' : 'badge-warning')}>{order.status}</span></div></div></div>))}</div>
            ) : (
              <div className="text-center py-16 bg-sand-50 fade-up"><Icons.bag className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-500 mb-4">No orders yet</p><Link href="/shop" className="btn-primary">Start Shopping</Link></div>
            )
          )}

          {tab === 'profile' && (
            <div className="max-w-md fade-up">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div><label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label><input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Email</label><input type="email" value={user?.email} disabled className="input-field bg-gray-50" /></div>
                <div><label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Phone</label><input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+355..." className="input-field" /></div>
                {success && <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>}
                <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
              </form>
            </div>
          )}

          {tab === 'security' && (
            <div className="max-w-md fade-up">
              <h3 className="font-medium mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div><label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Current Password</label><input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">New Password</label><input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Confirm New Password</label><input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" /></div>
                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>}
                <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Changing...' : 'Change Password'}</button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
