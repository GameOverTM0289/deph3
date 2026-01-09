import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/types';
import { defaultProducts } from '@/lib/data/products';
import { generateId } from '@/lib/utils';

interface ProductsState {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getActiveProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sold'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  toggleProductFeatured: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  incrementSold: (id: string, quantity: number) => void;
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  getLowStockProducts: (threshold: number) => Product[];
  duplicateProduct: (id: string) => Product | undefined;
  bulkUpdateStock: (updates: { id: string; stock: number }[]) => void;
  getProductStats: () => { total: number; active: number; outOfStock: number; lowStock: number; totalValue: number };
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      
      getProduct: (id) => get().products.find((p) => p.id === id),
      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
      getActiveProducts: () => get().products.filter((p) => p.active),
      getFeaturedProducts: () => get().products.filter((p) => p.featured && p.active),
      
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          sold: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },
      
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },
      
      toggleProductActive: (id) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        }));
      },
      
      toggleProductFeatured: (id) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
        }));
      },
      
      updateStock: (id, stock) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)),
        }));
      },
      
      incrementSold: (id, quantity) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, sold: p.sold + quantity, stock: Math.max(0, p.stock - quantity) } : p
          ),
        }));
      },
      
      searchProducts: (query) => {
        const q = query.toLowerCase();
        return get().products.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      },
      
      getProductsByCategory: (category) => {
        return get().products.filter((p) => p.category === category && p.active);
      },
      
      getLowStockProducts: (threshold) => {
        return get().products.filter((p) => p.stock <= threshold && p.active);
      },
      
      duplicateProduct: (id) => {
        const original = get().products.find((p) => p.id === id);
        if (!original) return undefined;
        
        const duplicate: Product = {
          ...original,
          id: generateId(),
          name: `${original.name} (Copy)`,
          slug: `${original.slug}-copy-${Date.now()}`,
          sold: 0,
          active: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, duplicate] }));
        return duplicate;
      },
      
      bulkUpdateStock: (updates) => {
        set((state) => ({
          products: state.products.map((p) => {
            const update = updates.find((u) => u.id === p.id);
            return update ? { ...p, stock: Math.max(0, update.stock) } : p;
          }),
        }));
      },
      
      getProductStats: () => {
        const products = get().products;
        return {
          total: products.length,
          active: products.filter((p) => p.active).length,
          outOfStock: products.filter((p) => p.stock === 0).length,
          lowStock: products.filter((p) => p.stock > 0 && p.stock < 10).length,
          totalValue: products.reduce((acc, p) => acc + p.price * p.stock, 0),
        };
      },
    }),
    { name: 'delphine-products' }
  )
);
