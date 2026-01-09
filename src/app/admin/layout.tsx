'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user';
import { Icons } from '@/components/ui/Icons';
import Providers from '@/components/Providers';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Icons.chart },
  { href: '/admin/orders', label: 'Orders', icon: Icons.package },
  { href: '/admin/products', label: 'Products', icon: Icons.bag },
  { href: '/admin/customers', label: 'Customers', icon: Icons.users },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Icons.mail },
  { href: '/admin/analytics', label: 'Analytics', icon: Icons.trendUp },
  { href: '/admin/settings', label: 'Settings', icon: Icons.settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setMounted(true); useUserStore.persist.rehydrate(); }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !user?.isAdmin)) {
      router.push('/account');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || !user?.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>;
  }

  return (
    <Providers>
      <div className="min-h-screen bg-sand-50">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center px-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-sand-100 transition-colors">
            <Icons.menu className="w-5 h-5" />
          </button>
          <Image src="/logo.svg" alt="Delphine" width={100} height={30} className="h-6 w-auto mx-auto" />
        </header>

        {/* Sidebar */}
        <aside className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-6 border-b">
            <Link href="/admin"><Image src="/logo.svg" alt="Delphine" width={120} height={35} className="h-8 w-auto" /></Link>
            <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                    isActive ? 'bg-navy-900 text-white' : 'text-gray-600 hover:bg-sand-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy-900 text-white flex items-center justify-center text-sm font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1 btn-outline text-xs py-2 justify-center">
                <Icons.home className="w-3 h-3 mr-1" /> Store
              </Link>
              <button onClick={logout} className="flex-1 btn-ghost text-xs py-2 justify-center text-red-600 hover:bg-red-50">
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}
