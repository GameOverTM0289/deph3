import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(persist((set, get) => ({
  items: [], isOpen: false,
  addItem: (item) => {
    const existing = get().items.find(i => i.variantId === item.variantId);
    if (existing) {
      set({ items: get().items.map(i => i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i) });
    } else {
      set({ items: [...get().items, item] });
    }
    set({ isOpen: true });
  },
  removeItem: (variantId) => set({ items: get().items.filter(i => i.variantId !== variantId) }),
  updateQuantity: (variantId, q) => {
    if (q < 1) { get().removeItem(variantId); return; }
    set({ items: get().items.map(i => i.variantId === variantId ? { ...i, quantity: q } : i) });
  },
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  getItemCount: () => get().items.reduce((t, i) => t + i.quantity, 0),
  getSubtotal: () => get().items.reduce((t, i) => t + i.price * i.quantity, 0),
}), { name: 'delphine-cart', skipHydration: true }));
