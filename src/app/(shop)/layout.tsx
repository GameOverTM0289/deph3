import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Providers from '@/components/Providers';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </Providers>
  );
}
